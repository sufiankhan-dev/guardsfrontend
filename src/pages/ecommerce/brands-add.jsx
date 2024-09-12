




import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Brandsadd = () => {
  const [formData, setFormData] = useState({
    image: "",
    name: "",
    __v: "",
   
  })

  const user = useSelector((state) => state.auth.user);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/${user.type}/brand/create-brand`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log(response,"ll")
      if (response.status === 201) {
        toast.success("Product created successfully")
      } else {
        toast.warning(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to create Product")
    }
  }

  return (
    <div>
      <Card title="Create New Brands">
        <div className="grid lg:grid-cols-1 grid-cols-1 gap-5">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <div>
              <Textinput
                label="Name"
                type="text"
                placeholder=" Name"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Textinput
                label="Image URL"
                type="text"
                placeholder=" Image URL"
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
             
             
             
             
            </div>
            <div>
             
              <Textinput
                label="Vendor"
                type="text"
                placeholder=" Vendor"
                onChange={(e) => setFormData({ ...formData, __v: e.target.value })}
              />
             
            </div>
          </div>
        </div>
        <br />
        <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
          <Link to={"/brands"}  text="Submit" className="btn btn-dark" onClick={handleSubmit} >Submit</Link>
        </div>
      </Card>
    </div>
  );
};

export default Brandsadd;
