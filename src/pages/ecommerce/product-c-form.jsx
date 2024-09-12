import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Productcreateform = () => {
  const [formData, setFormData] = useState({
    description: "",
    image: null,
    name: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const validate = () => {
    const errors = {};
    
    if (!formData.name) {
      errors.name = "Product name is required";
    }

    if (!formData.description) {
      errors.description = "Product description is required";
    }

    if (!formData.image) {
      errors.image = "Product image is required";
    }

    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("image", formData.image);
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/${user.type}/category/create-category`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log(response, "ll");
      if (response.status === 201) {
        toast.success("Product created successfully");
        navigate('/product-catagroy');
      } else {
        toast.warning(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create Product");
    }
  };

  const handleCancel = () => {
    navigate('/product-catagroy');
  }

  return (
    <div>
      <Card title="Create New Product Category">
        <div className="grid lg:grid-cols-1 grid-cols-1 gap-5">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <div>
              <Textinput
                label="Name"
                type="text"
                placeholder="Product Name"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
              <Textinput
                label="Description"
                type="text"
                placeholder="Product Description"
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              {errors.description && <p className="text-red-500">{errors.description}</p>}
            </div>
            <div>
              <label className="small mb-1" htmlFor="inputFirstName">Image</label>
              <input
                className="form-control"
                type="file"
                placeholder="Image"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              />
              {errors.image && <p className="text-red-500">{errors.image}</p>}
            </div>
          </div>
        </div>
        <br />
        <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
          <button className="btn btn-light text-center" onClick={handleCancel} type="button">
            Cancel
          </button>
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Productcreateform;
