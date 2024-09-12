import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const RoleEditPage = () => {
  const navigate = useNavigate()

  const [picker, setPicker] = useState(new Date());
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    permissions: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [role, setRole] = useState({})
  const [uploadingData, setUploadingData] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const roleId = urlParams.get('id');
  const user = useSelector((state) => state.auth.user);

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/${user.type}/role/update-role/${roleId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log(response)
      if (response.status === 200) {
        toast.success("Role updated successfully")
        navigate('/roles')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);
    }
    finally{
      setUploadingData(false)
    }
  }

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/role/get-role/${roleId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        setRole(response.data)
        console.log(response.data)
        setIsLoading(false)
      } catch (error) {
        console.log(error)
        toast.error("Failed to fetch role")
      }
    }
    setIsLoading(true)
    fetchRole()
  }, [])
  const handleCancel =() =>{
    navigate('/roles')
  }

  const permission = [
    "create",
    "read",
    "update",
    "delete"
  ]

  return (
    <div>
      {!isLoading && (
  
      <Card title="Update Role">
        <div className="grid lg:grid-cols-1 grid-cols-1 ">
          <div className="grid lg:grid-cols-1 grid-cols-1">
            <div>
            <label htmlFor="roles" className=" form-label">
                    Name
                  </label>
              <input
                label="Name"
                type="text"
                placeholder="Add Role Name"
                className='border-[3px] h-10 w-[100%] mb-3 p-2 '

                value={role.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">Permissions</label>
          </div>
          <div className="grid lg:grid-cols-4 grid-cols-2 gap-5 text-start mb-3">
            {
              permission.map((item, index) => (
                <div key={index} className="mb-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded text-start"
                    value={formData.permissions}

                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, permissions: [...formData.permissions, item] })
                      } else {
                        setFormData({ ...formData, permissions: formData.permissions.filter((permission) => permission !== item) })
                      }
                    }}
                  />
                  <label htmlFor={item} className="ml-2 block text-sm text-gray-900 dark:text-gray-200">
                    {item}
                  </label>
                </div>
              ))
            }
          </div>
        </div>
        <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
          <button className="btn btn-light  text-center" onClick={handleCancel} type='button'>Cancel</button>

          <Button  text="Save" className="btn-dark" isLoading={uploadingData} onClick={handleSubmit} />
        </div>
      </Card>
      )}
    </div>
  );
};

export default RoleEditPage;
