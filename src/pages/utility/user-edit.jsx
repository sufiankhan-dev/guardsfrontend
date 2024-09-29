import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select"; // Make sure you have this installed for roles selection

const UserEditPage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber1: "",
    password: "",
    role: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingData, setUploadingData] = useState(false);
  
  const userId = new URLSearchParams(window.location.search).get("id");
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/${currentUser.type}/role/get-roles`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRoles(rolesResponse.data);

        const userResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/${currentUser.type}/user/get-users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFormData(userResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch user or roles");
      }
    };

    fetchData();
  }, [userId, currentUser.type]);

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    console.log("Submitting data:", formData); // Log the data being submitted
  
    try {
      setUploadingData(true);
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/${currentUser.type}/user/update-user/${userId}`,
        {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber1: formData.phoneNumber1,
          password: formData.password,
          role: formData.role
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (response.status === 200) {
        toast.success("User updated successfully");
        navigate("/user");
      }
    } catch (error) {
      console.error("Error details:", error.response ? error.response.data : error); // Improved error logging
      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setUploadingData(false);
    }
  };
  

  const validate = () => {
    const errors = {};

    if (!formData.firstName) {
      errors.firstName = "First name is required";
    }

    if (!formData.lastName) {
      errors.lastName = "Last name is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }

    if (!formData.phoneNumber1) {
      errors.phoneNumber1 = "Phone number is required";
    } else if (!/^\d{11}$/.test(formData.phoneNumber1)) {
      errors.phoneNumber1 = "Phone number must be 10 digits";
    }

    if (!formData.role) {
      errors.role = "Role is required";
    }

    return errors;
  };

  const handleCancel = () => {
    navigate("/user");
  };

  const roleOptions = roles.map(role => ({
    value: role._id,
    label: role.name
  }));

  return (
    <div>
      <Card title="Edit User">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mb-5">
              <div>
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="border-[3px] h-10 w-full mb-3 p-2"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
                {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
              </div>
              <div>
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="border-[3px] h-10 w-full mb-3 p-2"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
                {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
              </div>
              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="border-[3px] h-10 w-full mb-3 p-2"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
              <div>
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="border-[3px] h-10 w-full mb-3 p-2"
                  value={formData.phoneNumber1}
                  onChange={(e) => setFormData({ ...formData, phoneNumber1: e.target.value })}
                />
                {errors.phoneNumber1 && <p className="text-red-500 text-xs">{errors.phoneNumber1}</p>}
              </div>
              <div>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="border-[3px] h-10 w-full mb-3 p-2"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                {/* Optionally, handle password errors here */}
              </div>
              <div>
                <label className="form-label">Role</label>
                <Select
                  options={roleOptions}
                  value={roleOptions.find(option => option.value === formData.role)}
                  onChange={(selectedOption) => setFormData({ ...formData, role: selectedOption.value })}
                />
                {errors.role && <p className="text-red-500 text-xs">{errors.role}</p>}
              </div>
            </div>
            <div className="space-x-3">
              <button className="btn btn-light" onClick={handleCancel} type="button">Cancel</button>
              <Button text="Save" className="btn-dark" onClick={handleSubmit} isLoading={uploadingData} disabled={uploadingData} />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserEditPage;
