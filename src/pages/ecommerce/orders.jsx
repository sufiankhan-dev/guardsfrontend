import React,{ useState, useMemo, useEffect } from "react";
// import { advancedTable } from "../../constant/table-data";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";
import axios from "axios";
import { toast } from "react-toastify";

import { Link, useNavigate } from "react-router-dom";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "../table/react-tables/GlobalFilter";
import { Menu } from "@headlessui/react";
import Header from "@/components/partials/header";
import { useSelector } from "react-redux";
import Tooltip from "@/components/ui/Tooltip";
import Icons from "@/components/ui/Icon";
import { icon } from "leaflet";





const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input
          type="checkbox"
          ref={resolvedRef}
          {...rest}
          className="table-checkbox"
        />
       
      </>
      
    );
  }
);


const VoucherCard = ({ row }) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(row.original.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex items-center">
    <div className="bg-black-500 text-white rounded-lg p-4 flex-1">
      <h3 className="text-sm text-center text-white font-bold mb-2 cursor-pointer" onClick={toggleDropdown}>
        Product order
      </h3>
      {isOpen && (
        <div>
          <div className="mb-2">
            
          </div>
         
          <div className="mb-2">
            <span className="font-semibold mr-2">Products:</span>
            <div className="flex flex-col">
              {row.original.products.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                  <img src={item.product.image} alt={item.product.name} style={{ width: '70px', height: 'auto' }} className="mr-2" />
                  <span>{item.product.name}</span>
                  <span className="text-gray-300">Quantity: {item.quantity}</span>

                </div>
              ))}
            </div>
          </div>
          {/* <div className="mb-2">
            <span className="font-semibold mr-2">Expiration Date:</span>
            <span>{row.original.expirationDate}</span>
          </div> */}
          <p className="text-green-400">(Your Order)</p>
        </div>
      )}
    </div>
  </div>
);
};


const Orders = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState([]);
  const [orders, setOrders] = useState([]); // Assuming you have this in your component

  const [itemsData, setitemsData] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [rider, setRiders] = useState([]);
  
  const [pageIndex, setPageIndex] = useState(0);
  const [total, setTotal] = useState(0);

  const [hasNextPage, setHasNextPage] = useState(false);


  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    hasNextPage: false,
  });
 
  
  useEffect(() => {
    fetchData(pageIndex, pageSize);
  }, [pageIndex, pageSize]);

  const fetchData = async (pageIndex, pageSize) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/${user.type}/order/get-orders`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            page: pageIndex + 1, // Backend pages are usually 1-indexed
            limit: pageSize,
          },
        }
      );
      const orders = response.data.orders;
      setProductData(orders);
      console.log(response,"att");
      setHasNextPage(response.data.pagination.hasNextPage);
      setTotal(response.data.pagination.total);

      // Fetch riders after fetching orders
    } catch (error) {
      console.log(error);
    }
  };

  // const fetchRiders = async (orders) => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_BASE_URL}/${user.type}/rider/get-riders`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     const ridersMap = response.data.riders.reduce((acc, rider) => {
  //       acc[rider.id] = rider;
  //       return acc;
  //     }, {});

  //     // Merge rider info into orders
  //     const ordersWithRiders = orders.map(order => ({
  //       ...order,
  //       rider: ridersMap[order.riderId] || null // Assuming order has a riderId field
  //     }));

  //     setProductData(ordersWithRiders);
  //     console.log(response, "Riders fetched");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  

  // const handleDelete = async (id) => {
  //   try {
  //     const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/${user.type}/product/delete-product/${id}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     console.log(response);
  //     toast.success("Role deleted successfully");
      
  //     const fetchData = async (id) => {
  //       try {
  //         const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/product/get-products${id}`, {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         });
  //         console.log(response,"jjo");
  //         setProductData(response.data.products);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };
  //     fetchData();
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Failed to delete role");
  //   }
  // };


  

  const actions = [
    {
      name: "View",
      icon: "heroicons:eye",
      doit: (id) => {
        navigate(`/Order-view?id=${id}`);
      },
      show: (status) => true, // Always show
    },
    {
      name: "Assign to Rider",
      icon: "heroicons-outline:check",
      doit: (id) => {
        navigate(`/assign-order?id=${id}`);
      },
      show: (status) => status !== 'completed' && status !== 'assigned', // Show only if not completed or assigned
    },
    {
      name: "Order Complete",
      icon: "heroicons-outline:check-circle",
      doit: async (id, setOrders) => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${user.type}/order/update-order-status/${id}`, {
            method: 'PUT',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ status: 'completed' }),
          });
          if (response.ok) {
            const updatedOrder = await response.json();
            console.log('Order status updated to completed:', updatedOrder);
  
            // Update the local state to reflect the change
            setOrders(prevOrders => prevOrders.map(order =>
              order.id === id ? { ...order, status: 'completed' } : order
            ));
  
            toast.success("Order Completed");
          } else {
            console.error('Failed to update order status');
            toast.error('Failed to update order status');
          }
        } catch (error) {
          console.error('Error updating order status:', error);
          toast.error('Error updating order status');
        }
      },
      show: (status) => status !== 'completed', // Show only if not completed
    },
  ];
  
  
  const COLUMNS = [
    {
      Header: "Sr no",
      accessor: "_id",
      Cell: ({ row, flatRows }) => {
          return <span>{flatRows.indexOf(row) + 1}</span>;
      },
  },
  {
    Header: "Customer Details",
    accessor: "user",
    Cell: ({ row }) => {
      const user = row.original.user || {};
      const { email, name, phone } = user;
  
      return (
        <div>
          <div>
            <strong>Name:</strong> {name || "N/A"}
          </div>
          <div>
            <strong>Email:</strong> {email ? <a className="text-blue-500 underline">{email}</a> : "N/A"}
          </div>
          <div>
            <strong>Phone:</strong> {phone || "N/A"}
          </div>
        </div>
      );
    },
  },
  {
    Header: "Orders No",
    accessor: "orderNumber",
    Cell: (row) => <span>{row?.cell?.value}</span>,
  },

  
  
    // {
    //   Header: 'Image',
    //   accessor: 'image',
    //   Cell: ({ row }) => {
    //     const imageUrl = row.original.products[0].product.image;
    //     return <img src={imageUrl} alt="Product" style={{ width: '70px', height: 'auto' }} />;
    //   },
    // },
    // {
    //   Header: 'Customer-Phone',
    //   accessor: 'user.phone',
    //   Cell: (row) => {
    //     return <span>{row?.cell?.value}</span>;
    //   },
    //   },
    
    // {
    //   Header: 'Product',
    //   accessor: 'products',
    //   Cell: ({ row }) => <VoucherCard row={row} />,

    // },
    // {
    //   Header: 'Quantity',
    //   accessor: 'quantity', // Accessing the products array directly
    //   Cell: ({ row }) => {
    //     // Calculate the total quantity by summing up the quantities of all products
    //     const totalQuantity = row.original.products.reduce((sum, item) => sum + item.quantity, 0);
    //     return <span>{totalQuantity}</span>;
    //   },
    // },
    {
      Header: 'GrandTotal',
      accessor: 'grandTotal',
      Cell: (row) => {
        return <span>{row?.cell?.value && row?.cell?.value !== undefined && row?.cell?.value !== "undefined" ? parseFloat(row?.cell?.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "" : "Not Available"}</span>;
    },
    },
    {
      Header: "Total",
      accessor: "total",
      Cell: (row) => {
        return <span>{row?.cell?.value && row?.cell?.value !== undefined && row?.cell?.value !== "undefined" ? parseFloat(row?.cell?.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "" : "Not Available"}</span>;
    },
    
    },
    
    
    
    
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ cell: { value } }) => (
        <span className="block w-full">
          <span
            className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
              value === "completed"
                ? "text-success-500 bg-success-500"
                : value === "assigned"
                ? "text-warning-500 bg-yellow-500"
                : value === "pending"
                ? "text-danger-500 bg-danger-500"
                : ""
            }`}
          >
            {value}
          </span>
        </span>
      ),
    }
    ,
    {
      Header: "Rider Details",
      accessor: "rider",
      Cell: ({ row }) => {
        const rider = row.original.rider || {};
        console.log(rider,"kkkl");
        const { email, name, phone } = rider;
  
        return (
          <div>
            <div>
              <strong>Name:</strong> {name }
            </div>
            <div>
              <strong>Email:</strong> { <a className="text-blue-500 underline">{email}</a> }
            </div>
            <div>
              <strong>Phone:</strong> {phone}
            </div>
          </div>
        );
      },
    },
    {
      Header: "Date Added",
      accessor: "date",
      Cell: (row) => {
        return <span>{new Date(row?.cell?.value).toLocaleDateString()}</span>;
      },
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: (row) => {
        const orderStatus = row.cell.row.original.status;
  
        return (
          <div>
            <Dropdown
              classMenuItems="right-0 w-[140px] top-[110%]"
              label={
                <span className="text-xl text-center block w-full">
                  <Icon icon="heroicons-outline:dots-vertical" />
                </span>
              }
            >
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {actions
                  .filter(action => action.show(orderStatus))
                  .map((item, i) => (
                    <Menu.Item key={i}>
                      <div
                        className={`${
                          item.name === "delete"
                            ? "bg-danger-500 text-danger-500 bg-opacity-30 hover:bg-opacity-100 hover:text-white"
                            : "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50"
                        } w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex space-x-2 items-center rtl:space-x-reverse`}
                        onClick={() => item.name === "Order Complete"
                          ? item.doit(row.cell.row.original._id, setOrders)
                          : item.doit(row.cell.row.original._id)
                        }
                      >
                        <span className="text-base">
                          <Icon icon={item.icon} />
                        </span>
                        <span>{item.name}</span>
                      </div>
                    </Menu.Item>
                  ))}
              </div>
            </Dropdown>
          </div>
        );
      },
    },
    
,
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => productData, [productData]);

  const tableInstance = useTable(
    {
      columns,
      data,
      manualPagination: true,
      pageCount: Math.ceil(total / pageSize),
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount: controlledPageCount,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex: currentPageIndex, pageSize: currentPageSize } = state;
  const handlePageChange = (pageIndex) => {
    gotoPage(pageIndex);
    setPageIndex(pageIndex);
  };

  const handlePageSizeChange = (pageSize) => {
    setPageSize(pageSize);
  };

  return (
    <>
      <Card noborder>
        <div className="md:flex pb-6 items-center">
          <h6 className="flex-1 md:mb-0 mb-3">Order</h6>
          <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <Button
              icon="heroicons-outline:calendar"
              text="Select date"
              className=" btn-outline-secondary dark:border-slate-700  text-slate-600 btn-sm font-normal dark:text-slate-300 "
              iconClass="text-lg"
            />
            <Button
              icon="heroicons-outline:filter"
              text="Filter"
              className=" btn-outline-secondary text-slate-600 dark:border-slate-700 dark:text-slate-300 font-normal btn-sm "
              iconClass="text-lg"
            />
            {/* <Button
              icon="heroicons-outline:plus-sm"
              text="Order"
              className=" btn-dark font-normal btn-sm "
              iconClass="text-lg"
              onClick={() => {
                navigate("/");
              }}
            /> */}
          </div>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps}
              >
                <thead className=" bg-slate-200 dark:bg-slate-700q">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          scope="col"
                          className=" table-th "
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                  {...getTableBodyProps}
                >
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} className="hover:bg-gray-200">
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()} className="table-td ">
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                        
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="flex space-x-2 rtl:space-x-reverse items-center">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Go</span>
            <span>
              <input
                type="number"
                className="form-control py-2"
                defaultValue={currentPageIndex + 1}
                onChange={(e) => {
                  const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                  handlePageChange(pageNumber);
                }}
                style={{ width: "50px" }}
              />
            </span>
          </span>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Page <span>{currentPageIndex + 1} of {pageOptions.length}</span>
          </span>
        </div>
        <ul className="flex items-center space-x-3 rtl:space-x-reverse">
          <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
            <button
              className={`${!canPreviousPage ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => handlePageChange(0)}
              disabled={!canPreviousPage}
            >
              <Icons icon="heroicons:chevron-double-left-solid" />
            </button>
          </li>
          <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
            <button
              className={`${!canPreviousPage ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => handlePageChange(currentPageIndex - 1)}
              disabled={!canPreviousPage}
            >
              Prev
            </button>
          </li>
          {pageOptions.map((pageIdx) => (
  <li key={pageIdx}>
    <button
      aria-current="page"
      className={`${
        pageIdx === pageIndex
          ? "bg-slate-900 dark:bg-slate-600 dark:text-slate-200 text-white font-medium"
          : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900 font-normal"
      } text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
      onClick={() => {
        handlePageChange(pageIdx);
      }}
    >
      {pageIdx + 1}
    </button>
  </li>
))}
          <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
            <button
              className={`${!hasNextPage ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => handlePageChange(currentPageIndex + 1)}
              disabled={!hasNextPage}
            >
              Next
            </button>
          </li>
          <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
            <button
              onClick={() => handlePageChange(Math.ceil(total / pageSize) - 1)}
              disabled={!hasNextPage}
              className={`${!hasNextPage ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Icons icon="heroicons:chevron-double-right-solid" />
            </button>
          </li>
        </ul>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Show</span>
          <select
            value={currentPageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="form-select py-2"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
      </Card>
    </>
  );
};


export default Orders;
