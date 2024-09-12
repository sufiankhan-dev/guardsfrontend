import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const UserEditPage = () => {
  const navigate = useNavigate();
  const [picker, setPicker] = useState(new Date());
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const urlParams = new URLSearchParams(window.location.search);
  const [uploadingData, setUploadingData] = useState(false);

  const userId = urlParams.get("id");
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/${user.type}/role/get-roles`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRoles(rolesResponse.data);

        const userResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/${user.type}/user/get-users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFormData(userResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch user or roles");
      }
     
    };

    fetchData();
  }, [userId]);

  const handleSubmit = async () => {

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      if (await checkEmailExists(formData.email)) {
        setErrors({ email: "Email already exists" });
      } else {

        try {
          setUploadingData(true);

          const response = await axios.put(
            `${process.env.REACT_APP_BASE_URL}/${user.type}/user/update-user/${userId}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log(response);
          if (response.status === 200) {
            toast.success("User updated successfully");
            navigate("/Customer");
          }
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message)
        }
        finally{
          setUploadingData(false)
        }
      }
    }
  };

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

    // if (!formData.password) {
    //   errors.password = "Password is required";
    // } else if (!/[!@#$%^&*]/.test(formData.password)) {
    //   errors.password = "Password must contain at least one special character";
    // }

    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{11}$/.test(formData.phone)) {
      errors.phone = "Phone number is invalid";
    }

    return errors;
  };

  const checkEmailExists = async (email) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/${user.type}/user/check-email`,
        { email, userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.exists;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const handleCancel = () => {
    navigate("/Customer");
  };

  return (
    <div>
      <Card title="Edit User">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid lg:grid-cols-1 grid-cols-1 gap-5 mb-5">
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
              <div>
                <div>
                  <label htmlFor="roles" className="form-label">
                    Name
                  </label>
                  <input
                    label="Name"
                    type="text"
                    className="border-[3px] h-10 w-[100%] mb-3 p-2"
                    placeholder="Add Users Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                   <label htmlFor="roles" className="form-label">
                  Phone
                </label>
                <input
                  label="Phone"
                  type="number"
                  placeholder="Add Customer phone"
                  className="border-[3px] h-10 w-[100%] mb-3 p-2"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
                  {/* <label htmlFor="roles" className="form-label">
                    Password
                  </label>
                  <input
                    label="Password"
                    type="text"
                    className="border-[3px] h-10 w-[100%] mb-3 p-2"
                    value={formData.password}
                    placeholder="Add Customer Password"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )} */}
                </div>
              </div>
              <div>
                <label htmlFor="roles" className="form-label">
                  Email
                </label>
                <input
                  label="Email"
                  type="email"
                  placeholder="Add Users email"
                  className="border-[3px] h-10 w-[100%] mb-3 p-2"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
               
              </div>
            </div>
          </div>
        )}

        <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
          <button
            className="btn btn-light text-center"
            onClick={handleCancel}
            type="button"
          >
            Cancel
          </button>

          <Button
            text="Save"
            className="btn-dark"
            onClick={handleSubmit}
            disabled={isLoading}
            isLoading={uploadingData}
          />
        </div>
      </Card>
    </div>
  );
};

export default UserEditPage;
