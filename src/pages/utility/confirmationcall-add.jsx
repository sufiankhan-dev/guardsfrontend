import React, { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useSelector } from "react-redux";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";

const ConfirmationCallAddPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    employeeId: "",
    locationId: "",
    callingTime: "",
    notes: "",
  });

  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const [errors, setErrors] = useState({});
  const [uploadingData, setUploadingData] = useState(false);
  const isSubmitting = useRef(false);

  useEffect(() => {
    // Fetch employee data
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/admin/employe/get-employees`, // Replace with correct endpoint
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEmployees(response.data.employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    // Fetch location data
    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/admin/location/get-locations`, // Replace with correct endpoint
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchEmployees();
    fetchLocations();
  }, []);
  // const validate = () => {
  //   const validationErrors = {};
  //   if (!formData.employeeId)
  //     validationErrors.employeeId = "Employee is required";
  //   if (!formData.locationId)
  //     validationErrors.locationId = "Location is required";
  //   if (!formData.callingTime)
  //     validationErrors.callingTime = "Calling Time is required";
  //   if (!formData.notes) validationErrors.notes = "Notes are required";
  //   return validationErrors;
  // };

  const handleSubmit = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    // const validationErrors = validate();
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   isSubmitting.current = false;
    //   return;
    // }

    try {
      setUploadingData(true);
      const response = await axios.post(
        `https://dashcart-backend-production.up.railway.app/api/admin/call/add-confirmation-call`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.status === 201) {
        toast.success("Confirmation call created successfully");
        navigate("/confirmation-call");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Error creating confirmation call"
      );
    } finally {
      setUploadingData(false);
      isSubmitting.current = false;
    }
  };

  const handleCancel = () => {
    navigate("/confirmation-call");
  };

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Card title="Create New Confirmation Call">
        <div className="grid lg:grid-cols-1 grid-cols-1 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            <label htmlFor="employeeId" className="form-label">
              Select Employee
            </label>
            <Select
              options={employees.map((emp) => ({
                value: emp._id,
                label: `${emp.employeeName}`,
              }))}
              onChange={(selectedOption) =>
                setFormData({ ...formData, employeeId: selectedOption.value })
              }
              placeholder="Select Employee"
            />
            {/* {errors.employeeId && (
              <p className="text-red-500">{errors.employeeId}</p>
            )} */}
            <label htmlFor="locationId" className="form-label">
              Select Location
            </label>
            <Select
              options={locations.map((loc) => ({
                value: loc._id,
                label: loc.locationName,
              }))}
              onChange={(selectedOption) =>
                setFormData({ ...formData, locationId: selectedOption.value })
              }
              placeholder="Select Location"
            />
            {/* {errors.locationId && (
              <p className="text-red-500">{errors.locationId}</p>
            )} */}

            {/* <Textinput
              label="Calling Time"
              type="date"
              value={formData.callingTime}
              onChange={(e) =>
                setFormData({ ...formData, callingTime: e.target.value })
              }
            /> */}
            <label htmlFor="callingTime" className="form-label -mb-2">
              Calling Time
            </label>
            <Flatpickr
              value={formData.callingTime} // Use the same state value for callingTime
              onChange={
                (date) => setFormData({ ...formData, callingTime: date[0] }) // Update callingTime with the selected date and time
              }
              options={{ enableTime: true, dateFormat: "Y-m-d H:i" }} // Enable time selection and set date format
              className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 shadow-md cursor-pointer" // Apply your desired styling class
              placeholder="Select Date & Time"
            />
            {/* {errors.callingTime && (
              <p className="text-red-500">{errors.callingTime}</p>
            )} */}

            <Textinput
              label="Notes"
              type="text"
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
            {/* {errors.notes && <p className="text-red-500">{errors.notes}</p>} */}
          </div>
        </div>

        {/* Buttons */}
        <div className="text-right mt-8 space-x-4">
          <button
            className="btn btn-light"
            onClick={handleCancel}
            type="button"
          >
            Cancel
          </button>
          <Button
            text="Save"
            type="submit"
            className="btn-dark"
            onClick={handleSubmit}
            isLoading={uploadingData}
            disabled={uploadingData}
          />
        </div>
      </Card>
    </div>
  );
};

export default ConfirmationCallAddPage;
