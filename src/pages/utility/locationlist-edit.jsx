import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";

const LocationEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerNo: "",
    locationName: "",
    address: "",
    timeZone: "",
    locationTypeName: "",
    schedule: [{ day: "", intervals: [{ startTime: "", endTime: "" }] }],
    clientDetails: [{ name: "", designation: "", email: "", phone: "" }],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingData, setUploadingData] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("id");

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/${user.type}/location/get-location/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFormData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch location data");
      }
    };
    fetchData();
  }, [userId, user.type]);

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleScheduleChange = (dayIndex, intervalIndex, field, value) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[dayIndex].intervals[intervalIndex][field] = value;
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const handleDayChange = (dayIndex, value) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[dayIndex].day = value;  // update the day value
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const addInterval = (dayIndex) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[dayIndex].intervals.push({ startTime: "", endTime: "" });
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const addDayToSchedule = () => {
    setFormData({
      ...formData,
      schedule: [
        ...formData.schedule,
        { day: "", intervals: [{ startTime: "", endTime: "" }] },
      ],
    });
  };

  const handleAddClient = () => {
    setFormData({
      ...formData,
      clientDetails: [
        ...formData.clientDetails,
        { name: "", designation: "", email: "", phone: "", customerNo: "" },
      ],
    });
  };
  const handleClientDetailsChange = (index, key, value) => {
    const updatedClientDetails = [...formData.clientDetails];
    updatedClientDetails[index][key] = value;
    setFormData({ ...formData, clientDetails: updatedClientDetails });
  };

  const handleSubmit = async () => {
    try {
      setUploadingData(true);
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/${user.type}/location/update-location/${userId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 200) {
        toast.success("Location updated successfully");
        navigate("/location");
      }
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("Failed to update location");
    } finally {
      setUploadingData(false);
    }
  };

  const handleCancel = () => {
    navigate("/location");
  };

  return (
    <div>
      <Card title="Edit Location">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {/* Other fields for Location */}
            <div className="grid lg:grid-cols-1 grid-cols-1 gap-2 mb-5">
              <div>
                <label className="font-medium">Location Name</label>
                <input
                  className="border-[2px] rounded-md text-gray-700 h-10 w-[100%] mb-3 p-2"
                  type="text"
                  value={formData.locationName}
                  onChange={(e) => handleInputChange("locationName", e.target.value)}
                />
              </div>
              <div>
                <label className="font-medium">Customer Number</label>
                <input
                  className="border-[2px] rounded-md text-gray-700 h-10 w-[100%] mb-3 p-2"
                  type="text"
                  value={formData.customerNo}
                  onChange={(e) => handleInputChange("customerNo", e.target.value)}
                />
              </div>
              {/* Other fields for Address, Time Zone, Location Type, etc. */}
              <div className="space-y-4">
            {formData.clientDetails.map((client, index) => (
              <div key={index}>
                <span className="text-2xl font-semibold">Client Details</span>
                <div className="mt-3" />
                <div className="grid grid-cols-2 space-x-6">
                  <input
                    label="Client Name"
                    type="text"
                    placeholder="Name"
                    className="border-[2px] rounded-md text-gray-700 h-10 w-[100%] mb-3 p-2"

                    value={client.name}
                    onChange={(e) =>
                      handleClientDetailsChange(index, "name", e.target.value)
                    }
                    // error={
                    //   errors[`clientDetails.${index}.name`] &&
                    //   errors[`clientDetails.${index}.name`]
                    // }
                  />
                  <input
                    label="Designation"
                    type="text"
                    placeholder="Designation"
                    className="border-[2px] rounded-md text-gray-700 h-10 w-[100%] mb-3 p-2"

                    value={client.designation}
                    onChange={(e) =>
                      handleClientDetailsChange(
                        index,
                        "designation",
                        e.target.value
                      )
                    }
                    // error={
                    //   errors[`clientDetails.${index}.designation`] &&
                    //   errors[`clientDetails.${index}.designation`]
                    // }
                  />
                </div>
                <div className="mt-3" />
                <div className="grid grid-cols-2 space-x-6">
                  <input
                    label="Email"
                    type="email"
                    className="border-[2px] rounded-md text-gray-700 h-10 w-[100%] mb-3 p-2"

                    placeholder="Email"
                    value={client.email}
                    onChange={(e) =>
                      handleClientDetailsChange(index, "email", e.target.value)
                    }
                    // error={
                    //   errors[`clientDetails.${index}.email`] &&
                    //   errors[`clientDetails.${index}.email`]
                    // }
                  />
                  <input
                    label="Phone"
                    type="text"
                    className="border-[2px] rounded-md text-gray-700 h-10 w-[100%] mb-3 p-2"

                    placeholder="Phone"
                    value={client.phone}
                    onChange={(e) =>
                      handleClientDetailsChange(index, "phone", e.target.value)
                    }
                    // error={
                    //   errors[`clientDetails.${index}.phone`] &&
                    //   errors[`clientDetails.${index}.phone`]
                    // }
                  />
                </div>
              </div>
            ))}
            <Button
              onClick={handleAddClient}
              className="bg-black-500 text-white hover:bg-gray-700 flex flex-row items-center"
            >
              <FaPlus className="mr-2" />
              Add Another Client
            </Button>
          </div>
            </div>

            {/* Schedule Section */}
            <div>
              <h3 className="font-bold mb-3">Schedule</h3>
              {formData.schedule.map((daySchedule, dayIndex) => (
                <div key={dayIndex}>
                  {/* Dropdown for selecting day */}
                  <label className="font-medium">Day</label>
                  <select
                    value={daySchedule.day}
                    onChange={(e) => handleDayChange(dayIndex, e.target.value)}
                    className="border-[2px] rounded-md h-10 w-[100%] mb-3 p-2"
                  >
                    <option value="">Select Day</option>
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>

                  {daySchedule.intervals.map((interval, intervalIndex) => (
                    <div key={intervalIndex} className="grid grid-cols-2 gap-2">
                      {/* Input fields for start and end time */}
                      <input
                        className="border-[2px] rounded-md h-10 w-[100%] mb-3 p-2"
                        type="time"
                        value={interval.startTime}
                        onChange={(e) =>
                          handleScheduleChange(dayIndex, intervalIndex, "startTime", e.target.value)
                        }
                      />
                      <input
                        className="border-[2px] rounded-md h-10 w-[100%] mb-3 p-2"
                        type="time"
                        value={interval.endTime}
                        onChange={(e) =>
                          handleScheduleChange(dayIndex, intervalIndex, "endTime", e.target.value)
                        }
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => addInterval(dayIndex)}
                    className="bg-green-600 text-white font-bold text-lg px-4 py-2 rounded-md mb-4 flex flex-row items-center justify-center"
                  >
                    <FaPlus className="mr-2" />
                    Add Time Slot
                  </button>
                </div>
              ))}
              <button
                onClick={addDayToSchedule}
                className="bg-yellow-400 font-bold px-4 py-2 rounded-md mb-4"
              >
                Add Day to Schedule
              </button>
            </div>
            

            {/* Action Buttons */}
            <div className="space-x-3 mt-4">
              <Button text="Cancel" onClick={handleCancel} className="bg-black-500 hover:bg-black-700 text-white" />
              <Button text="Save" onClick={handleSubmit} disabled={uploadingData} className="bg-black-500 hover:bg-black-700 text-white" />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LocationEditPage;