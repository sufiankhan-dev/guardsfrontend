// New file created by me
// import React, { useState, useRef } from "react";
// import Button from "@/components/ui/Button";
// import Card from "@/components/ui/Card";
// import Textinput from "@/components/ui/Textinput";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";
// import { useSelector } from "react-redux";

// const LocationAddPage = () => {
//   const navigate = useNavigate();
//   const user = useSelector((state) => state.auth.user);

//   const [formData, setFormData] = useState({
//     locationName: "",
//     address: "",
//     coverageHours: "",
//     timeZone: "",
//     locatedWhere: "",
//     clientDetails: [{ name: "", designation: "", email: "", phone: "" }],
//     trailerOnSite: false,
//     licenseNumber: "",
//     monitoringStatus: "non-monitoring",
//     monitoringDetails: { cameras: 0, towerNumber: "", nvrDetails: "" },
//     notes: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [uploadingData, setUploadingData] = useState(false);
//   const isSubmitting = useRef(false);

//   const validate = () => {
//     const validationErrors = {};
//     if (!formData.locationName)
//       validationErrors.locationName = "Location Name is required";
//     if (!formData.timeZone) validationErrors.timeZone = "Time Zone is required";
//     return validationErrors;
//   };

//   const handleSubmit = async () => {
//     if (isSubmitting.current) return;
//     isSubmitting.current = true;

//     console.log("Form data before validation:", formData);
//     const validationErrors = validate();
//     console.log("Validation errors:", validationErrors);
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       isSubmitting.current = false;
//       return;
//     }

//     try {
//       setUploadingData(true);
//       console.log("Submitting location data:", formData);
//       const response = await axios.post(
//         `${process.env.REACT_APP_BASE_URL}/${user.type}/location/create`,
//         {
//           ...formData,
//         },
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );
//       if (response.status === 201) {
//         toast.success("Location created successfully");
//         navigate("/location");
//       }
//     } catch (error) {
//       console.log(error); // Logs the full error
//       toast.error(error.response?.data?.message || "Error creating location");
//     } finally {
//       setUploadingData(false);
//       isSubmitting.current = false;
//     }
//   };

//   const handleClientDetailsChange = (index, key, value) => {
//     const updatedClientDetails = [...formData.clientDetails];
//     updatedClientDetails[index][key] = value;
//     setFormData({ ...formData, clientDetails: updatedClientDetails });
//   };

//   const handleCancel = () => {
//     navigate("/location");
//   };

//   return (
//     <div className="max-w-6xl mx-auto mt-8">
//       <Card title="Create New Location">
//         <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
//           {/* Left Column */}
//           <div className="space-y-4">
//             <Textinput
//               label="Location Name"
//               type="text"
//               placeholder="Location Name"
//               value={formData.locationName}
//               onChange={(e) =>
//                 setFormData({ ...formData, locationName: e.target.value })
//               }
//             />
//             <Textinput
//               label="Address"
//               type="text"
//               placeholder="Address"
//               value={formData.address}
//               onChange={(e) =>
//                 setFormData({ ...formData, address: e.target.value })
//               }
//             />
//             <Textinput
//               label="Coverage Hours"
//               type="text"
//               placeholder="Coverage Hours"
//               value={formData.coverageHours}
//               onChange={(e) =>
//                 setFormData({ ...formData, coverageHours: e.target.value })
//               }
//             />
//             <Textinput
//               label="Time Zone"
//               type="text"
//               placeholder="Time Zone"
//               value={formData.timeZone}
//               onChange={(e) =>
//                 setFormData({ ...formData, timeZone: e.target.value })
//               }
//             />
//             <Textinput
//               label="Located Where"
//               type="text"
//               placeholder="City or Area"
//               value={formData.locatedWhere}
//               onChange={(e) =>
//                 setFormData({ ...formData, locatedWhere: e.target.value })
//               }
//             />
//             <Textinput
//               label="Notes"
//               type="text"
//               placeholder="Notes"
//               value={formData.notes}
//               onChange={(e) =>
//                 setFormData({ ...formData, notes: e.target.value })
//               }
//             />
//           </div>

//           {/* Right Column */}
//           <div className="space-y-4">
//             {formData.clientDetails.map((client, index) => (
//               <div key={index}>
//                 {/* <h4>Client {index + 1}</h4> */}
//                 <Textinput
//                   label="Client Name"
//                   type="text"
//                   placeholder="Name"
//                   value={client.name}
//                   onChange={(e) =>
//                     handleClientDetailsChange(index, "name", e.target.value)
//                   }
//                 />
//                 <Textinput
//                   label="Designation"
//                   type="text"
//                   placeholder="Designation"
//                   value={client.designation}
//                   onChange={(e) =>
//                     handleClientDetailsChange(
//                       index,
//                       "designation",
//                       e.target.value
//                     )
//                   }
//                 />
//                 <Textinput
//                   label="Email"
//                   type="email"
//                   placeholder="Email"
//                   value={client.email}
//                   onChange={(e) =>
//                     handleClientDetailsChange(index, "email", e.target.value)
//                   }
//                 />
//                 <Textinput
//                   label="Phone"
//                   type="text"
//                   placeholder="Phone"
//                   value={client.phone}
//                   onChange={(e) =>
//                     handleClientDetailsChange(index, "phone", e.target.value)
//                   }
//                 />
//               </div>
//             ))}
//             <label>
//               Trailer on Site
//               <input
//                 type="checkbox"
//                 checked={formData.trailerOnSite}
//                 onChange={(e) =>
//                   setFormData({ ...formData, trailerOnSite: e.target.checked })
//                 }
//               />
//             </label>
//             {formData.trailerOnSite && (
//               <Textinput
//                 label="License Number"
//                 type="text"
//                 placeholder="License Number"
//                 value={formData.licenseNumber}
//                 onChange={(e) =>
//                   setFormData({ ...formData, licenseNumber: e.target.value })
//                 }
//               />
//             )}
//             <label htmlFor="monitoringStatus">Monitoring Status</label>
//             <Select
//               name="monitoringStatus"
//               options={[
//                 { value: "monitoring", label: "Monitoring" },
//                 { value: "non-monitoring", label: "Non-Monitoring" },
//               ]}
//               value={{
//                 value: formData.monitoringStatus,
//                 label: formData.monitoringStatus,
//               }}
//               onChange={(selectedOption) =>
//                 setFormData({
//                   ...formData,
//                   monitoringStatus: selectedOption.value,
//                 })
//               }
//             />
//             {formData.monitoringStatus === "monitoring" && (
//               <div>
//                 <Textinput
//                   label="Number of Cameras"
//                   type="number"
//                   placeholder="Number of Cameras"
//                   value={formData.monitoringDetails.cameras}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       monitoringDetails: {
//                         ...formData.monitoringDetails,
//                         cameras: e.target.value,
//                       },
//                     })
//                   }
//                 />
//                 <Textinput
//                   label="Camera Tower Number"
//                   type="text"
//                   placeholder="Camera Tower Number"
//                   value={formData.monitoringDetails.towerNumber}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       monitoringDetails: {
//                         ...formData.monitoringDetails,
//                         towerNumber: e.target.value,
//                       },
//                     })
//                   }
//                 />
//                 <Textinput
//                   label="NVR Details"
//                   type="text"
//                   placeholder="NVR Details"
//                   value={formData.monitoringDetails.nvrDetails}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       monitoringDetails: {
//                         ...formData.monitoringDetails,
//                         nvrDetails: e.target.value,
//                       },
//                     })
//                   }
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="text-right mt-8 space-x-4">
//           <button
//             className="btn btn-light"
//             onClick={handleCancel}
//             type="button"
//           >
//             Cancel
//           </button>
//           <Button
//             text="Save"
//             type="submit"
//             className="btn-dark"
//             onClick={handleSubmit}
//             isLoading={uploadingData}
//             disabled={uploadingData}
//           />
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default LocationAddPage;

// import React, { useState, useRef, useEffect } from "react";
// import Button from "@/components/ui/Button";
// import Card from "@/components/ui/Card";
// import Textinput from "@/components/ui/Textinput";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";
// import { useSelector } from "react-redux";

// const LocationAddPage = () => {
//   const navigate = useNavigate();
//   const user = useSelector((state) => state.auth.user);

//   const [formData, setFormData] = useState({
//     userList: "",
//     locationName: "",
//     address: "",
//     timeZone: "",
//     locationType: "",
//     clientDetails: [{ name: "", designation: "", email: "", phone: "" }],
//     schedule: [
//       { day: "Monday", startTime: "", endTime: "" },
//       { day: "Tuesday", startTime: "", endTime: "" },
//       { day: "Wednesday", startTime: "", endTime: "" },
//       { day: "Thursday", startTime: "", endTime: "" },
//       { day: "Friday", startTime: "", endTime: "" },
//       { day: "Saturday", startTime: "", endTime: "" },
//       { day: "Sunday", startTime: "", endTime: "" },
//     ],
//   });

//   const [timeZones, setTimeZones] = useState([]);
//   const [locationTypes, setLocationTypes] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [uploadingData, setUploadingData] = useState(false);
//   const isSubmitting = useRef(false);

//   useEffect(() => {
//     // Fetch time zones
//     axios
//       .get("https://worldtimeapi.org/api/timezone")
//       .then((response) => {
//         setTimeZones(
//           response.data.map((zone) => ({ value: zone, label: zone }))
//         );
//       })
//       .catch((error) => {
//         console.error("Error fetching time zones:", error);
//       });

//     // Fetch location types from your database
//     axios
//       .get(
//         `${process.env.REACT_APP_BASE_URL}/${user.type}/locationtype/get-location-types`,
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       )
//       .then((response) => {
//         setLocationTypes(
//           response.data.locationTypes.map((type) => ({
//             value: type._id,
//             label: `${type.name} (${type.maincategory})`,
//             // category: type.maincategory,
//           }))
//         );
//       })
//       .catch((error) => {
//         console.error("Error fetching location types:", error);
//       });

//     // Fetching Users

//     axios
//       .get(`${process.env.REACT_APP_BASE_URL}/${user.type}/user/get-users`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       })
//       .then((response) => {
//         setUsers(
//           response.data.users.map((user) => ({
//             value: user._id,
//             label: user.firstName,
//           }))
//         );
//       })
//       .catch((error) => {
//         console.error("Error fetching roles:", error);
//       });
//   }, []);

//   const validate = () => {
//     const validationErrors = {};
//     if (!formData.locationName)
//       validationErrors.locationName = "Location Name is required";
//     if (!formData.timeZone) validationErrors.timeZone = "Time Zone is required";
//     if (!formData.locationType)
//       validationErrors.locationType = "Location Type is required";

//     formData.clientDetails.forEach((client, index) => {
//       if (!client.name)
//         validationErrors[`clientDetails.${index}.name`] = `Client ${
//           index + 1
//         } Name is required`;

//       if (!client.designation)
//         validationErrors[`clientDetails.${index}.designation`] = `Client ${
//           index + 1
//         } Designation is required`;

//       if (!client.email)
//         validationErrors[`clientDetails.${index}.email`] = `Client ${
//           index + 1
//         } Email is required`;

//       if (!client.phone)
//         validationErrors[`clientDetails.${index}.phone`] = `Client ${
//           index + 1
//         } Phone is required`;
//     });

//     return validationErrors;
//   };

//   const handleSubmit = async () => {
//     if (isSubmitting.current) return;
//     isSubmitting.current = true;

//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       isSubmitting.current = false;
//       return;
//     }

//     try {
//       setUploadingData(true);
//       const response = await axios.post(
//         `${process.env.REACT_APP_BASE_URL}/${user.type}/location/create-location`,
//         formData,
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );
//       if (response.status === 201) {
//         toast.success("Location created successfully");
//         navigate("/location");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Error creating location");
//     } finally {
//       setUploadingData(false);
//       isSubmitting.current = false;
//     }
//   };

//   const handleClientDetailsChange = (index, key, value) => {
//     const updatedClientDetails = [...formData.clientDetails];
//     updatedClientDetails[index][key] = value;
//     setFormData({ ...formData, clientDetails: updatedClientDetails });
//   };

//   const handleAddClient = () => {
//     setFormData({
//       ...formData,
//       clientDetails: [
//         ...formData.clientDetails,
//         { name: "", designation: "", email: "", phone: "" },
//       ],
//     });
//   };

//   const handleScheduleChange = (day) => {
//     const updatedSchedule = formData.schedule.map((scheduleItem) =>
//       scheduleItem.day === day
//         ? { ...scheduleItem, selected: !scheduleItem.selected }
//         : scheduleItem
//     );
//     setFormData({ ...formData, schedule: updatedSchedule });
//   };

//   const handleTimeChange = (day, timeType, value) => {
//     const updatedSchedule = formData.schedule.map((scheduleItem) =>
//       scheduleItem.day === day
//         ? {
//             ...scheduleItem,
//             [timeType === "startTime" ? "startTime" : "endTime"]: value,
//           }
//         : scheduleItem
//     );
//     setFormData({ ...formData, schedule: updatedSchedule });
//   };

//   console.log(formData.schedule);

//   return (
//     <div className="max-w-6xl mx-auto mt-8">
//       <Card title="Create New Location">
//         <div className="grid lg:grid-cols-1 grid-cols-1 gap-8">
//           <div className="space-y-4">
//             <label htmlFor="maincategory" className="form-label">
//               Select User
//             </label>
//             <Select
//               label="Select User"
//               options={users}
//               onChange={(selectedOption) =>
//                 setFormData({ ...formData, userList: selectedOption.value })
//               }
//             />
//             <Textinput
//               label="Location Name"
//               type="text"
//               placeholder="Location Name"
//               value={formData.locationName}
//               onChange={(e) =>
//                 setFormData({ ...formData, locationName: e.target.value })
//               }
//             />
//             <Textinput
//               label="Address"
//               type="text"
//               placeholder="Address"
//               value={formData.address}
//               onChange={(e) =>
//                 setFormData({ ...formData, address: e.target.value })
//               }
//             />
//             <div className="grid grid-cols-2 space-x-6">
//               <div>
//                 <label htmlFor="timeZone" className="form-label pt-1">
//                   Time Zone
//                 </label>
//                 <Select
//                   label="Time Zone"
//                   options={timeZones}
//                   onChange={(selectedOption) =>
//                     setFormData({ ...formData, timeZone: selectedOption.value })
//                   }
//                 />
//               </div>
//               <div>
//                 <label htmlFor="locationType" className="form-label pt-1">
//                   Location Type
//                 </label>
//                 <Select
//                   label="Location Type"
//                   options={locationTypes}
//                   onChange={(selectedOption) =>
//                     setFormData({
//                       ...formData,
//                       locationType: selectedOption.value,
//                     })
//                   }
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="space-y-4">
//             {formData.clientDetails.map((client, index) => (
//               <div key={index}>
//                 <span className="text-2xl font-semibold">Client Details</span>
//                 <div className="mt-3" />
//                 <div className="grid grid-cols-2 space-x-6">
//                   <Textinput
//                     label="Client Name"
//                     type="text"
//                     placeholder="Name"
//                     value={client.name}
//                     onChange={(e) =>
//                       handleClientDetailsChange(index, "name", e.target.value)
//                     }
//                     error={
//                       errors[`clientDetails.${index}.name`] &&
//                       "Client Name is required"
//                     }
//                   />
//                   {/* <div className="mt-3" /> */}
//                   <Textinput
//                     label="Designation"
//                     type="text"
//                     placeholder="Designation"
//                     value={client.designation}
//                     onChange={(e) =>
//                       handleClientDetailsChange(
//                         index,
//                         "designation",
//                         e.target.value
//                       )
//                     }
//                     error={
//                       errors[`clientDetails.${index}.designation`] &&
//                       "Client Designation is required"
//                     }
//                   />
//                 </div>
//                 <div className="mt-3" />
//                 <div className="grid grid-cols-2 space-x-6">
//                   <Textinput
//                     label="Email"
//                     type="email"
//                     placeholder="Email"
//                     value={client.email}
//                     onChange={(e) =>
//                       handleClientDetailsChange(index, "email", e.target.value)
//                     }
//                     error={
//                       errors[`clientDetails.${index}.email`] &&
//                       "Client Email is required"
//                     }
//                   />
//                   {/* <div className="mt-3" /> */}
//                   <Textinput
//                     label="Phone"
//                     type="text"
//                     placeholder="Phone"
//                     value={client.phone}
//                     onChange={(e) =>
//                       handleClientDetailsChange(index, "phone", e.target.value)
//                     }
//                     error={
//                       errors[`clientDetails.${index}.phone`] &&
//                       "Client Phone is required"
//                     }
//                   />
//                 </div>
//               </div>
//             ))}
//             <Button text="Add Client" onClick={handleAddClient} />

//             <div className="bg-gray-50 p-4 rounded-lg shadow-md">
//               <h4 className="text-xl font-semibold mb-4">Schedule</h4>
//               {[
//                 "Monday",
//                 "Tuesday",
//                 "Wednesday",
//                 "Thursday",
//                 "Friday",
//                 "Saturday",
//                 "Sunday",
//               ].map((day) => (
//                 <div key={day} className="flex items-center mb-2">
//                   <input
//                     type="checkbox"
//                     checked={
//                       formData.schedule.find(
//                         (scheduleItem) => scheduleItem.day === day
//                       )?.selected || false
//                     }
//                     onChange={() => handleScheduleChange(day)}
//                     className="form-checkbox h-5 w-5 text-blue-600"
//                   />
//                   <div className="flex flex-row items-center w-full justify-between px-4 py-2 bg-white rounded-lg shadow-sm ml-4">
//                     <span className="text-lg font-medium">{day}</span>
//                     <div className="flex flex-row gap-x-4">
//                       <Textinput
//                         type="time"
//                         placeholder="Start Time"
//                         className="border rounded-md p-2 w-40"
//                         onChange={(e) =>
//                           handleTimeChange(day, "startTime", e.target.value)
//                         }
//                       />
//                       <Textinput
//                         type="time"
//                         placeholder="End Time"
//                         className="border rounded-md p-2 w-40"
//                         onChange={(e) =>
//                           handleTimeChange(day, "startTime", e.target.value)
//                         }
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//         <div className="text-right mt-8 space-x-4">
//           <button
//             className="btn btn-light"
//             onClick={() => navigate("/location")}
//             type="button"
//           >
//             Cancel
//           </button>
//           <Button
//             text="Save"
//             onClick={handleSubmit}
//             isLoading={uploadingData}
//             disabled={uploadingData}
//           />
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default LocationAddPage;

import React, { useState, useRef, useEffect } from "react";
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
    userList: "",
    locationName: "",
    address: "",
    timeZone: "",
    locationType: "",
    employees: [],

    clientDetails: [{ name: "", designation: "", email: "", phone: "" }],
    schedule: [
      { day: "Monday", startTime: "", endTime: "", selected: false },
      { day: "Tuesday", startTime: "", endTime: "", selected: false },
      { day: "Wednesday", startTime: "", endTime: "", selected: false },
      { day: "Thursday", startTime: "", endTime: "", selected: false },
      { day: "Friday", startTime: "", endTime: "", selected: false },
      { day: "Saturday", startTime: "", endTime: "", selected: false },
      { day: "Sunday", startTime: "", endTime: "", selected: false },
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
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/${user.type}/user/get-users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setUsers(
          response.data.users.map((user) => ({
            value: user._id,
            label: user.firstName,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
      axios
      .get(`${process.env.REACT_APP_BASE_URL}/${user.type}/employe/get-employees`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setemployes(
          response.data.employees.map((employ) => ({
            value: employ._id,
            label: employ.employeeName,
          }))
        );
        console.log(employes,"....");
      })
      .catch((error) => {
        console.error("Error fetching employe:", error);
      });
  }, []);

  const validate = () => {
    const validationErrors = {};
    if (!formData.locationName)
      validationErrors.locationName = "Location Name is required";
    if (!formData.timeZone) validationErrors.timeZone = "Time Zone is required";
    if (!formData.locationType)
      validationErrors.locationType = "Location Type is required";

    formData.clientDetails.forEach((client, index) => {
      if (!client.name)
        validationErrors[`clientDetails.${index}.name`] = `Client ${
          index + 1
        } Name is required`;
      if (!client.designation)
        validationErrors[`clientDetails.${index}.designation`] = `Client ${
          index + 1
        } Designation is required`;
      if (!client.email)
        validationErrors[`clientDetails.${index}.email`] = `Client ${
          index + 1
        } Email is required`;
      if (!client.phone)
        validationErrors[`clientDetails.${index}.phone`] = `Client ${
          index + 1
        } Phone is required`;
    });

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
      schedule: formData.schedule
        .filter((item) => item.selected && item.startTime && item.endTime) // Only keep selected schedules with valid times
        .map(({ selected, ...rest }) => rest), // Remove the selected flag
    };

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

  const handleScheduleChange = (day) => {
    const updatedSchedule = formData.schedule.map((scheduleItem) =>
      scheduleItem.day === day
        ? { ...scheduleItem, selected: !scheduleItem.selected }
        : scheduleItem
    );
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const handleTimeChange = (day, timeType, value) => {
    const updatedSchedule = formData.schedule.map((scheduleItem) =>
      scheduleItem.day === day
        ? {
            ...scheduleItem,
            [timeType === "startTime" ? "startTime" : "endTime"]: value,
          }
        : scheduleItem
    );
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Card title="Create New Location">
        <div className="grid lg:grid-cols-1 grid-cols-1 gap-8">
          <div className="space-y-4">
            <label htmlFor="maincategory" className="form-label">
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
            />
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
                    error={
                      errors[`clientDetails.${index}.name`] &&
                      errors[`clientDetails.${index}.name`]
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
                    error={
                      errors[`clientDetails.${index}.designation`] &&
                      errors[`clientDetails.${index}.designation`]
                    }
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
                    error={
                      errors[`clientDetails.${index}.email`] &&
                      errors[`clientDetails.${index}.email`]
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
                    error={
                      errors[`clientDetails.${index}.phone`] &&
                      errors[`clientDetails.${index}.phone`]
                    }
                  />
                </div>
              </div>
            ))}
            <Button
              onClick={handleAddClient}
              className="bg-black-500 text-white hover:bg-gray-700"
            >
              Add More Client
            </Button>
          </div>
          <div className="space-y-4">
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
