import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/ui/Modal";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "../table/react-tables/GlobalFilter";
import { useSelector } from "react-redux";
import Icons from "@/components/ui/Icon";
import * as XLSX from "xlsx";
import { FaMinus, FaPlus } from "react-icons/fa";
import Select from "@/components/ui/Select";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import Textinput from "@/components/ui/Textinput";
import Datepicker from "react-tailwindcss-datepicker"; // Ensure you have the date picker installed
// import "react-tailwindcss-datepicker/dist/index.css";

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
  const [value, setValue] = useState({ startDate: null, endDate: null });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const [time, setTime] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [isAnimated, setIsAnimated] = useState(false); // New state for animation

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

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
      setIsAnimated(true);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleLocationChange = (event) => {
    const selectedLocationId = event.target.value; // Get the selected location ID directly
    setSelectedLocation(selectedLocationId);
    console.log("Selected Location ID:", selectedLocationId); // Check selected location ID
    fetchData(pageIndex, pageSize, selectedLocationId); // Fetch data for the selected location
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        page: pageIndex + 1,
        limit: pageSize,
        location: selectedLocation || undefined,
        startDate: value.startDate
          ? new Date(value.startDate).toISOString()
          : undefined,
        endDate: value.endDate
          ? new Date(value.endDate).toISOString()
          : undefined,
      };

      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/${user.type}/attendence/get-attendances`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params,
        }
      );

      setUserData(response.data.attendances);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when pageIndex, pageSize, selectedLocation, or date range changes
  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, selectedLocation, value]);

  // const handleChangeStatus = async (id, newStatus) => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_BASE_URL}/admin/user/change-status/${id}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //         body: JSON.stringify({ status: newStatus }),
  //       }
  //     );
  //     if (response.ok) {
  //       setUserData((prevUsers) =>
  //         prevUsers.map((user) =>
  //           user._id === id ? { ...user, status: newStatus } : user
  //         )
  //       );
  //       toast.success("User status updated");
  //     } else {
  //       console.error("Failed to update user status");
  //       toast.error("Failed to update user status");
  //     }
  //   } catch (error) {
  //     console.error("Error updating user status:", error);
  //     toast.error("Error updating user status");
  //   }
  // };

  const openDialog = (employee, action) => {
    console.log("Dialog opened for:", employee, action);
    setSelectedEmployee(employee);
    setSelectedAction(action);
    setTime("");
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

  const handleCheckOut = async (record) => {
    const updateData = {
      checkOutTime: new Date().toISOString(), // or set it as needed
      checkOutLocationName: "Your Location Here", // Get the location appropriately
      contactNumber: "Your Contact Number Here", // Get the contact appropriately
    };

    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/admin/attendence/update-attendance/${record._id}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Check out successful!");
      fetchData(pageIndex, pageSize); // Refresh the data
    } catch (error) {
      console.error("Check out failed:", error);
      toast.error("Failed to check out.");
    }
  };

  const handleDeleteAttendance = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/admin/attendence/delete-attendance/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Attendance deleted successfully");
      fetchData(pageIndex, pageSize, selectedLocation); // Refresh the data
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete attendance");
    }
  };

  const actions = [
    // {
    //   name: "edit",
    //   icon: "heroicons:pencil-square",
    //   doit: (id) => {
    //     navigate(`/Customer-edit?id=${id}`);
    //   },
    // },
    {
      name: "Delete",
      icon: "heroicons-outline:trash",
      doit: (id) => {
        handleDeleteAttendance(id); // Call the updated function
      },
    },
    // {
    //   name: "view",
    //   icon: "heroicons-outline:eye",
    //   doit: (id) => {
    //     navigate(`/customer-view?id=${id}`);
    //   },
    // },
    // {
    //   name: "change status",
    //   icon: "heroicons-outline:refresh",
    //   doit: (id, currentStatus) => {
    //     const newStatus = currentStatus === "active" ? "inactive" : "active";
    //     handleChangeStatus(id, newStatus);
    //   },
    // },
  ];

  const COLUMNS = [
    {
      Header: "Sr no",
      accessor: "id",
      Cell: ({ row, flatRows }) => {
        return <span>{flatRows.indexOf(row) + 1}</span>;
      },
    },
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
        const initialCheckInRecords = cell.value || [];
        const [checkInRecords, setCheckInRecords] = useState(
          initialCheckInRecords
        );
        const [showModal, setShowModal] = useState(false);
        const [formData, setFormData] = useState({
          checkInTime: new Date(),
          checkInLocationName: "",
          contactNumber: "",
        });
        const attendanceId = cell.row.original._id; // Use the existing attendance ID

        const handleAddCheckIn = async () => {
          const newCheckIn = {
            checkInTime: formData.checkInTime.toISOString(), // Format the date
            checkInLocationName: formData.checkInLocationName || "N/A", // Default value if empty
            contactNumber: formData.contactNumber || "N/A", // Default value if empty
          };

          try {
            const response = await axios.put(
              `https://dashcart-backend-production.up.railway.app/api/admin/attendence/update-checkin/${attendanceId}`,
              newCheckIn,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (response.status === 200) {
              setCheckInRecords([...checkInRecords, newCheckIn]);
              setShowModal(false); // Close the modal after submission
            } else {
              console.error("Failed to update check-in");
            }
          } catch (error) {
            console.error(
              "Error updating check-in:",
              error.response?.data || error
            );
          }
        };

        return (
          <div>
            {checkInRecords.length > 0 ? (
              checkInRecords.map((record, index) => (
                <div key={index} className="mb-4">
                  <div>
                    <b>Check-In Time:</b>
                    <p className="text-green-500">
                      {new Date(record.checkInTime).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <b>Location:</b>
                    <p>{record.checkInLocationName || "N/A"}</p>
                  </div>
                  <div>
                    <b>Contact:</b>
                    <p>{record.contactNumber || "N/A"}</p>
                  </div>
                </div>
              ))
            ) : (
              <span>No check-in records</span>
            )}
            <button
              onClick={() => setShowModal(true)} // Show the modal when clicked
              className="text-white flex flex-row bg-blue-700 hover:bg-blue-500 px-2 items-center justify-center py-2 rounded-md "
            >
              <FaPlus className="mr-2" /> Add Check-In
            </button>

            {showModal && (
              <Modal
                activeModal={showModal}
                onClose={() => setShowModal(false)}
                title="Add Check-In"
              >
                <div className="space-y-4">
                  {/* Check-in Time */}
                  <label htmlFor="checkInTime" className="form-label">
                    Check-in Time
                  </label>
                  <Flatpickr
                    value={formData.checkInTime}
                    onChange={(date) =>
                      setFormData({ ...formData, checkInTime: date[0] })
                    }
                    options={{ enableTime: true, dateFormat: "Y-m-d H:i" }}
                    className="form-input"
                  />

                  {/* Check-in Location Name */}
                  <Textinput
                    label="Check-in Address"
                    type="text"
                    placeholder="Enter Check-in Address"
                    value={formData.checkInLocationName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        checkInLocationName: e.target.value,
                      })
                    }
                  />

                  {/* Contact Number */}
                  <Textinput
                    label="Contact Number"
                    type="text"
                    placeholder="Enter Contact Number"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactNumber: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Modal Buttons */}
                <div className="text-right mt-4 space-x-4">
                  <Button
                    onClick={() => setShowModal(false)}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddCheckIn}>Submit</Button>
                </div>
              </Modal>
            )}
          </div>
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
                <div className="mb-4">
                  <b>Check Out:</b> <br />{" "}
                  <p className="text-green-500">
                    {new Date(record.checkOutTime).toLocaleString()}
                  </p>
                </div>
                {/* <div>Location: {record.checkOutLocationName || "N/A"}</div> */}
                {/* <div>Contact: {record.contactNumber || "N/A"}</div> */}
              </div>
            ))}
          </div>
        ) : (
          <span>No check-out records</span>
        );
      },
    },

    {
      Header: "Created At",
      accessor: "createdAt",
      Cell: ({ cell }) => {
        return new Date(cell.value).toLocaleString();
      },
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => {
        const record = row.original; // Get the original record data

        return (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleCheckOut(record)} // Call the check-out function
              className="text-white flex flex-row bg-green-700 hover:bg-green-500 px-2 items-center justify-center py-2 rounded-md "
            >
              <FaMinus className="mr-2" />
              Check Out
            </button>
            {actions.map((action, i) => (
              <button
                key={i}
                onClick={() => action.doit(record._id, record.status)}
                className="text-white flex flex-row items-center justify-center bg-red-700 hover:bg-red-600 px-4 py-2 rounded-md"
              >
                <Icon icon={action.icon} className="mr-2 text-center text-lg" />
                {action.name}
              </button>
            ))}
          </div>
        );
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
    setPageIndex(0);
  };
  if (loading) {
    return <div>Loading Attendance...</div>;
  }

  // const handleDateRangeConfirm = () => {
  //   fetchData(pageIndex, pageSize, selectedLocation); // Fetch data for the selected date range
  //   setShowCalendar(false); // Hide calendar after confirmation
  // };

  function formatDateTime(dateTime) {
    const options = {
      day: "2-digit", // Get the day with two digits (01, 02, etc.)
      month: "2-digit", // Get the month with two digits (01, 02, etc.)
      year: "numeric", // Get the full year (e.g., 2024)
      hour: "2-digit", // Get the hour in 12-hour format
      minute: "2-digit", // Get the minutes with two digits
      hour12: true, // Display the time in 12-hour format with AM/PM
    };

    return new Date(dateTime).toLocaleString("en-GB", options);
  }

  const exportToExcel = (attendanceData) => {
    // console.log(attendanceData);
    console.log("Exporting Data:", attendanceData);
    // Store the employee reference
    try {
      const exportData = attendanceData.map((attendance) => {
        const employee = attendance.employee; // Store the employee reference here
        return {
          "Employee Name": employee ? employee.employeeName : "N/A",
          "Employee ID": employee ? employee.employeeIDNumber : "N/A",
          "Location Name": attendance.location.locationName,
          "Check-In Times": attendance.checkInRecords
            .map((record) => formatDateTime(record.checkInTime))
            .join(", "),
          "Check-Out Times": attendance.checkOutRecords
            .map((record) => formatDateTime(record.checkOutTime))
            .join(", "),
          Status: attendance.status,
          "Created At": formatDateTime(attendance.createdAt),
        };
      });
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const headerStyle = {
        fill: {
          fgColor: { rgb: "FFFF00" },
        },
        font: {
          bold: true, // Make header text bold
        },
        alignment: {
          vertical: "center",
          horizontal: "center",
        },
      };
      const range = XLSX.utils.decode_range(worksheet["!ref"]);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const headerCell = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!worksheet[headerCell]) continue;
        worksheet[headerCell].s = headerStyle;
      }
      const wrapTextStyle = { alignment: { wrapText: true } };
      Object.keys(worksheet).forEach((key) => {
        if (key.startsWith("D") || key.startsWith("E")) {
          worksheet[key].s = wrapTextStyle;
        }
      });
      const columnWidths = Object.keys(exportData[0]).map((key) => ({
        wch: Math.max(
          key.length, // Use the header length as the minimum width
          ...exportData.map((row) =>
            row[key] ? row[key].toString().length : 10
          ) // Find the max length of the data in each column
        ),
      }));
      worksheet["!cols"] = columnWidths;
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
      XLSX.writeFile(workbook, "attendance_data.xlsx");
      XLSX.utils.book_append_sheet(workbook, worksheet, "Attendances");
      XLSX.writeFile(workbook, "Attendance_Report.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
    // Prepare the data for export
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
              onChange={handleLocationChange}
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
              onClick={() => setShowCalendar(!showCalendar)}
            />

            {/* Date Range Picker */}
            {showCalendar && (
              <div className="date-range-custom2 relative">
                <Datepicker
                  value={[value.startDate, value.endDate]} // Use an array for the date picker
                  asSingle={false}
                  onChange={(dates) => {
                    setValue({ startDate: dates[0], endDate: dates[1] }); // Set start and end dates
                    // Fetch data immediately after selecting new dates
                    fetchData();
                  }}
                />
              </div>
            )}

            {/* Render attendance data */}
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul>
                {userData.map((attendance) => (
                  <li key={attendance._id}>
                    {/* {attendance.employee.employeeName} */}
                  </li>
                ))}
              </ul>
            )}
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
              onClick={() => {
                try {
                  console.log("Export button clicked");
                  console.log("Attendance Data:", userData); // Log the data being passed
                  exportToExcel(userData); // Call export function
                } catch (error) {
                  console.error("Error during export:", error);
                }
              }} // Add click handler for export
            />
          </div>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700 "
                {...getTableProps()}
              >
                <thead className="bg-gradient-to-r from-[#304352] to-[#d7d2cc] dark:bg-slate-800">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          scope="col"
                          className="table-th text-white"
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
                      <tr
                        {...row.getRowProps()}
                        className={isAnimated ? "fade-in" : ""}
                      >
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