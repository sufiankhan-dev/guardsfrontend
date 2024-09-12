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

const Configadd = () => {
  const navigate = useNavigate()

  const [picker, setPicker] = useState(new Date());
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    deliveryFeeV1
      :
      "",
    deliveryFeeV2
      :
      "",
    deliveryFeeVI
      :
      "",
    platformFee
      :
      "",
    tax
      :
      "",
    __v: "0"

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
        const configUrl = `${baseURL}/${userType}/config/get-config`;
        console.log(`Fetching data from: ${configUrl}`);

        const userResponse = await axios.get(configUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        setFormData(userResponse.data);
        console.log("Fetched data: ", userResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch data: ", error);
        toast.error("Failed to fetch Config");
      }
    };

    fetchData();
  }, [user.type]); // Include user.type in the dependency array

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const handleSubmit = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/${user.type}/config/update-config/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log(response)
      if (response.status === 200) {
        toast.success("User updated successfully")
        navigate('/dashboard')
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to update config ")
    }
  }
  const handleCancel = () => {
    navigate('/dashboard')
  }

  return (
    <div>
      <Card title="Configure form">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid lg:grid-cols-1 grid-cols-1 gap-5 mb-5 ">
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
              <div>
                <div>
                  <label htmlFor="roles" className=" form-label">
                    Delivery Fee (vendor 1)
                  </label>
                  <input
                    label="Name"
                    type="text"
                    className='border-[3px] h-10 w-[100%] mb-3 p-2 '
                    placeholder="Add Delivery Fee V1"
                    value={formData.deliveryFeeV1}
                    onChange={(e) => setFormData({ ...formData, deliveryFeeV1: e.target.value })}
                  />
                  <label htmlFor="roles" className=" form-label">
                    Delivery Fee (Vendor 2)
                  </label>
                  <input
                    label="Password"
                    type="text"
                    className='border-[3px] h-10 w-[100%] mb-3 p-2 '

                    value={formData.deliveryFeeV2}

                    placeholder="Add delivery Fee V2 "
                    onChange={(e) => setFormData({ ...formData, deliveryFeeV2: e.target.value })}
                  />
                  <label htmlFor="roles" className=" form-label">
                    Platform Fee
                  </label>
                  <input
                    label="Phone"
                    type="number"
                    placeholder="Add platform Fee"
                    className='border-[3px] h-10 w-[100%] mb-3 p-2 '

                    value={formData.platformFee}
                    onChange={(e) => setFormData({ ...formData, platformFee: e.target.value })}
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
                  Delivery Fee (More Then 2 Vendors)
                </label>
                <input
                  label="Email"
                  type="text"
                  placeholder="Add deliveryFee VI "
                  className='border-[3px] h-10 w-[100%] mb-3 p-2 '

                  value={formData.deliveryFeeVI}
                  onChange={(e) => setFormData({ ...formData, deliveryFeeVI: e.target.value })}
                />
                <div className="form-group">
                  <label htmlFor="roles" className="form-label">
                    Tax
                  </label>
                  <div className="relative">
                    <input
                      label="Tax"
                      type="number"
                      className="border-3 h-10 w-full mb-3 p-2 pr-10" // Added padding-right to make space for the % symbol
                      value={formData.tax}
                      onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                    />
                    <b className="absolute top-[10px] left-7 flex items-center pr-2 pointer-events-none text-gray-500">
                      %
                    </b>
                  </div>
                </div>



              </div>




            </div>
          </div>
        )}

        <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
          <button className="btn btn-light  text-center" onClick={handleCancel} type='button'>Cancel</button>

          <Button text="Save" className="btn-dark" onClick={handleSubmit} />
        </div>
      </Card>
    </div>
  );
};

export default Configadd;
