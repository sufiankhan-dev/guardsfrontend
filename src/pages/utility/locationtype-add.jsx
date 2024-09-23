// New file created by me
import React, { useState, useRef } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useSelector } from "react-redux";

const LocationTypeAddPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    name: "",
    maincategory: "",
  });

  const [errors, setErrors] = useState({});
  const [uploadingData, setUploadingData] = useState(false);
  const isSubmitting = useRef(false);

  const validate = () => {
    const validationErrors = {};
    if (!formData.name) validationErrors.name = "Location Name is required";
    if (!formData.maincategory)
      validationErrors.maincategory = "Main Category is required";
    return validationErrors;
  };

  const handleSubmit = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    console.log("Form data before validation:", formData);
    const validationErrors = validate();
    console.log("Validation errors:", validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      isSubmitting.current = false;
      return;
    }

    try {
      setUploadingData(true);
      console.log("Submitting location data:", formData);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/${user.type}/locationtype/create-location-type`,
        {
          ...formData,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.status === 201) {
        toast.success("Location type created successfully");
        navigate("/locationtype");
      }
    } catch (error) {
      console.log(error); // Logs the full error
      toast.error(
        error.response?.data?.message || "Error creating location type"
      );
    } finally {
      setUploadingData(false);
      isSubmitting.current = false;
    }
  };

  //   const handleClientDetailsChange = (index, key, value) => {
  //     const updatedClientDetails = [...formData.clientDetails];
  //     updatedClientDetails[index][key] = value;
  //     setFormData({ ...formData, clientDetails: updatedClientDetails });
  //   };

  const handleCancel = () => {
    navigate("/locationtype");
  };

  const mainCategoryOptions = [
    { value: "Commercial", label: "Commercial" },
    { value: "Construction", label: "Construction" },
    // Add more states here
  ];

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Card title="Create New Location Type">
        <div className="grid lg:grid-cols-1 grid-cols-1 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            <Textinput
              label="Location Name"
              type="text"
              placeholder="Location Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
            <label htmlFor="maincategory" className="form-label">
              Main Category
            </label>
            <Select
              label="Main Category"
              name="maincategory"
              options={mainCategoryOptions}
              placeholder="Select Main Category"
              value={
                mainCategoryOptions.find(
                  (option) => option.value === formData.maincategory
                ) || null
              }
              onChange={(selectedOption) =>
                setFormData({ ...formData, maincategory: selectedOption.value })
              }
            />
            {errors.maincategory && (
              <p className="text-red-500">{errors.maincategory}</p>
            )}
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

export default LocationTypeAddPage;
