import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { data } from 'autoprefixer';
import Card from '@/components/ui/Card';
import { useSelector } from 'react-redux';



function Productview() {
    const [logData, setlogData] = useState([]);
    const [product, setProdxucts] = useState([]);
    const [localData, setlocalData] = useState([]);
    const user = useSelector((state) => state.auth.user);

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

   


    useEffect(() => {
        const fetchProducts = async () => {
          // try {
          //   const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/product/get-products/${userId}`, {
          //       headers: {
          //         Authorization: `Bearer ${localStorage.getItem("token")}`
          //       },
          //     });
              try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/product/get-products/${userId}`, {
            headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                });
            console.log(response,"lll");
           
            setlogData(response.data); 
            setlocalData(logData.products)

            console.log(logData,"kia");// Assuming data is an array of product objects
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchProducts();
      }, [userId]);

      const decreaseQuantity = (index) => {
        const updatedProducts = [...products];
        if (updatedProducts[index].quantity > 1) {
          updatedProducts[index].quantity -= 1;
          setProducts(updatedProducts);
        }
      };
    
      // Function to handle increasing quantity
      const increaseQuantity = (index) => {
        const updatedProducts = [...products];
        if (updatedProducts[index].quantity < updatedProducts[index].stock) {
          updatedProducts[index].quantity += 1;
          setProducts(updatedProducts);
        }
      };
    
    



  return (
    <Card>
      <div class="py-3 py-md-5 bg-light">
        
    <div key={logData._id} class="container">
        <div class="row">
            <div class="col-md-5 mt-3"> 
            <Card className='h-[420px]'>
                <div class="bg-white border  ">
                <img src={logData?.image} class="w-100 " alt="Img"/>

                </div>
            </Card>

            </div>
            <div class="col-md-7 mt-3">
            <Card>
                <div class="product-view">
                    <h4 class="product-name">
                    {logData?.name}
                        <label class="label-stock bg-success">In Stock</label>
                    </h4>
                    <h5 class="text-lg text-amber-600">
                    {logData?.brand?.name}
                    </h5>
                    <p class="product-path">
                   <strong>Category</strong>  {logData?.category?.name}
                    </p>
                    <div>
                        <span class="selling-price">{logData?.price}$</span>
                    </div>
                    <div className="mt-2">
            {/* <div className="input-group">
              <span className="btn btn1" onClick={() => decreaseQuantity(index)}><i className="fa fa-minus">-</i></span>
              <input type="text" value="1" className="input-quantity" />
              <span className="btn btn1" onClick={() => increaseQuantity(index)}><i className="fa fa-plus">+</i></span>
            </div> */}
            <p>Stock: {logData?.stock}</p>

          </div>
        
                   
                    <div class="mt-3">
                        <h5 class="mb-0">Small Description</h5>
                        <p>
                            {logData?.description}
                        </p>
                    </div>
                </div>
                </Card>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 mt-3">
                <div class="card">
                    <div class="card-header bg-white">
                        <h4>Description</h4>
                    </div>
                    <div class="card-body">
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
        
</div>
</Card>



  )
}

export default Productview