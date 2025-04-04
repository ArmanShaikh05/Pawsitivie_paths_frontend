/* eslint-disable react/prop-types */

import { Logo } from "@/assets";
import { convertAmount } from "@/utils/features";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download } from "lucide-react";
import moment from "moment";
import { useRef } from "react";
import { Button } from "../ui/button";

const Invoice = ({ setOpenInvoiceDialog, orderData }) => {
  const shippingAmount = convertAmount(
    orderData?.shippingDetails?.shippingCharge
  );
  const taxAmount = convertAmount(orderData?.shippingDetails?.taxAmount);
  const discountAmount = convertAmount(
    orderData?.shippingDetails?.discountAmount
  );

  const totalAmount =
    orderData?.amount - discountAmount + shippingAmount + taxAmount;

  const invoiceRef = useRef();

  const downloadPDF = () => {
    const input = invoiceRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${orderData?._id.toString().slice(18)}.pdf`);
    });
  };

  return (
    <>
      <div className="flex items-center px-6  gap-2 mb-4">
        <Button
          onClick={downloadPDF}
          className=" bg-blue-500 text-white text-[0.8rem] p-2 rounded flex items-center gap-2"
        >
          <Download size={14} /> Download
        </Button>
        <Button variant={"outline"} onClick={() => setOpenInvoiceDialog(false)}>
          Close
        </Button>
      </div>
      <div
        ref={invoiceRef}
        className="max-w-3xl mx-auto bg-white p-6 shadow-md border rounded-lg"
      >
        <div className="flex justify-between items-start border-b pb-4 mb-4">
          <div>
            <img
              src={Logo}
              alt="Company Logo"
              className="w-20 h-20 ml-3 mb-4 object-contain rounded-full shadow-sm"
            />
            <h1 className="text-2xl font-bold">Pawsitive Paths</h1>
            <p className="text-sm">www.pawsitivepaths.com</p>
            <p className="text-sm">pawsitivepaths@gmail.com</p>
          </div>
          <div className="text-right">
            <p className="text-sm">
              Date: {moment(orderData?.createdAt).format("L")}
            </p>
            <p className="text-sm">
              Invoice No: {orderData?._id.toString().slice(18)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-4">
          <div>
            <h2 className="font-semibold">Bill To:</h2>
            <p className="text-sm">{orderData?.userId?.userName}</p>
            {orderData?.userId?.address && (
              <p className="text-sm">{orderData?.userId?.address}</p>
            )}
            <p className="text-sm">{orderData?.userId?.email}</p>
            {orderData?.userId?.phone && (
              <p className="text-sm">{orderData?.userId?.phone}</p>
            )}
          </div>
          <div>
            <h2 className="font-semibold">Ship To:</h2>
            <p className="text-sm">{orderData?.userId?.userName}</p>
            {orderData?.userId?.address && (
              <p className="text-sm">{orderData?.userId?.address}</p>
            )}
            <p className="text-sm">{orderData?.userId?.email}</p>
            {orderData?.userId?.phone && (
              <p className="text-sm">{orderData?.userId?.phone}</p>
            )}
          </div>
        </div>

        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Description</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Unit Price</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {orderData?.products?.map((item, index) => (
              <tr key={index} className="border">
                <td className="border p-2 flex items-center gap-4">
                  {item?.productId?.productImages && (
                    <img
                      src={item?.productId?.productImages?.[0]?.url}
                      alt={item?.productId?.productName}
                      className="w-12 h-12 object-cover"
                    />
                  )}{" "}
                  <div className="flex flex-col">
                  <span className="font-semibold">{item?.productId?.productName}</span>
                  <span className="text-sm text-gray-500">{item?.shopId?.shopName}</span>
                  </div>
                </td>
                <td className="border p-2 text-center">{item.productQty}</td>
                <td className="border p-2 text-center">
                  ₹{item?.productId?.productPrice.toFixed(2)}
                </td>
                <td className="border p-2 text-center">
                  ₹
                  {(item.productQty * item?.productId?.productPrice).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col items-end w-full">
          <div className="mt-8 w-[300px] grid grid-cols-2 gap-4 text-right">
            <p className="text-sm">Subtotal:</p>{" "}
            <p className="text-sm">₹{orderData?.amount?.toFixed(2)}</p>
            <p className="text-sm">Discount:</p>{" "}
            <p className="text-sm">-₹{discountAmount.toFixed(2)}</p>
            <p className="text-sm">Tax (18%):</p>{" "}
            <p className="text-sm">₹{taxAmount.toFixed(2)}</p>
            <p className="text-sm">Shipping:</p>{" "}
            <p className="text-sm">₹{shippingAmount.toFixed(2)}</p>
          </div>
          <div className="mt-8 border-t-2 pt-4 w-[300px] grid grid-cols-2 gap-4 text-right">
            <h2 className="font-bold text-lg">Total:</h2>{" "}
            <h2 className="font-bold text-lg">₹{totalAmount.toFixed(2)}</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice;
