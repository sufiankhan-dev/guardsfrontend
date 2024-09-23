// // New file created by me

// import React, { useState, useRef } from "react";
// import Button from "@/components/ui/Button";
// import Card from "@/components/ui/Card";
// import Textinput from "@/components/ui/Textinput";
// import Flatpickr from "react-flatpickr";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// import Select from "react-select";

// const UserAddPage = () => {
//   const navigate = useNavigate();
//   const user = useSelector((state) => state.auth.user);

//   const [formData, setFormData] = useState({
//     firstName: "",
//     middleName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     phoneNumber1: "", // Change from phone to phoneNumber1
//     phoneNumber2: "", // Change from secondaryPhone to phoneNumber2
//     secondaryEmail: "",
//     address: "",
//     city: "",
//     state: "",
//     country: "",
//     gender: "",
//     dateOfBirth: "",
//     roleId: "",
//   });

//   const [roles, setRoles] = useState([]);
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [uploadingData, setUploadingData] = useState(false);
//   const isSubmitting = useRef(false);

//   const validate = () => {
//     const validationErrors = {};

//     if (!formData.firstName)
//       validationErrors.firstName = "First name is required";
//     if (!formData.lastName) validationErrors.lastName = "Last name is required";
//     if (!formData.email) {
//       validationErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       validationErrors.email = "Invalid email format";
//     }

//     if (!formData.password) {
//       validationErrors.password = "Password is required";
//     } else if (!/[!@#$%^&*]/.test(formData.password)) {
//       validationErrors.password =
//         "Password must contain at least one special character";
//     }

//     if (!formData.phoneNumber1)
//       validationErrors.phoneNumber1 = "Phone number is required";
//     if (!/^\d{11}$/.test(formData.phoneNumber1))
//       validationErrors.phone = "Phone number is invalid";

//     return validationErrors;
//   };

//   const handleSubmit = async () => {
//     // console.log("Submit clicked");
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

//     const formattedDate = formData.dateOfBirth
//       ? formData.dateOfBirth.toISOString().split("T")[0]
//       : null;

//     try {
//       setUploadingData(true);
//       console.log("Submitting user data:", formData);
//       const response = await axios.post(
//         `${process.env.REACT_APP_BASE_URL}/${user.type}/user/create-user`,
//         {
//           ...formData,
//           dateOfBirth: formattedDate,
//           email: formData.email.toLowerCase(),
//         },
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );
//       if (response.status === 201) {
//         toast.success("User created successfully");
//         navigate("/user");
//       }
//     } catch (error) {
//       console.log(error); // Logs the full error
//       toast.error(error.response?.data?.message || "Error creating user");
//     } finally {
//       setUploadingData(false);
//       isSubmitting.current = false;
//     }
//   };

//   const handleCancel = () => {
//     navigate("/user");
//   };

//   const roleOptions = [
//     { value: "super-admin", label: "Super Admin" },
//     { value: "admin", label: "Admin" },
//     { value: "66e08dbec146f84aec8a8e36", label: "User" },
//     { value: "dispatch", label: "Dispatch" },
//     { value: "monitoring", label: "Monitoring" },
//     { value: "time-sheet", label: "Time sheet" },
//   ];

//   const countryOptions = [
//     { value: "us", label: "United States" },
//     { value: "uk", label: "United Kingdom" },
//     { value: "ca", label: "Canada" },
//     // Add more countries here
//   ];

//   const stateOptions = [
//     { value: "ny", label: "New York" },
//     { value: "ca", label: "California" },
//     { value: "tx", label: "Texas" },
//     // Add more states here
//   ];

//   const cityOptions = [
//     { value: "nyc", label: "New York City" },
//     { value: "la", label: "Los Angeles" },
//     { value: "hou", label: "Houston" },
//     // Add more cities here
//   ];

//   const genderOptions = [
//     { value: "male", label: "Male" },
//     { value: "female", label: "Female" },
//     { value: "other", label: "Other" },
//   ];

//   const handleRoleChange = (event) => {
//     console.log("Selected role:", event.target.value);
//   };

//   // console.log(formData);
//   return (
//     <div className="max-w-6xl mx-auto mt-8">
//       <Card title="Create New User">
//         <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
//           {/* Personal Information */}
//           <div>
//             {/* <h3 className="text-lg font-semibold mb-4">Personal Information</h3> */}
//             <div className="space-y-4">
//               <label htmlFor="role" className="form-label">
//                 User Role
//               </label>
//               <Select
//                 label="Role"
//                 name="role"
//                 options={roleOptions}
//                 placeholder="Select Role"
//                 value={
//                   roleOptions.find(
//                     (option) => option.value === formData.roleId
//                   ) || null
//                 }
//                 onChange={(selectedOption) =>
//                   setFormData({ ...formData, roleId: selectedOption.value })
//                 }
//               />
//               <label htmlFor="state" className="form-label">
//                 User State
//               </label>
//               <Select
//                 label="State"
//                 name="state"
//                 options={stateOptions}
//                 placeholder="Select State"
//                 value={
//                   stateOptions.find(
//                     (option) => option.value === formData.state
//                   ) || null
//                 }
//                 onChange={(selectedOption) =>
//                   setFormData({ ...formData, state: selectedOption.value })
//                 }
//               />
//               <Textinput
//                 label="First Name"
//                 type="text"
//                 placeholder="First Name"
//                 value={formData.firstName}
//                 onChange={(e) =>
//                   setFormData({ ...formData, firstName: e.target.value })
//                 }
//               />
//               <Textinput
//                 label="Middle Name"
//                 type="text"
//                 placeholder="Middle Name"
//                 value={formData.middleName}
//                 onChange={(e) =>
//                   setFormData({ ...formData, middleName: e.target.value })
//                 }
//               />
//               <Textinput
//                 label="Email"
//                 type="email"
//                 placeholder="Email Address"
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     email: e.target.value.toLowerCase(),
//                   })
//                 }
//               />
//               <Textinput
//                 label="Phone"
//                 type="number"
//                 placeholder="Phone Number"
//                 value={formData.phoneNumber1}
//                 onChange={(e) =>
//                   setFormData({ ...formData, phoneNumber1: e.target.value })
//                 }
//               />
//               <label className="block text-sm font-medium">Gender</label>
//               <Select
//                 name="gender"
//                 options={genderOptions}
//                 placeholder="Select Gender"
//                 value={
//                   genderOptions.find(
//                     (option) => option.value === formData.gender
//                   ) || null
//                 }
//                 onChange={(selectedOption) =>
//                   setFormData({ ...formData, gender: selectedOption.value })
//                 }
//               />
//               <div className="relative">
//                 <Textinput
//                   label="Password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Password"
//                   value={formData.password}
//                   onChange={(e) =>
//                     setFormData({ ...formData, password: e.target.value })
//                   }
//                 />
//                 <FontAwesomeIcon
//                   icon={showPassword ? faEye : faEyeSlash}
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-[70%] transform -translate-y-1/2 cursor-pointer"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Contact Information */}
//           <div>
//             {/* <h3 className="text-lg font-semibold mb-4">Contact Information</h3> */}
//             <div className="space-y-4">
//               <label htmlFor="country" className="form-label">
//                 User Country
//               </label>
//               <Select
//                 label="Country"
//                 name="country"
//                 options={countryOptions}
//                 placeholder="Select Country"
//                 value={
//                   countryOptions.find(
//                     (option) => option.value === formData.country
//                   ) || null
//                 }
//                 onChange={(selectedOption) =>
//                   setFormData({ ...formData, country: selectedOption.value })
//                 }
//               />
//               <label htmlFor="city" className="form-label">
//                 User City
//               </label>
//               <Select
//                 label="City"
//                 name="city"
//                 options={cityOptions}
//                 placeholder="Select City"
//                 value={
//                   cityOptions.find(
//                     (option) => option.value === formData.city
//                   ) || null
//                 }
//                 onChange={(selectedOption) =>
//                   setFormData({ ...formData, city: selectedOption.value })
//                 }
//               />
//               <Textinput
//                 label="Last Name"
//                 type="text"
//                 placeholder="Last Name"
//                 value={formData.lastName}
//                 onChange={(e) =>
//                   setFormData({ ...formData, lastName: e.target.value })
//                 }
//               />
//               <Textinput
//                 label="Address"
//                 type="text"
//                 placeholder="Address"
//                 value={formData.address}
//                 onChange={(e) =>
//                   setFormData({ ...formData, address: e.target.value })
//                 }
//               />
//               <Textinput
//                 label="Secondary Email"
//                 type="secondaryEmail"
//                 placeholder="Secondary Email Address"
//                 value={formData.secondaryEmail}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     secondaryEmail: e.target.value.toLowerCase(),
//                   })
//                 }
//               />
//               <Textinput
//                 label="Secondary Phone"
//                 type="secondaryNumber"
//                 placeholder="Secondary Phone Number"
//                 value={formData.phoneNumber2}
//                 onChange={(e) =>
//                   setFormData({ ...formData, phoneNumber2: e.target.value })
//                 }
//               />
//               <span className="py-4">
//                 <label className="block text-sm font-medium my-3">
//                   Date of Birth
//                 </label>
//                 <Flatpickr
//                   value={formData.dateOfBirth}
//                   options={{ dateFormat: "Y-m-d" }}
//                   onChange={(date) =>
//                     setFormData({ ...formData, dateOfBirth: date[0] })
//                   }
//                   placeholder="Select Date"
//                   className="block w-full rounded-md border border-gray-300 p-2"
//                 />
//               </span>
//             </div>
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

// export default UserAddPage;

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
            <Textinput
              label="Notes"
              type="text"
              placeholder="Additional Notes"
              // value={formData.notes}
              // onChange={(e) =>
              //   setFormData({ ...formData, notes: e.target.value })
              // }
            />
            <label className="block text-sm font-medium">Status</label>
            <Select
              label="Status"
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
