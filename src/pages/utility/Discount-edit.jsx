import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Textarea from "@/components/ui/Textarea";

const Discountedit = () => {
    const navigate = useNavigate()
  
    const [picker, setPicker] = useState(new Date());
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({
        code: "",
        discount: "",
        description: "",
        status:null,
        type:"percentage",
        __v:""
  
    })
    const [isLoading, setIsLoading] = useState(true)
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    const user = useSelector((state) => state.auth.user);
  
    useEffect(() => {
        const fetchData = async () => {
          try {
            // Verify the base URL and user type
            const baseURL = process.env.REACT_APP_BASE_URL;
            const userType = user.type;
            
            if (!baseURL || !userType) {
              throw new Error("Base URL or User Type is not defined");
            }
    
            // Log the constructed URL for debugging
            const configUrl = `${baseURL}/${userType}/discount/get-discounts/${userId}`;
            console.log(`Fetching data from: ${configUrl}`);
    
            const userResponse = await axios.get(configUrl, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            });
    
            setFormData(userResponse.data.discounts);
            console.log("Fetched data: ", userResponse.data.discounts);
            setIsLoading(false);
          } catch (error) {
            console.error("Failed to fetch data: ", error);
            toast.error("Failed to fetch Config");
          }
        };
    
        fetchData();
      }, [user.type, userId]); // Include user.type and userId in the dependency array
    
      if (isLoading) {
        return <div>Loading...</div>;
      }
  
    const handleSubmit = async () => {
      try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/${user.type}/discount/update-discount/${userId}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        console.log(response)
        if (response.status === 200) {
          toast.success("User updated successfully")
          navigate('/discout-table')
        }
      } catch (error) {
        console.log(error)
        toast.error("Failed to update user")
      }
    }
    const handleCancel = () => {
      navigate('/discout-table')
    }
  
    return (
      <div>
        <Card title="Edit User">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid lg:grid-cols-1 grid-cols-1 gap-5 mb-5 ">
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
                <div>
                  <div>
                    <label htmlFor="roles" className=" form-label">
                      Name
                    </label>
                    <input
                      label="Name"
                      type="text"
                      className='border-[3px] h-10 w-[100%] mb-3 p-2 '
                      placeholder="Add Users Name"
                      value={formData?.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    />
                    <label htmlFor="roles" className=" form-label">
                      Password
                    </label>
                    <input
                      label="Password"
                      type="text"
                      className='border-[3px] h-10 w-[100%] mb-3 p-2 '
  
                      value={formData?.discount}
  
                      placeholder="Add Customer Password"
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    />
                  </div>
                  {/* <label htmlFor="roles" className=" form-label">
                  Roles
                </label>
                <select
                  name="roles"
                  id="roles"
                  className="form-control py-2"
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </select> */}
  
                  {/* <label htmlFor="default-picker" className=" form-label">
                  Date
                </label>
  
                <Flatpickr
                  className="form-control py-2"
                  value={picker}
                  onChange={(date) => setPicker(date)}
                  id="default-picker"
                  
                /> */}
                </div>
                <div>
                  <label htmlFor="roles" className=" form-label">
                    Email
                  </label>
                  <input
                    label="Email"
                    type="email"
                    placeholder="Add Users email"
                    className='border-[3px] h-10 w-[100%] mb-3 p-2 '
  
                    value={formData?.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  {/* <label htmlFor="roles" className=" form-label">
                    phone
                  </label> */}
                  {/* <input
                    label="Phone"
                    type="number"
                    placeholder="Add Customer phone"
                    className='border-[3px] h-10 w-[100%] mb-3 p-2 '
  
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  /> */}
                </div>
  
  
  
  
              </div>
            </div>
          )}
  
          <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
            <button className="btn btn-light  text-center" onClick={handleCancel} type='button'>Cancel</button>
  
            <Button  text="Save" className="btn-dark" onClick={handleSubmit} />
          </div>
        </Card>
      </div>
    );
  };

export default Discountedit