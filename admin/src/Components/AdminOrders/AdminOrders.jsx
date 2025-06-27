import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Notification from '../Notification/Notification';
import './AdminOrders.css';

import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import logo from '../../assets/logo.png';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusOptions] = useState(["New", "Processing", "Done", "Cancelled"]);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const res = await axios.get('http://localhost:8070/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError('Failed to load orders. Check console.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAllOrders();
    } else {
      setError("No auth token found");
      setLoading(false);
    }
  }, [token]);

  const handleCancel = async (orderId) => {
    try {
      await axios.put(`http://localhost:8070/orders/cancel/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotification({ message: 'Order cancelled.', type: 'success' });
      setOrders(prev => prev.map(order =>
        order._id === orderId ? { ...order, status: 'Cancelled', paymentStatus: 'Cancelled' } : order
      ));
    } catch (err) {
      console.error("Error cancelling order:", err);
      setNotification({ message: 'Failed to cancel order.', type: 'error' });
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:8070/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotification({ message: 'Status updated.', type: 'success' });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    } catch (err) {
      console.error("Error updating status:", err);
      setNotification({ message: 'Failed to update status.', type: 'error' });
    }
  };

  const closeNotification = () => {
    setNotification({ message: '', type: '' });
  };

  const formatAddress = (shippingAddress) => {
    if (!shippingAddress) return 'N/A';
    const { street, city, state, postalCode } = shippingAddress;
    return `${street}, ${city}, ${state} ${postalCode}`;
  };

  // PDF generation function
  const generatePDF = (order, forPrint = false) => {
    const doc = new jsPDF();

    // Add logo
    const imgProps = doc.getImageProperties(logo);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const imgWidth = 40;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    const imgX = (pdfWidth - imgWidth) / 2;
    doc.addImage(logo, 'PNG', imgX, 10, imgWidth, imgHeight);

   
    doc.setTextColor('#EB1E21');
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('EliteCell', pdfWidth / 2, 10 + imgHeight + 12, { align: 'center' });

    // Outline rectangle
    const margin = 10;
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

    // Reset color & font for body text
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    let startY = 10 + imgHeight + 20;

    doc.text(`Order ID: ${order._id}`, margin + 4, startY);
    startY += 8;

    doc.text(`Customer Name: ${order.customerId?.userId?.name || 'N/A'}`, margin + 4, startY);
    startY += 8;

    doc.text(`Payment Status: ${order.paymentStatus}`, margin + 4, startY);
    startY += 8;

    doc.text(`Order Status: ${order.status}`, margin + 4, startY);
    startY += 8;

    const orderDate = new Date(order.createdAt).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    doc.text(`Order Date: ${orderDate}`, margin + 4, startY);
    startY += 8;

    const { street, city, state, postalCode } = order.shippingAddress || {};
    const shippingAddressText = street && city && state && postalCode
      ? `${street}, ${city}, ${state} ${postalCode}`
      : 'N/A';

    doc.text(`Shipping: ${shippingAddressText}`, margin + 4, startY);
    startY += 10;

    // Table of items
    const tableColumn = ["Product", "Quantity", "Unit Price (Rs.)"];
    const tableRows = [];

    if (order.order_items && order.order_items.length > 0) {
      order.order_items.forEach(item => {
        tableRows.push([
          item.name || 'Unnamed Item',
          item.quantity.toString(),
          item.unitPrice.toFixed(2),
        ]);
      });
    }

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: startY,
      theme: 'grid',
      styles: {
        cellPadding: 3,
        fontSize: 11,
        valign: 'middle',
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: '#5a9ecb',
        textColor: 255,
        halign: 'center',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      margin: { left: margin, right: margin }
    });

    const finalY = doc.lastAutoTable.finalY || startY + 40;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: Rs. ${order.lastAmount.toFixed(2)}`, pageWidth - margin - 60, finalY + 10);

    if (forPrint) {
      // Open PDF in new tab and trigger print
      const string = doc.output('bloburl');
      const x = window.open(string);
      x.onload = function () {
        x.focus();
        x.print();
      };
    } else {
      doc.save(`Order_${order._id}.pdf`);
    }
  };

  if (!token) return <div style={{ color: 'red' }}>No auth token found</div>;
  if (loading) return <div>Loading orders...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="admin-orders-container">
      <h2>All Customer Orders</h2>

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Address</th>
                <th>Items</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Change Status</th>
                <th>Actions</th> {/* Adjusted header */}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.customerId?.userId?.name || 'N/A'}</td>
                  <td>{formatAddress(order.shippingAddress)}</td>

                  <td>
                    {order.order_items && order.order_items.length > 0 ? (
                      <table className="nested-items-table">
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left' }}>Product</th>
                            <th>Qty</th>
                            <th>Rs.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.order_items.map((item, index) => (
                            <tr key={index}>
                              <td>{item.name || 'Unnamed Item'}</td>
                              <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                              <td style={{ textAlign: 'right' }}>{item.unitPrice}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      'No items'
                    )}
                  </td>

                  <td>{order.status}</td>
                  <td>{order.paymentStatus}</td>
                  <td>Rs. {order.lastAmount}</td>

                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      {statusOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <button
                      onClick={() => handleCancel(order._id)}
                      disabled={order.status === "Cancelled"}
                    >
                      Cancel
                    </button>{' '}
                    <button
                      onClick={() => generatePDF(order)}
                    >
                      Download Receipt
                    </button>{' '}
                    <button
                      onClick={() => generatePDF(order, true)}
                    >
                      Print Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
