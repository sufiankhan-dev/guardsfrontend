import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import ImageBlock1 from "@/components/partials/widget/block/image-block-1";
import GroupChart1 from "@/components/partials/widget/chart/group-chart-1";
import RevenueBarChart from "@/components/partials/widget/chart/revenue-bar-chart";
import RadialsChart from "@/components/partials/widget/chart/radials";
import SelectMonth from "@/components/partials/SelectMonth";
import CompanyTable from "@/components/partials/Table/company-table";
import RecentActivity from "@/components/partials/widget/recent-activity";
import MostSales from "../../components/partials/widget/most-sales";
import RadarChart from "../../components/partials/widget/chart/radar-chart";
import HomeBredCurbs from "./HomeBredCurbs";
import axios from "axios";
import GroupChart4 from "@/components/partials/widget/chart/group-chart-4";
import { count } from "d3-array";
import { useSelector } from "react-redux";
import dashboardImg from "../../assets/images/all-img/dashboardImg.jpeg";

const Dashboard = () => {
  const [dash, setdashboard] = useState();
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/${user.type}/homepage/get-dashboard`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setdashboard(response.data.dashboard);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [user.type]);

  if (!user?.type) {
    // reload the page
    window.location.reload();
  }

  const shapeLine1 = {
    series: [
      {
        data: [800, 600, 1000, 800, 600, 1000, 800, 900],
      },
    ],
    options: {
      chart: {
        toolbar: {
          autoSelected: "pan",
          show: false,
        },
        offsetX: 0,
        offsetY: 0,
        zoom: {
          enabled: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      colors: ["#00EBFF"],
      tooltip: {
        theme: "light",
      },
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0,
        },
      },
      yaxis: {
        show: false,
      },
      fill: {
        type: "solid",
        opacity: [0.1],
      },
      legend: {
        show: false,
      },
      xaxis: {
        low: 0,
        offsetX: 0,
        offsetY: 0,
        show: false,
        labels: {
          low: 0,
          offsetX: 0,
          show: false,
        },
        axisBorder: {
          low: 0,
          offsetX: 0,
          show: false,
        },
      },
    },
  };
  const shapeLine2 = {
    series: [
      {
        data: [800, 600, 1000, 800, 600, 1000, 800, 900],
      },
    ],
    options: {
      chart: {
        toolbar: {
          autoSelected: "pan",
          show: false,
        },
        offsetX: 0,
        offsetY: 0,
        zoom: {
          enabled: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      colors: ["#FB8F65"],
      tooltip: {
        theme: "light",
      },
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0,
        },
      },
      yaxis: {
        show: false,
      },
      fill: {
        type: "solid",
        opacity: [0.1],
      },
      legend: {
        show: false,
      },
      xaxis: {
        low: 0,
        offsetX: 0,
        offsetY: 0,
        show: false,
        labels: {
          low: 0,
          offsetX: 0,
          show: false,
        },
        axisBorder: {
          low: 0,
          offsetX: 0,
          show: false,
        },
      },
    },
  };
  const shapeLine3 = {
    series: [
      {
        data: [800, 600, 1000, 800, 600, 1000, 800, 900],
      },
    ],
    options: {
      chart: {
        toolbar: {
          autoSelected: "pan",
          show: false,
        },
        offsetX: 0,
        offsetY: 0,
        zoom: {
          enabled: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      colors: ["#5743BE"],
      tooltip: {
        theme: "light",
      },
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0,
        },
      },
      yaxis: {
        show: false,
      },
      fill: {
        type: "solid",
        opacity: [0.1],
      },
      legend: {
        show: false,
      },
      xaxis: {
        low: 0,
        offsetX: 0,
        offsetY: 0,
        show: false,
        labels: {
          low: 0,
          offsetX: 0,
          show: false,
        },
        axisBorder: {
          low: 0,
          offsetX: 0,
          show: false,
        },
      },
    },
  };

  const Dashcode = [
    {
      name: shapeLine3,
      title: "Total No Of",
      count: {
        Guards: (
          <>
            <br />
            <strong>{dash?.employee || 0}</strong>{" "}
          </>
        ),
      },
      bg: "bg-gradient-to-r from-[#4E65FF] to-[#92EFFD] dark:bg-slate-800",
      icon: "heroicons-outline:user-circle",
    },
    {
      name: shapeLine2,
      title: "Total no of Active",
      count: {
        Users: (
          <>
            <br />
            <strong>{dash?.activeUsers || 0}</strong>{" "}
          </>
        ),
      },
      bg: "bg-gradient-to-r from-[#FFECD2] to-[#FCB69F] dark:bg-slate-800",
      icon: "heroicons-outline:user-group",
    },
    {
      name: shapeLine1,
      title: "Total no of",
      count: {
        Locations: (
          <>
            <br />
            <strong>{dash?.location || 0}</strong>{" "}
          </>
        ),
      },
      bg: "bg-gradient-to-r from-[#11998E] to-[#38EF7D] dark:bg-slate-800",
      icon: "heroicons:map-pin",
    },
    // {
    //   name: shapeLine3,
    //   title: "Total no of ",
    //   count: {
    //     Revenue: (
    //       <>
    //         <br />
    //         {/* <strong>{"$50,000"}</strong>{" "} */}
    //       </>
    //     ),
    //   },
    //   bg: "bg-gradient-to-r from-[#93A5CF] to-[#E4EfE9] dark:bg-slate-800",
    //   icon: "heroicons-outline:currency-dollar",
    // },
  ];

  // counts
  const counters = [
    // {
    //   name: shapeLine1,
    //   title: "Total no of product ",
    //   count: { "category" : <><br /><strong>{dash?.category || 0}</strong> </>
    // },
    //    bg: "bg-[#E5F9FF] dark:bg-slate-900	",
    //    icon: "heroicons-outline:shopping-bag",
    // },
    // {
    //   name: shapeLine2,
    //   title: "Total no of ",
    //   count: { "Brands" : <><br /><strong>{dash?.brand || 0}</strong> </>,
    // },
    // bg: "bg-[#FFEDE5] dark:bg-slate-900	",
    // icon: "heroicons-outline:gift-top",
    // },
    // {
    //   name: shapeLine3,
    //   title: "Total no of ",
    //   count: { "Order" : <><br /><strong>{dash?.order || 0}</strong> </>
    // },         bg: "bg-[#EAE5FF] dark:bg-slate-900	",
    // icon: "heroicons-outline:shopping-cart",
    // },
    // {
    //   name: shapeLine3,
    //   title: "Total No Of",
    //   count: { "Vendors" : <><br /><strong>{dash?.vendor || 0}</strong> </>
    // },         bg: "bg-[#EAE5FF] dark:bg-slate-900	",
    // icon: "heroicons-outline:truck",
    // },
    // {
    //   name: shapeLine2,
    //   title: "Total no of ",
    //   count: { "User" : <><br /><strong>{dash?.users || 0}</strong> </>,
    // },
    // bg: "bg-[#FFEDE5] dark:bg-slate-900	",
    // icon: "heroicons-outline:user-group",
    // },
    // {
    //   name: shapeLine1,
    //   title: "Total no of Properties",
    //   count: { "Products" : <><br /><strong>{dash?.products || 0}</strong> </>,
    // },
    // bg: "bg-[#E5F9FF] dark:bg-slate-900	",
    // icon: "heroicons:shopping-bag",
    // },
  ];
  console.log(counters, "jj");

  const [filterMap, setFilterMap] = useState("usa");
  return (
    <div>
      <HomeBredCurbs title="Dashboard" />
      <div className="grid grid-cols-12 gap-5 mb-5 w-full">
        {/* <div className="2xl:col-span-3 lg:col-span-4 col-span-12">
          <ImageBlock1 />
        </div> */}
        {/* <div className="2xl:col-span-12 lg:col-span-12 col-span-12">
          <Card bodyClass="p-4">
            <div className="grid md:grid-cols-3 col-span-1 gap-4">
              <GroupChart4 statistics={counters} />
            </div>
          </Card>
        </div> */}
        <div className="2xl:col-span-12 lg:col-span-12 col-span-12">
          <Card bodyClass="p-4">
            <div
              className={`grid grid-cols-${Dashcode.length} col-span-1 gap-4`}
            >
              <GroupChart4 statistics={Dashcode} />
            </div>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-8 col-span-12">
          <Card>
            <div className="legend-ring">
            <RevenueBarChart
  height={400}
  dash={{
    employee: 120,
    activeUsers: 95,
    location: 35,
  }}
/>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <Card title="Our Guards">
            <img src={dashboardImg} alt="" />
          </Card>
        </div>
        <div className="lg:col-span-8 col-span-12">
          <Card title="All Company" headerslot={<SelectMonth />} noborder>
            <CompanyTable />
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <Card title="Recent Activity" headerslot={<SelectMonth />}>
            <RecentActivity />
          </Card>
        </div>
        <div className="lg:col-span-8 col-span-12">
          <Card
            title="Most Sales"
            headerslot={
              <div className="border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded p-1 flex items-center">
                <span
                  className={` flex-1 text-sm font-normal px-3 py-1 transition-all duration-150 rounded cursor-pointer
                ${
                  filterMap === "global"
                    ? "bg-slate-900 text-white dark:bg-slate-700 dark:text-slate-300"
                    : "dark:text-slate-300"
                }  
                `}
                  onClick={() => setFilterMap("global")}
                >
                  Global
                </span>
                <span
                  className={` flex-1 text-sm font-normal px-3 py-1 rounded transition-all duration-150 cursor-pointer
                  ${
                    filterMap === "usa"
                      ? "bg-slate-900 text-white dark:bg-slate-700 dark:text-slate-300"
                      : "dark:text-slate-300"
                  }
              `}
                  onClick={() => setFilterMap("usa")}
                >
                  USA
                </span>
              </div>
            }
          >
            <MostSales filterMap={filterMap} />
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <Card title="Overview" headerslot={<SelectMonth />}>
            <RadarChart />
            <div className="bg-slate-50 dark:bg-slate-900 rounded p-4 mt-8 flex justify-between flex-wrap">
              <div className="space-y-1">
                <h4 className="text-slate-600 dark:text-slate-200 text-xs font-normal">
                  Invested amount
                </h4>
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  $8264.35
                </div>
                <div className="text-slate-500 dark:text-slate-300 text-xs font-normal">
                  +0.001.23 (0.2%)
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-slate-600 dark:text-slate-200 text-xs font-normal">
                  Invested amount
                </h4>
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  $8264.35
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-slate-600 dark:text-slate-200 text-xs font-normal">
                  Invested amount
                </h4>
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  $8264.35
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
