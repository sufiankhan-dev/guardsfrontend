// New file created by me

import React, { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { countryOptions } from "../../../data/index";
import { stateOptions } from "../../../data/country";
import cities from "cities.json";

const UserAddPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber1: "", // Change from phone to phoneNumber1
    phoneNumber2: "", // Change from secondaryPhone to phoneNumber2
    secondaryEmail: "",
    address: "",
    city: "",
    state: "",
    country: "",
    gender: "",
    dateOfBirth: "",
    role: "",
  });

  const [roles, setRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadingData, setUploadingData] = useState(false);
  const isSubmitting = useRef(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/admin/role/get-roles`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRoles(response.data); // Set roles data from backend
      } catch (error) {
        console.log(error);
      }
    };

    fetchRoles();
  }, []);

  const validate = () => {
    const validationErrors = {};

    if (!formData.firstName)
      validationErrors.firstName = "First name is required";
    if (!formData.lastName) validationErrors.lastName = "Last name is required";
    if (!formData.email) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "Invalid email format";
    }
    // if (!formData.secondaryEmail) {
    //   validationErrors.secondaryEmail = "Secondary Email is required";
    // } else if (!/\S+@\S+\.\S+/.test(formData.secondaryEmail)) {
    //   validationErrors.secondaryEmail = "Invalid email format";
    // }

    if (!formData.password) {
      validationErrors.password = "Password is required";
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      validationErrors.password =
        "Password must contain at least one special character";
    }

    // if (!formData.phoneNumber1)
    //   validationErrors.phoneNumber1 = "Phone number is required";
    // if (!/^\d{11}$/.test(formData.phoneNumber1))
    //   validationErrors.phoneNumber1 = "Phone number is invalid";

    if (!formData.address) validationErrors.address = "Address is required";
    if (!formData.city) validationErrors.city = "City is required";
    if (!formData.state) validationErrors.state = "State is required";
    if (!formData.country) validationErrors.country = "Country is required";
    if (!formData.gender) validationErrors.gender = "Gender is required";
    if (!formData.dateOfBirth)
      validationErrors.dateOfBirth = "Date of Birth is required";
    if (!formData.role) validationErrors.role = "Role is required";

    return validationErrors;
  };

  const handleSubmit = async () => {
    // console.log("Submit clicked");
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

    const formattedDate = formData.dateOfBirth
      ? formData.dateOfBirth.toISOString().split("T")[0]
      : null;

    try {
      setUploadingData(true);
      console.log("Submitting user data:", formData);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/${user.type}/user/create-user`,
        {
          ...formData,
          dateOfBirth: formattedDate,
          email: formData.email.toLowerCase(),
          // roleId: formData.roleId,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.status === 201) {
        toast.success("User created successfully");
        navigate("/user");
      }
    } catch (error) {
      console.log(error); // Logs the full error
      toast.error(error.response?.data?.message || "Error creating user");
    } finally {
      setUploadingData(false);
      isSubmitting.current = false;
    }
  };

  const handleCancel = () => {
    navigate("/user");
  };

  const roleOptions = roles.map((role) => ({
    value: role._id, // MongoDB ObjectId
    label: role.name, // Role name
  }));

  const cityOptions = cities
    .filter((city) => city.country === "PK" || city.country === "AE") // Replace "US" with any desired country code
    .map((city) => ({
      value: city.name,
      label: city.name,
    }));

  // const countryOptions = [
  //   { value: "United States", label: "United States" },
  //   { value: "United Kingdom", label: "United Kingdom" },
  //   { value: "Canada", label: "Canada" },
  //   // Add more countries here
  // ];

  // const stateOptions = [
  //   { value: "ny", label: "New York" },
  //   { value: "ca", label: "California" },
  //   { value: "tx", label: "Texas" },
  //   // Add more states here
  // ];

  // const cityOptions = [
  //   { value: "New York City", label: "New York City" },
  //   { value: "Los Angeles", label: "Los Angeles" },
  //   { value: "Houston", label: "Houston" },
  //   // Add more cities here
  // ];

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const handleRoleChange = (event) => {
    console.log("Selected role:", event.target.value);
  };

  // console.log(formData);
  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Card title="Create New User">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
          {/* Personal Information */}
          <div>
            {/* <h3 className="text-lg font-semibold mb-4">Personal Information</h3> */}
            <div className="space-y-4">
              <label htmlFor="role" className="form-label">
                User Role
              </label>
              <Select
                label="Role"
                name="role"
                options={roleOptions}
                placeholder="Select Role"
                value={
                  roleOptions.find(
                    (option) => option.value === formData.role
                  ) || null
                }
                onChange={(selectedOption) =>
                  setFormData({ ...formData, role: selectedOption.value })
                }
              />
              {errors.roleId && <p className="text-red-500">{errors.role}</p>}
              <label htmlFor="state" className="form-label">
                User State
              </label>
              <Select
                label="State"
                name="state"
                options={stateOptions}
                placeholder="Select State"
                value={
                  stateOptions.find(
                    (option) => option.value === formData.state
                  ) || null
                }
                onChange={(selectedOption) =>
                  setFormData({ ...formData, state: selectedOption.value })
                }
              />
              {errors.state && <p className="text-red-500">{errors.state}</p>}
              <Textinput
                label="First Name"
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
              {errors.firstName && (
                <p className="text-red-500">{errors.firstName}</p>
              )}
              <Textinput
                label="Middle Name"
                type="text"
                placeholder="Middle Name (Optional)"
                value={formData.middleName}
                onChange={(e) =>
                  setFormData({ ...formData, middleName: e.target.value })
                }
              />
              <Textinput
                label="Email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value.toLowerCase(),
                  })
                }
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
              <Textinput
                label="Phone"
                type="number"
                placeholder="Phone Number (Optional)"
                value={formData.phoneNumber1}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber1: e.target.value })
                }
              />
              {/* {errors.phoneNumber1 && (
                <p className="text-red-500">{errors.phoneNumber1}</p>
              )} */}

              <label className="block text-sm font-medium">Gender</label>
              <Select
                name="gender"
                options={genderOptions}
                placeholder="Select Gender"
                value={
                  genderOptions.find(
                    (option) => option.value === formData.gender
                  ) || null
                }
                onChange={(selectedOption) =>
                  setFormData({ ...formData, gender: selectedOption.value })
                }
              />
              {errors.gender && <p className="text-red-500">{errors.gender}</p>}
              <div className="relative">
                <Textinput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[70%] transform -translate-y-1/2 cursor-pointer"
                />
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            {/* <h3 className="text-lg font-semibold mb-4">Contact Information</h3> */}
            <div className="space-y-4">
              <label htmlFor="country" className="form-label">
                User Country
              </label>
              <Select
                label="Country"
                name="country"
                options={countryOptions}
                placeholder="Select Country"
                value={
                  countryOptions.find(
                    (option) => option.label === formData.country
                  ) || null
                }
                onChange={(selectedOption) =>
                  setFormData({ ...formData, country: selectedOption.label })
                }
              />
              {errors.country && (
                <p className="text-red-500">{errors.country}</p>
              )}
              <label htmlFor="city" className="form-label">
                User City
              </label>
              <Select
                label="City"
                name="city"
                options={cityOptions}
                placeholder="Select City"
                value={
                  cityOptions.find(
                    (option) => option.value === formData.city
                  ) || null
                }
                onChange={(selectedOption) =>
                  setFormData({ ...formData, city: selectedOption.value })
                }
              />
              {errors.city && <p className="text-red-500">{errors.city}</p>}
              <Textinput
                label="Last Name"
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
              {errors.lastName && (
                <p className="text-red-500">{errors.lastName}</p>
              )}
              <Textinput
                label="Address"
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
              {errors.address && (
                <p className="text-red-500">{errors.address}</p>
              )}
              <Textinput
                label="Secondary Email"
                type="secondaryEmail"
                placeholder="Secondary Email Address (Optional)"
                value={formData.secondaryEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    secondaryEmail: e.target.value.toLowerCase(),
                  })
                }
              />
              {/* {errors.secondaryEmail && (
                <p className="text-red-500">{errors.secondaryEmail}</p>
              )} */}
              <Textinput
                label="Secondary Phone"
                type="secondaryNumber"
                placeholder="Secondary Phone Number (Optional)"
                value={formData.phoneNumber2}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber2: e.target.value })
                }
              />
              {/* {errors.phoneNumber2 && (
                <p className="text-red-500">{errors.phoneNumber2}</p>
              )} */}
              <span className="py-4">
                <label className="block text-sm font-medium my-3">
                  Date of Birth
                </label>
                <Flatpickr
                  value={formData.dateOfBirth}
                  options={{ dateFormat: "Y-m-d" }}
                  onChange={(date) =>
                    setFormData({ ...formData, dateOfBirth: date[0] })
                  }
                  placeholder="Select Date"
                  className="block w-full rounded-md border border-gray-300 p-2"
                />
              </span>
              {errors.dateOfBirth && (
                <p className="text-red-500">{errors.dateOfBirth}</p>
              )}
            </div>
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

export default UserAddPage;
