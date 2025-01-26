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
    notes: "",
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

    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/admin/location/get-locations`,
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
    // if (!formData.checkInTime)
    //   validationErrors.checkInTime = "Check-in time is required";
    // if (!formData.checkInLocationName)
    //   validationErrors.checkInLocationName = "Check-in location is required";
    // if (!formData.contactNumber)
    //   validationErrors.contactNumber = "Contact number is required";

    return validationErrors;
  };

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
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/admin/attendence/create-attendance`,
        {
          employeeId: formData.employeeId,
          locationId: formData.locationId,
          checkInTime: formData.checkInTime,
          checkInLocationName: formData.checkInLocationName,
          contactNumber: formData.contactNumber,
          notes: formData.notes,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 201) {
        toast.success("Attendance added successfully");
        navigate("/attendance");
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

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Card title="Create Attendence">
        <div className="grid lg:grid-cols-1 grid-cols-1 gap-8">
          <div>
            <div className="space-y-4">
              <label htmlFor="employeeId" className="form-label">
                Select Employee
              </label>
              <Select
                options={employees.map((emp) => ({
                  value: emp._id,
                  label: `${emp.employeeName}  (Id: ${emp.employeeIDNumber})`,
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
