import Card from '@/components/ui/Card';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

function Customerview() {
    const [userData, setUserData] = useState([]);
    const [localData, setlocalData] = useState([]);
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    const user = useSelector((state) => state.auth.user);





    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/user/get-users/${userId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setUserData(response.data);
                console.log(response, "ll");

            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);








    return (
        <Card>

            <div class="container-xl px-4 mt-4">

                <div class="row">
                    {/* <div class="col-xl-4">
                        <div class="card mb-4 mb-xl-0">
                            <div class="card-header">Profile Picture</div>
                            <div class="card-body text-center h-[350px]">
                                <img class="img-account-profile rounded-circle mb-2" src="http://bootdey.com/img/Content/avatar/avatar1.png" alt="" />
                            </div>
                        </div>
                    </div> */}
                    <div class="col-xl-12">
                        <div class="card mb-4">
                            <div class="card-header">Customer Details</div>
                            <div class="card-body">

                                <div class="mb-3">
                                    <label class="small mb-1" for="inputUsername">Username (how your name will appear to other users on the site)</label>
                                    <p className="  form-control py-2   ">{userData?.name}</p>
                                </div>
                                <div class="row gx-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="small mb-1" for="inputFirstName">Status</label>
                                        <input class="form-control" id="inputFirstName" type="text" placeholder="Enter your first name" value={userData?.status} />
                                    </div>
                                    <div class="col-md-6">
                                        <label class="small mb-1" for="inputLastName">Type</label>
                                        <input class="form-control" id="inputLastName" type="text" placeholder="Enter your last name" value={userData?.type} />
                                    </div>
                                </div>
                                <div class="row gx-3 mb-3">
                                <div class="col-md-6">
                                        <label class="small mb-1" for="inputPhone">Date</label>
                                        <input class="form-control" id="inputPhone" type="tel" placeholder="Enter your phone number" value={userData?.date} />
                                    </div>
                                    <div class="col-md-6">
                                        <label class="small mb-1" for="inputLocation">Email address</label>
                                        <input class="form-control" id="inputLocation" type="text" placeholder="Enter your location" value={userData?.email} />
                                    </div>
                                </div>
                                {/* <div class="mb-3">
                            <label class="small mb-1" for="inputEmailAddress">Email address</label>
                            <input class="form-control" id="inputEmailAddress" type="email" placeholder="Enter your email address" value={userData?.email}/>
                        </div> */}
                                {/* <div class="row gx-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="small mb-1" for="inputPhone">Date</label>
                                        <input class="form-control" id="inputPhone" type="tel" placeholder="Enter your phone number" value={userData?.date} />
                                    </div>

                                </div> */}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default Customerview