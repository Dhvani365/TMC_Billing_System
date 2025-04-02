import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromBill, resetBill, updateQuantity, updateDiscountedPrice } from '@/store/billSlice';
import { FaTimes } from 'react-icons/fa';
import { Separator } from "@radix-ui/react-separator";
import './BillArea.css';

const BillArea = () => {
  const dispatch = useDispatch();
  const bill = useSelector((state) => state.bill.items);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const total = bill.reduce((acc, item) => acc + parseFloat(item.total), 0);
  const totalPages = Math.ceil(bill.length / itemsPerPage);
  const currentItems = bill.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
    const billItemsRows = bill.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.productName}</td>
        
        <td>5%</td>
        <td>${item.quantity} Pcs</td>
        <td>₹${item.price.toFixed(2)}</td>
        <td>${item.discountedPrice ? `₹${item.discountedPrice.toFixed(2)}` : '-'}</td>
        <td>₹${item.total.toFixed(2)}</td>
      </tr>
    `).join('');
  
    // Calculate tax (assuming a 5% GST split into CGST and SGST)
    const cgst = total * 0.025;
    const sgst = total * 0.025;
    const totalTax = cgst + sgst;
    const grandTotal = total + totalTax;
  
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
            <strong>Invoice No:</strong> GST/5124<br>
          </td>
          <td colspan="2" class="left">
            <strong>Date:</strong> ${new Date().toLocaleDateString()}
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
                UCA Lifestyle<br>
                Flat No.404, Manglam Apartment,<br>
                Shetranjiwad, Begumpura, Surat<br>
                <strong>GSTIN/UIN:</strong> 24GORPS9172G2Z3<br>
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
                UCA Lifestyle<br>
                Flat No.404, Manglam Apartment,<br>
                Shetranjiwad, Begumpura, Surat<br>
                <strong>GSTIN/UIN:</strong> 24GORPS9172G2Z3<br>
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
            <tr>
              <td colspan="7" class="total">Total Amount</td>
              <td>₹${total.toFixed(2)}</td>
          </tbody>
        </table>

        <!-- Tax Calculation -->
    <table>
        <tr>
            <td colspan="9"><strong>Amount Chargeable (in words):</strong> INR------Only</td>
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
            <td class="center" colspan="4">₹${grandTotal.toFixed(2)}</td>
            <td class="center">2.50%</td>
            <td class="center">₹${cgst.toFixed(2)}</td>
            <td class="center">2.50%</td>
            <td class="center">₹${cgst.toFixed(2)}</td>
            <td class="center">${totalTax.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="9"><strong>Tax Amount (in words):</strong> INR----- Only</td>
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
  
  
  const handleSave = (bill) => {
    // Implement your save logic here
    alert("Bill saved successfully"); 
  }

  return (
    <div className="w-[50%] p-5 m-3 bg-zinc-100 rounded-xl shadow-sm flex flex-col justify-between h-[85%] printableArea">
      <h2 className="text-xl font-bold text-black mb-2">Bill Details</h2>

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
          <p>Total Amount: ₹{total.toFixed(2)}</p>
        </div>

        {/* Separator */}
        <Separator className="bg-gray-700 w-full h-px my-2" />



        {/* Left-aligned Buttons */}
        <div className="flex justify-end space-x-10 p-3 bg-zinc-300 rounded-md shadow-xl">
          <button
            onClick={() => handleSave(bill)}
            className="text-white bg-green-500 hover:bg-green-600 px-5 py-2 border border-zinc-800 rounded-sm"
          >
            Save
          </button>
          <button
            onClick={() => dispatch(resetBill())}
            className="text-white bg-red-500 hover:bg-green-600 px-5 py-2 border border-zinc-800 rounded-sm"
          >
            Reset
          </button>
        
          <button
            onClick={handlePrint}
            className="text-white bg-green-500 hover:bg-green-600 px-5 py-2 border border-zinc-800 rounded-sm"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillArea;