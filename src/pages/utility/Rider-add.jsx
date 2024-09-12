import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Rideradd = () => {
  const navigate = useNavigate();
  const [picker, setPicker] = useState(new Date());
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/rider/get-riders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setRoles(response.data);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoles();
  }, [user.type]);

  const validate = () => {
    const errors = {};

    if (!formData.name) {
      errors.name = "Name is required";
    }
    // if (!formData.items) {
    //   errors.items = "Items are required";
    // }

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

    if (!formData.age) {
      errors.age = "Age is required";
    } else if (!/^\d{2}$/.test(formData.age)) {
      errors.age = "Age should be a two-digit number";
    }
    
    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{11}$/.test(formData.phone)) {
      errors.phone = "Phone number should be 10 digits";
    }

    // if (!formData.trackerno) {
    //   errors.trackerno = "Tracking number is required";
    // } else if (!/^\d{14}$/.test(formData.trackerno)) {
    //   errors.trackerno = "Tracking number should be 14 digits";
    // }

    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/${user.type}/rider/create-rider`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      if (response.status === 201) {
        toast.success("Rider created successfully");
        navigate("/Rider");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create Rider");
    }
  };

  const handleCancel = () => {
    navigate("/Rider");
  };

  return (
    <div>
      <Card title="Create Rider ">
        <div className="grid lg:grid-cols-1 grid-cols-1 gap-5">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <div>
              <Textinput
                label="Name"
                type="text"
                placeholder="Add Rider Name"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
              <br />
              <Textinput
                label="Password"
                type="password"
                placeholder="Add Password"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              {errors.password && <p className="text-red-500">{errors.password}</p>}
              
              <br />
                           <Textinput
                label="Age"
                type="number"
                placeholder="Add Rider Age"
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
              {errors.age && <p className="text-red-500">{errors.age}</p>}
            </div>
            <div>
            <Textinput
                label="Email"
                type="email"
                placeholder="Add Rider Email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
             
              <br />
              <Textinput
                label="Phone"
                type="text"
                placeholder="Add Rider Phone"
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              {errors.phone && <p className="text-red-500">{errors.phone}</p>}
              {/* <Textinput
                label="Items"
                type="text"
                placeholder="Add Items"
                onChange={(e) => setFormData({ ...formData, items: e.target.value })}
              />
              {errors.items && <p className="text-red-500">{errors.items}</p>}
              <br /> */}
              {/* <Textinput
                label="Tracking Number"
                type="text"
                placeholder="Add Tracking Number"
                onChange={(e) => setFormData({ ...formData, trackerno: e.target.value })}
              />
              {errors.trackerno && <p className="text-red-500">{errors.trackerno}</p>}
              <br /> */}
             
            </div>
          </div>
        </div>

        <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
          <button className="btn btn-light text-center" onClick={handleCancel} type="button">
            Cancel
          </button>
          <Button text="Save" className="btn-dark" onClick={handleSubmit} />
        </div>
      </Card>
    </div>
  );
};

export default Rideradd;
