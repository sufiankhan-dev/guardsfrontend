import React, { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useSelector } from "react-redux";
import { FaPlus, FaMinus } from "react-icons/fa";

const LocationAddPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    userList: "",
    locationName: "",
    address: "",
    timeZone: "",
    locationType: "",
    employees: [],

    clientDetails: [{ name: "", designation: "", email: "", phone: "" }],
    // schedule: [
    //   { day: "Monday", startTime: "", endTime: "", selected: false },
    //   { day: "Tuesday", startTime: "", endTime: "", selected: false },
    //   { day: "Wednesday", startTime: "", endTime: "", selected: false },
    //   { day: "Thursday", startTime: "", endTime: "", selected: false },
    //   { day: "Friday", startTime: "", endTime: "", selected: false },
    //   { day: "Saturday", startTime: "", endTime: "", selected: false },
    //   { day: "Sunday", startTime: "", endTime: "", selected: false },
    // ],
    schedule: [
      {
        day: "Monday",
        intervals: [{ startTime: "", endTime: "" }],
      },
      {
        day: "Tuesday",
        intervals: [{ startTime: "", endTime: "" }],
      },
      {
        day: "Wednesday",
        intervals: [{ startTime: "", endTime: "" }],
      },
      {
        day: "Thursday",
        intervals: [{ startTime: "", endTime: "" }],
      },
      {
        day: "Friday",
        intervals: [{ startTime: "", endTime: "" }],
      },
      {
        day: "Saturday",
        intervals: [{ startTime: "", endTime: "" }],
      },
      {
        day: "Sunday",
        intervals: [{ startTime: "", endTime: "" }],
      },
    ],
  });

  const [timeZones, setTimeZones] = useState([]);
  const [locationTypes, setLocationTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [employes, setemployes] = useState([]);

  const [errors, setErrors] = useState({});
  const [uploadingData, setUploadingData] = useState(false);
  const isSubmitting = useRef(false);

  useEffect(() => {
    // Fetch time zones
    axios
      .get("https://worldtimeapi.org/api/timezone")
      .then((response) => {
        setTimeZones(
          response.data.map((zone) => ({ value: zone, label: zone }))
        );
      })
      .catch((error) => {
        console.error("Error fetching time zones:", error);
      });

    // Fetch location types from your database
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/${user.type}/locationtype/get-location-types`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        setLocationTypes(
          response.data.locationTypes.map((type) => ({
            value: type._id,
            label: `${type.name} (${type.maincategory})`,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching location types:", error);
      });

    // Fetching Users
    // axios
    //   .get(`${process.env.REACT_APP_BASE_URL}/${user.type}/user/get-users`, {
    //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    //   })
    //   .then((response) => {
    //     setUsers(
    //       response.data.users.map((user) => ({
    //         value: user._id,
    //         label: user.firstName,
    //       }))
    //     );
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching roles:", error);
    //   });
    //   axios
    //   .get(`${process.env.REACT_APP_BASE_URL}/${user.type}/employe/get-employees`, {
    //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    //   })
    //   .then((response) => {
    //     setemployes(
    //       response.data.employees.map((employ) => ({
    //         value: employ._id,
    //         label: employ.employeeName,
    //       }))
    //     );
    //     console.log(employes,"....");
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching employe:", error);
    //   });
  }, []);

  const validate = () => {
    const validationErrors = {};
    if (!formData.locationName)
      validationErrors.locationName = "Location Name is required";
    if (!formData.timeZone) validationErrors.timeZone = "Time Zone is required";
    if (!formData.locationType)
      validationErrors.locationType = "Location Type is required";

    // formData.clientDetails.forEach((client, index) => {
    //   if (!client.name)
    //     validationErrors[`clientDetails.${index}.name`] = `Client ${
    //       index + 1
    //     } Name is required`;
    //   if (!client.designation)
    //     validationErrors[`clientDetails.${index}.designation`] = `Client ${
    //       index + 1
    //     } Designation is required`;
    //   if (!client.email)
    //     validationErrors[`clientDetails.${index}.email`] = `Client ${
    //       index + 1
    //     } Email is required`;
    //   if (!client.phone)
    //     validationErrors[`clientDetails.${index}.phone`] = `Client ${
    //       index + 1
    //     } Phone is required`;
    // });

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

    // Prepare data for submission
    const submissionData = {
      ...formData,
      // schedule: formData.schedule
      //   .filter((item) => item.selected && item.startTime && item.endTime) // Only keep selected schedules with valid times
      //   .map(({ selected, ...rest }) => rest), // Remove the selected flag
      schedule: formData.schedule.filter((item) =>
        item.intervals.every(
          (interval) => interval.startTime && interval.endTime
        )
      ),
    };

    console.log(submissionData.schedule);

    try {
      setUploadingData(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/${user.type}/location/create-location`,
        submissionData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.status === 201) {
        toast.success("Location created successfully");
        navigate("/location");
      }
    } catch (error) {
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

  const handleAddClient = () => {
    setFormData({
      ...formData,
      clientDetails: [
        ...formData.clientDetails,
        { name: "", designation: "", email: "", phone: "" },
      ],
    });
  };

  // const handleScheduleChange = (day) => {
  //   const updatedSchedule = formData.schedule.map((scheduleItem) =>
  //     scheduleItem.day === day
  //       ? { ...scheduleItem, selected: !scheduleItem.selected }
  //       : scheduleItem
  //   );
  //   setFormData({ ...formData, schedule: updatedSchedule });
  // };

  // const handleTimeChange = (day, timeType, value) => {
  //   const updatedSchedule = formData.schedule.map((scheduleItem) =>
  //     scheduleItem.day === day
  //       ? {
  //           ...scheduleItem,
  //           [timeType === "startTime" ? "startTime" : "endTime"]: value,
  //         }
  //       : scheduleItem
  //   );
  //   setFormData({ ...formData, schedule: updatedSchedule });
  // };

  const handleAddInterval = (day) => {
    const updatedSchedule = formData.schedule.map((scheduleItem) =>
      scheduleItem.day === day
        ? {
            ...scheduleItem,
            intervals: [
              ...scheduleItem.intervals,
              { startTime: "", endTime: "" },
            ],
          }
        : scheduleItem
    );
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const handleRemoveInterval = (day, index) => {
    const updatedSchedule = formData.schedule.map((scheduleItem) =>
      scheduleItem.day === day
        ? {
            ...scheduleItem,
            intervals: scheduleItem.intervals.filter((_, i) => i !== index),
          }
        : scheduleItem
    );
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const handleTimeChange = (day, index, timeType, value) => {
    const updatedSchedule = formData.schedule.map((scheduleItem) =>
      scheduleItem.day === day
        ? {
            ...scheduleItem,
            intervals: scheduleItem.intervals.map((interval, i) =>
              i === index
                ? {
                    ...interval,
                    [timeType === "startTime" ? "startTime" : "endTime"]: value,
                  }
                : interval
            ),
          }
        : scheduleItem
    );
    console.log(updatedSchedule);
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Card title="Create New Location">
        <div className="grid lg:grid-cols-1 grid-cols-1 gap-8">
          <div className="space-y-4">
            {/* <label htmlFor="maincategory" className="form-label">
              Select User
            </label>
            <Select
              label="Select User"
              options={users}
              onChange={(selectedOption) =>
                setFormData({ ...formData, userList: selectedOption.value })
              }
            />
            <label htmlFor="maincategory" className="form-label">
              Select Employe
            </label>
            <Select
              label="Select employe"
              options={employes}
              onChange={(selectedOption) =>
                setFormData({ ...formData, employees: selectedOption.value })
              }
            /> */}
            <Textinput
              label="Customer Name"
              type="text"
              placeholder="Customer Name"
              value={formData.locationName}
              onChange={(e) =>
                setFormData({ ...formData, locationName: e.target.value })
              }
            />
            <Textinput
              label="Street Address"
              type="text"
              placeholder="Street Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
            <div className="grid grid-cols-2 space-x-6">
              <div>
                <label htmlFor="timeZone" className="form-label pt-1">
                  Time Zone
                </label>
                <Select
                  label="Time Zone"
                  options={timeZones}
                  onChange={(selectedOption) =>
                    setFormData({ ...formData, timeZone: selectedOption.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="locationType" className="form-label pt-1">
                  Location Type
                </label>
                <Select
                  label="Location Type"
                  options={locationTypes}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      locationType: selectedOption.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {formData.clientDetails.map((client, index) => (
              <div key={index}>
                <span className="text-2xl font-semibold">Client Details</span>
                <div className="mt-3" />
                <div className="grid grid-cols-2 space-x-6">
                  <Textinput
                    label="Client Name"
                    type="text"
                    placeholder="Name"
                    value={client.name}
                    onChange={(e) =>
                      handleClientDetailsChange(index, "name", e.target.value)
                    }
                    // error={
                    //   errors[`clientDetails.${index}.name`] &&
                    //   errors[`clientDetails.${index}.name`]
                    // }
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
                    // error={
                    //   errors[`clientDetails.${index}.designation`] &&
                    //   errors[`clientDetails.${index}.designation`]
                    // }
                  />
                </div>
                <div className="mt-3" />
                <div className="grid grid-cols-2 space-x-6">
                  <Textinput
                    label="Email"
                    type="email"
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
                  <Textinput
                    label="Phone"
                    type="text"
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
          {/* <div className="space-y-4">
            <span className="text-2xl font-semibold">Schedule</span>
            {formData.schedule.map((scheduleItem) => (
              <div
                key={scheduleItem.day}
                className="flex items-center justify-between p-2 border border-gray-300 rounded-md"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={scheduleItem.selected}
                    onChange={() => handleScheduleChange(scheduleItem.day)}
                    className="mr-2"
                  />
                  <label className="font-medium">{scheduleItem.day}</label>
                </div>
                {scheduleItem.selected && (
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <label className="mr-2">Start Time:</label>
                      <Textinput
                        type="time"
                        value={scheduleItem.startTime}
                        onChange={(e) =>
                          handleTimeChange(
                            scheduleItem.day,
                            "startTime",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded-md p-1"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="mr-2">End Time:</label>
                      <Textinput
                        type="time"
                        value={scheduleItem.endTime}
                        onChange={(e) =>
                          handleTimeChange(
                            scheduleItem.day,
                            "endTime",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded-md p-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div> */}
          <div className="space-y-4">
            {formData.schedule.map((daySchedule, dayIndex) => (
              <div key={dayIndex}>
                <h3 className="text-xl font-semibold">{daySchedule.day}</h3>
                {daySchedule.intervals.map((interval, intervalIndex) => (
                  <div
                    key={intervalIndex}
                    className="grid grid-cols-2 gap-4 mt-2"
                  >
                    <Textinput
                      label="Start Time"
                      type="time"
                      value={interval.startTime}
                      onChange={(e) =>
                        handleTimeChange(
                          daySchedule.day,
                          intervalIndex,
                          "startTime",
                          e.target.value
                        )
                      }
                    />
                    <Textinput
                      label="End Time"
                      type="time"
                      value={interval.endTime}
                      onChange={(e) =>
                        handleTimeChange(
                          daySchedule.day,
                          intervalIndex,
                          "endTime",
                          e.target.value
                        )
                      }
                    />
                    {intervalIndex > 0 && (
                      <Button
                        className="bg-red-500 text-white hover:bg-red-600 mt-2 w-56 flex flex-row items-center"
                        onClick={() =>
                          handleRemoveInterval(daySchedule.day, intervalIndex)
                        }
                      >
                        <FaMinus className="mr-2" /> Remove Time Slot
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  className="bg-green-600 text-white hover:bg-green-700 mt-4 flex items-center"
                  onClick={() => handleAddInterval(daySchedule.day)}
                >
                  <FaPlus className="mr-2" /> Add Another Time Slot
                </Button>
              </div>
            ))}
          </div>

          {/* <Button onClick={handleSubmit} disabled={uploadingData}>
            {uploadingData ? "Creating..." : "Create Location"}
          </Button> */}
          <div className="text-right mt-8 space-x-4">
            <button
              className="btn btn-light"
              onClick={() => navigate("/location")}
              type="button"
            >
              Cancel
            </button>
            <Button
              text="Save"
              className="bg-black-500 text-white hover:bg-gray-700"
              onClick={handleSubmit}
              isLoading={uploadingData}
              disabled={uploadingData}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LocationAddPage;
