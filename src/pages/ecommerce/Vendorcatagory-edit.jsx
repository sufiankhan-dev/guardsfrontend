import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Vendorcatagoryedit = () => {
    const [picker, setPicker] = useState(new Date());
    const navigate = useNavigate()
    const [productdata, setproductData] = useState('')
    const [localData, setlocalData] = useState([]);
    const [logData, setlogData] = useState([]);
    const [formData, setFormData] = useState({
        description: "",
        image: null,
        name: "",
    });
    const [errors, setErrors] = useState({});
    const user = useSelector((state) => state.auth.user);

    const [isLoading, setIsLoading] = useState(true)
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/vendor/get-vendor-categories/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                });
                console.log(response, "lll");
                setFormData(response.data)
                console.log(response, "kia");
            } catch (error) {
                console.error(error);
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
            const data = new FormData()
            data.append('name', formData.name)
            data.append('description', formData.description)
            data.append('image', formData.image)
            console.log(productdata, "llll");
            const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/${user.type}/vendor/update-vendor-category/${userId}`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            console.log(productdata._id, "aaa")
            if (response.status === 200) {
                toast.success("Vendor updated successfully")
                navigate('/Vendor-category')
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to update user")
        }
    }

    const handleCancel = () => {
        navigate('/Vendor-category')
    }

    return (
        <div>
            <div className="grid lg:grid-cols-1 grid-cols-1 gap-5">
                <div>
                    <form onSubmit={handleSubmit}>
                        <Card title="Update Vendor Category">
                            <div className="grid lg:grid-cols-1 grid-cols-1 gap-5">
                                <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
                                    <div>
                                        <div className="col-md-6 w-[100%]">
                                            <label className="small mb-1" htmlFor="inputFirstName">Name</label>
                                            <input
                                                className='border-[3px] h-10 w-[100%] mb-3 p-2'
                                                type="text" placeholder="Name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                            <br />
                                        </div>

                                        <label className="small mb-1" htmlFor="inputFirstName">Image</label>
                                        <input
                                            className="form-control"
                                            type="file"
                                            placeholder="Image"
                                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                        />
                                        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                                    </div>
                                    <div>
                                        <div className="col-md-6 w-[100%]">
                                            <label className="small mb-1" htmlFor="inputFirstName">Description</label>
                                            <input
                                                className='border-[3px] h-10 w-[100%] mb-3 p-2'
                                                type="text" placeholder="Description"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
                                <button className="btn btn-light text-center" onClick={handleCancel} type='button'>Cancel</button>
                                <button type="submit" className="btn btn-dark">Update</button>
                            </div>
                        </Card>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Vendorcatagoryedit;
