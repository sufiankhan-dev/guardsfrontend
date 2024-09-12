import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../../assets/images/logo/Comp1.gif"; // Replace with your loader component

const Catagroyedit = () => {
    const [picker, setPicker] = useState(new Date());
    const [productdata, setproductData] = useState('');
    const [localData, setlocalData] = useState([]);
    const [logData, setlogData] = useState([]);
    const [formData, setFormData] = useState({
        description: "",
        image: null,
        name: "",
    });
    const [errors, setErrors] = useState({});
    const user = useSelector((state) => state.auth.user);
    const [showLoader, setShowLoader] = useState(true); // State to control loader visibility


    const [isLoading, setIsLoading] = useState(true); // Track loading state
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    const navigate = useNavigate();

    useEffect(() => {
      const fetchProducts = async () => {
          try {
              const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/category/get-categories/${userId}`, {
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`
                  },
              });
              setFormData(response.data);

              // Simulate a minimum loader display time (e.g., 1 second)
              setTimeout(() => {
                  setIsLoading(false); // Set loading to false after minimum time
                  setShowLoader(false); // Hide loader after minimum time
              }, 3000); // Adjust the timeout value as needed
          } catch (error) {
              console.error(error);
              setIsLoading(false); // Handle loading state in case of error
              setShowLoader(false); // Hide loader on error
          }
      };

      fetchProducts();
  }, [userId]);

    const validate = () => {
        const errors = {};

        if (!formData.name) {
            errors.name = "Name is required";
        }

        if (!formData.description) {
            errors.description = "Description is required";
        }

        if (!formData.image) {
            errors.image = "Image is required";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/${user.type}/category/update-category/${userId}`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.status === 200) {
                toast.success("Category updated successfully");
                navigate('/product-catagroy');
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to update Category. Please try again!");
        }
    };

    const handleCancel = () => {
        navigate('/product-catagroy');
    };

    // Render loading indicator while fetching data
    if (showLoader) {
        return (
            <div className="flex items-center justify-center h-full">
                <img src={Loader} width={300} height={300}  alt="Loading..." /> {/* Replace Loader with your loader image */}
            </div>
        );
    }

    // Once data is loaded, render the form
    return (
        <div>
            <div className="grid lg:grid-cols-1 grid-cols-1 gap-5">
                <div>
                    <form onSubmit={handleSubmit}>
                        <Card title="Update Category">
                            <div className="grid lg:grid-cols-1 grid-cols-1 gap-5">
                                <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
                                    <div>
                                        <div className="col-md-6 w-[100%]">
                                            <label className="small mb-1" htmlFor="inputFirstName">Name</label>
                                            <input
                                                className='border-[3px] h-10 w-[100%] mb-3 p-2'
                                                type="text"
                                                placeholder="Category name"
                                                value={formData?.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                        </div>
                                        <div className="col-md-6 w-[100%]">
                                            <label className="small mb-1" htmlFor="inputFirstName">Description</label>
                                            <input
                                                className='border-[3px] h-10 w-[100%] mb-3 p-2'
                                                type="text"
                                                placeholder="Category description"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="col-md-6 w-[100%]">
                                            <label className="small mb-1" htmlFor="inputFirstName">Image</label>
                                            <input
                                                className="form-control"
                                                type="file"
                                                placeholder="Image"
                                                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                            />
                                            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
                                <button className="btn btn-light text-center" onClick={handleCancel} type='button'>Cancel</button>
                                <button type="submit" className="btn btn-dark" onClick={handleSubmit}>Update</button>
                            </div>
                        </Card>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Catagroyedit;
