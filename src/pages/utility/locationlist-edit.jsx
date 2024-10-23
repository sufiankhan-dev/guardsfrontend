import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const LocationEditPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    locationName: "",
    address: "",
    userList: [],
    timeZone: "",
    locationType: "",
    parentLocation: "",
    schedule: [{ day: "", intervals: [{ startTime: "", endTime: "" }] }],
    clientDetails: { name: "", designation: "", email: "", phone: "" },
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingData, setUploadingData] = useState(false);

  const locationId = new URLSearchParams(window.location.search).get("id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationResponse = await axios.get(
          `https://dashcart-backend-production.up.railway.app/api/admin/location/get-location/${locationId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFormData(locationResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch location data");
      }
    };

    fetchData();
  }, [locationId]);

  const handleSubmit = async () => {
    try {
      setUploadingData(true);
      const response = await axios.put(
        `https://dashcart-backend-production.up.railway.app/api/admin/location/update-location/${locationId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Location updated successfully");
        navigate("/locations");
      }
    } catch (error) {
      console.error(
        "Error details:",
        error.response ? error.response.data : error
      );
      toast.error(error.response?.data?.message || "Failed to update location");
    } finally {
      setUploadingData(false);
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.locationName) {
      errors.locationName = "Location name is required";
    }
    if (!formData.address) {
      errors.address = "Address is required";
    }
    if (!formData.userList || formData.userList.length === 0) {
      errors.userList = "At least one user must be assigned";
    }
    if (!formData.timeZone) {
      errors.timeZone = "Time zone is required";
    }
    if (!formData.locationType) {
      errors.locationType = "Location type is required";
    }
    if (!formData.schedule || formData.schedule.length === 0) {
      errors.schedule = "Schedule is required";
    }
    if (!formData.clientDetails.name) {
      errors.clientDetails = "Client name is required";
    }
    return errors;
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[index][field] = value;
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const addInterval = (dayIndex) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[dayIndex].intervals.push({ startTime: "", endTime: "" });
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const handleCancel = () => {
    navigate("/locations");
  };

  return (
    <div>
      <Card title="Edit Location">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mb-5">
              <div>
                <label className="form-label">Location Name</label>
                <input
                  type="text"
                  className="border-[3px] h-10 w-full mb-3 p-2"
                  value={formData.locationName}
                  onChange={(e) =>
                    setFormData({ ...formData, locationName: e.target.value })
                  }
                />
                {errors.locationName && (
                  <p className="text-red-500 text-xs">{errors.locationName}</p>
                )}
              </div>
              <div>
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="border-[3px] h-10 w-full mb-3 p-2"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
                {errors.address && (
                  <p className="text-red-500 text-xs">{errors.address}</p>
                )}
              </div>
              {/* Add remaining fields like userList, timeZone, locationType, clientDetails, etc. */}
              {/* Schedule section */}
              <div>
                <label className="form-label">Schedule</label>
                {formData.schedule.map((daySchedule, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      className="border-[3px] h-10 w-full mb-3 p-2"
                      placeholder="Day"
                      value={daySchedule.day}
                      onChange={(e) =>
                        handleScheduleChange(index, "day", e.target.value)
                      }
                    />
                    {daySchedule.intervals.map((interval, intervalIndex) => (
                      <div
                        key={intervalIndex}
                        className="grid grid-cols-2 gap-2"
                      >
                        <input
                          type="time"
                          className="border-[3px] h-10 w-full mb-3 p-2"
                          value={interval.startTime}
                          onChange={(e) =>
                            handleScheduleChange(
                              index,
                              "startTime",
                              e.target.value
                            )
                          }
                        />
                        <input
                          type="time"
                          className="border-[3px] h-10 w-full mb-3 p-2"
                          value={interval.endTime}
                          onChange={(e) =>
                            handleScheduleChange(
                              index,
                              "endTime",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => addInterval(index)}
                    >
                      Add Interval
                    </button>
                  </div>
                ))}
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

export default LocationEditPage;
