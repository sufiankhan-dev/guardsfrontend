
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
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Card from "@/components/ui/Card";

const AttendancePage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [userData, setUserData] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    checkInStart: null,
    checkInEnd: null,
  });
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locations, setLocations] = useState([]);
 
 const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };


  // Fetch locations
  const fetchLocations = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admin/location/get-locations`,
        {
          headers: {
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

  // Fetch attendance data
 // Fetch attendance data
// Fetch attendance data
const fetchData = async () => {
  try {
    setLoading(true);

    // Validate the date range before proceeding
    if (filters.checkInStart && filters.checkInEnd) {
      const startTime = new Date(filters.checkInStart);
      const endTime = new Date(filters.checkInEnd);
      if (endTime < startTime) {
        alert("End time cannot be earlier than start time.");
        setLoading(false);
        return;
      }
    }

    const params = {
      page: pageIndex + 1,
      limit: pageSize,
      location: selectedLocation || undefined,
      startDate: filters.startDate ? new Date(filters.startDate).toISOString() : undefined,
      endDate: filters.endDate ? new Date(filters.endDate).toISOString() : undefined,
      checkInStart: filters.checkInStart
        ? new Date(filters.checkInStart).toISOString()
        : undefined,
      checkInEnd: filters.checkInEnd
        ? new Date(filters.checkInEnd).toISOString()
        : undefined,
    };

    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/${user.type}/attendence/get-attendances`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params,
      }
    );

    // Check if there are any results
    if (response.data.attendances.length === 0) {
      alert("No records found for the selected time range.");
    }

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
    setLoading(false); // Remove loading once data has been fetched
  }
};


  

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, selectedLocation, filters]);

  // Add new time or note
  const handleAddTime = (field, index) => {
    setUserData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index][field] = [...(updatedData[index][field] || []), new Date().toISOString()];
      return updatedData;
    });
  };

  const handleAddNote = (index) => {
    const newNote = prompt("Enter a note:");
    if (newNote) {
      setUserData((prevData) => {
        const updatedData = [...prevData];
        updatedData[index].note = [...(updatedData[index].note || []), newNote];
        return updatedData;
      });
    }
  };

  // Save changes to backend
  const handleSaveChanges = async (rowId) => {
    const updatedAttendance = userData.find((data) => data._id === rowId);
    if (!updatedAttendance) {
      alert("Attendance record not found.");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/admin/attendence/update-attendance/${rowId}`,
        updatedAttendance,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Attendance updated successfully!");
        fetchData(); // Refresh data after saving
      } else {
        alert("Failed to update attendance.");
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Error updating attendance.");
    }
  };

  // Table columns
  const columns = useMemo(
    () => [
      { Header: "Sr No", accessor: "id", Cell: ({ row, flatRows }) => flatRows.indexOf(row) + 1 },
      { Header: "Accounts", accessor: "location.locationName" },
      { Header: "Guards", accessor: "employee.employeeName" },
      { Header: "E.ID", accessor: "employee.employeeIDNumber" },

      { Header: "Phone", accessor: "employee.contactNumber1" },
      { Header: "Company number", accessor: "employee.contactNumber2" },

      {
        Header: "Check-in Time",
        accessor: "checkInTime",
        Cell: ({ value, row }) => (
          <div>
            {value.map((time, index) => (
              <div key={index}><b>in</b><br />{new Date(time).toLocaleTimeString()}</div>
            ))}
            <button onClick={() => handleAddTime("checkInTime", row.index)}>
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
            {value.map((time, index) => (
              <div key={index}><b>out</b><br />{new Date(time).toLocaleTimeString()}</div>
            ))}
            <button onClick={() => handleAddTime("checkOutTime", row.index)}>
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
            {value.map((time, index) => (
              <div key={index}>{new Date(time).toLocaleTimeString()}</div>
            ))}
            <button onClick={() => handleAddTime("callingTimes", row.index)}>
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
            {value.map((note, index) => (
              <div key={index}>{note}</div>
            ))}
            <button onClick={() => handleAddNote(row.index)}>
              <FaPlus />
            </button>
          </div>
        ),
      },
      { Header: "Created At", accessor: "createdAt", Cell: ({ value }) => new Date(value).toLocaleDateString() },
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
    [userData]
  );

  // Table instance
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



  const exportToExcel = async (selectedLocationName) => {
    const fileName = "AttendanceData.xlsx";
    const workbook = new ExcelJS.Workbook();
    let worksheet;
  
    try {
      // Check if the file already exists by attempting to load it
      const existingFile = await fetch(fileName);
      const arrayBuffer = await existingFile.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);
  
      // Try to get the "Attendance" worksheet
      worksheet = workbook.getWorksheet("Attendance");
    } catch (error) {
      worksheet = workbook.addWorksheet("Attendance");
  
      // Define columns
      worksheet.columns = [
        { header: "Sr No", key: "srNo", width: 10 },
        { header: "Account", key: "location", width: 20 },
        { header: "Guards", key: "employeeName", width: 20 },
        { header: "E.ID", key: "employeeIDNumber", width: 15 },
        { header: "Employee Contact", key: "employeeContact", width: 20 },
        { header: "Company Phone", key: "contactNumber2", width: 20 },
        { header: "Check-in Times", key: "checkInTimes", width: 30 },
        { header: "Check-out Times", key: "checkOutTimes", width: 30 },
        { header: "Calling Times", key: "callingTimes", width: 30 },
        { header: "Notes", key: "notes", width: 30 },
        { header: "Created At", key: "createdAt", width: 15 },
      ];
  
      // Add the title row for the location
      worksheet.mergeCells("A1:K1");
      const locationCell = worksheet.getCell("A1");
      locationCell.value = `Location: ${selectedLocationName || "All Locations"}`;
      locationCell.font = { bold: true, size: 14 };
      locationCell.alignment = { horizontal: "center", vertical: "middle" };
  
      // Add header row
      worksheet.addRow([
        "Sr No", "Account", "Guards", "E.ID", "Phone", "Company Phone",
        "Check-in Times", "Check-out Times", "Calling Times", "Notes", "Created At"
      ]);

      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "f4f5f7 " } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF000000" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });
    
  
      // Style the header row
      worksheet.getRow(2).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FF000000" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF808080" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });
    }
    
  
    // Format the time strings
    const formatTime = (timeString) => {
      if (!timeString || typeof timeString !== "string") return "";
      const match = timeString.match(/T(\d{2}:\d{2}:\d{2})/);
      if (match) timeString = match[1];
      const date = new Date(`1970-01-01T${timeString}Z`);
      return isNaN(date.getTime()) ? "" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };
  
    // Prepare data for export
    const data = userData.map((row, index) => ({
      srNo: worksheet.rowCount - 1 + index + 1, // Adjust Sr No to account for existing rows
      location: row.location?.locationName || "N/A",
      employeeName: row.employee?.employeeName || "N/A",
      employeeIDNumber: row.employee?.employeeIDNumber || "N/A",
      employeeContact: row.employee?.contactNumber1 || "N/A",
      contactNumber2: row.employee?.contactNumber2 || "N/A",
      checkInTimes: (row.checkInTime || []).map(formatTime).join(", "),
      checkOutTimes: (row.checkOutTime || []).map(formatTime).join(", "),
      callingTimes: (row.callingTimes || []).map(formatTime).join(", "),
      notes: (row.note || []).join(", "),
      createdAt: new Date(row.createdAt).toLocaleDateString(),
    }));
  
    // Add new rows
    worksheet.addRows(data);
  
    // Save the updated workbook to a file
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer], { type: "application/octet-stream" }), fileName);
    });
  };
  
  
  
  
  
  
  
  
  
  

  if (loading) return <div>Loading Attendance...</div>;
  return (
    <Card>
    <div className="overflow-x-auto mt-6 max-w-full">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        
        <div className="flex flex-col md:flex-row gap-4 md:gap-10 items-center mb-4 w-full md:w-auto">
          <h2 className="text-2xl font-bold text-gray-700 flex-1">Attendance Data</h2>
          
  
          {/* Export to Excel Button */}
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md"
            onClick={() => exportToExcel(selectedLocation?.locationName)}
          >
            Export to Excel
          </button>
  
          {/* Select Location */}
          <select
            onChange={(e) => {
              const selected = locations.find((loc) => loc._id === e.target.value);
              setSelectedLocation(selected);
            }}
            value={selectedLocation?._id || ""}
            className="bg-gray-100 px-4 py-2 rounded-md border-1 w-full md:w-auto"
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
          text="Add Attendance"
          className="btn-dark font-normal btn-sm md:absolute right-16 "
          iconClass="text-lg"
          onClick={() => {
            navigate("/attendence-add");
          }}
        />
        
  
       
      
      </div>
  
      {/* Filters Section */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Check-In Start Time */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700">Check-In Start Time:</label>
            <input
              type="datetime-local"
              value={filters.checkInStart || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, checkInStart: e.target.value }))
              }
              className="p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* Check-In End Time */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700">Check-In End Time:</label>
            <input
              type="datetime-local"
              value={filters.checkInEnd || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, checkInEnd: e.target.value }))
              }
              className="p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
  
        {/* Filter and Clear Buttons */}
        <div className="flex gap-4 mt-4 flex-wrap">
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-black-500 text-white rounded-md shadow-md hover:bg-black-700 transition w-full sm:w-auto"
          >
            Apply Filters
          </button>
          <button
            onClick={() =>
              setFilters({
                startDate: "",
                endDate: "",
                checkInStart: "",
                checkInEnd: "",
              })
            }
            className="px-4 py-2 bg-white text-gray-800 rounded-md shadow-md hover:bg-gray-400 transition w-full sm:w-auto"
          >
            Clear Filters
          </button>
        </div>
      </div>
  
      {/* Attendance Table */}
      <div className="overflow-x-auto mt-6 max-w-full">
      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700" {...getTableProps()}>
          <thead className="bg-gradient-to-r from-[#304352] to-[#d7d2cc] dark:bg-slate-800">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    scope="col"
                    className="table-th text-slate-50"
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
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
  
      {/* Pagination Section */}
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
          Page <strong>{pageIndex + 1} of {pageOptions.length}</strong>
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
    </Card>
  
  
  );
};

export default AttendancePage;
