import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AssignOrder = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [riders, setRiders] = useState([]);
  const [selectedRider, setSelectedRider] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('id');

  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/${user.type}/rider/get-riders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        setRiders(response.data.riders);
      } catch (error) {
        console.log("Error fetching riders:", error);
      }
    };

    fetchRiders();
  }, [user.type]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        if (orderId) {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/${user.type}/order/get-orders/${orderId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            }
          );

          console.log("Order Response:", response.data);
          setSelectedOrder(response.data);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user.type]);

  const handleRiderSelect = (riderId) => {
    const rider = riders.find(r => r._id === riderId);
    setSelectedRider(rider);
  };

  const handleAssignOrder = async () => {
    if (!selectedOrder || !selectedRider) {
      toast.error("Please select both an order and a rider");
      return;
    }

    try {
      const assignUrl = `${process.env.REACT_APP_BASE_URL}/${user.type}/order/assign-order/${selectedOrder._id}/rider/${selectedRider._id}`;
      console.log("Assign URL:", assignUrl); // Log the URL for debugging

      const response = await axios.put(
        assignUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const invoiceUrl = response.data.invoice;
      window.open(invoiceUrl, "_blank");

      toast.success("Order assigned successfully");
      navigate("/orders");
    } catch (error) {
      console.log("Error assigning order:", error);
      toast.error("Failed to assign order");
    }
  };


  return (
    <Card>
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-semibold">Assign Order to Rider</h2>
      </div>
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          {selectedOrder ? (
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Order Details</h3>
              <div className="mt-2">
                <p><strong>Order ID:</strong> {selectedOrder.orderNumber}</p>
                <p><strong>Customer Name:</strong> {selectedOrder.user.name || 'N/A'}</p>
                <p><strong>Phone:</strong> {selectedOrder.user.phone || 'N/A'}</p>
                <p><strong>Status:</strong> {selectedOrder.status || 'N/A'}</p>
              </div>
            </div>
          ) : (
            <p className="text-center">No order selected</p>
          )}

          <div className="mb-4">
            <label htmlFor="rider-select" className="block mb-2 text-sm font-medium text-gray-700">
              Select Rider
            </label>
            <select
              id="rider-select"
              className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => handleRiderSelect(e.target.value)}
            >
              <option value="">Select a rider</option>
              {riders.map((rider) => (
                <option key={rider._id} value={rider._id}>
                  {rider.name}
                </option>
              ))}
            </select>
          </div>

          {selectedRider && (
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Rider Details</h3>
              <div className="mt-2">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                  Rider Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={selectedRider.name || ''}
                  readOnly
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2 mb-3"
                />

                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  value={selectedRider.email || ''}
                  readOnly
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2 mb-3"
                />

                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
                  Phone NO
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={selectedRider.phone || ''}
                  readOnly
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2 mb-3"
                />
              </div>
            </div>
          )}

          <button
            type="button"
            className="w-full py-2 px-4 bg-black-500 text-white font-semibold rounded-md shadow-md hover:bg-black-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleAssignOrder}
            disabled={!selectedRider || !selectedOrder}
          >
            Assign Order
          </button>
        </>
      )}
    </div>
    </Card>
  );
};

export default AssignOrder;
