import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "@/components/ui/Modal";
import TimePicker from "react-time-picker";
import { useNavigate } from "react-router-dom";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "../table/react-tables/GlobalFilter";
import { Menu } from "@headlessui/react";
import { useSelector } from "react-redux";
import Icons from "@/components/ui/Icon";
import * as XLSX from "xlsx";

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

const AttendancePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true); // Loading state
  const [showDialog, setShowDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const [time, setTime] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locations, setLocations] = useState([]);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admin/location/get-locations`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLocations(response.data);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchData = async (pageIndex, pageSize, location) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/${user.type}/attendence/get-attendances`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            page: pageIndex + 1,
            limit: pageSize,
            location: location || undefined,
          },
        }
      );
      setUserData(response.data.attendances);
      setTotal(response.data.pagination.total);
      setHasNextPage(response.data.pagination.hasNextPage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pageIndex, pageSize);
    fetchLocations();
  }, [pageIndex, pageSize]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/${user.type}/user/delete-user/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("User deleted successfully");
      fetchData(pageIndex, pageSize);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete user");
    }
  };

  const handleChangeStatus = async (id, newStatus) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/admin/user/change-status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (response.ok) {
        setUserData((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, status: newStatus } : user
          )
        );
        toast.success("User status updated");
      } else {
        console.error("Failed to update user status");
        toast.error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Error updating user status");
    }
  };

  const openDialog = (employee, action) => {
    console.log("Dialog opened for:", employee, action); // Add this to verify
    setSelectedEmployee(employee);
    setSelectedAction(action);
    setTime(""); // Reset the time picker
    setShowDialog(true);
  };

  const saveTime = () => {
    if (selectedAction === "checkIn") {
      setUserData((prev) =>
        prev.map((user) =>
          user._id === selectedEmployee._id
            ? { ...user, checkInTime: time }
            : user
        )
      );
    } else if (selectedAction === "checkOut") {
      setUserData((prev) =>
        prev.map((user) =>
          user._id === selectedEmployee._id
            ? { ...user, checkOutTime: time }
            : user
        )
      );
    }
    setShowDialog(false);
  };

  const actions = [
    {
      name: "edit",
      icon: "heroicons:pencil-square",
      doit: (id) => {
        navigate(`/Customer-edit?id=${id}`);
      },
    },
    {
      name: "delete",
      icon: "heroicons-outline:trash",
      doit: (id) => {
        handleDelete(id);
      },
    },
    {
      name: "view",
      icon: "heroicons-outline:eye",
      doit: (id) => {
        navigate(`/customer-view?id=${id}`);
      },
    },
    {
      name: "change status",
      icon: "heroicons-outline:refresh",
      doit: (id, currentStatus) => {
        const newStatus = currentStatus === "active" ? "inactive" : "active";
        handleChangeStatus(id, newStatus);
      },
    },
  ];

  const COLUMNS = [
    // {
    //   Header: "Sr no",
    //   accessor: "id",
    //   Cell: ({ row, flatRows }) => {
    //     return <span>{flatRows.indexOf(row) + 1}</span>;
    //   },
    // },
    // {
    //   Header: "Location",
    //   accessor: "location.locationName", // Make sure roleId is part of the response from the backend
    //   Cell: (row) => <span>{row?.cell?.value}</span>,
    // },
    // {
    //   Header: "Employees",
    //   accessor: "employee.employeeName", // Make sure roleId is part of the response from the backend
    //   Cell: (row) => <span>{row?.cell?.value}</span>,
    // },
    // {
    //   Header: "Check-in",
    //   accessor: "checkInTime",
    //   Cell: (row) => (
    //     <span>
    //       {row?.cell?.value ? (
    //         row.cell.value
    //       ) : (
    //         <Button
    //           className="btn-sm btn-outline border"
    //           onClick={() => openDialog(row.row.original, "checkIn")}
    //         >
    //           Check-in
    //         </Button>
    //       )}
    //     </span>
    //   ),
    // },
    // {
    //   Header: "Check-out",
    //   accessor: "checkOutTime",
    //   Cell: (row) => (
    //     <span>
    //       {row?.cell?.value ? (
    //         row.cell.value
    //       ) : (
    //         <Button
    //           className="btn-sm btn-outline border"
    //           onClick={() => openDialog(row.row.original, "checkOut")}
    //         >
    //           Check-out
    //         </Button>
    //       )}
    //     </span>
    //   ),
    // },
    // {
    //   Header: "Created-At",
    //   accessor: "createdAt",
    //   Cell: (row) => (
    //     <span>{new Date(row?.cell?.value).toLocaleDateString()}</span>
    //   ),
    // },
    // {
    //   Header: "Action",
    //   accessor: "action",
    //   Cell: (row) => {
    //     const userStatus = row.cell.row.original.status;
    //     const userId = row.cell.row.original._id;

    //     return (
    //       <div>
    //         <Dropdown
    //           classMenuItems="right-0 w-[140px] top-[110%]"
    //           label={
    //             <span className="text-xl text-center block w-full">
    //               <Icon icon="heroicons-outline:dots-vertical" />
    //             </span>
    //           }
    //         >
    //           <div className="divide-y divide-slate-100 dark:divide-slate-800">
    //             {actions.map((item, i) => (
    //               <Menu.Item key={i}>
    //                 <div
    //                   className={`${
    //                     item.name === "delete"
    //                       ? "bg-danger-500 text-danger-500 bg-opacity-30 hover:bg-opacity-100 hover:text-white"
    //                       : "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50"
    //                   } w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex space-x-2 items-center rtl:space-x-reverse`}
    //                   onClick={() =>
    //                     item.name === "change status"
    //                       ? item.doit(userId, userStatus)
    //                       : item.doit(userId)
    //                   }
    //                 >
    //                   <span className="text-base">
    //                     <Icon icon={item.icon} />
    //                   </span>
    //                   <span>
    //                     {item.name === "change status"
    //                       ? userStatus === "active"
    //                         ? "inactive"
    //                         : "active"
    //                       : item.name}
    //                   </span>
    //                 </div>
    //               </Menu.Item>
    //             ))}
    //           </div>
    //         </Dropdown>
    //       </div>
    //     );
    //   },
    // },

    {
      Header: "Employee",
      accessor: "employee",
      Cell: ({ cell }) => {
        const { employeeName, employeeIDNumber } = cell.value || {};
        return (
          <div>
            <strong>{employeeName || "N/A"}</strong>
            <div>ID: {employeeIDNumber || "N/A"}</div>
          </div>
        );
      },
    },
    {
      Header: "Location",
      accessor: "location",
      Cell: ({ cell }) => {
        const { locationName, address } = cell.value || {};
        return (
          <div>
            <strong>{locationName || "N/A"}</strong>
            <div>{address || "N/A"}</div>
          </div>
        );
      },
    },
    {
      Header: "Check In",
      accessor: "checkInRecords",
      Cell: ({ cell }) => {
        const checkInRecords = cell.value || [];
        return checkInRecords.length > 0 ? (
          <div>
            {checkInRecords.map((record) => (
              <div key={record._id}>
                <div>Time: {new Date(record.checkInTime).toLocaleString()}</div>
                <div>Location: {record.checkInLocationName || "N/A"}</div>
                <div>Contact: {record.contactNumber || "N/A"}</div>
              </div>
            ))}
          </div>
        ) : (
          <span>No check-in records</span>
        );
      },
    },
    {
      Header: "Check Out",
      accessor: "checkOutRecords",
      Cell: ({ cell }) => {
        const checkOutRecords = cell.value || [];
        return checkOutRecords.length > 0 ? (
          <div>
            {checkOutRecords.map((record) => (
              <div key={record._id}>
                <div>
                  Time: {new Date(record.checkOutTime).toLocaleString()}
                </div>
                <div>Location: {record.checkOutLocationName || "N/A"}</div>
                <div>Contact: {record.contactNumber || "N/A"}</div>
              </div>
            ))}
          </div>
        ) : (
          <span>No check-out records</span>
        );
      },
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Created At",
      accessor: "createdAt",
      Cell: ({ cell }) => {
        return new Date(cell.value).toLocaleString();
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => userData, [userData]);

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
    canPreviousPage,
    canNextPage,
    pageOptions,
    state,
    gotoPage,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const {
    globalFilter,
    pageIndex: currentPageIndex,
    pageSize: currentPageSize,
  } = state;

  const handlePageChange = (pageIndex) => {
    gotoPage(pageIndex);
    setPageIndex(pageIndex);
  };

  const handlePageSizeChange = (pageSize) => {
    setPageSize(pageSize);
    setPageIndex(0); // Reset to first page whenever page size changes
  };
  if (loading) {
    return <div>Loading Attendance...</div>; // Show loading indicator
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(userData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, "attendance_data.xlsx");
  };

  return (
    <>
      <Card noborder>
        <div className="md:flex pb-6 items-center">
          <h6 className="flex-1 md:mb-0 mb-3">Attendance</h6>
          <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                fetchData(pageIndex, pageSize, e.target.value); // Fetch data with selected location
              }}
              className="form-select py-2"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location._id} value={location._id}>
                  {location.locationName}
                </option>
              ))}
            </select>

            <Button
              icon="heroicons-outline:calendar"
              text="Select date"
              className="btn-outline-secondary dark:border-slate-700 text-slate-600 btn-sm font-normal dark:text-slate-300"
              iconClass="text-lg"
            />
            <Button
              icon="heroicons-outline:filter"
              text="Filter"
              className="btn-outline-secondary dark:border-slate-700 text-slate-600 btn-sm font-normal dark:text-slate-300"
              iconClass="text-lg"
            />
            <Button
              icon="heroicons:plus"
              text="Add attendance"
              className="btn-dark font-normal btn-sm"
              iconClass="text-lg"
              onClick={() => {
                navigate("/attendence-add");
              }}
            />
            <Button
              icon="heroicons-outline:download"
              text="Export to Excel"
              className="btn-dark font-normal btn-sm"
              iconClass="text-lg"
              onClick={exportToExcel} // Add click handler for export
            />
          </div>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps()}
              >
                <thead className="bg-slate-200 dark:bg-slate-700">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          scope="col"
                          className="table-th"
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
                  {...getTableBodyProps()}
                >
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()} className="table-td">
                            {cell.render("Cell")}
                          </td>
                        ))}
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
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Go
              </span>
              <span>
                <input
                  type="number"
                  className="form-control py-2"
                  defaultValue={currentPageIndex + 1}
                  onChange={(e) => {
                    const pageNumber = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    handlePageChange(pageNumber);
                  }}
                  style={{ width: "50px" }}
                />
              </span>
            </span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Page{" "}
              <span>
                {currentPageIndex + 1} of {pageOptions.length}
              </span>
            </span>
          </div>
          <ul className="flex items-center space-x-3 rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={`${
                  !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handlePageChange(0)}
                disabled={!canPreviousPage}
              >
                <Icons icon="heroicons:chevron-double-left-solid" />
              </button>
            </li>
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={`${
                  !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
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
                className={`${
                  !hasNextPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handlePageChange(currentPageIndex + 1)}
                disabled={!hasNextPage}
              >
                Next
              </button>
            </li>
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                onClick={() =>
                  handlePageChange(Math.ceil(total / pageSize) - 1)
                }
                disabled={!hasNextPage}
                className={`${
                  !hasNextPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Icon icon="heroicons:chevron-double-right-solid" />
              </button>
            </li>
          </ul>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Show
            </span>
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

export default AttendancePage;

// import React, { useState, useMemo, useEffect } from "react";
// import Card from "@/components/ui/Card";
// import Icon from "@/components/ui/Icon";
// import Dropdown from "@/components/ui/Dropdown";
// import Button from "@/components/ui/Button";
// import axios from "axios";
// import { toast } from "react-toastify";
// import Modal from "@/components/ui/Modal";
// // Removed TimePicker as it wasn't being used
// import { useNavigate } from "react-router-dom";
// import {
//   useTable,
//   useRowSelect,
//   useSortBy,
//   useGlobalFilter,
//   usePagination,
// } from "react-table";
// import GlobalFilter from "../table/react-tables/GlobalFilter";
// import { Menu } from "@headlessui/react";
// import { useSelector } from "react-redux";

// const AttendancePage = () => {
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState([]);
//   const [pageIndex, setPageIndex] = useState(0);
//   const [pageSize, setPageSize] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [hasNextPage, setHasNextPage] = useState(false);
//   const [locations, setLocations] = useState([]);
//   const [selectedLocation, setSelectedLocation] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [loading, setLoading] = useState(true);

//   const user = useSelector((state) => state.auth.user);

//   const fetchLocations = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_BASE_URL}/admin/location/get-locations`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setLocations(response.data);
//     } catch (error) {
//       console.error("Failed to fetch locations:", error);
//       toast.error("Error fetching locations");
//     }
//   };

//   const fetchData = async (pageIndex, pageSize, location, date) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `${process.env.REACT_APP_BASE_URL}/${user.type}/attendence/get-attendances`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           params: {
//             page: pageIndex + 1,
//             limit: pageSize,
//             location: location || undefined,
//             date: date || undefined,
//           },
//         }
//       );
//       setUserData(response.data.attendances);
//       setTotal(response.data.pagination.total);
//       setHasNextPage(response.data.pagination.hasNextPage);
//     } catch (error) {
//       console.error("Error fetching attendance data:", error);
//       toast.error("Failed to load attendance data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLocations();
//     fetchData(pageIndex, pageSize, selectedLocation, selectedDate);
//   }, [pageIndex, pageSize, selectedLocation, selectedDate]); // Added location and date to dependencies

//   const COLUMNS = [
//     {
//       Header: "Employee",
//       accessor: "employee",
//       Cell: ({ cell }) => {
//         const { employeeName, employeeIDNumber } = cell.value || {};
//         return (
//           <div>
//             <strong>{employeeName || "N/A"}</strong>
//             <div>ID: {employeeIDNumber || "N/A"}</div>
//           </div>
//         );
//       },
//     },
//     {
//       Header: "Location",
//       accessor: "location",
//       Cell: ({ cell }) => {
//         const { locationName, address } = cell.value || {};
//         return (
//           <div>
//             <strong>{locationName || "N/A"}</strong>
//             <div>{address || "N/A"}</div>
//           </div>
//         );
//       },
//     },
//     {
//       Header: "Check In",
//       accessor: "checkInRecords",
//       Cell: ({ cell }) => {
//         const checkInRecords = cell.value || [];
//         return checkInRecords.length > 0 ? (
//           <div>
//             {checkInRecords.map((record) => (
//               <div key={record._id}>
//                 <div>Time: {new Date(record.checkInTime).toLocaleString()}</div>
//                 <div>Location: {record.checkInLocationName || "N/A"}</div>
//                 <div>Contact: {record.contactNumber || "N/A"}</div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <span>No check-in records</span>
//         );
//       },
//     },
//     {
//       Header: "Check Out",
//       accessor: "checkOutRecords",
//       Cell: ({ cell }) => {
//         const checkOutRecords = cell.value || [];
//         return checkOutRecords.length > 0 ? (
//           <div>
//             {checkOutRecords.map((record) => (
//               <div key={record._id}>
//                 <div>
//                   Time: {new Date(record.checkOutTime).toLocaleString()}
//                 </div>
//                 <div>Location: {record.checkOutLocationName || "N/A"}</div>
//                 <div>Contact: {record.contactNumber || "N/A"}</div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <span>No check-out records</span>
//         );
//       },
//     },
//     {
//       Header: "Status",
//       accessor: "status",
//     },
//     {
//       Header: "Created At",
//       accessor: "createdAt",
//       Cell: ({ cell }) => {
//         return new Date(cell.value).toLocaleString();
//       },
//     },
//   ];

//   const columns = useMemo(() => COLUMNS, []);
//   const data = useMemo(() => userData, [userData]);

//   const tableInstance = useTable(
//     {
//       columns,
//       data,
//       manualPagination: true,
//       pageCount: Math.ceil(total / pageSize),
//       initialState: { pageIndex: 0, pageSize: 10 },
//     },
//     useGlobalFilter,
//     useSortBy,
//     usePagination,
//     useRowSelect
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     page,
//     nextPage,
//     previousPage,
//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     state,
//     gotoPage,
//     setGlobalFilter,
//     prepareRow,
//   } = tableInstance;

//   const {
//     globalFilter,
//     pageIndex: currentPageIndex,
//     pageSize: currentPageSize,
//   } = state;

//   const handlePageChange = (pageIndex) => {
//     gotoPage(pageIndex);
//     setPageIndex(pageIndex);
//   };

//   const handlePageSizeChange = (pageSize) => {
//     setPageSize(pageSize);
//     setPageIndex(0); // Reset to first page whenever page size changes
//   };

//   const handleDateChange = (e) => {
//     setSelectedDate(e.target.value);
//   };

//   if (loading) {
//     return <div>Loading Attendance...</div>; // Show loading indicator
//   }

//   return (
//     <>
//       <Card noborder>
//         <div className="md:flex pb-6 items-center">
//           <h6 className="flex-1 md:mb-0 mb-3">Attendance</h6>
//           <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse">
//             <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
//             <select
//               value={selectedLocation}
//               onChange={(e) => {
//                 setSelectedLocation(e.target.value);
//               }}
//               className="form-select py-2"
//             >
//               <option value="">All Locations</option>
//               {locations.map((location) => (
//                 <option key={location._id} value={location._id}>
//                   {location.locationName}
//                 </option>
//               ))}
//             </select>

//             <input
//               type="date"
//               value={selectedDate}
//               onChange={handleDateChange}
//               className="form-input py-2"
//             />

//             <Button
//               icon="heroicons:plus"
//               text="Add attendance"
//               className="btn-dark font-normal btn-sm"
//               iconClass="text-lg"
//               onClick={() => {
//                 navigate("/attendence-add");
//               }}
//             />
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table {...getTableProps()} className="table-auto w-full">
//             <thead>
//               {headerGroups.map((headerGroup) => (
//                 <tr {...headerGroup.getHeaderGroupProps()}>
//                   {headerGroup.headers.map((column) => (
//                     <th {...column.getHeaderProps()}>
//                       {column.render("Header")}
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>
//             <tbody {...getTableBodyProps()}>
//               {page.map((row) => {
//                 prepareRow(row);
//                 return (
//                   <tr {...row.getRowProps()}>
//                     {row.cells.map((cell) => {
//                       return (
//                         <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
//                       );
//                     })}
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex justify-between mt-4">
//           <Button onClick={previousPage} disabled={!canPreviousPage}>
//             Previous
//           </Button>
//           <Button onClick={nextPage} disabled={!canNextPage}>
//             Next
//           </Button>
//         </div>
//       </Card>
//     </>
//   );
// };

// export default AttendancePage;
