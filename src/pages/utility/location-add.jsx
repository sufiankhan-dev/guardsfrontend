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

const LocationAddPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    locationName: "",
    address: "",
    coverageHours: "",
    timeZone: "",
    locatedWhere: "",
    clientDetails: [{ name: "", designation: "", email: "", phone: "" }],
    trailerOnSite: false,
    licenseNumber: "",
    monitoringStatus: "non-monitoring",
    monitoringDetails: { cameras: 0, towerNumber: "", nvrDetails: "" },
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [uploadingData, setUploadingData] = useState(false);
  const isSubmitting = useRef(false);

  const validate = () => {
    const validationErrors = {};
    if (!formData.locationName)
      validationErrors.locationName = "Location Name is required";
    if (!formData.timeZone) validationErrors.timeZone = "Time Zone is required";
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
        `${process.env.REACT_APP_BASE_URL}/${user.type}/location/create`,
        {
          ...formData,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.status === 201) {
        toast.success("Location created successfully");
        navigate("/location");
      }
    } catch (error) {
      console.log(error); // Logs the full error
      toast.error(error.response?.data?.message || "Error creating location");
    } finally {
      setUploadingData(false);
      isSubmitting.current = false;
    }
  };

  const handleClientDetailsChange = (index, key, value) => {
    const updatedClientDetails = [...formData.clientDetails];
    updatedClientDetails[index][key] = value;
    setFormData({ ...formData, clientDetails: updatedClientDetails });
  };

  const handleCancel = () => {
    navigate("/location");
  };

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Card title="Create New Location">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            <Textinput
              label="Location Name"
              type="text"
              placeholder="Location Name"
              value={formData.locationName}
              onChange={(e) =>
                setFormData({ ...formData, locationName: e.target.value })
              }
            />
            <Textinput
              label="Address"
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
            <Textinput
              label="Coverage Hours"
              type="text"
              placeholder="Coverage Hours"
              value={formData.coverageHours}
              onChange={(e) =>
                setFormData({ ...formData, coverageHours: e.target.value })
              }
            />
            <Textinput
              label="Time Zone"
              type="text"
              placeholder="Time Zone"
              value={formData.timeZone}
              onChange={(e) =>
                setFormData({ ...formData, timeZone: e.target.value })
              }
            />
            <Textinput
              label="Located Where"
              type="text"
              placeholder="City or Area"
              value={formData.locatedWhere}
              onChange={(e) =>
                setFormData({ ...formData, locatedWhere: e.target.value })
              }
            />
            <Textinput
              label="Notes"
              type="text"
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {formData.clientDetails.map((client, index) => (
              <div key={index}>
                {/* <h4>Client {index + 1}</h4> */}
                <Textinput
                  label="Client Name"
                  type="text"
                  placeholder="Name"
                  value={client.name}
                  onChange={(e) =>
                    handleClientDetailsChange(index, "name", e.target.value)
                  }
                />
                <Textinput
                  label="Designation"
                  type="text"
                  placeholder="Designation"
                  value={client.designation}
                  onChange={(e) =>
                    handleClientDetailsChange(
                      index,
                      "designation",
                      e.target.value
                    )
                  }
                />
                <Textinput
                  label="Email"
                  type="email"
                  placeholder="Email"
                  value={client.email}
                  onChange={(e) =>
                    handleClientDetailsChange(index, "email", e.target.value)
                  }
                />
                <Textinput
                  label="Phone"
                  type="text"
                  placeholder="Phone"
                  value={client.phone}
                  onChange={(e) =>
                    handleClientDetailsChange(index, "phone", e.target.value)
                  }
                />
              </div>
            ))}
            <label>
              Trailer on Site
              <input
                type="checkbox"
                checked={formData.trailerOnSite}
                onChange={(e) =>
                  setFormData({ ...formData, trailerOnSite: e.target.checked })
                }
              />
            </label>
            {formData.trailerOnSite && (
              <Textinput
                label="License Number"
                type="text"
                placeholder="License Number"
                value={formData.licenseNumber}
                onChange={(e) =>
                  setFormData({ ...formData, licenseNumber: e.target.value })
                }
              />
            )}
            <label htmlFor="monitoringStatus">Monitoring Status</label>
            <Select
              name="monitoringStatus"
              options={[
                { value: "monitoring", label: "Monitoring" },
                { value: "non-monitoring", label: "Non-Monitoring" },
              ]}
              value={{
                value: formData.monitoringStatus,
                label: formData.monitoringStatus,
              }}
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  monitoringStatus: selectedOption.value,
                })
              }
            />
            {formData.monitoringStatus === "monitoring" && (
              <div>
                <Textinput
                  label="Number of Cameras"
                  type="number"
                  placeholder="Number of Cameras"
                  value={formData.monitoringDetails.cameras}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monitoringDetails: {
                        ...formData.monitoringDetails,
                        cameras: e.target.value,
                      },
                    })
                  }
                />
                <Textinput
                  label="Camera Tower Number"
                  type="text"
                  placeholder="Camera Tower Number"
                  value={formData.monitoringDetails.towerNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monitoringDetails: {
                        ...formData.monitoringDetails,
                        towerNumber: e.target.value,
                      },
                    })
                  }
                />
                <Textinput
                  label="NVR Details"
                  type="text"
                  placeholder="NVR Details"
                  value={formData.monitoringDetails.nvrDetails}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monitoringDetails: {
                        ...formData.monitoringDetails,
                        nvrDetails: e.target.value,
                      },
                    })
                  }
                />
              </div>
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

export default LocationAddPage;
