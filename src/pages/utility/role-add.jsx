import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleAddPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    permissions: [],
  });
  const navigate = useNavigate();
  const [uploadingData, setUploadingData] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const handleSubmit = async () => {
    try {
      setUploadingData(true);

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/${user.type}/role/create-role`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data.message);
      if (response.status === 201) {
        toast.success("Role created successfully");
        navigate('/roles');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setUploadingData(false);
    }
  };

  const handleCancel = () => {
    navigate("/roles");
  };

  const permission = ["create", "read", "update", "delete"];

  return (
    <div>
      <Card title="Create New Role">
        <div className="grid lg:grid-cols-1 grid-cols-1 gap-5">
          <div className="grid lg:grid-cols-1 grid-cols-1 gap-5">
            <div>
              <Textinput
                label="Name"
                type="text"
                placeholder="Add Role Name"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
              Permissions
            </label>
          </div>
          <div className="grid lg:grid-cols-4 grid-cols-2 gap-5">
            {permission.map((item, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        permissions: [...formData.permissions, item],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        permissions: formData.permissions.filter(
                          (permission) => permission !== item
                        ),
                      });
                    }
                  }}
                />
                <label
                  htmlFor={item}
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-200"
                >
                  {item}
                </label>
              </div>
            ))}
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
          <Button
            text="Save"
            className="btn-dark"
            isLoading={uploadingData}
            onClick={handleSubmit}
          />
        </div>
      </Card>
    </div>
  );
};

export default RoleAddPage;
