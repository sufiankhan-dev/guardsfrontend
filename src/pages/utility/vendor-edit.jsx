import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CancelIcon from "../../assets/images/logo/cancel-icon.svg";

const VendorEditPage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({ image: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [vendorCategoryNames, setVendorCategoryNames] = useState([]); // Changed state name

  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('id');
  const user = useSelector((state) => state.auth.user);
  const [uploadingData, setUploadingData] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
    const [initialImage, setInitialImage] = useState(null);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "",
    shopUrl: "",
    image: "",
    shopAddress: "",
    shopName: "",
    featured: false,
  });

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

        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/${user.type}/vendor/get-vendors/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const fetchVendorCategories = async () => {
          try {
            const response = await axios.get(
              `${process.env.REACT_APP_BASE_URL}/${user.type}/vendor/get-vendor-categories/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                }
              }
            );
            // Extract category names
            setVendorCategoryNames(response.data.vendorCategories);
            setInitialImage(response.data.imageUrl);

          } catch (error) {
            console.log(error);
          }
        };

        fetchVendorCategories();
        setFormData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
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
          setUploadingData(true)
          const data = new FormData();
          data.append("name", formData.name);
          data.append("email", formData.email);
          data.append("phone", formData.phone);
          data.append("shopUrl", formData.shopUrl);
          data.append("status", formData.status);
          data.append("image", formData.image);
          data.append("shopAddress", formData.shopAddress);
          data.append("shopName", formData.shopName);
          data.append("featured", formData.featured);

          const response = await axios.put(
            `${process.env.REACT_APP_BASE_URL}/${user.type}/vendor/update-vendor/${userId}`,
            data,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.status === 200) {
            toast.success("Vendor updated successfully");
            navigate('/vendor');
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

    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{11}$/.test(formData.phone)) { // Assuming a 10-digit phone number
      errors.phone = "Phone number is invalid";
    }

    if (!formData.shopUrl) {
      errors.shopUrl = "Shop URL is required";
    }

    if (!formData.shopAddress) {
      errors.shopAddress = "Shop address is required";
    }

    if (!formData.shopName) {
      errors.shopName = "Shop name is required";
    }
    if (!formData.image) {
      errors.image = "Image is required";
    }
    // No need to validate vendorCategory field as it's read-only

    return errors;
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  const checkEmailExists = async (email) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/${user.type}/vendor/check-email`,
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
    navigate('/vendor');
  };

  const status = ["active", "inactive"];

  return (
    <div>
      <Card title="Edit Vendor">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid lg:grid-cols-1 grid-cols-1 gap-5">
            <form className="lg:grid-cols-2 grid gap-8 grid-cols-1">
              <div>
                <label htmlFor="name" className="form-label">
                  Vendor Name
                </label>
                <input
                  label="Name"
                  type="text"
                  className="border-[3px] h-10 w-[100%] mb-3 p-2"
                  placeholder="Add Vendor Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                <br />

                <label className="form-label">Phone Number</label>
                <input
                  className="border-[3px] h-10 w-[100%] mb-3 p-2"
                  label="Phone Number"
                  type="number"
                  placeholder="Vendor's Phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                <br />

                <label className="form-label">Shop Website</label>
                <input
                  className="border-[3px] h-10 w-[100%] mb-3 p-2"
                  label="Shop URL"
                  type="text"
                  placeholder="Vendor's Shop URL"
                  value={formData.shopUrl}
                  onChange={(e) => setFormData({ ...formData, shopUrl: e.target.value })}
                />
                {errors.shopUrl && <p className="text-red-500 text-xs mt-1">{errors.shopUrl}</p>}
                <br />

                <div>
                  <label className="form-label">Image URL</label>
                  <input
                    className="form-control"
                    type="file"
                    placeholder="Image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                  <br />

                  {/* <label className="form-label">Vendor Category</label>
                  <input
                    className="border-[3px] h-10 w-[100%] mb-3 p-2"
                    label="Vendor Category"
                    type="text"
                    placeholder="Vendor Categories"
                    value={vendorCategoryNames?.name} // Display category names joined by commas
                    readOnly
                  /> */}
                  {selectedImage && (
                    <div className="flex flex-wrap rtl:space-x-reverse gap-4">
                      <div className="xl:w-1/5 md:w-1/3 w-1/2 rounded mt-6 border p-2 border-slate-200 relative">
                        <img
                          src={CancelIcon}
                          className="w-[17px] cursor-pointer absolute top-0 right-0 m-1"
                          alt="Cancel Icon"
                          onClick={removeSelectedImage}
                        />
                        <img
                          src={selectedImage}
                          alt="Selected"
                          className="object-cover w-full h-full rounded"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
              <label className="form-label">Email</label>
                <input
                  className="border-[3px] h-10 w-[100%] mb-3 p-2 lowercase"
                  label="Email"
                  type="email"
                  placeholder="Add Vendor Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                <br />
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  className="border-[3px] h-10 w-[100%] mb-3 p-2"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="">Select Status</option>
                  {status.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <br />

               

                <label className="form-label">Address</label>
                <input
                  label="Address"
                  className="border-[3px] h-10 w-[100%] mb-3 p-2"
                  value={formData.shopAddress}
                  type="text"
                  placeholder="Add Vendor Address"
                  onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
                />
                {errors.shopAddress && <p className="text-red-500 text-xs mt-1">{errors.shopAddress}</p>}
                <br />
                <br />
  <div>
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <label htmlFor="featured" className="ml-2">
                  Featured
                </label>
              </div>
                {/* <label className="form-label">Shop Name</label>
                
                <input
                  label="Shop Name"
                  className="border-[3px] h-10 w-[100%] mb-3 p-2"
                  type="text"
                  placeholder="Add Vendor's Shop Name"
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                />
                {errors.shopName && <p className="text-red-500 text-xs mt-1">{errors.shopName}</p>} */}
              </div>

              {/* <div>
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <label htmlFor="featured" className="ml-2">
                  Featured
                </label>
              </div> */}
            </form>
          </div>
        )}

        <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
          <button className="btn btn-light text-center" onClick={handleCancel} type="button">
            Cancel
          </button>
          <Button text="Save" className="btn-dark" onClick={handleSubmit} isLoading={uploadingData}/>
        </div>
      </Card>
    </div>
  );
};

export default VendorEditPage;
