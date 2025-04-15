import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromBill, resetBill, updateQuantity, updateDiscountedPrice } from '../store/billSlice';
import { FaTimes } from 'react-icons/fa';
import { Separator } from "@radix-ui/react-separator";
import {  Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, WidthType, convertInchesToTwip} from "docx";
import { saveAs } from "file-saver";
import './BillArea.css';
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const BillArea = () => {
  const dispatch = useDispatch();
  const bill = useSelector((state) => state.bill.items);
  const selectedClient = useSelector((state) => state.client.selectedClient);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [customInvoiceNumber, setCustomInvoiceNumber] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [billId, setBillId] = useState(null);
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const total = bill.reduce((acc, item) => acc + parseFloat(item.total), 0);
  const totalPages = Math.ceil(bill.length / itemsPerPage);
  const currentItems = bill.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  // const billDate = useSelector((state) => state.bill.date);

  const generateInvoiceNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `GST/${year}${month}${day}/${hours}${minutes}${seconds}-${randomSuffix}`;
  };

  const getOrGenerateInvoiceNumber = () => {
    // If custom invoice number is provided, use it
    if (customInvoiceNumber) {
      return customInvoiceNumber;
    }
    
    // If we already have a generated invoice number, use it
    if (invoiceNumber) {
      return invoiceNumber;
    }
    
    // Otherwise, generate a new one and store it
    const newInvoiceNumber = generateInvoiceNumber();
    setInvoiceNumber(newInvoiceNumber);
    return newInvoiceNumber;
  };
  
  // Handle quantity change and dispatch the update action
  const handleQuantityChange = (itemId, newQuantity) => {
    const numericQuantity = parseInt(newQuantity);
    if (!isNaN(numericQuantity) && numericQuantity >= 0) {
      dispatch(updateQuantity({ id: itemId, quantity: numericQuantity }));
    }
  };

  const handleDiscountedPriceChange = (itemId, newDiscountedPrice) => {
    const numericDiscountedPrice = parseFloat(newDiscountedPrice);
    if (!isNaN(numericDiscountedPrice) && numericDiscountedPrice >= 0) {
      dispatch(updateDiscountedPrice({ id: itemId, discountedPrice: numericDiscountedPrice }));
    }
  };

  const handleDecrease = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      dispatch(updateQuantity({ id: itemId, quantity: currentQuantity - 1 }));
    }
  };

  const handleIncrease = (itemId, currentQuantity) => {
    dispatch(updateQuantity({ id: itemId, quantity: currentQuantity + 1 }));
  };
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    // Generate dynamic table rows from bill items
    const billItemsRows = currentItems.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.productName}</td>
        <td></td>
        <td>5%</td>
        <td>${item.quantity} Pcs</td>
        <td>₹${item.price}</td>
        <td>${item.discountedPrice ? `₹${item?.discountedPrice}` : '-'}</td>
        <td>₹${item.total}</td>
      </tr>
    `).join('');
  
    // Calculate tax (assuming a 5% GST split into CGST and SGST)
    const cgst = total * 0.025;
    const sgst = total * 0.025;
    const totalTax = cgst + sgst;
    const grandTotal = total + totalTax;
    
    // Calculate round-off amount
    const roundedGrandTotal = Math.round(grandTotal);
    const roundOffAmount = (roundedGrandTotal - grandTotal).toFixed(2);

    // Utility function to convert numbers to words, including fractional part
    const numberToWords = (num) => {
      const a = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
      ];
      const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

      const inWords = (n) => {
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
        if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + inWords(n % 100) : '');
        if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
        if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
        return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
      };

      const integerPart = Math.floor(num);
      const fractionalPart = Math.round((num - integerPart) * 100);

      let result = inWords(integerPart);
      if (fractionalPart > 0) {
        result += ` and ${inWords(fractionalPart)} Paise`;
      }
      return result + ' Only';
    };

    // Inside handlePrint function
    const amountChargeableInWords = numberToWords(roundedGrandTotal);
    const taxAmountInWords = numberToWords(totalTax);

    const billContent = `
      <html>
      <head>
        <title>Print Tax Invoice</title>
        <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; text-align: center; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .left { text-align: left; vertical-align: top;}
        .no-inner-border td { border-top: none; border-bottom: none; text-align: right; }  
        </style>
      </head>
      <body>
        <center>Tax Invoice</center>
        <table>
          <tr>
            <td colspan="4" rowspan="3" width="50%">
              <strong>GIRNAR FASHION</strong><br>
              Avadh Textile Market, Surat, Gujarat<br>
                <strong>GSTIN/UIN:</strong> 24CMPPS0737K1ZK<br>
                <strong>State Name:</strong> Gujarat, <strong>Code:</strong> 24
            </td>
          <td colspan="2" class="left">
            <strong>Invoice No:</strong> ${getOrGenerateInvoiceNumber()}<br>
          </td>
          <td colspan="2" class="left">
            <strong>Date:</strong> ${customDate ? new Date(customDate).toLocaleDateString() : new Date().toLocaleDateString()}
          </td>
        </tr>
        <tr>
            <td colspan="2" class="left"><strong>Delivery Note</strong><br>5124</td>
            <td colspan="3" class="left"><strong>Mode/Terms of Payment</strong></td>
        </tr>
        <tr>
            <td colspan="2" class="left"><strong>Reference No. & Date</strong><br>5124</td>
            <td colspan="3" class="left"><strong>Other Reference(s)</strong></td>
        </tr>
        </table>
  
        <table>
          <tr>
            <td colspan="4" rowspan="2" width="50%">
                <strong>Consignee (Ship to)</strong><br>
                ${selectedClient.name}<br>
                ${selectedClient.address}<br>
                <strong>GSTIN/UIN:</strong> ${selectedClient.gst_no}<br>
                <strong>State Name:</strong> Gujarat, <strong>Code:</strong> 24
            </td>
            <td colspan="2" class="left"><strong>Dispatch Doc No.</strong></td>
            <td colspan="3" class="left"><strong>Delivery Note Date</strong><br>18-Jan-25</td>
        </tr>
        <tr>
            <td colspan="2" class="left"><strong>Dispatched through</strong></td>
            <td colspan="3" class="left"><strong>Destination</strong></td>
        </tr>
        <tr>
            <td colspan="4" rowspan="2">
                <strong>Buyer (Bill to)</strong><br>
                ${selectedClient.name}<br>
                ${selectedClient.address}<br>
                <strong>GSTIN/UIN:</strong> ${selectedClient.gst_no}<br>
                <strong>State Name:</strong> Gujarat, <strong>Code:</strong> 24<br>
                <strong>Place to Supply:</strong> Gujarat
            </td>
        </tr>
        <tr>
            <td colspan="5" rowspan="2" class="left"><strong>Terms of Delivery</strong></td>
        </tr>
        </table>
  
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Description of Goods</th>
              <th>HSN/SAC</th>
              <th>GST Rate</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Disc. Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${billItemsRows}
            <tr class="no-inner-border">
            <td colspan="7" class="total">CGST</td>
            <td>₹${cgst.toFixed(2)}</td>
            </tr>
            <tr class="no-inner-border">
              <td colspan="7" class="total">SGST</td>
              <td>₹${sgst.toFixed(2)}</td>
            </tr>
            <tr class="no-inner-border">
              <td colspan="7" class="total">Round Off</td>
              <td>₹${roundOffAmount}</td>
            </tr>
            <tr>
              <td colspan="7" class="total">Total Amount</td>
              <td>₹${total}</td>
          </tbody>
        </table>

        <!-- Tax Calculation -->
    <table>
        <tr>
            <td colspan="9"><strong>Amount Chargeable (in words):</strong> INR ${amountChargeableInWords}</td>
        </tr>
        <tr>
            <th colspan="4" rowspan="2">Taxable Value</th>
            <th colspan="2">Central Tax</th>
            <th colspan="2">State Tax</th>
            <th rowspan="2">Total Tax Amount</th>
        </tr>
        <tr>
            <th>Value</th>
            <th>Rate</th>
            <th>Amount</th>
            <th>Rate</th>
        </tr>
        <tr>
            <td class="center" colspan="4">₹${total.toFixed(2)}</td>
            <td class="center">2.50%</td>
            <td class="center">₹${cgst.toFixed(2)}</td>
            <td class="center">2.50%</td>
            <td class="center">₹${cgst.toFixed(2)}</td>
            <td class="center">${totalTax.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="9"><strong>Tax Amount (in words):</strong> INR ${taxAmountInWords}</td>
        </tr>
    </table>
    
    <table>
        <tr>
            <td colspan="3">
                <strong>Declaration</strong><br>
                We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
            </td>
            <td colspan="6">
                <strong>Company's Bank Details</strong><br>
                Bank Name: Kotak Bank 0786<br>
                A/c No.: 6345120786<br>
                Branch & IFS Code: Ring Road, Surat & KKBK0002847
            </td>
        </tr>
        <tr>
            <td colspan="9" class="center"><strong>For Girnar Fashion</strong><br><br>Authorised Signatory</td>
        </tr>
    </table>
      <script>
        window.onload = function() {
          window.print();
          setTimeout(() => window.close(), 500);
        };
      </script>
      </body>
      </html>
    `;
  
    printWindow.document.write(billContent);
    printWindow.document.close();
  };

  const paddedCell = (paragraphs, options = {}) => new TableCell({
    children: paragraphs,
    margins: {
      top: convertInchesToTwip(0.05),
      bottom: convertInchesToTwip(0.05),
      left: convertInchesToTwip(0.1),
      right: convertInchesToTwip(0.1),
    },
    ...options,
  });
  
  const handleDownloadDocx = () => {
    const currentDate = new Date().toLocaleDateString();
    const total = bill.reduce((acc, item) => acc + parseFloat(item.total), 0);
    const cgst = +(total * 0.025).toFixed(2);
    const sgst = +(total * 0.025).toFixed(2);
    const totalTax = cgst + sgst;
    const roundOff = +(Math.round(total + cgst + sgst) - (total + cgst + sgst)).toFixed(2);
    const grandTotal = +(total + cgst + sgst + roundOff).toFixed(2);
  
    const numberToWords = (num) => {
      const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
      const inWords = (n) => {
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
        if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + inWords(n % 100) : '');
        if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
        return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
      };
  
      const integerPart = Math.floor(num);
      const fractional = Math.round((num - integerPart) * 100);
      return inWords(integerPart) + (fractional > 0 ? ` and ${inWords(fractional)} Paise` : '') + " Only";
    };
  
    const headers = ["#", "Description of Goods", "HSN/SAC", "GST Rate", "Quantity", "Rate", "Disc. Price", "Amount"];
    const itemRows = bill.map((item, index) => [
      String(index + 1),
      item.productName,
      "",
      "5%",
      `${item.quantity} Pcs`,
      `₹${item.price}`,
      item.discountedPrice ? `₹${item.discountedPrice}` : "-",
      `₹${item.total}`,
    ]);
  
    const blankLine = new Paragraph({ text: "", spacing: { after: 0 } });
  
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
    
          // --- Table 1: Header + Invoice Details ---
          new Table({
            rows: [
              new TableRow({
                children: [
                  paddedCell([
                    new Paragraph({ children: [new TextRun({ text: "GIRNAR FASHION", bold: true })] }),
                    new Paragraph("Avadh Textile Market, Surat, Gujarat"),
                    new Paragraph("GSTIN/UIN: 24CMPPS0737K1ZK"),
                    new Paragraph("State Name: Gujarat, Code: 24"),
                  ], { columnSpan: 2, rowSpan: 2 }),
                  paddedCell([
                    new Paragraph({ children: [new TextRun({ text: "Invoice No:", bold: true })] }),
                    new Paragraph(getOrGenerateInvoiceNumber())
                  ]),
                  paddedCell([
                    new Paragraph({ children: [new TextRun({ text: "Date:", bold: true })] }),
                    new Paragraph(customDate ? new Date(customDate).toLocaleDateString() : currentDate)
                  ]),
                ],
              }),
              new TableRow({
                children:  [
                  paddedCell([
                    new Paragraph({ children: [new TextRun({ text: "Delivery Note:", bold: true })] }),
                    new Paragraph("5124")
                  ]),
                  paddedCell([
                    new Paragraph({ children: [new TextRun({ text: "Mode/Terms of Payment:", bold: true })] }),
                    new Paragraph("Immediately / 30 Days/ _______")
                  ]),
                ]
              }),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE }
          }),
    
          blankLine,
    
          // --- Table 2: Buyer Info + Dispatch Info ---
          new Table({
            rows: [
              new TableRow({
                children: [
                  paddedCell([
                    new Paragraph({ children: [new TextRun({ text: "Buyer (Bill to):", bold: true })] }),
                    new Paragraph(selectedClient.name),
                    new Paragraph(selectedClient.address),
                    new Paragraph(`GSTIN/UIN: ${selectedClient.gst_no}`),
                    new Paragraph("State Name: Gujarat, Code: 24"),
                  ], { rowSpan: 2 }),
                  paddedCell([
                    new Paragraph({ children: [new TextRun({ text: "Dispatch Doc No.", bold: true })] })
                  ]),
                  paddedCell([
                    new Paragraph({ children: [new TextRun({ text: "Delivery Note Date", bold: true })] }),
                    new Paragraph("18-Jan-25")
                  ]),
                ]
              }),
              new TableRow({
                children: [
                  paddedCell([
                    new Paragraph({ children: [new TextRun({ text: "Dispatched through", bold: true })] })
                  ]),
                  paddedCell([
                    new Paragraph({ children: [new TextRun({ text: "Destination", bold: true })] })
                  ]),
                ]
              }),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE }
          }),
    
          blankLine,

          // --- Table 3: Product + Total Tax Summary ---
new Table({
  rows: [
    new TableRow({
      children: headers.map(h =>
        paddedCell([
          new Paragraph({
            children: [new TextRun({ text: h, bold: true })]
          })
        ])
      )
    }),
    ...itemRows.map(row =>
      new TableRow({
        children: row.map(val =>
          paddedCell([new Paragraph(val)])
        )
      })
    ),
    new TableRow({
      children: [
        paddedCell([
          new Paragraph({ children: [new TextRun({ text: "CGST", bold: true })], alignment: AlignmentType.RIGHT })
        ], { columnSpan: 7 }),
        paddedCell([new Paragraph(`₹${cgst.toFixed(2)}`)])
      ]
    }),
    new TableRow({
      children: [
        paddedCell([
          new Paragraph({ children: [new TextRun({ text: "SGST", bold: true })], alignment: AlignmentType.RIGHT })
        ], { columnSpan: 7 }),
        paddedCell([new Paragraph(`₹${sgst.toFixed(2)}`)])
      ]
    }),
    new TableRow({
      children: [
        paddedCell([
          new Paragraph({ children: [new TextRun({ text: "Round Off", bold: true })], alignment: AlignmentType.RIGHT })
        ], { columnSpan: 7 }),
        paddedCell([new Paragraph(`₹${roundOff}`)])
      ]
    }),
    new TableRow({
      children: [
        paddedCell([
          new Paragraph({ children: [new TextRun({ text: "Total Amount", bold: true })] })
        ], { columnSpan: 7 }),
        paddedCell([new Paragraph(`₹${total.toFixed(2)}`)])
      ]
    }),
  ],
  width: { size: 100, type: WidthType.PERCENTAGE }
}),
blankLine,
// --- Table 4: Amount Chargeable + Tax Table ---
new Table({
  rows: [
    new TableRow({
      children: [
        paddedCell([
          new Paragraph({
            children: [new TextRun({ text: `Amount Chargeable (in words): INR ${numberToWords(grandTotal)}`, bold: true })]
          })
        ], { columnSpan: 6 })
      ]
    }),
    new TableRow({
      children: [
        paddedCell([new Paragraph({ children: [new TextRun({ text: "Taxable Value", bold: true })] })], { rowSpan: 2 }),
        paddedCell([new Paragraph({ children: [new TextRun({ text: "Central Tax", bold: true })] })], { columnSpan: 2 }),
        paddedCell([new Paragraph({ children: [new TextRun({ text: "State Tax", bold: true })] })], { columnSpan: 2 }),
        paddedCell([new Paragraph({ children: [new TextRun({ text: "Total Tax Amount", bold: true })] })], { rowSpan: 2 }),
      ]
    }),
    new TableRow({
      children: [
        paddedCell([new Paragraph("Value")]),
        paddedCell([new Paragraph("Rate")]),
        paddedCell([new Paragraph("Value")]),
        paddedCell([new Paragraph("Rate")]),
      ]
    }),
    new TableRow({
      children: [
        paddedCell([new Paragraph(`₹${total.toFixed(2)}`)]),
        paddedCell([new Paragraph(`₹${cgst.toFixed(2)}`)]),
        paddedCell([new Paragraph("2.50%")]),
        paddedCell([new Paragraph(`₹${sgst.toFixed(2)}`)]),
        paddedCell([new Paragraph("2.50%")]),
        paddedCell([new Paragraph(`₹${totalTax.toFixed(2)}`)])
      ]
    }),
    new TableRow({
      children: [
        paddedCell([
          new Paragraph({
            children: [new TextRun({ text: `Tax Amount (in words): INR ${numberToWords(cgst + sgst)}`, bold: true })]
          })
        ], { columnSpan: 6 })
      ]
    }),
  ],
  width: { size: 100, type: WidthType.PERCENTAGE }
}),
blankLine,

    
          // --- Table 5: Declaration + Bank + Signature ---
          new Table({
            rows: [
              new TableRow({
                children: [
                  paddedCell([
                    new Paragraph({ children: [new TextRun({ text: "Declaration", bold: true })] }),
                    new Paragraph("We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.")
                  ]),
                  paddedCell([
                    new Paragraph({ children: [new TextRun({ text: "Company’s Bank Details", bold: true })] }),
                    new Paragraph("Bank Name: Kotak Bank 0786"),
                    new Paragraph("A/c No.: 6345120786"),
                    new Paragraph("Branch & IFS Code: Ring Road, Surat & KKBK0002847")
                  ])
                ]
              }),
              new TableRow({
                children: [
                  paddedCell([
                    new Paragraph({
                      children: [new TextRun("For Girnar Fashion")],
                      alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                      children: [new TextRun("Authorised Signatory")],
                      alignment: AlignmentType.CENTER,
                    }),
                  ], { columnSpan: 2 })
                ]
              })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE }
          })
    
        ]
      }]
    });
    
  
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "Girnar_Fashion_Invoice.docx");
    });
  };
    
  const handleSave = async () => {
    try {
      
      // Check if bill is empty
      if (bill.length === 0) {
        alert("Cannot save an empty bill");
        return;
      }
      
      // Check if client is selected
      if (!selectedClient || !selectedClient._id) {
        alert("Please select a party/client first");
        return;
      }
  
      // Calculate tax amounts and totals
      const totalAmount = bill.reduce((acc, item) => acc + parseFloat(item.total), 0);
      const cgst = +(totalAmount * 0.025).toFixed(2);
      const sgst = +(totalAmount * 0.025).toFixed(2);
      const roundOff = +(Math.round(totalAmount + cgst + sgst) - (totalAmount + cgst + sgst)).toFixed(2);
      const grandTotal = Math.round(totalAmount + cgst + sgst);
  
      // Generate timestamp-based invoice number
      const currentInvoiceNumber = getOrGenerateInvoiceNumber();
      

      const billDate = customDate ? new Date(customDate) : new Date();
      // Format bill items to match the backend model
      const billItems = bill.map((item,index) => ({
        skuId: item.objectid, // Assuming item.id is the SKU ID
        productName: item.productName,
        quantity: item.quantity,
        price: parseFloat(item.price),
        discountedPrice: item.discountedPrice ? parseFloat(item.discountedPrice) : undefined,
        total: parseFloat(item.total)
      }));
  
      // Create the bill object according to your backend model
      const billData = {
        invoiceNumber: currentInvoiceNumber,
        date: billDate,
        partyId: selectedClient._id,
        party: {
          name: selectedClient.name,
          address: selectedClient.address,
          gstin: selectedClient.gst_no,
          state: "Gujarat", // You might want to get this from the client data
          stateCode: "24"   // You might want to get this from the client data
        },
        items: billItems,
        totalAmount,
        cgst,
        sgst,
        roundOff,
        grandTotal,
        notes: "", // Optional notes
        status: "active"
      };
  
      // Get the token from localStorage (assuming you store it there after login)
      const token = localStorage.getItem('userid');
      
      if (!token) {
        alert("You must be logged in to save bills");
        return;
      }
  
      // Make the API call to save the bill
      
    let response;
    
    // Determine if we're saving a new bill or updating an existing one
    if (isSaved && billId) {
      // Update existing bill
      response = await axios.put(
        `${BACKEND_URL}/bill/update/${billId}`, billData);
      
      if (response.status === 200) {
        alert("Bill updated successfully!");
      }
    } else {
        // Save new bill
        response = await axios.post(`${BACKEND_URL}/bill/add`,  billData);
        
        if (response.status === 201) {
          alert("Bill saved successfully!");
          // Store the bill ID and set isSaved to true
          setBillId(response.data._id);
          setIsSaved(true);
        }
      }
    } catch (error) {
      console.error("Error saving/updating bill:", error);
        
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        if (error.response.status === 400 && error.response.data.message) {
          alert(`Error: ${error.response.data.message}`);
        } else if (error.response.status === 401) {
          alert("Authentication error. Please log in again.");
        } else {
          alert(`Error: ${error.response.status} - ${error.response.data.message || "Unknown error"}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        alert("Network error. Please check your connection and try again.");
      } else {
        // Something happened in setting up the request
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleReset = () => {
    dispatch(resetBill());
    setInvoiceNumber('');
    if (customInvoiceNumber) {
      // Extract numeric part and increment it
      const match = customInvoiceNumber.match(/(\D*)(\d+)(\D*)/);
      if (match) {
        const [_, prefix, number, suffix] = match;
        const incrementedNumber = (parseInt(number, 10) + 1).toString().padStart(number.length, '0');
        setCustomInvoiceNumber(`${prefix}${incrementedNumber}${suffix}`);
      } else {
        // If no numeric part, just clear it
        setCustomInvoiceNumber('');
      }
    } else {
      setCustomInvoiceNumber('');
    }
    setCustomDate(new Date().toISOString().split('T')[0]); // Reset date to today
    setIsSaved(false); // Reset saved status
    setBillId(null); // Clear bill ID
  };
  return (
    <div className="w-[50%] p-5 m-3 bg-zinc-100 rounded-xl shadow-sm flex flex-col justify-between h-[85%] printableArea">
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-black">Bill Details</h2>
      <div className="flex space-x-4">
        <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700">Invoice Number</label>
          <input
            type="text"
            id="invoiceNumber"
            value={customInvoiceNumber}
            onChange={(e) => setCustomInvoiceNumber(e.target.value)}
            placeholder="GST/XXXX"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            id="invoiceDate"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>
      </div>
    </div>

      {/* Scrollable Table */}
      <div className="overflow-auto flex-grow shadow-2xl">
        <table className="w-full">
          <thead>
            <tr className="bg-green-300">
              <th className='border border-gray-800'>#</th>
              <th className='border border-gray-800'>Product Name</th>
              <th className='border border-gray-800'>Quantity</th>
              <th className='border border-gray-800'>Price</th>
              <th className='border border-gray-800'>Discounted Price</th>  
              <th className='border border-gray-800'>Total</th>   
              <th className='border border-gray-800'>Actions</th>        
            </tr>
          </thead>
          <tbody className="text-center border border-gray-800 divide-y divide-gray-800 rounded-md">
            {currentItems.map((item, index) => (
              <tr key={item.id}>
                <td className='border border-gray-800'>{index + 1}</td>
                <td className='border border-gray-800'>{item.productName}</td>
                <td className='border border-gray-800'>
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleDecrease(item.id, item.quantity)}
                      className="px-2 bg-red-500 text-white rounded"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="w-10 text-center border border-gray-300"
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <button
                      onClick={() => handleIncrease(item.id, item.quantity)}
                      className="px-2 bg-green-500 text-white rounded"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className='border border-gray-800'>₹{item.price}</td>
                <td className='border border-gray-800'>
                  <input
                    type="text"
                    value={item.discountedPrice}
                    onChange={(e) => handleDiscountedPriceChange(item.id, e.target.value)}
                    className="w-20 text-center border border-gray-300"
                    onKeyPress={(e) => {
                      if (!/[0-9.]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </td>
                <td className='border border-gray-800'>₹{item.total}</td>
                <td className='border border-gray-800'>
                  <button onClick={() => dispatch(removeFromBill(item.id))}>
                    <FaTimes size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fixed container for Total Amount, Separator, and Buttons */}
      <div className="relative w-full">
        {/* Right-aligned Total Amount */}
        <div className="text-right text-lg font-semibold mb-2 pr-10 bg-yellow-100 rounded-sm shadow-md">
          <p>Total Amount: ₹{total}</p>
        </div>

        {/* Separator */}
        <Separator className="bg-gray-700 w-full h-px my-2" />



        {/* Left-aligned Buttons */}
        <div className="flex justify-end space-x-10 p-3 bg-zinc-300 rounded-md shadow-xl">
          <button
            onClick={() => handleSave(bill)}
            className="text-white bg-green-500 hover:bg-green-600 px-5 py-2 border border-zinc-800 rounded-sm"
          >
            {isSaved ? "Update" : "Save"}
          </button>
          <button
            onClick={()=> handleReset()}
            className="text-white bg-red-500 hover:bg-green-600 px-5 py-2 border border-zinc-800 rounded-sm"
          >
            New Bill
          </button>
        
          <button
            onClick={handlePrint}
            className="text-white bg-green-500 hover:bg-green-600 px-5 py-2 border border-zinc-800 rounded-sm"
          >
            Print
          </button>

          <button
            onClick={handleDownloadDocx}
            className="text-white bg-blue-500 hover:bg-blue-600 px-5 py-2 border border-zinc-800 rounded-sm"
          >
            Download Word
          </button>

        </div>
      </div>
    </div>
  );
};

export default BillArea;