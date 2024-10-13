import React, { useState, useRef } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";

const EmployeeAddPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    // employeeName: "",
    // employeeId: "",
    // address: "",
    // contactNumber: "",
    // category: "",
    // guardCardDetails: {
    //   number: "",
    //   issueDate: null,
    //   expiryDate: null,
    // },
    // payRate: "",
    // hiringManager: "",
    // notes: "",
    // status: "",

    employeeName: "",
    employeeAddress: "",
    employeeIDNumber: "",
    contactNumber1: "",
    employeeCategory: "",
    guardCardNumber: "",
    issueDate: "",
    expiryDate: "",
    payRate: 0,
    managerName: "",
    salarystatus: "unpaid",
    employeeCategory: "Shack",
    approved: false,
    status: "active",
  });

  const [uploadingData, setUploadingData] = useState(false);
  const isSubmitting = useRef(false);

  const handleSubmit = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    try {
      setUploadingData(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/${user.type}/employe/create-employee`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 201) {
        toast.success("Employee added successfully");
        navigate("/employees");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding employee");
    } finally {
      setUploadingData(false);
      isSubmitting.current = false;
    }
  };

  const handleCancel = () => {
    navigate("/employees");
  };

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Card title="Add Employee">
        <div className="grid lg:grid-cols-1 grid-cols-1 gap-8">
          {/* Employee Information */}
          <div className="space-y-4">
            <Textinput
              label="Employee Name*"
              type="text"
              placeholder="Employee Name"
              value={formData.employeeName}
              onChange={(e) =>
                setFormData({ ...formData, employeeName: e.target.value })
              }
            />
            <Textinput
              label="Employee ID*"
              type="text"
              placeholder="Employee ID"
              value={formData.employeeIDNumber}
              onChange={(e) =>
                setFormData({ ...formData, employeeIDNumber: e.target.value })
              }
            />
            <Textinput
              label="Address"
              type="text"
              placeholder="Address"
              value={formData.employeeAddress}
              onChange={(e) =>
                setFormData({ ...formData, employeeAddress: e.target.value })
              }
            />
            <Textinput
              label="Contact Number"
              type="tel"
              placeholder="Contact Number"
              value={formData.contactNumber1}
              onChange={(e) =>
                setFormData({ ...formData, contactNumber1: e.target.value })
              }
            />
            <label className="block text-sm font-medium">Category</label>
            <Select
              label="Category"
              name="category"
              options={[
                { value: "Regular", label: "Regular" },
                { value: "Shack", label: "Shack" },
              ]}
              placeholder="Select Category"
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  employeeCategory: selectedOption.value,
                })
              }
            />
            <div>
              <label className="block text-xl font-semibold mt-5">
                Employee Card Details
              </label>
              <div className="mt-3" />
              <Textinput
                label="Card Number"
                type="text"
                placeholder="Guard Card Number"
                value={formData.guardCardNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    guardCardNumber: e.target.value,
                  })
                }
              />
              <div className="flex space-x-4 mt-3">
                <span className="w-full">
                  <label className="block text-sm mb-1 font-medium">
                    Issue Date
                  </label>
                  <Flatpickr
                    value={formData.issueDate}
                    options={{ dateFormat: "Y-m-d" }}
                    onChange={(date) =>
                      setFormData({
                        ...formData,
                        issueDate: date[0],
                      })
                    }
                    placeholder="Select Issue Date"
                    className="block w-full rounded-md border border-gray-300 p-2"
                  />
                </span>
                <span className="w-full">
                  <label className="block text-sm font-medium mb-1">
                    Expiry Date
                  </label>
                  <Flatpickr
                    value={formData.expiryDate}
                    options={{ dateFormat: "Y-m-d" }}
                    onChange={(date) =>
                      setFormData({
                        ...formData,
                        expiryDate: date[0],
                      })
                    }
                    placeholder="Select Expiry Date"
                    className="block w-full rounded-md border border-gray-300 p-2"
                  />
                </span>
              </div>
            </div>
            <Textinput
              label="Pay Rate"
              type="number"
              placeholder="Pay Rate"
              value={formData.payRate}
              onChange={(e) =>
                setFormData({ ...formData, payRate: e.target.value })
              }
            />
            <Textinput
              label="Hiring Manager"
              type="text"
              placeholder="Hiring Manager"
              value={formData.managerName}
              onChange={(e) =>
                setFormData({ ...formData, managerName: e.target.value })
              }
            />
            {/* <Textinput
              label="Notes"
              type="text"
              placeholder="Additional Notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            /> */}
            <label className="block text-sm font-medium">Status</label>
            <Select
              label="Salary Status"
              name="status"
              options={[
                { value: true, label: "Approved" },
                { value: false, label: "Not Approved" },
              ]}
              placeholder="Select Status"
              onChange={(selectedOption) =>
                setFormData({ ...formData, approved: selectedOption.value })
              }
            />
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

export default EmployeeAddPage;
