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
      updatedData[index][columnName] = [
        ...(updatedData[index][columnName] || []),
        new Date().toISOString(),
      ];
      return updatedData;
    });
  };

  const handleAddNote = (index) => {
    const newNote = prompt("Enter note: ");
    if (newNote) {
      setUserData((prevData) => {
        const updatedData = [...prevData];
        updatedData[index].note = [...(updatedData[index].note || []), newNote];
        return updatedData;
      });
    }
  };

  const handleSaveChanges = async (attendanceId) => {
    const updatedAttendance = userData.find((data) => data.id === attendanceId);

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
        Cell: ({ value, rowIndex }) => (
          <div>
            {value?.length > 0
              ? value.map((time, index) => (
                  <div key={index}>{new Date(time).toLocaleTimeString()}</div>
                ))
              : "Not Checked In"}
            <button onClick={() => handleAddTime("checkInTime", rowIndex)}>
              <FaPlus />
            </button>
          </div>
        ),
      },
      {
        Header: "Check-out Time",
        accessor: "checkOutTime",
        Cell: ({ value, rowIndex }) => (
          <div>
            {value?.length > 0
              ? value.map((time, index) => (
                  <div key={index}>{new Date(time).toLocaleTimeString()}</div>
                ))
              : "Not Checked Out"}
            <button onClick={() => handleAddTime("checkOutTime", rowIndex)}>
              <FaPlus />
            </button>
          </div>
        ),
      },
      {
        Header: "Calling Times",
        accessor: "callingTimes",
        Cell: ({ value, rowIndex }) => (
          <div>
            {value?.length > 0
              ? value.map((time, index) => <div key={index}>{time}</div>)
              : "N/A"}
            <button onClick={() => handleAddTime("callingTimes", rowIndex)}>
              <FaPlus />
            </button>
          </div>
        ),
      },
      {
        Header: "Notes",
        accessor: "note",
        Cell: ({ value, rowIndex }) => (
          <div>
            {value?.length > 0
              ? value.map((note, index) => <div key={index}>{note}</div>)
              : "N/A"}
            <button onClick={() => handleAddNote(rowIndex)}>
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
          <button onClick={() => handleSaveChanges(row.original.id)}>
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
    <div>
      <h2>Attendance Data</h2>
      <select onChange={handleLocationChange} value={selectedLocation}>
        <option value="">Select Location</option>
        {locations.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {loc.locationName}
          </option>
        ))}
      </select>

      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={value.startDate || ""}
          onChange={(e) =>
            setValue((prev) => ({ ...prev, startDate: e.target.value }))
          }
        />
        <label>End Date:</label>
        <input
          type="date"
          value={value.endDate || ""}
          onChange={(e) =>
            setValue((prev) => ({ ...prev, endDate: e.target.value }))
          }
        />
        <label>Check-In Start Time:</label>
        <input
          type="datetime-local"
          value={value.checkInStart || ""}
          onChange={(e) =>
            setValue((prev) => ({ ...prev, checkInStart: e.target.value }))
          }
        />
        <label>Check-In End Time:</label>
        <input
          type="datetime-local"
          value={value.checkInEnd || ""}
          onChange={(e) =>
            setValue((prev) => ({ ...prev, checkInEnd: e.target.value }))
          }
        />
        <button onClick={fetchData}>Apply Filters</button>
      </div>

      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="text-left">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-4 py-2 font-bold text-gray-700 border-b border-gray-300"
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

      <div>
        <button onClick={() => handlePageChange(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>
        <button
          onClick={() => handlePageChange(pageOptions.length - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </button>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
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
