// import React, { useState, useEffect } from "react";
// import Button from "@/components/ui/Button";
// import Card from "@/components/ui/Card";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const LocationEditPage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     locationName: "",
//     address: "",
//     userList: [],
//     timeZone: "",
//     locationType: "",
//     parentLocation: "",
//     schedule: [{ day: "", intervals: [{ startTime: "", endTime: "" }] }],
//     clientDetails: { name: "", designation: "", email: "", phone: "" },
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [uploadingData, setUploadingData] = useState(false);

//   const locationId = new URLSearchParams(window.location.search).get("id");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const locationResponse = await axios.get(
//           `https://dashcart-backend-production.up.railway.app/api/admin/location/get-location/${locationId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         setFormData(locationResponse.data);
//         setIsLoading(false);
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to fetch location data");
//       }
//     };

//     fetchData();
//   }, [locationId]);

//   const handleSubmit = async () => {
//     try {
//       setUploadingData(true);
//       const response = await axios.put(
//         `https://dashcart-backend-production.up.railway.app/api/admin/location/update-location/${locationId}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         toast.success("Location updated successfully");
//         navigate("/locations");
//       }
//     } catch (error) {
//       console.error(
//         "Error details:",
//         error.response ? error.response.data : error
//       );
//       toast.error(error.response?.data?.message || "Failed to update location");
//     } finally {
//       setUploadingData(false);
//     }
//   };

//   const validate = () => {
//     const errors = {};
//     if (!formData.locationName) {
//       errors.locationName = "Location name is required";
//     }
//     if (!formData.address) {
//       errors.address = "Address is required";
//     }
//     if (!formData.userList || formData.userList.length === 0) {
//       errors.userList = "At least one user must be assigned";
//     }
//     if (!formData.timeZone) {
//       errors.timeZone = "Time zone is required";
//     }
//     if (!formData.locationType) {
//       errors.locationType = "Location type is required";
//     }
//     if (!formData.schedule || formData.schedule.length === 0) {
//       errors.schedule = "Schedule is required";
//     }
//     if (!formData.clientDetails.name) {
//       errors.clientDetails = "Client name is required";
//     }
//     return errors;
//   };

//   const handleScheduleChange = (index, field, value) => {
//     const updatedSchedule = [...formData.schedule];
//     updatedSchedule[index][field] = value;
//     setFormData({ ...formData, schedule: updatedSchedule });
//   };

//   const addInterval = (dayIndex) => {
//     const updatedSchedule = [...formData.schedule];
//     updatedSchedule[dayIndex].intervals.push({ startTime: "", endTime: "" });
//     setFormData({ ...formData, schedule: updatedSchedule });
//   };

//   const handleCancel = () => {
//     navigate("/locations");
//   };

//   return (
//     <div>
//       <Card title="Edit Location">
//         {isLoading ? (
//           <p>Loading...</p>
//         ) : (
//           <div>
//             <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mb-5">
//               <div>
//                 <label className="form-label">Location Name</label>
//                 <input
//                   type="text"
//                   className="border-[3px] h-10 w-full mb-3 p-2"
//                   value={formData.locationName}
//                   onChange={(e) =>
//                     setFormData({ ...formData, locationName: e.target.value })
//                   }
//                 />
//                 {errors.locationName && (
//                   <p className="text-red-500 text-xs">{errors.locationName}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="form-label">Address</label>
//                 <input
//                   type="text"
//                   className="border-[3px] h-10 w-full mb-3 p-2"
//                   value={formData.address}
//                   onChange={(e) =>
//                     setFormData({ ...formData, address: e.target.value })
//                   }
//                 />
//                 {errors.address && (
//                   <p className="text-red-500 text-xs">{errors.address}</p>
//                 )}
//               </div>
//               {/* Add remaining fields like userList, timeZone, locationType, clientDetails, etc. */}
//               {/* Schedule section */}
//               <div>
//                 <label className="form-label">Schedule</label>
//                 {formData.schedule.map((daySchedule, index) => (
//                   <div key={index}>
//                     <input
//                       type="text"
//                       className="border-[3px] h-10 w-full mb-3 p-2"
//                       placeholder="Day"
//                       value={daySchedule.day}
//                       onChange={(e) =>
//                         handleScheduleChange(index, "day", e.target.value)
//                       }
//                     />
//                     {daySchedule.intervals.map((interval, intervalIndex) => (
//                       <div
//                         key={intervalIndex}
//                         className="grid grid-cols-2 gap-2"
//                       >
//                         <input
//                           type="time"
//                           className="border-[3px] h-10 w-full mb-3 p-2"
//                           value={interval.startTime}
//                           onChange={(e) =>
//                             handleScheduleChange(
//                               index,
//                               "startTime",
//                               e.target.value
//                             )
//                           }
//                         />
//                         <input
//                           type="time"
//                           className="border-[3px] h-10 w-full mb-3 p-2"
//                           value={interval.endTime}
//                           onChange={(e) =>
//                             handleScheduleChange(
//                               index,
//                               "endTime",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </div>
//                     ))}
//                     <button
//                       type="button"
//                       className="btn btn-light"
//                       onClick={() => addInterval(index)}
//                     >
//                       Add Interval
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="space-x-3">
//               <button
//                 className="btn btn-light"
//                 onClick={handleCancel}
//                 type="button"
//               >
//                 Cancel
//               </button>
//               <Button
//                 text="Save"
//                 onClick={handleSubmit}
//                 disabled={uploadingData}
//               />
//             </div>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default LocationEditPage;

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
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
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingData, setUploadingData] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("id");

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
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleScheduleChange = (dayIndex, intervalIndex, field, value) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[dayIndex].intervals[intervalIndex][field] = value;
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const handleClientDetailsChange = (index, field, value) => {
    const updatedClientDetails = [...formData.clientDetails];
    updatedClientDetails[index][field] = value;
    setFormData({ ...formData, clientDetails: updatedClientDetails });
  };

  const addInterval = (dayIndex) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[dayIndex].intervals.push({ startTime: "", endTime: "" });
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const addClient = () => {
    setFormData({
      ...formData,
      clientDetails: [
        ...formData.clientDetails,
        { name: "", designation: "", email: "", phone: "" },
      ],
    });
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

  // const validateForm = () => {
  //   const newErrors = {};
  //   if (!formData.locationName) newErrors.locationName = "Location name is required";
  //   if (!formData.address) newErrors.address = "Address is required";
  //   if (!formData.timeZone) newErrors.timeZone = "Time zone is required";
  //   if (!formData.locationTypeName) newErrors.locationTypeName = "Location type is required";
  //   formData.clientDetails.forEach((client, index) => {
  //     if (!client.name) newErrors[`clientDetails.${index}.name`] = "Client name is required";
  //   });
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const handleSubmit = async () => {
    // if (!validateForm()) return;
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
            <div className="grid lg:grid-cols-1 grid-cols-1 gap-2 mb-5">
              <div>
                <label className="font-medium">Customer Name</label>
                <input
                  className="border-[2px] rounded-md text-gray-700 h-10 w-[100%] mb-3 p-2 "
                  type="text"
                  value={formData.locationName}
                  onChange={(e) =>
                    handleInputChange("locationName", e.target.value)
                  }
                />
                {errors.locationName && (
                  <p className="text-red-500 text-xs">{errors.locationName}</p>
                )}
              </div>
              <div>
                <label className="font-medium">Customer Number</label>
                <input
                  className="border-[2px] rounded-md text-gray-700 h-10 w-[100%] mb-3 p-2 "
                  type="text"
                  value={formData.customerNo}
                  onChange={(e) =>
                    handleInputChange("customerNo", e.target.value)
                  }
                />
                {/* {errors.customerNo && (
                  <p className="text-red-500 text-xs">{errors.customerNo}</p>
                )} */}
              </div>
              <div>
                <label className="font-medium">Street Address</label>
                <input
                  className="border-[2px] rounded-md text-gray-700 h-10 w-[100%] mb-3 p-2 "
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs">{errors.address}</p>
                )}
              </div>

              {/* Time Zone Field */}
              <div>
                <label className="font-medium">Time Zone</label>
                <input
                  className="border-[2px] rounded-md text-gray-700 h-10 w-[100%] mb-3 p-2 "
                  type="text"
                  value={formData.timeZone}
                  onChange={(e) =>
                    handleInputChange("timeZone", e.target.value)
                  }
                />
                {errors.timeZone && (
                  <p className="text-red-500 text-xs">{errors.timeZone}</p>
                )}
              </div>

              {/* Location Type Name */}
              <div>
                <label className="font-medium">Location Name</label>
                <input
                  className="border-[2px] rounded-md text-gray-700 h-10 w-[100%] mb-3 p-2 "
                  type="text"
                  value={formData.locationTypeName}
                  onChange={(e) =>
                    handleInputChange("locationTypeName", e.target.value)
                  }
                />
                {errors.locationTypeName && (
                  <p className="text-red-500 text-xs">
                    {errors.locationTypeName}
                  </p>
                )}
              </div>
            </div>

            {/* Schedule Section */}
            <div>
              <h3 className="font-bold mb-3">Schedule</h3>
              {formData.schedule.map((daySchedule, dayIndex) => (
                <div key={dayIndex}>
                  {/* <input
                    className="border-[3px] h-10 w-[100%] mb-3 p-2 "
                    placeholder="Day"
                    value={daySchedule.day}
                    onChange={(e) =>
                      handleInputChange("schedule", [
                        ...formData.schedule,
                        { ...daySchedule, day: e.target.value },
                      ])
                    }
                  /> */}
                  <span className="font-bold mb-2 text-lg pt-4">
                    {daySchedule.day}
                  </span>
                  {daySchedule.intervals.map((interval, intervalIndex) => (
                    <div key={intervalIndex} className="grid grid-cols-2 gap-2">
                      <input
                        className="border-[2px] rounded-md h-10 w-[100%] mb-3 p-2 "
                        type="time"
                        value={interval.startTime}
                        onChange={(e) =>
                          handleScheduleChange(
                            dayIndex,
                            intervalIndex,
                            "startTime",
                            e.target.value
                          )
                        }
                      />
                      <input
                        className="border-[2px] rounded-md h-10 w-[100%] mb-3 p-2 "
                        type="time"
                        value={interval.endTime}
                        onChange={(e) =>
                          handleScheduleChange(
                            dayIndex,
                            intervalIndex,
                            "endTime",
                            e.target.value
                          )
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
                className="bg-yellow-400 font-bold px-4 py-2 rounded-md text-black flex flex-row items-center justify-center"
              >
                <FaPlus className="mr-2" />
                Add Day
              </button>
            </div>

            {/* Client Details */}
            <div className="space-y-4">
              {formData.clientDetails.map((client, index) => (
                <div key={index}>
                  <h3 className="font-bold mt-5 mb-4">Client Details</h3>
                  <label className="font-medium">Client Name</label>

                  <input
                    className="border-[2px] rounded-md text-gray-700 h-10 w-[100%] mb-3 p-2 "
                    label="Client Name"
                    type="text"
                    value={client.name}
                    onChange={(e) =>
                      handleClientDetailsChange(index, "name", e.target.value)
                    }
                  />
                  <label className="font-medium">Designation</label>

                  <input
                    className="border-[2px] rounded-md text-gray-700 h-10 w-[100%] mb-3 p-2 "
                    label="Designation"
                    type="text"
                    value={client.designation}
                    onChange={(e) =>
                      handleClientDetailsChange(
                        index,
                        "designation",
                        e.target.value
                      )
                    }
                  />
                  <label className="font-medium">Email</label>

                  <input
                    className="border-[2px] rounded-md text-gray-700 h-10 w-[100%] mb-3 p-2 "
                    label="Email"
                    type="email"
                    value={client.email}
                    onChange={(e) =>
                      handleClientDetailsChange(index, "email", e.target.value)
                    }
                  />
                  <label className="font-medium">Phone</label>

                  <input
                    className="border-[2px] rounded-md text-gray-700 h-10 w-[100%] mb-3 p-2 "
                    label="Phone"
                    type="text"
                    value={client.phone}
                    onChange={(e) =>
                      handleClientDetailsChange(index, "phone", e.target.value)
                    }
                  />
                </div>
              ))}
              <Button
                onClick={addClient}
                className="bg-black-500 text-white flex flex-row items-center justify-center hover:bg-black-700"
              >
                <FaPlus className="mr-2" />
                Add Another Client
              </Button>
            </div>

            <div className="space-x-3 mt-4">
              <Button
                text="Cancel"
                onClick={handleCancel}
                className="bg-black-500 hover:bg-black-700 text-white"
              />
              <Button
                text="Save"
                onClick={handleSubmit}
                disabled={uploadingData}
                className="bg-black-500 hover:bg-black-700 text-white"
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LocationEditPage;
