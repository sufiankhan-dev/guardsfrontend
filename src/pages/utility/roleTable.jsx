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

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <input
        type="checkbox"
        ref={resolvedRef}
        {...rest}
        className="table-checkbox"
      />
    );
  }
);

const RolePage = () => {
  const navigate = useNavigate();
  const [roleData, setRoleData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const user = useSelector((state) => state.auth.user);
  const [isAnimated, setIsAnimated] = useState(false); // New state for animation

  // Function to fetch role data
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/${user.type}/role/get-roles`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      setRoleData(response.data);
      // setIsAnimated(true); // Trigger animation after fetching data
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [user.type]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/${user.type}/role/delete-role/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Role deleted successfully");
      fetchRoles(); // Re-fetch roles after deletion
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete role");
    }
  };

  const actions = [
    {
      name: "edit",
      icon: "heroicons:pencil-square",
      doit: (id) => navigate(`/role-edit?id=${id}`),
    },
    {
      name: "delete",
      icon: "heroicons-outline:trash",
      doit: (id) => handleDelete(id),
    },
  ];

  const COLUMNS = [
    {
      Header: "Sr no",
      accessor: "id",
      Cell: ({ row, flatRows }) => <span>{flatRows.indexOf(row) + 1}</span>,
    },
    {
      Header: "Role Name",
      accessor: "name",
      Cell: ({ cell }) => <span>{cell.value}</span>,
    },
    {
      Header: "Created-At",
      accessor: "date",
      Cell: ({ cell }) => (
        <span>{new Date(cell.value).toLocaleDateString()}</span>
      ),
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => (
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
                  onClick={() => item.doit(row.original._id)}
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
      ),
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => roleData, [roleData]);

  const tableInstance = useTable(
    {
      columns,
      data,
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

  const { globalFilter, pageIndex: currentPageIndex } = state;

  const handlePageChange = (pageIndex) => {
    gotoPage(pageIndex);
    setPageIndex(pageIndex);
  };

  const handlePageSizeChange = (pageSize) => {
    setPageSize(pageSize);
    gotoPage(0); // Go to first page when page size changes
  };

  if (loading) {
    return <div>Loading roles...</div>; // Show loading indicator
  }

  return (
    <Card noborder>
      <div className="md:flex pb-6 items-center">
        <h6 className="flex-1 md:mb-0 mb-3">Roles</h6>
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
            className="btn-outline-secondary text-slate-600 dark:border-slate-700 dark:text-slate-300 font-normal btn-sm"
            iconClass="text-lg"
          />
          <Button
            icon="heroicons-outline:plus-sm"
            text="Add Role"
            className="btn-dark font-normal btn-sm"
            iconClass="text-lg"
            onClick={() => navigate("/role-add")}
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
                value={currentPageIndex + 1}
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
        {/* <ul className="flex items-center space-x-3 rtl:space-x-reverse">
          <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              <Icon icon="heroicons-outline:chevron-left" />
            </button>
          </li>
          <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
            <button
              className={`${
                !canNextPage ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              <Icon icon="heroicons-outline:chevron-right" />
            </button>
          </li>
        </ul> */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <ul className="flex items-center space-x-3 rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons-outline:chevron-left" />
              </button>
            </li>
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={`${
                  !canNextPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                <Icon icon="heroicons-outline:chevron-right" />
              </button>
            </li>
          </ul>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Show
          </span>
          <select
            value={pageSize}
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
  );
};

export default RolePage;
