import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CryptoJS from "crypto-js";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";



const VendorAddPage = () => {
  const navigate = useNavigate();

  const [picker, setPicker] = useState(new Date());
  const [roles, setRoles] = useState([]);
  const [vendorCategories, setVendorCategories] = useState([]);
  const [uploadingData, setUploadingData] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    shopUrl: "",
    vendorCategory: "",
    role: "",
    image: null,
    shopAddress: "",
    shopName: "",
    featured: false
  });
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/role/get-roles`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setRoles(response.data);
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    }
    const fetchVendorCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/vendor/get-vendor-categories`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setVendorCategories(response.data.vendorCategories);
      } catch (error) {
        console.log(error)
      }
    }
    fetchRoles();
    fetchVendorCategories();
  }, [user.type]);

  const validate = () => {
    const errors = {};

    if (!formData.name) {
      errors.name = "Name is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invaild";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      errors.password = "Password must contain at least one special character";
    }

    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{11}$/.test(formData.phone)) {
      errors.phone = "Phone number is invalid";
    }

    if (!formData.shopUrl) {
      errors.shopUrl = "Shop URL is required";
    }

    if (!formData.vendorCategory) {
      errors.vendorCategory = "Vendor category is required";
    }

    if (!formData.shopAddress) {
      errors.shopAddress = "Shop address is required";
    }

    if (!formData.shopName) {
      errors.shopName = "Shop name is required";
    }
    if (!formData.image) {
      errors.image = "image is required";
    } 
    

    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    console.log(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    

    // const encryptedPassword = CryptoJS.AES.encrypt(
    //   formData.password,
    //   'your-secret-key'
    // ).toString();

    try {
      setUploadingData(true);
     
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("phone", formData.phone);
      data.append("shopUrl", formData.shopUrl);
      data.append("vendorCategory", formData.vendorCategory);
      data.append("image", formData.image);
      data.append("shopAddress", formData.shopAddress);
      data.append("shopName", formData.shopName);
      data.append("featured", formData.featured);

      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/${user.type}/vendor/create-vendor`,data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log(response)
      if (response.status === 201) {
        toast.success("Vendor created successfully");
        navigate("/vendor");
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
    finally{
      setUploadingData(false)
    }
    
  }

  const handleCancel = () => {
    navigate('/vendor');
  }

  return (
    <div>
      <Card title="Create new Vendor">
        <div className="grid lg:grid-cols-1 grid-cols-1 gap-5">
          <form className="lg:grid-cols-2 grid gap-8 grid-cols-1">
            <div>
              <Textinput
                label=" Vendor Name"
                type="text"
                placeholder="Add Vendor Name"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
              <br />
              <div className="relative">
                <Textinput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Add Customer Password"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEye :  faEyeSlash}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[70%] transform -translate-y-1/2 cursor-pointer"
                />
              </div>
              {errors.password && <p className="text-red-500">{errors.password}</p>}
              <br />
              <Textinput
                label="Shop Address"
                type="text"
                placeholder="Add Vendor Address"
                onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
              />
              {errors.shopAddress && <p className="text-red-500">{errors.shopAddress}</p>}
              <br />
              <label htmlFor="vendorCategories" className="form-label">
                Vendor Categories
              </label>
              <select
                name="vendorCategories"
                id="vendorCategories"
                className="form-control py-2"
                onChange={(e) => setFormData({ ...formData, vendorCategory: e.target.value })}
              >
                <option value="">Select Vendor Category</option>
                {vendorCategories.map((category) => (
                  <option key={category.id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.vendorCategory && <p className="text-red-500">{errors.vendorCategory}</p>}
              <br />
              <Textinput
                label="Store Name"
                type="text"
                placeholder="Add Vendor Store Name"
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
              />
              {errors.shopName && <p className="text-red-500">{errors.shopName}</p>}
              <input type="checkbox"
                id="featured"
                name="featured"
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
              <label htmlFor="featured" className="ml-2">
                Featured
              </label>
              <br />
            </div>
            <div>
              <Textinput
                label="Email"
                type="email"
                className=""
                placeholder="Add Users email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
              <br />
              <Textinput
                label="Phone"
                type="number"
                placeholder="Add Users phone"
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              {errors.phone && <p className="text-red-500">{errors.phone}</p>}
              <br />
              <Textinput
                label="Shop Website"
                type="text"
                placeholder="Add Shop Website"
                onChange={(e) => setFormData({ ...formData, shopUrl: e.target.value })}
              />
              {errors.shopUrl && <p className="text-red-500">{errors.shopUrl}</p>}
              <br />
              <label className="small mb-1" htmlFor="inputFirstName">Image</label>
              <input
                className="form-control"
                type="file"
                placeholder="Image"
                
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              />
              <p>
              </p>
              {errors.image && <p className="text-red-500">{errors.image}</p>}
              <br />
            </div>
          </form>
        </div>

        <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
          <button className="btn btn-light text-center" onClick={handleCancel} type="button">
            Cancel
          </button>
          <Button text="Save" className="btn-dark" onClick={handleSubmit} isLoading={uploadingData} />
        </div>
      </Card>
    </div>
  );
};

export default VendorAddPage;
