import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { Order, ShoppingPlan, QualityReport, Product, Shop } from '../types';
import { formatINR } from '../utils/currency';
import { formatDate, formatDateTime } from '../utils/formatters';

export type ExportDocumentType =
  | 'invoice'
  | 'order_report'
  | 'shopping_list'
  | 'quality_report'
  | 'vendor_sales'
  | 'inventory_report';

export interface DocumentExportData {
  type: ExportDocumentType;
  title: string;
  order?: Order;
  plan?: ShoppingPlan;
  qualityReport?: QualityReport;
  products?: Product[];
  shop?: Shop;
  stats?: Record<string, any>;
}

export const documentExportService = {
  /**
   * Generates and downloads a branded PDF document
   */
  exportPDF(data: DocumentExportData) {
    const doc = new jsPDF();

    // Bazaar One Brand Header
    doc.setFillColor(122, 38, 58); // Deep Maroon #7A263A
    doc.rect(0, 0, 210, 32, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 248, 236); // Warm Cream #FFF8EC
    doc.text('BAZAAR ONE', 14, 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(244, 163, 64); // Saffron #F4A340
    doc.text('Your Local Bazaar. Your Modern Marketplace.', 14, 23);

    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('Unified Digital Commerce Platform | India', 14, 28);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 155, 28);

    doc.setTextColor(36, 36, 36);

    if (data.type === 'invoice' && data.order) {
      const order = data.order;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('TAX INVOICE / ORDER RECEIPT', 14, 42);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Invoice / Order No: ${order.id}`, 14, 49);
      doc.text(`Date & Time: ${formatDateTime(order.createdAt)}`, 14, 54);
      doc.text(`Payment Mode: ${order.paymentMethod.toUpperCase()} (${order.paymentStatus})`, 14, 59);
      if (order.paymentReference) {
        doc.text(`Ref ID: ${order.paymentReference}`, 14, 64);
      }

      // Shop & Customer Info boxes
      doc.setDrawColor(220, 220, 220);
      doc.setFillColor(252, 248, 238);
      doc.roundedRect(14, 70, 88, 32, 2, 2, 'FD');
      doc.roundedRect(108, 70, 88, 32, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.text('MERCHANT / VENDOR DETAILS:', 18, 77);
      doc.setFont('helvetica', 'normal');
      doc.text(order.shopName, 18, 83);
      doc.text('Verified Merchant on Bazaar One', 18, 88);
      doc.text('GSTIN: Available on merchant request', 18, 93);

      doc.setFont('helvetica', 'bold');
      doc.text('CUSTOMER / DELIVERY ADDRESS:', 112, 77);
      doc.setFont('helvetica', 'normal');
      doc.text(order.customerName, 112, 83);
      doc.text(`${order.deliveryAddress.street}, ${order.deliveryAddress.area}`, 112, 88);
      doc.text(`${order.deliveryAddress.city} - ${order.deliveryAddress.pincode}`, 112, 93);

      // Table of Items
      const tableRows = order.items.map((item, idx) => [
        idx + 1,
        item.name,
        `${item.quantity} ${item.unit}`,
        formatINR(item.price),
        formatINR(item.price * item.quantity),
      ]);

      autoTable(doc, {
        startY: 108,
        head: [['#', 'Item Description', 'Qty / Unit', 'Rate', 'Amount']],
        body: tableRows,
        headStyles: { fillColor: [122, 38, 58], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [250, 250, 250] },
      });

      const finalY = (doc as any).lastAutoTable.finalY + 8;

      // Summary
      doc.setFont('helvetica', 'normal');
      doc.text(`Subtotal:`, 130, finalY);
      doc.text(formatINR(order.subtotal), 180, finalY, { align: 'right' });

      doc.text(`Delivery Fee:`, 130, finalY + 6);
      doc.text(order.deliveryFee === 0 ? 'FREE' : formatINR(order.deliveryFee), 180, finalY + 6, { align: 'right' });

      doc.text(`Applicable Tax (GST):`, 130, finalY + 12);
      doc.text(formatINR(order.tax), 180, finalY + 12, { align: 'right' });

      if (order.discount > 0) {
        doc.text(`Discount:`, 130, finalY + 18);
        doc.text(`- ${formatINR(order.discount)}`, 180, finalY + 18, { align: 'right' });
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(`Total Payable:`, 130, finalY + 26);
      doc.text(formatINR(order.totalAmount), 180, finalY + 26, { align: 'right' });

      // Footer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Thank you for shopping local with Bazaar One!', 14, 275);
      doc.text('This is a computer-generated invoice. For support, visit https://bazaarone.in/support', 14, 280);
    } else if (data.type === 'shopping_list' && data.plan) {
      const plan = data.plan;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`SHOPPING PLANNER: ${plan.title.toUpperCase()}`, 14, 42);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Plan Frequency: ${plan.frequency.toUpperCase()}`, 14, 49);
      doc.text(`Planned Budget: ${formatINR(plan.budget)} | Actual Spent: ${formatINR(plan.spent)}`, 14, 54);

      const tableRows = plan.items.map((item, idx) => [
        idx + 1,
        item.name,
        `${item.quantity} ${item.unit}`,
        item.preferredShopName || 'Local Market',
        formatINR(item.estimatedPrice),
        item.isPurchased ? 'PURCHASED [x]' : 'PENDING [ ]',
      ]);

      autoTable(doc, {
        startY: 62,
        head: [['#', 'Item Name', 'Quantity', 'Preferred Shop', 'Est. Price', 'Status']],
        body: tableRows,
        headStyles: { fillColor: [39, 103, 73], textColor: [255, 255, 255] },
      });
    } else if (data.type === 'inventory_report' && data.products) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('VENDOR INVENTORY & STOCK VALUATION REPORT', 14, 42);

      const tableRows = data.products.map((p, idx) => [
        idx + 1,
        p.name,
        p.category,
        formatINR(p.price),
        `${p.stockQuantity} ${p.unit}`,
        p.stockQuantity <= p.lowStockThreshold ? 'LOW STOCK' : 'AVAILABLE',
      ]);

      autoTable(doc, {
        startY: 52,
        head: [['#', 'Product Name', 'Category', 'Price', 'Stock Level', 'Status']],
        body: tableRows,
        headStyles: { fillColor: [122, 38, 58], textColor: [255, 255, 255] },
      });
    }

    doc.save(`${data.title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`);
  },

  /**
   * Generates and downloads an editable Microsoft Word (.docx) document
   */
  async exportDOCX(data: DocumentExportData) {
    const rows: TableRow[] = [];

    // Header row
    rows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '#', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Item / Description', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Quantity', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Rate (INR)', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Total', bold: true })] })] }),
        ],
      })
    );

    if (data.order) {
      data.order.items.forEach((item, idx) => {
        rows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(String(idx + 1))] }),
              new TableCell({ children: [new Paragraph(item.name)] }),
              new TableCell({ children: [new Paragraph(`${item.quantity} ${item.unit}`)] }),
              new TableCell({ children: [new Paragraph(formatINR(item.price))] }),
              new TableCell({ children: [new Paragraph(formatINR(item.price * item.quantity))] }),
            ],
          })
        );
      });
    } else if (data.plan) {
      data.plan.items.forEach((item, idx) => {
        rows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(String(idx + 1))] }),
              new TableCell({ children: [new Paragraph(item.name)] }),
              new TableCell({ children: [new Paragraph(`${item.quantity} ${item.unit}`)] }),
              new TableCell({ children: [new Paragraph(formatINR(item.estimatedPrice))] }),
              new TableCell({ children: [new Paragraph(item.isPurchased ? 'Purchased' : 'Pending')] }),
            ],
          })
        );
      });
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: 'BAZAAR ONE - OFFICIAL DOCUMENT',
              heading: 'Heading1',
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: data.title,
              heading: 'Heading2',
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: `Date: ${new Date().toLocaleDateString('en-IN')}` }),
            new Paragraph({ text: '' }),
            new Table({
              rows,
              width: { size: 100, type: WidthType.PERCENTAGE },
            }),
            new Paragraph({ text: '' }),
            new Paragraph({
              text: 'Generated by Bazaar One Marketplace System. Verified and secure.',
              style: 'italic',
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${data.title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.docx`);
  },

  /**
   * Generates and downloads a structured JSON export
   */
  exportJSON(data: DocumentExportData) {
    const jsonString = JSON.stringify(
      {
        platform: 'Bazaar One',
        tagline: 'Your Local Bazaar. Your Modern Marketplace.',
        exportedAt: new Date().toISOString(),
        documentType: data.type,
        title: data.title,
        payload: data.order || data.plan || data.qualityReport || data.products || data.stats,
      },
      null,
      2
    );

    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, `${data.title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.json`);
  },

  /**
   * Generates and downloads a standalone responsive HTML document
   */
  exportHTML(data: DocumentExportData) {
    const order = data.order;
    const plan = data.plan;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${data.title} - Bazaar One</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 30px; background: #FFF8EC; color: #242424; }
    .container { max-width: 800px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border-top: 8px solid #7A263A; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #F4A340; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { color: #7A263A; font-size: 28px; font-weight: bold; margin: 0; }
    .tagline { color: #F4A340; font-size: 13px; font-weight: 500; }
    table { width: 100%; border-collapse: collapse; margin: 25px 0; }
    th { background: #7A263A; color: #ffffff; text-align: left; padding: 12px; font-size: 14px; }
    td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
    .total-box { margin-top: 20px; float: right; width: 300px; background: #FCF8EE; padding: 20px; border-radius: 8px; border: 1px solid #D9A441; }
    .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
    .grand-total { font-size: 18px; font-weight: bold; color: #7A263A; border-top: 2px solid #7A263A; padding-top: 10px; margin-top: 10px; }
    .footer { clear: both; margin-top: 50px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1 class="logo">BAZAAR ONE</h1>
        <div class="tagline">Your Local Bazaar. Your Modern Marketplace.</div>
      </div>
      <div style="text-align: right;">
        <h2 style="margin: 0; color: #7A263A; font-size: 18px;">${data.title}</h2>
        <div style="font-size: 12px; color: #666;">Date: ${new Date().toLocaleDateString('en-IN')}</div>
      </div>
    </div>

    ${
      order
        ? `
      <div>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Merchant:</strong> ${order.shopName}</p>
        <p><strong>Customer:</strong> ${order.customerName} (${order.customerPhone})</p>
        <p><strong>Fulfillment:</strong> ${order.fulfillmentType.toUpperCase()} | <strong>Payment:</strong> ${order.paymentMethod.toUpperCase()} (${order.paymentStatus})</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${item.name}</td>
              <td>${item.quantity} ${item.unit}</td>
              <td>${formatINR(item.price)}</td>
              <td>${formatINR(item.price * item.quantity)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
      <div class="total-box">
        <div class="total-row"><span>Subtotal:</span><span>${formatINR(order.subtotal)}</span></div>
        <div class="total-row"><span>Delivery:</span><span>${order.deliveryFee === 0 ? 'FREE' : formatINR(order.deliveryFee)}</span></div>
        <div class="total-row"><span>Taxes (GST):</span><span>${formatINR(order.tax)}</span></div>
        ${order.discount > 0 ? `<div class="total-row"><span>Discount:</span><span>-${formatINR(order.discount)}</span></div>` : ''}
        <div class="total-row grand-total"><span>Grand Total:</span><span>${formatINR(order.totalAmount)}</span></div>
      </div>
    `
        : ''
    }

    ${
      plan
        ? `
      <div>
        <p><strong>Frequency:</strong> ${plan.frequency.toUpperCase()}</p>
        <p><strong>Allocated Budget:</strong> ${formatINR(plan.budget)} | <strong>Spent:</strong> ${formatINR(plan.spent)}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Product / Item</th>
            <th>Quantity</th>
            <th>Estimated Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${plan.items
            .map(
              (item, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${item.name}</td>
              <td>${item.quantity} ${item.unit}</td>
              <td>${formatINR(item.estimatedPrice)}</td>
              <td>${item.isPurchased ? 'PURCHASED' : 'PENDING'}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `
        : ''
    }

    <div class="footer">
      Generated automatically by Bazaar One Platform. Official verified record.
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    saveAs(blob, `${data.title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.html`);
  },
};
