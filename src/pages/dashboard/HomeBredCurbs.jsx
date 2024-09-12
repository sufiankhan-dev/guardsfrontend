import React, { useState } from "react";
import Icon from "@/components/ui/Icon";
import dayjs from "dayjs";
import Datepicker from "react-tailwindcss-datepicker";
const HomeBredCurbs = ({ title }) => {
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });

  const handleValueChange = (newValue) => {
    setValue(newValue);
  };
  return (
    <div className="flex justify-between flex-wrap items-center mb-6">
      <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
        {title}
      </h4>
      <div className="flex sm:space-x-4 space-x-2 sm:justify-end items-center rtl:space-x-reverse">
        <div className="date-range-custom relative">
          <Datepicker
            value={value}
            inputClassName="input-class"
            containerClassName="container-class"
            onChange={handleValueChange}
          />
        </div>
        <div className="date-range-custom2 relative">
          <Datepicker
            value={value}
            asSingle={true}
            inputClassName="input-class"
            containerClassName="container-class"
            onChange={handleValueChange}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeBredCurbs;
