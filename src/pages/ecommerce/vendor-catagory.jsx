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

const Vendorcatagory = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const user = useSelector((state) => state.auth.user);
    const [pageIndex, setPageIndex] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async (page = 1) => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/vendor/get-vendor-categories?page=${page}&limit=3`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserData(response.data.vendorCategories);
        setHasNextPage(response.data.pagination.hasNextPage);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData(currentPage);
  }, [currentPage]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/${user.type}/vendor/delete-vendor-category/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("User deleted successfully");
      // Refresh data after deletion
      const fetchData = async (page = 1) => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/${user.type}/vendor/get-vendor-categories?page=${page}&limit=3`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setUserData(response.data.vendorCategories);
          setHasNextPage(response.data.pagination.hasNextPage);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData(currentPage);
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const actions = [
    {
      name: "edit",
      icon: "heroicons:pencil-square",
      doit: (id) => {
        navigate(`/vender-cata-edit?id=${id}`);
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
      icon: "heroicons-outline:trash",
      doit: (id) => {
        navigate(`/brands-edit?id=${id}`);
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
      Header: "Image",
      accessor: "image",
      Cell: (row) => {
        return (
          <img
            src={row?.cell?.value}
            alt="Image"
            style={{ width: "70px", height: "auto" }}
          />
        );
      },
    },
    {
      Header: "Name",
      accessor: "name",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Vendor",
      accessor: "__v",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Description",
      accessor: "description",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Date",
      accessor: "date",
      Cell: (row) => {
        return <span>{new Date(row?.cell?.value).toLocaleDateString()}</span>;
      },
    },
    {
      Header: "action",
      accessor: "action",
      Cell: (row) => {
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
                      className={`
                        ${
                          item.name === "delete"
                            ? "bg-danger-500 text-danger-500 bg-opacity-30 hover:bg-opacity-100 hover:text-white"
                            : "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50"
                        }
                        w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex space-x-2 items-center rtl:space-x-reverse`}
                      onClick={() => item.doit(row?.cell?.row.original._id)}
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
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => userData, [userData]);

  const tableInstance = useTable(
    {
      columns,
      data,
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
    pageCount,
    setPageSize,
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
          <h6 className="flex-1 md:mb-0 mb-3">Vendor-Category</h6>
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
              text="Add New"
              className="btn-dark btn-sm"
              onClick={() => navigate("/vender-add")}
            />
          </div>
        </div>
        <div className="mb-5">
          <div className="overflow-x-auto -mx-6">
            <div className="inline-block min-w-full align-middle px-6">
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
                            {...column.getHeaderProps(column.getSortByToggleProps())}
                            scope="col"
                            className="table-th"
                          >
                            {column.render("Header")}
                            <span>
                              {column.isSorted
                                ? column.isSortedDesc
                                  ? " ▼"
                                  : " ▲"
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
                          {row.cells.map((cell) => {
                            return (
                              <td
                                {...cell.getCellProps()}
                                className="table-td"
                              >
                                {cell.render("Cell")}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default Vendorcatagory;
