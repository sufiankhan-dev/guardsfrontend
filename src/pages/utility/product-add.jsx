import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";

const ProductAddPage = () => {
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
  });
  const [errors, setErrors] = useState({});
  const [vendors, setVendors] = useState([]);
  const [uploadingData, setUploadingData] = useState(false);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const validate = () => {
    const errors = {};
    
    if (!formData.name) errors.name = "Product name is required";
    if (!formData.category) errors.category = "Product category is required";
    if (!formData.price) errors.price = "Product price is required";
    if (!formData.sku) errors.sku = "Product SKU is required";
    if (!formData.stock) errors.stock = "Product stock is required";
    if (!formData.description) errors.description = "Product description is required";
    if (!formData.vendor) errors.vendor = "Product vendor is required";
    if (!formData.image) errors.image = "Product image is required";

    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setUploadingData(true)
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData?.category?._id);
      data.append("price", formData.price);
      data.append("sku", formData.sku);
      data.append("stock", formData.stock);
      data.append("description", formData.description);
      data.append("vendor", formData?.vendor?._id);
      data.append("image", formData.image);
      data.append("featured", formData.featured);

      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/${user.type}/product/create-product`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.status === 201) {
        toast.success("Product created successfully");
        navigate('/products');
      } else {
        toast.warning(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    }
    finally{
      setUploadingData(false)
    }
  };

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
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch vendors");
      }
    };

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
    //     setBrands(brands);
    //   } catch (error) {
    //     console.log(error);
    //     toast.error("Failed to fetch brands");
    //   }
    // };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/category/get-categories?limit=10000`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setCategories(response.data.categories);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch categories");
      }
    };

    fetchVendors();
    // fetchBrands();
    fetchCategories();
  }, [user.type]);

  const handleCancel = () => {
    navigate('/products');
  };

  const handleCategoryChange = (selectedOption) => {
    setFormData({ ...formData, category: selectedOption ? selectedOption.value : "" });
  };

  const handleBrandChange = (selectedOption) => {
    setFormData({ ...formData, brand: selectedOption ? selectedOption.value : "" });
  };

  const handleVendorChange = (selectedOption) => {
    setFormData({ ...formData, vendor: selectedOption ? selectedOption.value : "" });
  };

  return (
    <div>
      <Card title="Create New Product">
        <div className="grid lg:grid-cols-1 grid-cols-1 gap-5">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <div>
              <Textinput
                label="Name"
                type="text"
                placeholder="Product Name"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
              <Textinput
                label="SKU"
                type="text"
                placeholder="Product SKU"
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
              {errors.sku && <p className="text-red-500">{errors.sku}</p>}
              <label htmlFor="categories" className="form-label">
                Categories
              </label>
              <Select
                id="categories"
                options={categories.map(cat => ({ value: cat._id, label: cat.name }))}
                onChange={handleCategoryChange}
                isClearable
                placeholder="Select Category"
              />
              {errors.category && <p className="text-red-500">{errors.category}</p>}
              {/* <label htmlFor="brands" className="form-label">
                Brand
              </label>
              <Select
                id="brands"
                options={brands.map(brand => ({ value: brand._id, label: brand.name }))}
                onChange={handleBrandChange}
                isClearable
                placeholder="Select Brand"
              />
              {errors.brand && <p className="text-red-500">{errors.brand}</p>} */}
              <Textinput
                label="Price"
                type="number"
                placeholder="Product Price"
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              {errors.price && <p className="text-red-500">{errors.price}</p>}
            </div>
            <div>
              <Textinput
                label="Stock"
                type="number"
                placeholder="Count In Stock"
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
              {errors.stock && <p className="text-red-500">{errors.stock}</p>}
              <Textinput
                label="Description"
                type="textbox"
                placeholder="Product Description"
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              {errors.description && <p className="text-red-500">{errors.description}</p>}
              <label htmlFor="vendor" className="form-label">
                Vendor
              </label>
              <Select
                id="vendor"
                options={vendors.map(vendor => ({ value: vendor._id, label: vendor.name }))}
                onChange={handleVendorChange}
                isClearable
                
                placeholder="Select Vendor"
              />
              {errors.vendor && <p className="text-red-500">{errors.vendor}</p>}
              <label className="small mb-1" htmlFor="image">Image</label>
              <input
                className="form-control"
                type="file"
                placeholder="Image"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              />
              {errors.image && <p className="text-red-500">{errors.image}</p>}
              <br />
              <input
                type="checkbox"
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
          <button className="btn btn-light text-center" onClick={handleCancel} type="button">Cancel</button>
          <Button text="Save" className="btn-dark" onClick={handleSubmit} isLoading={uploadingData} />
        </div>
      </Card>
    </div>
  );
};

export default ProductAddPage;
