// New file created by me

import React, { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";

const AttendenceAddPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    employeeId: "",
    locationId: "",
    checkInTime: "",
    checkInLocationName: "",
    contactNumber: "",
  });

  const [roles, setRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const isSubmitting = useRef(false);
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);

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

  const validate = () => {
    const validationErrors = {};

    if (!formData.employeeId)
      validationErrors.employeeId = "Employee ID is required";
    if (!formData.locationId)
      validationErrors.locationId = "Location ID is required";
    if (!formData.checkInTime)
      validationErrors.checkInTime = "Check-in time is required";
    if (!formData.checkInLocationName)
      validationErrors.checkInLocationName = "Check-in location is required";
    if (!formData.contactNumber)
      validationErrors.contactNumber = "Contact number is required";

    return validationErrors;
  };

  const handleSubmit = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      isSubmitting.current = false;
      return;
    }

    try {
      const response = await axios.post(
        "https://dashcart-backend-production.up.railway.app/api/admin/attendence/create-attendance",
        {
          employeeId: formData.employeeId,
          locationId: formData.locationId,
          checkInTime: formData.checkInTime,
          checkInLocationName: formData.checkInLocationName,
          contactNumber: formData.contactNumber,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 201) {
        toast.success("Attendance added successfully");
        navigate("/attendance"); // Adjust as per your routes
      }
    } catch (error) {
      console.error("Error adding attendance:", error);
      toast.error(error.response?.data?.message || "Error adding attendance");
    } finally {
      isSubmitting.current = false;
    }
  };
  const handleCancel = () => {
    navigate("/attendance");
  };

  // console.log(formData);
  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Card title="Create Attendence">
        <div className="grid lg:grid-cols-1 grid-cols-1 gap-8">
          {/* Personal Information */}
          <div>
            {/* <h3 className="text-lg font-semibold mb-4">Personal Information</h3> */}
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
              {errors.employeeId && (
                <p className="text-red-500">{errors.employeeId}</p>
              )}
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
              {errors.locationId && (
                <p className="text-red-500">{errors.locationId}</p>
              )}

              {/* Check-in Time */}
              <label htmlFor="checkInTime" className="form-label">
                Check-in Time
              </label>
              <Flatpickr
                value={formData.checkInTime}
                onChange={(date) =>
                  setFormData({ ...formData, checkInTime: date[0] })
                }
                options={{ enableTime: true, dateFormat: "Y-m-d H:i" }}
                className="form-input"
              />
              {errors.checkInTime && (
                <p className="text-red-500">{errors.checkInTime}</p>
              )}

              {/* Check-in Location Name */}
              <Textinput
                label="Check-in Address"
                type="text"
                placeholder="Enter Check-in Address"
                value={formData.checkInLocationName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    checkInLocationName: e.target.value,
                  })
                }
              />
              {errors.checkInLocationName && (
                <p className="text-red-500">{errors.checkInLocationName}</p>
              )}

              {/* Contact Number */}
              <Textinput
                label="Contact Number"
                type="text"
                placeholder="Enter Contact Number"
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
              />
              {errors.contactNumber && (
                <p className="text-red-500">{errors.contactNumber}</p>
              )}
            </div>
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
          <Button onClick={handleSubmit} disabled={isSubmitting.current}>
            Submit
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AttendenceAddPage;
