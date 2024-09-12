import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import axios from "axios";
import { products } from "@/constant/data";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Brandsedit = () => {
  const [picker, setPicker] = useState(new Date());
  const [productdata,setproductData]= useState('')
  const [localData, setlocalData] = useState([]);
      const [logData, setlogData] = useState([]);
      const [formData, setFormData] = useState({
        description: "",
        image: "",
        name: "",
        __v: "",
       
      })
  const user = useSelector((state) => state.auth.user);

  // const [formData, setFormData] = useState({
  //   name: "",
  //   category: "",
  //   brand: "",
  //   price: "",
  //   sku: "",
  //   countInStock: "",
  //   description: "",
  //   vendor: "",
  //   imageUrl: "",
  // })
  const [isLoading, setIsLoading] = useState(true)
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('id');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/brand/get-brands/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            },
          });
        console.log(response,"lll");
       
        setlogData(response.data); 
        setlocalData(logData.data)

        console.log(logData,"kia");// Assuming data is an array of product objects
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [userId]);

  const handleSubmit = async () => {
    try {
      console.log(productdata,"llll");
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/${user.type}/brand/update-brand/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log(productdata._id, "aaa")
      if (response.status === 200) {
        toast.success("Vendor updated successfully")
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to update user")
    }
  }
  
 

  return (
    <div>
       
          <div className="grid lg:grid-cols-1 grid-cols-1 gap-5">
            <div>
              <form onSubmit={handleSubmit}>
              <Card title="Update Brands">
                <div className="grid lg:grid-cols-1 grid-cols-1 gap-5">
                  <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
                    <div>
                    <div class="col-md-6">
                                <label class="small mb-1" for="inputFirstName">name</label>
                      <input
                       class="form-control"  type="text" placeholder="Enter your first name"
                        value={ logData?.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}

                        


                        />
                        </div>
                        <div class="col-md-6">
                                <label class="small mb-1" for="inputFirstName">Vendor</label>

                                <input
                                             class="form-control"

                        label="Vendor"
                        type="text"
                        placeholder=" Vendor"
                        value={logData.__v
                        }

                        onChange={(e) => setFormData({ ...formData, __v
                            : e.target.value })}
                      />
                      </div>
                    
                    
                  
                    </div>
                    <div>
                   
                   
                     
                      <div class="col-md-6">
                                <label class="small mb-1" for="inputFirstName">Imgurl</label>
                      <input
                                             class="form-control"

                        label="Image URL"
                        type="text"
                        placeholder=" Image URL"
                        value={logData.image}

                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
                  {/* <button className="btn-dark" onClick={handleSubmit} >update</button> */}
                  <Link type="button" to={"/brands"}  class="btn btn-dark" onClick={handleSubmit}>update</Link>

                </div>
              </Card>
              </form>
            </div>
          </div>
        

        {/* <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
          <Button text="Save" className="btn-dark" onClick={handleSubmit} />
        </div> */}
    </div>
  );
};

export default Brandsedit;
