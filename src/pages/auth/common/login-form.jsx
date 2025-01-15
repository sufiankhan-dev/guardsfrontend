// import React, { useEffect, useState } from "react";
// import Textinput from "@/components/ui/Textinput";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useNavigate } from "react-router-dom";
// import Checkbox from "@/components/ui/Checkbox";
// import Button from "@/components/ui/Button";
// import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { useLoginMutation } from "@/store/api/auth/authApiSlice";
// import { setUser } from "@/store/api/auth/authSlice";
// import { toast } from "react-toastify";
// import { useSelector } from "react-redux";

// const schema = yup
//   .object({
//     email: yup.string().email("Invalid email").required("Email is Required"),
//     password: yup.string().required("Password is Required"),
//   })
//   .required();

// const LoginForm = () => {
//   const [login, { isLoading }] = useLoginMutation();
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.auth);

//   const {
//     register,
//     formState: { errors },
//     handleSubmit,
//   } = useForm({
//     resolver: yupResolver(schema),
//     mode: "all",
//   });
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user?.isAuth) {
//       navigate("/dashboard");
//     }
//   })

//   const onSubmit = async (data) => {
//     try {
//       const response = await login(data);

//       if (response?.error) {
//         console.log(response.error);
//         throw new Error(response.error.data.message);
//       }

//       if (response?.data?.error) {
//         throw new Error(response.error.data.message);
//       }

//       if (!response?.data?.token) {
//         throw new Error("Invalid credentials");
//       }

//       if (response?.data?.user?.type === "user") {
//         throw new Error("Invalid credentials");
//       }

//       const userData = await dispatch(setUser(response?.data?.user));

//       localStorage.setItem("user", JSON.stringify(response?.data?.user));
//       localStorage.setItem("token",response?.data?.token)

//       navigate("/dashboard");
//       toast.success("Login Successful");
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const [checked, setChecked] = useState(false);

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       <Textinput
//         name="email"
//         label="Email"
//         type="email"
//         register={register}
//         error={errors.email}
//         className="h-[48px]"
//       />
//       <Textinput
//         name="password"
//         label="Password"
//         type="password"
//         register={register}
//         error={errors.password}
//         className="h-[48px]"
//       />
//       <div className="flex justify-between">
//         <Checkbox
//           value={checked}
//           onChange={() => setChecked(!checked)}
//           label="Keep me signed in"
//         />
//         <Link
//           to="/forgot-password"
//           className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
//         >
//           Forgot Password?
//         </Link>
//       </div>

//       <Button
//         type="submit"
//         text="Sign in"
//         className="btn btn-dark block w-full text-center"
//         isLoading={isLoading}
//       />
//     </form>
//   );
// };

// export default LoginForm;

import React, { useEffect, useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "@/store/api/auth/authApiSlice";
import { setUser } from "@/store/api/auth/authSlice";
import { toast } from "react-toastify";
import { useVerifyOtpMutation } from "@/store/api/apiSlice";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();

const otpSchema = yup
  .object({
    otp: yup.string().required("OTP is required"),
  })
  .required();

const LoginForm = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);

  const [step, setStep] = useState(1); // 1 for login, 2 for OTP verification
  const [email, setEmail] = useState(""); // Store email for OTP verification
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(step === 1 ? schema : otpSchema),
    mode: "all",
  });

  useEffect(() => {
    if (user?.isAuth) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const [verifyOtp] = useVerifyOtpMutation(); // New mutation for OTP verification

  const onSubmit = async (data) => {
    if (step === 1) {
      // Login step
      try {
        const response = await login({
          email: data.email,
          password: data.password,
        }).unwrap();

        if (response?.message === "OTP sent to email for verification") {
          setEmail(data.email); // Store email for OTP step
          setStep(2); // Move to OTP step
          toast.info("OTP sent to your email.");
        } else {
          throw new Error(response?.message || "Failed to send OTP");
        }
      } catch (error) {
        toast.error(error.response?.data?.message );
      }
    } else if (step === 2) {
      // OTP Verification step
      try {
        const otpResponse = await verifyOtp({
          email,
          otp: data.otp,
        }).unwrap();

        if (otpResponse?.token) {
          // Set user and token in local storage and Redux
          dispatch(setUser(otpResponse.user));
          localStorage.setItem("user", JSON.stringify(otpResponse.user));
          localStorage.setItem("token", otpResponse.token);

          navigate("/dashboard");
          toast.success("Login successful");
        } else {
          throw new Error(otpResponse?.message || "OTP verification failed");
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {step === 1 ? (
        <>
          <Textinput
            name="email"
            label="Email"
            type="email"
            register={register}
            error={errors.email}
            className="h-[48px]"
          />
          <Textinput
            name="password"
            label="Password"
            type="password"
            register={register}
            error={errors.password}
            className="h-[48px]"
          />
          <div className="flex justify-between">
            <Checkbox
              label="Keep me signed in"
              // Add any necessary props
            />
            <Link
              to="/forgot-password"
              className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
            >
              Forgot Password?
            </Link>
          </div>
        </>
      ) : (
        <>
          <Textinput
            name="otp"
            label="Enter OTP"
            type="text"
            register={register}
            error={errors.otp}
            className="h-[48px]"
          />
        </>
      )}

      <Button
        type="submit"
        text={step === 1 ? "Sign in" : "Verify OTP"}
        className="btn btn-dark block w-full text-center"
        isLoading={isLoading}
      />
    </form>
  );
};

export default LoginForm;
