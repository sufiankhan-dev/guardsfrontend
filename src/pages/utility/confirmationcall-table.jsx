import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";
import axios from "axios";
import { toast } from "react-toastify";
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
import { FaPlus } from "react-icons/fa";
import CallingTimeDialog from "./CallingTimeDialog";

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

const EmployeePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [callData, setCallData] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true); // Loading state

  // callData.forEach((item) => {
  //   console.log(item._id);
  // });

  const fetchData = async (pageIndex, pageSize) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/${user.type}/call/get-confirmation-calls`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            page: pageIndex + 1,
            limit: pageSize,
          },
        }
      );
      setCallData(response.data.confirmationCalls);
      // setTotal(response.data?.pagination.total);
      // setHasNextPage(response.data?.pagination.hasNextPage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // console.log(callData);

  useEffect(() => {
    fetchData(pageIndex, pageSize);
  }, [pageIndex, pageSize]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/${user.type}/delete-confirmation-call/${id}`,
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
        `${process.env.REACT_APP_BASE_URL}/admin/change-call-status/${id}`,
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
        setCallData((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, status: newStatus } : user
          )
        );
        toast.success("Call status updated");
      } else {
        console.error("Failed to update Call status");
        toast.error("Failed to update Call status");
      }
    } catch (error) {
      console.error("Error updating Call status:", error);
      toast.error("Error updating Call status");
    }
  };

  const CallingTimeCell = ({ row }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // const [callingTimes, setCallingTimes] = useState([]);
    const [selectedCallId, setSelectedCallId] = useState(null); // Store selected _id

    const handleOpenDialog = () => {
      setSelectedCallId(row.row.original._id);
      setIsDialogOpen(true);
    };

    const callingTimes = row.row.original.callingTimes || []; // Access callingTimes from the original data

    const handleCloseDialog = () => {
      setIsDialogOpen(false);
    };

    const handleSubmitCallingTime = async (callingTime) => {
      if (!selectedCallId) return;

      const formattedTime = new Date(callingTime).toISOString();
      const apiUrl = `${process.env.REACT_APP_BASE_URL}/admin/call/add-calling-time/${selectedCallId}`;

      try {
        const response = await fetch(apiUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ callingTime: formattedTime }),
        });

        if (response.ok) {
          // Refetch the data after successfully adding calling time
          fetchData(pageIndex, pageSize); // Refetch call data
          toast.success("Calling time added successfully!");
        } else {
          console.error("Error adding calling time:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    return (
      <div className="flex flex-col">
        <ul>
          {callingTimes.map((time, index) => (
            <li key={index} className="mb-2">
              <span className="font-semibold underline">Call Time:</span>
              <br />
              {new Date(time).toLocaleString()}
            </li>
          ))}
        </ul>
        <Button
          onClick={handleOpenDialog}
          className="bg-black-500 hover:bg-black-600 mt-2"
        >
          <FaPlus className="text-white" />
        </Button>

        {isDialogOpen && (
          <CallingTimeDialog
            onClose={() => setIsDialogOpen(false)}
            onSubmit={handleSubmitCallingTime}
          />
        )}
      </div>
    );
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
    {
      Header: "Sr no",
      accessor: "id",
      Cell: ({ row, flatRows }) => {
        return <span>{flatRows.indexOf(row) + 1}</span>;
      },
    },
    {
      Header: "Employee ID",
      accessor: "employee.employeeName", // Access the employee ID
      Cell: (row) => <span>{row.cell.value}</span>,
    },
    {
      Header: "Location",
      accessor: "location.locationName", // Access the location name
      Cell: (row) => <span>{row.cell.value}</span>,
    },
    {
      Header: "Address",
      accessor: "location.address", // Access the location address
      Cell: (row) => <span>{row.cell.value}</span>,
    },
    {
      Header: "Calling Time",
      accessor: "callingTime", // Access calling time
      // Cell: (row) => (
      //   <div>
      //     {new Date(row.cell.value).toLocaleString()}
      //     <Button className="bg-black-500 hover:bg-black-600">
      //       <FaPlus className="text-white" />
      //     </Button>
      //   </div>
      // ),
      Cell: (row) => <CallingTimeCell row={row} />,
    },
    // {
    //   Header: "Confirmation Call Id",
    //   accessor: "_id", // Access calling time
    //   // Cell: (row) => (
    //   //   <div>
    //   //     {new Date(row.cell.value).toLocaleString()}
    //   //     <Button className="bg-black-500 hover:bg-black-600">
    //   //       <FaPlus className="text-white" />
    //   //     </Button>
    //   //   </div>
    //   // ),
    //   Cell: (row) => <span>{row.cell.value}</span>,
    // },
    {
      Header: "Notes",
      accessor: "notes", // Access notes
      Cell: (row) => <span>{row.cell.value}</span>,
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: (row) => (
        <span className="block w-full">
          <span
            className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
              row?.cell?.value === "active"
                ? "text-success-500 bg-success-500"
                : row?.cell?.value === "inactive"
                ? "text-warning-500 bg-warning-500"
                : ""
            }`}
          >
            {row?.cell?.value}
          </span>
        </span>
      ),
    },
    {
      Header: "Created-At",
      accessor: "createdAt",
      Cell: (row) => (
        <span>{new Date(row?.cell?.value).toLocaleDateString()}</span>
      ),
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: (row) => {
        const userStatus = row.cell.row.original.status;
        const userId = row.cell.row.original._id;

        // console.log(userStatus);

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
                {actions.map((item, i) => (
                  <Menu.Item key={i}>
                    <div
                      className={`${
                        item.name === "delete"
                          ? "bg-danger-500 text-danger-500 bg-opacity-30 hover:bg-opacity-100 hover:text-white"
                          : "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50"
                      } w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex space-x-2 items-center rtl:space-x-reverse`}
                      onClick={() =>
                        item.name === "change status"
                          ? item.doit(userId, userStatus)
                          : item.doit(userId)
                      }
                    >
                      <span className="text-base">
                        <Icon icon={item.icon} />
                      </span>
                      <span>
                        {item.name === "change status"
                          ? userStatus === "active"
                            ? "inactive"
                            : "active"
                          : item.name}
                      </span>
                    </div>
                  </Menu.Item>
                ))}
              </div>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => callData, [callData]);

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
    return <div>Loading Employees...</div>; // Show loading indicator
  }

  return (
    <>
      <Card noborder>
        <div className="md:flex pb-6 items-center">
          <h6 className="flex-1 md:mb-0 mb-3">COnfirmation Call</h6>
          <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
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
              text="Add Confirmation Call"
              className="btn-dark font-normal btn-sm"
              iconClass="text-lg"
              onClick={() => {
                navigate("/confirmationcall-add");
              }}
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
                <thead className="bg-gradient-to-r from-[#304352] to-[#d7d2cc] dark:bg-slate-800">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          scope="col"
                          className="table-th text-slate-50"
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

export default EmployeePage;
