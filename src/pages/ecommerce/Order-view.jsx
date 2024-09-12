import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Card from "@/components/ui/Card";
import log from "../../assets/images/logo/sufi-logo2.png"
import { Navigate, useNavigate } from "react-router-dom";

function Orderview() {
  const [order, setOrder] = useState({
    products: [],
    user: { name: '', email: '', phone: '', status: '' },
    date: '',
    deliveryFee: 0,
    platformFee: 0,
    tax: 0,
    total: 0,
    grandTotal: 0,
    address:{address:""}
  });
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const urlParams = new URLSearchParams(window.location.search);
  const [isLoading, setIsLoading] = useState(false);
  const userId = urlParams.get('id');
  const orderViewRef = useRef(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/order/get-orders/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
        });
        setOrder(response.data);
        setIsLoading(false);
        console.log(response.data, "Order Data");
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [userId, user.type]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // const downloadPDF = () => {
  //   const input = orderViewRef.current;
  //   if (input) {
  //     console.log("Capturing element:", input);
  //     html2canvas(input)
  //       .then((canvas) => {
  //         const imgData = canvas.toDataURL('image/png/jpeg');
  //         const pdf = new jsPDF();
  //         pdf.addImage(imgData, 'JPEG', 0, 0);
  //         pdf.save("order.pdf");
  //       })
  //       .catch((error) => {
  //         console.error("Error generating PDF: ", error);
  //       });
  //   } else {
  //     console.error("Error: Order view element not found");
  //   }
  // };


  const loadImages = () => {
    const images = document.querySelectorAll("#order-view img");
    return Promise.all(
      Array.from(images).map((img) => {
        img.crossOrigin = "anonymous";
        if (img.complete) {
          return Promise.resolve();
        } else {
          return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
        }
      })
    );
  };

  const downloadPDF = () => {
    loadImages().then(() => {
      const input = orderViewRef.current;
      if (input) {
        console.log("Capturing element:", input);
        setTimeout(() => {
          html2canvas(input)
            .then((canvas) => {
              const imgData = canvas.toDataURL('image/png');
              const pdf = new jsPDF('p', 'mm', 'a4');
              const imgWidth = 210;
              const pageHeight = 295;
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
              let heightLeft = imgHeight;
              let position = 0;

              pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
              heightLeft -= pageHeight;

              while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
              }

              pdf.save("order.pdf");
            })
            .catch((error) => {
              console.error("Error generating PDF: ", error);
            });
        }, 1000); // Added delay to ensure all images are fully rendered
      } else {
        console.error("Error: Order view element not found");
      }
    }).catch((error) => {
      console.error("Error loading images: ", error);
    });
  };
  const handleCancel = () => {
    navigate('/orders');
  }

  return (
    <div className="container mt-6 mb-7">
      <Card>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="row justify-content-center">
          <div className="col-lg-12 col-xl-9">
            <div className="card" ref={orderViewRef} id="order-view">
              <div className="card-body p-5">
                <div className="flex align-items-start justify-center mb-1">
                  <img src={log} alt="Logo" className="logo-class" style={{ height: '150px', marginRight: '10px' }} />
                </div>
                
                <h4 className="text-[20px]">Order Information</h4>
                <div className="border-bottom border-top border-gray-200 pt-4 mt-4 mb-3">
                  <div className="row">
                    <div className="col-md-6 d-flex align-items-center mb-4">
                      <strong className="text-lg">Order No.</strong>
                      <p>{order._id}</p>
                    </div>
                    <div className="col-md-6 text-md-end">
                      <strong className="text-lg mb-2">Date</strong>
                      <p>{formatDate(order.date)}</p>
                    </div>
                  </div>
                </div>
                <div className="border-bottom border-gray-200 mt-4 py-4">
                  <div className="row">
                    <div className="col-md-6">
                    <h4 className="text-[20px]">Customer Infomation</h4>
                    <br />
                    <p><strong>Customer Name:</strong> {order.user.name}</p>
                      <br />
                      <p className="fs-sm"><strong>Email:</strong>
                        <a href="#!" className="text-blue-600"> {order.user.email}</a>
                      </p>
                      <br />
                      <p><strong>Phone:</strong> {order.user.phone}</p>
                      <br />
                      <p><strong>Status:</strong> {order.user.status}</p>
                      <br />
                      <p><strong>Address:</strong> {order.address.address}</p>

                    </div>
                  </div>
                </div>
        
        
                <table className="border-collapse border border-gray-200 w-full text-center">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2">Image</th>
                      <th className="border border-gray-300 p-2">Name</th>
                      <th className="border border-gray-300 p-2">Quantity</th>
                      <th className="border border-gray-300 p-2">Vendor</th>
                      <th className="border border-gray-300 p-2">status</th>
                      <th className="border border-gray-300 p-2">price</th>



                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(order.products) && order.products.length > 0 ? (
                      order.products.map((item) => (
                        <tr key={item._id}>
                          <td className="border border-gray-300 p-6">
                            <img src={item.product.image} alt="" className="h-20 w-32 object-cover" />
                          </td>
                          <td className="border border-gray-300 p-2">{item.product.name}</td>
                          <td className="border border-gray-300 p-2">{item.quantity}</td>
                          <td className="border border-gray-300 p-2">{item.product.vendor.name}</td>
                          <td className="border border-gray-300 p-2 text-green-300">{item.product.status}</td>
                          <td className="border border-gray-300 p-2">Rs:{item.product.price}</td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">No products found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
        
                {/* <div className="border-top border-gray-200 pt-4 mt-4">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="text-muted mb-2">Order No.</div>
                      <strong>{order._id}</strong>
                    </div>
                    <div className="col-md-6 text-md-end">
                      <div className="text-muted mb-2">Date</div>
                      <strong>{formatDate(order.date)}</strong>
                    </div>
                  </div>
                </div> */}
        
               
                <table className="table border-bottom border-gray-200 mt-3">
                  <thead>
                    <tr>
                      <th scope="col" className="fs-sm text-dark text-uppercase-bold-sm px-0">Description</th>
                      <th scope="col" className="fs-sm text-dark text-uppercase-bold-sm text-end px-0">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-0">Delivery Fee</td>
                      <td className="text-end px-0"><strong>Rs:</strong>{order.deliveryFee} </td>
                    </tr>
                    <tr>
                      <td className="px-0">Platform Fee</td>
                      <td className="text-end px-0"><strong>Rs:</strong>{parseInt(order.platformFee)} </td>
                    </tr>
                    <tr>
                      <td className="px-0">Tax</td>
                      <td className="text-end px-0"><strong>Rs:</strong>{parseInt(order.tax)} </td>
                    </tr>
                    <tr>
                      <td className="px-0">Total</td>
                      <td className="text-end px-0"><strong>Rs:</strong>{order.total} </td>
                    </tr>
                    <tr>
                      <td className="px-0"><strong>Grand Total</strong></td>
                      <td className="text-end px-0">  <b>Rs:</b><strong>{parseInt(order.grandTotal)}</strong> </td>
                    </tr>
                  </tbody>
                </table>
        
               
              </div>
            </div>
            <div className="mt-5">
                  <div className="d-flex justify-content-end gap-1">
                    <button onClick={handleCancel} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400">
                      Cancel
                    </button>
                    <button onClick={downloadPDF} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
                      Download PDF
                    </button>
                  </div>
                </div>
          </div>
        </div>
        
        )}
      </Card>
    </div>
  );
}

export default Orderview;
