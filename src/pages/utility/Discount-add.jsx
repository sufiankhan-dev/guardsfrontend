

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { id_ID } from "@faker-js/faker";
import { products } from "@/constant/data";

const Discountadd = () => {
  const navigate = useNavigate();

  const [picker, setPicker] = useState(new Date());
  const [Product, setProductCategories] = useState([]);

  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    description: "",
    status:null,
    type:"percentage",
    __v:""
  });
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.auth.user);


  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/discount/get-discounts`, {
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



  

//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/discount/get-discounts${userId}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         setRoles(response.data.discounts);
//       } catch (error) {
//         console.log(error);
//       }
//     };
   
//       fetchRoles();
//   }, []);

  const validate = () => {
    const errors = {};

    if (!formData.code) {
      errors.code = "code is required";
    }
    if (!formData.description) {
        errors.description = "description is required";
      }

    if (!formData.discount) {
      errors.discount = "Phone number is required";
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
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/${user.type}/discount/create-discount`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      if (response.status === 201) {
        toast.success("User created successfully");
        navigate("/discout-table");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create user");
    }
  };

  const handleCancel = () => {
    navigate("/discout-table");
  };

  return (
    <div>
      <Card title="Create new Customer">
        <div className="grid lg:grid-cols-1 grid-cols-1 gap-5">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <div>
              <Textinput
                label="Code"
                type="number"
                placeholder="Add Code"
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
              {errors.code && <p className="text-red-500">{errors.code}</p>}
              <br />
              <Textinput
                label="discount"
                type="number"
                placeholder="Add Discount"
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              />
              {errors.discount && <p className="text-red-500">{errors.discount}</p>}
              <br />
            </div>
            <div>
              <Textinput
                label="description"
                type="text"
                placeholder="Add Description"
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              {errors.description && <p className="text-red-500">{errors.description}</p>}
              <br />
              {/* <Textinput
                label="Phone"
                type="number"
                placeholder="Add Customer phone"
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              {errors.phone && <p className="text-red-500">{errors.phone}</p>} */}
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

export default Discountadd;
