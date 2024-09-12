import React, { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const UserAddPage = () => {
  const navigate = useNavigate();

  const [picker, setPicker] = useState(new Date());
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.auth.user);
  const [uploadingData, setUploadingData] = useState(false);
  const isSubmitting = useRef(false)


  // useEffect(() => {
  //   const fetchRoles = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_BASE_URL}/${user.type}/role/get-roles`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );
  //       setRoles(response.data);
  //       console.log(response);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchRoles();
  // }, [user.type]);

  const validate = () => {
    
    const errors = {};

    if (!formData.name) {
      errors.name = "Name is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      errors.password = "Password must contain at least one special character";
    }

    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{11}$/.test(formData.phone)) {
      errors.phone = "Phone number is invalid";
    }

    return errors;
  };

  const handleSubmit = async () => {
    if (isSubmitting.current) return
    isSubmitting.current = true

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Encrypt the password before sending it to the server
    // const encryptedPassword = CryptoJS.AES.encrypt(
    //   formData.password,
    //   'your-secret-key'
    // ).toString();

    try {
      setUploadingData(true);
      

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/${user.type}/user/create-user`,
        { ...formData, email: formData.email.toLowerCase() },
        // Convert email to lowercase before submission
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 201) {
        toast.success("User created successfully");
        navigate("/Customer");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    }
    finally {
      setUploadingData(false);
      console.log(isSubmitting.current,"...");
      isSubmitting.current = false
    }
    
  };

  const handleCancel = () => {
    navigate("/Customer");
  };

  return (
    <div>
      <Card title="Create new Customer">
        <div className="grid lg:grid-cols-1 grid-cols-1 gap-5">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <div>
              <Textinput
                label="Name"
                type="text"
                placeholder="Add Customer Name"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
              <br />
              <div className="relative">
                <Textinput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Add Customer Password"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <FontAwesomeIcon
                  icon={showPassword ?  faEye : faEyeSlash}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[70%] transform -translate-y-1/2 cursor-pointer"
                />
              </div>
              {errors.password && <p className="text-red-500">{errors.password}</p>}
              <br />
            </div>
            <div>
              <Textinput
                label="Email"
                type="email"
                className=""
                placeholder="Add Customer email"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value.toLowerCase() }) // Convert email to lowercase on change
                }
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
              <br />
              <Textinput
                label="Phone"
                type="number"
                placeholder="Add Customer phone"
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              {errors.phone && <p className="text-red-500">{errors.phone}</p>}
            </div>
          </div>
        </div>

        <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
          <button
            className="btn btn-light text-center"
            onClick={handleCancel}
            type="button"
          >
            Cancel
          </button>
          <Button text="Save" className="btn-dark" onClick={handleSubmit} isLoading={uploadingData} disabled={uploadingData}/>
        </div>
      </Card>
    </div>
  );
};

export default UserAddPage;
