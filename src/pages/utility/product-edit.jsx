import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import axios from "axios";
import { products } from "@/constant/data";
import register from "../auth/register";
import Radio from "@/components/ui/Radio";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "@/components/ui/Select";

const ProductEditPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    sku: "",
    stock: "",
    description: "",
    vendor: "",
    image: null,
    featured: false
  })
  const navigate = useNavigate()
  const [productdata, setproductData] = useState('')
  const [logData, setlogData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [uploadingData, setUploadingData] = useState(false);
  const [localData, setlocalData] = useState([]);

  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('id');

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        let hasNextPage = true;
        let vendors = [];
        let page = 1;
        while (hasNextPage) {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/vendor/get-vendors?page=${page}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
          vendors = vendors.concat(response.data.vendors);
          hasNextPage = response.data.pagination.hasNextPage;
          page++;
        }
        setVendors(vendors);
        console.log(vendors, "vendors")
      } catch (error) {
        console.log(error)
        toast.error("Failed to fetch vendors")
      }
    }

    // const fetchBrands = async () => {
    //   try {
    //     let hasNextPage = true;
    //     let brands = [];
    //     let page = 1;
    //     while (hasNextPage) {
    //       const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/brand/get-brands?page=${page}`, {
    //         headers: {
    //           Authorization: `Bearer ${localStorage.getItem("token")}`
    //         }
    //       });
    //       brands = brands.concat(response.data.brands);
    //       hasNextPage = response.data.pagination.hasNextPage;
    //       page++;
    //     }

    //     setBrands(brands)
    //   } catch (error) {
    //     console.log(error)
    //     toast.error("Failed to fetch vendors")
    //   }
    // }

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/category/get-categories?limit=10000`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setCategories(response.data.categories);
      } catch (error) {
        console.log(error)
        toast.error("Failed to fetch categories")
      }
    }

    fetchVendors();
    // fetchBrands();
    fetchCategories();
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/product/get-products/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
        });
        console.log(response, "lll");

        setFormData(response.data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [userId]);

  const handleSubmit = async () => {
    try {
      
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData?.category?._id);
      data.append("brand", formData.brand);
      data.append("price", formData.price);
      data.append("sku", formData.sku);
      data.append("stock", formData.stock);
      data.append("description", formData.description);
      data.append("vendor", formData?.vendor?._id);
      data.append("image", formData.image);
      data.append("featured", formData.featured);
      setUploadingData(true)

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/${user.type}/product/update-product/${userId}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.status === 200) {
        toast.success("Product updated successfully")
        navigate('/products')

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
    navigate('/products')
  }
  const handleVendorChange = (selectedOption) => {
    setFormData({ ...formData, vendor: selectedOption ? selectedOption.value : "" });
  };



  return (
    <div>
      <Card title="Edit Product">
        <div className="grid lg:grid-cols-1 grid-cols-1 gap-5">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <div>
              <label class="small mb-1" for="inputFirstName">Product Name</label>

              <input
                label="Name"
                className='border-[1px] h-10 w-[100%] mb-3 p-2 '

                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <label class="small mb-1" for="inputFirstName">SKU</label>

              <input
                label="SKU"
                className='border-[1px] h-10 w-[100%] mb-3 p-2 '

                type="text"
                placeholder="Product SKU"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
              <label htmlFor="categories" className=" form-label">
                Categories
              </label>
              {/* <select
                name="categories"
                id="categories"
                className="form-control py-2"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select> */}
              <Select
                id="vendor"
                options={categories.map(category => ({ value: category._id, label: category.name }))}
                onChange={handleVendorChange}
                isClearable
                placeholder="Select Vendor"
              />
              {/* <label htmlFor="brands" className=" form-label">
                Brand
              </label>
              <select
                name="brands"
                id="brands"
                className="form-control py-2"
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select> */}
              <label class="small mb-1" for="inputFirstName">Price</label>

              <input
                label="Price"
                className='border-[1px] h-10 w-[100%] mb-3 p-2 '

                type="number"
                value={formData.price}
                placeholder="Product Price"
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <label class="small mb-1" for="inputFirstName">Stock</label>

              <input
                label="Stock"
                type="number"
                className='border-[1px] h-10 w-[100%] mb-3 p-2 '
                value={formData.stock}

                placeholder="Count In Stock"
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
              <label class="small mb-1" for="inputFirstName">Description</label>

              <input
                label="Description"
                className='border-[1px] h-10 w-[100%] mb-3 p-2 '
                value={formData.description}


                type="textbox"
                placeholder="Product Description"
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <label htmlFor="vendor" className=" form-label">
                Vendor
              </label>
              <Select
                id="vendor"
                options={vendors.map(vendor => ({ value: vendor._id, label: vendor.name }))}
                onChange={handleVendorChange}
                isClearable
                placeholder="Select Vendor"
              />
              <label className="small mb-1" htmlFor="inputFirstName">Image</label>
              <input
                className="form-control"
                type="file"
                placeholder="Image"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              />
              <br />
              <input type="checkbox"
                id="featured"
                name="featured"
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />

              <label htmlFor="featured" className="ml-2">
                Featured
              </label>
            </div>
          </div>
        </div>
        <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
          <button className="btn btn-light  text-center" onClick={handleCancel} type='button'>Cancel</button>

          <Button text="Update" className="btn-dark" onClick={handleSubmit} isLoading={uploadingData} />
        </div>
      </Card>
    </div>
  );
};

export default ProductEditPage;
