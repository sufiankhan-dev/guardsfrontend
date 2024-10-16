import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const EmployeeEditPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeLastName: "",
    employeeAddress: "",
    employeeIDNumber: "",
    contactNumber1: "",
    employeeCategory: "",
    guardCardNumber: "",
    issueDate: "",
    expiryDate: "",
    payRate: "",
    managerName: "",
    approved: false,
    status: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingData, setUploadingData] = useState(false);

  const employeeId = new URLSearchParams(window.location.search).get("id");
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeResponse = await axios.get(
          `https://dashcart-backend-production.up.railway.app/api/admin/employe/get-employees/${employeeId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFormData(employeeResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch employee data");
      }
    };

    fetchData();
  }, [employeeId]);

  const handleSubmit = async () => {
    // const validationErrors = validate();
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   return;
    // }

    try {
      setUploadingData(true);
      const response = await axios.put(
        `https://dashcart-backend-production.up.railway.app/api/admin/employe/update-employee/${employeeId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Employee updated successfully");
        navigate("/employees");
      }
    } catch (error) {
      console.error(
        "Error details:",
        error.response ? error.response.data : error
      );
      toast.error(error.response?.data?.message || "Failed to update employee");
    } finally {
      setUploadingData(false);
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.employeeName) {
      errors.employeeName = "Employee first name is required";
    }
    if (!formData.employeeLastName) {
      errors.employeeLastName = "Employee last name is required";
    }

    if (!formData.employeeAddress) {
      errors.employeeAddress = "Employee address is required";
    }

    if (!formData.contactNumber1) {
      errors.contactNumber1 = "Contact number is required";
    }

    if (!formData.employeeIDNumber) {
      errors.employeeIDNumber = "Employee ID number is required";
    }

    if (!formData.guardCardNumber) {
      errors.guardCardNumber = "Guard card number is required";
    }

    if (!formData.issueDate) {
      errors.issueDate = "Issue date is required";
    }

    if (!formData.expiryDate) {
      errors.expiryDate = "Expiry date is required";
    }

    if (!formData.payRate) {
      errors.payRate = "Pay rate is required";
    }

    return errors;
  };

  const handleCancel = () => {
    navigate("/employees");
  };

  return (
    <div>
      <Card title="Edit Employee">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mb-5">
              <div>
                <label className="form-label">Employee First Name</label>
                <input
                  type="text"
                  className="border-[3px] h-10 w-full mb-3 p-2"
                  value={formData.employeeName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      employeeName: e.target.value,
                    })
                  }
                />
                {errors.employeeName && (
                  <p className="text-red-500 text-xs">{errors.employeeName}</p>
                )}
              </div>
              <div>
                <label className="form-label">Employee Last Name</label>
                <input
                  type="text"
                  className="border-[3px] h-10 w-full mb-3 p-2"
                  value={formData.employeeLastName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      employeeLastName: e.target.value,
                    })
                  }
                />
                {errors.employeeLastName && (
                  <p className="text-red-500 text-xs">
                    {errors.employeeLastName}
                  </p>
                )}
              </div>
              <div>
                <label className="form-label">Employee Address</label>
                <input
                  type="text"
                  className="border-[3px] h-10 w-full mb-3 p-2"
                  value={formData.employeeAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      employeeAddress: e.target.value,
                    })
                  }
                />
                {errors.employeeAddress && (
                  <p className="text-red-500 text-xs">
                    {errors.employeeAddress}
                  </p>
                )}
              </div>
              <div>
                <label className="form-label">Contact Number</label>
                <input
                  type="text"
                  className="border-[3px] h-10 w-full mb-3 p-2"
                  value={formData.contactNumber1}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNumber1: e.target.value })
                  }
                />
                {errors.contactNumber1 && (
                  <p className="text-red-500 text-xs">
                    {errors.contactNumber1}
                  </p>
                )}
              </div>
              <div>
                <label className="form-label">Employee ID Number</label>
                <input
                  type="text"
                  className="border-[3px] h-10 w-full mb-3 p-2"
                  value={formData.employeeIDNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      employeeIDNumber: e.target.value,
                    })
                  }
                />
                {errors.employeeIDNumber && (
                  <p className="text-red-500 text-xs">
                    {errors.employeeIDNumber}
                  </p>
                )}
              </div>
              <div>
                <label className="form-label">Guard Card Number</label>
                <input
                  type="text"
                  className="border-[3px] h-10 w-full mb-3 p-2"
                  value={formData.guardCardNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      guardCardNumber: e.target.value,
                    })
                  }
                />
                {errors.guardCardNumber && (
                  <p className="text-red-500 text-xs">
                    {errors.guardCardNumber}
                  </p>
                )}
              </div>
              <div>
                <label className="form-label">Issue Date</label>
                <input
                  type="date"
                  className="border-[3px] h-10 w-full mb-3 p-2"
                  value={formData.issueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, issueDate: e.target.value })
                  }
                />
                {errors.issueDate && (
                  <p className="text-red-500 text-xs">{errors.issueDate}</p>
                )}
              </div>
              <div>
                <label className="form-label">Expiry Date</label>
                <input
                  type="date"
                  className="border-[3px] h-10 w-full mb-3 p-2"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-xs">{errors.expiryDate}</p>
                )}
              </div>
              <div>
                <label className="form-label">Pay Rate</label>
                <input
                  type="number"
                  className="border-[3px] h-10 w-full mb-3 p-2"
                  value={formData.payRate}
                  onChange={(e) =>
                    setFormData({ ...formData, payRate: e.target.value })
                  }
                />
                {errors.payRate && (
                  <p className="text-red-500 text-xs">{errors.payRate}</p>
                )}
              </div>
              <div>
                <label className="form-label">Manager Name</label>
                <input
                  type="text"
                  className="border-[3px] h-10 w-full mb-3 p-2"
                  value={formData.managerName}
                  onChange={(e) =>
                    setFormData({ ...formData, managerName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-x-3">
              <button
                className="btn btn-light"
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </button>
              <Button
                text="Save"
                onClick={handleSubmit}
                disabled={uploadingData}
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EmployeeEditPage;
