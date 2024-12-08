import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  useTable,
  usePagination,
  useSortBy,
  useGlobalFilter,
  useRowSelect,
} from "react-table";
import { FaPlus } from "react-icons/fa";
import Button from "@/components/ui/Button";

const AttendancePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
    checkInStart: null,
    checkInEnd: null,
  });
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
        checkInStart: value.checkInStart
          ? new Date(value.checkInStart).toISOString()
          : undefined,
        checkInEnd: value.checkInEnd
          ? new Date(value.checkInEnd).toISOString()
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

      const updatedData = response.data.attendances.map((attendance) => ({
        ...attendance,
        checkInTime: attendance.checkInTime || [],
        checkOutTime: attendance.checkOutTime || [],
        callingTimes: attendance.callingTimes || [],
        note: attendance.note || [],
      }));

      setUserData(updatedData);
      setTotal(response.data.total);
      setHasNextPage(response.data.hasNextPage);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, selectedLocation, value]);

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleAddTime = (columnName, index) => {
    setUserData((prevData) => {
      const updatedData = [...prevData];
      if (!updatedData[index][columnName]) {
        updatedData[index][columnName] = [];
      }
      updatedData[index][columnName].push(new Date().toISOString());
      return updatedData;
    });
  };

  const handleAddNote = (index) => {
    const newNote = prompt("Enter a note:");
    if (newNote) {
      setUserData((prevData) => {
        const updatedData = [...prevData];
        if (!updatedData[index].note) {
          updatedData[index].note = [];
        }
        updatedData[index].note.push(newNote);
        return updatedData;
      });
    }
  };

  const handleSaveChanges = async (attendanceId) => {
    console.log("Received attendanceId:", attendanceId); // Debugging
    const updatedAttendance = userData.find(
      (data) => data._id === attendanceId
    );
    console.log("Updated Attendance Data:", updatedAttendance); // Debugging

    if (!updatedAttendance) {
      alert("Attendance not found!");
      return;
    }

    const payload = {
      checkInTime: updatedAttendance.checkInTime || [],
      checkOutTime: updatedAttendance.checkOutTime || [],
      callingTimes: updatedAttendance.callingTimes || [],
      note: updatedAttendance.note || [],
      location: updatedAttendance.location,
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/admin/attendence/update-attendance/${attendanceId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Server response:", response); // Debugging

      if (response.status === 200) {
        alert("Attendance updated successfully!");
        fetchData();
      } else {
        alert("Failed to update attendance.");
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Failed to update attendance!");
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Sr no",
        accessor: "id",
        Cell: ({ row, flatRows }) => <span>{flatRows.indexOf(row) + 1}</span>,
      },
      {
        Header: "Employee Name",
        accessor: "employee.employeeName",
        Cell: ({ value }) => <span>{value}</span>,
      },
      {
        Header: "Employee Contact",
        accessor: "employee.contactNumber1",
        Cell: ({ value }) => <span>{value}</span>,
      },
      {
        Header: "Location",
        accessor: "location.locationName",
        Cell: ({ value }) => <span>{value}</span>,
      },
      {
        Header: "Check-in Time",
        accessor: "checkInTime",
        Cell: ({ value, row }) => (
          <div>
            {value?.length > 0
              ? value.map((time, index) => (
                  <div key={index}>{new Date(time).toLocaleTimeString()}</div>
                ))
              : "Not Checked In"}
            <button
              className="ml-2 text-blue-500"
              onClick={() => handleAddTime("checkInTime", row.index)}
            >
              <FaPlus />
            </button>
          </div>
        ),
      },
      {
        Header: "Check-out Time",
        accessor: "checkOutTime",
        Cell: ({ value, row }) => (
          <div>
            {value?.length > 0
              ? value.map((time, index) => (
                  <div key={index}>{new Date(time).toLocaleTimeString()}</div>
                ))
              : "Not Checked Out"}
            <button
              className="ml-2 text-blue-500"
              onClick={() => handleAddTime("checkOutTime", row.index)}
            >
              <FaPlus />
            </button>
          </div>
        ),
      },
      {
        Header: "Calling Times",
        accessor: "callingTimes",
        Cell: ({ value, row }) => (
          <div>
            {value?.length > 0
              ? value.map((time, index) => <div key={index}>{time}</div>)
              : "N/A"}
            <button
              className="ml-2 text-blue-500"
              onClick={() => handleAddTime("callingTimes", row.index)}
            >
              <FaPlus />
            </button>
          </div>
        ),
      },
      {
        Header: "Notes",
        accessor: "note",
        Cell: ({ value, row }) => (
          <div>
            {value?.length > 0
              ? value.map((note, index) => <div key={index}>{note}</div>)
              : "N/A"}
            <button
              className="ml-2 text-blue-500"
              onClick={() => handleAddNote(row.index)}
            >
              <FaPlus />
            </button>
          </div>
        ),
      },
      {
        Header: "Created At",
        accessor: "createdAt",
        Cell: ({ value }) => (
          <span>{new Date(value).toLocaleDateString() || "N/A"}</span>
        ),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <button
            className="px-2 py-1 bg-green-500 text-white rounded-md"
            onClick={() => handleSaveChanges(row.original._id)}
          >
            Save
          </button>
        ),
      },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data: userData,
      manualPagination: true,
      pageCount: Math.ceil(total / pageSize),
      initialState: { pageIndex },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
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
    gotoPage,
    setGlobalFilter,
    prepareRow,
    pageOptions,
  } = tableInstance;

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

  return (
    <div className="min-h-screen bg-white rounded-md shadow-md p-6">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-x-10 items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">Attendance Data</h2>
          <select
            onChange={handleLocationChange}
            value={selectedLocation}
            className="bg-gray-100 px-2 py-2 rounded-md border-1"
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc._id}>
                {loc.locationName}
              </option>
            ))}
          </select>
        </div>
        <Button
          icon="heroicons:plus"
          text="Add Attendence"
          className="btn-dark font-normal btn-sm absolute right-16 top-28"
          iconClass="text-lg"
          onClick={() => {
            navigate("/attendence-add");
          }}
        />
      </div>
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700">
              Start Date:
            </label>
            <input
              type="date"
              placeholder="YYYY-MM-DD"
              value={value.startDate || ""}
              onChange={(e) =>
                setValue((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700">
              End Date:
            </label>
            <input
              type="date"
              placeholder="YYYY-MM-DD"
              value={value.endDate || ""}
              onChange={(e) =>
                setValue((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700">
              Check-In Start Time:
            </label>
            <input
              type="datetime-local"
              placeholder="YYYY-MM-DDTHH:MM"
              value={value.checkInStart || ""}
              onChange={(e) =>
                setValue((prev) => ({ ...prev, checkInStart: e.target.value }))
              }
              className="p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700">
              Check-In End Time:
            </label>
            <input
              type="datetime-local"
              placeholder="YYYY-MM-DDTHH:MM"
              value={value.checkInEnd || ""}
              onChange={(e) =>
                setValue((prev) => ({ ...prev, checkInEnd: e.target.value }))
              }
              className="p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-black-500 text-white rounded-md shadow-md hover:bg-black-700 transition"
          >
            Apply Filters
          </button>
          <button
            onClick={() =>
              setValue({
                startDate: "",
                endDate: "",
                checkInStart: "",
                checkInEnd: "",
              })
            }
            className="px-4 py-2 bg-white text-gray-800 rounded-md shadow-md hover:bg-gray-400 transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <table
        {...getTableProps()}
        className="table-auto w-full mt-6 border border-gray-300 shadow-md rounded-lg"
      >
        <thead className="bg-gradient-to-r from-[#304352] to-[#d7d2cc] dark:bg-slate-800">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="text-left">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="table-th text-slate-50"
                >
                  {column.render("Header")}
                  {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="bg-white">
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className="hover:bg-gray-50 transition duration-200"
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="px-4 py-2 text-gray-600 border-b border-gray-300"
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-4 flex flex-wrap items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(0)}
            disabled={!canPreviousPage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:bg-gray-300"
          >
            {"<<"}
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:bg-gray-300"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(pageOptions.length - 1)}
            disabled={!canNextPage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:bg-gray-300"
          >
            {">>"}
          </button>
        </div>
        <span className="text-gray-700 font-medium">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none"
        >
          {[10, 20, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AttendancePage;
