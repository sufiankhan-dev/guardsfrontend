import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Rideredit = () => {
    const navigate = useNavigate();
    const [picker, setPicker] = useState(new Date());
    const [roles, setRider] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadingData, setUploadingData] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        age: "",
       
    });
    const [errors, setErrors] = useState({});
    const user = useSelector((state) => state.auth.user);
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");



    useEffect(() => {
        const fetchRoles = async () => {
            try {


                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/rider/get-riders/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setFormData(response.data.riders);
                console.log(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchRoles();
    }, [user.type,]);

    const validate = () => {
        const errors = {};

        if (!formData.name) {
            errors.name = "Name is required";
        }
        // if (!formData.items) {
        //   errors.items = "Items are required";
        // }

        if (!formData.email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Email address is invalid";
        }

        if (!formData.password) {
            errors.password = "Password is required";
        } else if (!/[!@#$%^&*]/.test(formData.password)) {
            errors.password = "Password must contain at least one special character";
        }

        if (!formData.age) {
            errors.age = "Age is required";
        } else if (!/^\d{2}$/.test(formData.age)) {
            errors.age = "Age should be a two-digit number";
        }

        if (!formData.phone) {
            errors.phone = "Phone number is required";
        } else if (!/^\d{11}$/.test(formData.phone)) {
            errors.phone = "Phone number should be 10 digits";
        }

        // if (!formData.trackerno) {
        //   errors.trackerno = "Tracking number is required";
        // } else if (!/^\d{14}$/.test(formData.trackerno)) {
        //   errors.trackerno = "Tracking number should be 14 digits";
        // }

        return errors;
    };

    const handleSubmit = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            uploadingData(false)
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/${user.type}/rider/update-rider/${userId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            console.log(response);
            if (response.status === 201) {
                toast.success("Rider created successfully");
                navigate("/Rider");
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to create Rider");
        }
        finally{
            uploadingData(true)
        }
    };

    const handleCancel = () => {
        navigate("/Rider");
    };

    return (
        <div>
            <Card title="Edit Rider">

                <div className="grid lg:grid-cols-1 grid-cols-1 gap-5 mb-5">
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
                        <div>
                            <label htmlFor="name" className="form-label">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="border-[3px] h-10 w-[100%] mb-3 p-2"
                                placeholder="Add Rider's Name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                            )}

                            <label htmlFor="phone" className="form-label">
                                Phone
                            </label>
                            <input
                                type="text"
                                id="phone"
                                className="border-[3px] h-10 w-[100%] mb-3 p-2"
                                placeholder="Add Rider's Phone"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({ ...formData, phone: e.target.value })
                                }
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="border-[3px] h-10 w-[100%] mb-3 p-2"
                                placeholder="Add Rider's Email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}


                            <label htmlFor="age" className="form-label">
                                Age
                            </label>
                            <input
                                type="number"
                                id="age"
                                className="border-[3px] h-10 w-[100%] mb-3 p-2"
                                placeholder="Add Rider's Age"
                                value={formData?.age}
                                onChange={(e) =>
                                    setFormData({ ...formData, age: e.target.value })
                                }
                            />
                            {errors.age && (
                                <p className="text-red-500 text-xs mt-1">{errors.age}</p>
                            )}
                        </div>

                       
                    </div>
                </div>

                <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
                    <button
                        className="btn btn-light text-center"
                        onClick={handleCancel}
                        type="button"
                    >
                        Cancel
                    </button>

                    <Button
                        text="Save"
                        className="btn-dark"
                        onClick={handleSubmit}
                        isLoading={uploadingData}
                    />
                </div>
            </Card>
        </div>
    );
};

export default Rideredit;
