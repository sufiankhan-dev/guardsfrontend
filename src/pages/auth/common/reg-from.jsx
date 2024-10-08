// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import Textinput from "@/components/ui/Textinput";
// import Button from "@/components/ui/Button";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useNavigate } from "react-router-dom";
// import Checkbox from "@/components/ui/Checkbox";
// import { useDispatch, useSelector } from "react-redux";
// import { useRegisterUserMutation } from "@/store/api/auth/authApiSlice";

// const schema = yup
//   .object({
//     name: yup.string().required("Name is Required"),
//     email: yup.string().email("Invalid email").required("Email is Required"),
//     password: yup
//       .string()
//       .min(6, "Password must be at least 8 characters")
//       .max(20, "Password shouldn't be more than 20 characters")
//       .required("Please enter password"),
//     // confirm password
//   })
//   .required();

// const RegForm = () => {
//   const [registerUser, { isLoading, isError, error, isSuccess }] =
//     useRegisterUserMutation();

//   const [checked, setChecked] = useState(false);
//   const {
//     register,
//     formState: { errors },
//     handleSubmit,
//     reset,
//   } = useForm({
//     resolver: yupResolver(schema),
//     mode: "all",
//   });

//   const navigate = useNavigate();
//   const onSubmit = async (data) => {
//     try {
//       const response = await registerUser(data);
//       if (response.error) {
//         throw new Error(response.error.message);
//       }
//       reset();
//       navigate("/");
//       toast.success("Add Successfully");
//     } catch (error) {
//       console.log(error.response); // Log the error response to the console for debugging

//       const errorMessage =
//         error.response?.data?.message ||
//         "An error occurred. Please try again later.";

//       if (errorMessage === "Email is already registered") {
//         toast.error(errorMessage);
//       } else {
//         toast.warning(errorMessage);
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
//       <Textinput
//         name="name"
//         label="name"
//         type="text"
//         placeholder=" Enter your name"
//         register={register}
//         error={errors.name}
//         className="h-[48px]"
//       />{" "}
//       <Textinput
//         name="email"
//         label="email"
//         type="email"
//         placeholder=" Enter your email"
//         register={register}
//         error={errors.email}
//         className="h-[48px]"
//       />
//       <Textinput
//         name="password"
//         label="passwrod"
//         type="password"
//         placeholder=" Enter your password"
//         register={register}
//         error={errors.password}
//         className="h-[48px]"
//       />
//       <Checkbox
//         label="You accept our Terms and Conditions and Privacy Policy"
//         value={checked}
//         onChange={() => setChecked(!checked)}
//       />
//       <Button
//         type="submit"
//         text="Create an account"
//         className="btn btn-dark block w-full text-center"
//         isLoading={isLoading}
//       />
//     </form>
//   );
// };

// export default RegForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const RegForm = () => {
  const [formData, setFormData] = useState({
    country: "Pakistan",
    state: "",
    city: "",
    firstName: "",
    lastName: "",
    phoneNumber1: "",
    email: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    password: "",
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Form Data:", formData); // Log formData to ensure all fields are correct

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success(
          "Account created successfully! Please Sign-In to continue"
        );
        navigate("/");
      } else {
        const errorData = await response.json();
        console.error("Server response:", errorData); // Log the exact error message from the server
        toast.error("Error creating account. Please try again! ", errorData);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Error connecting to server.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div className="flex flex-col">
        <label className="text-sm font-medium">Country</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 mt-1"
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">State</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 mt-1"
          placeholder="State"
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">City</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 mt-1"
          placeholder="City"
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="border rounded-md px-3 py-2 mt-1"
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="border rounded-md px-3 py-2 mt-1"
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Phone Number</label>
        <input
          type="tel"
          name="phoneNumber1"
          value={formData.phoneNumber1}
          onChange={handleChange}
          placeholder="Phone Number"
          className="border rounded-md px-3 py-2 mt-1"
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@example.com"
          className="border rounded-md px-3 py-2 mt-1"
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 mt-1"
          placeholder="Address"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 mt-1"
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 mt-1"
          required
        >
          <option value="">Select Gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 mt-1"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-black-500 hover:bg-black-600 text-white rounded-md py-2 mt-4"
      >
        Sign Up
      </button>
      <ToastContainer />
    </form>
  );
};

export default RegForm;
