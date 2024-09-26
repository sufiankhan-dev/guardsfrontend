// import React, { useEffect, useState } from "react";
// import Modal from "@/components/ui/Modal";
// import Textinput from "@/components/ui/Textinput";
// import { useForm, Controller } from "react-hook-form";
// import Select from "@/components/ui/Select";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useSelector, useDispatch } from "react-redux";

// import Flatpickr from "react-flatpickr";
// import FormGroup from "@/components/ui/FormGroup";
// import Swal from "sweetalert2";
// import { toast } from "react-toastify";
// const EventModal = ({
//   showModal,
//   onClose,
//   categories,
//   selectedEvent,
//   onAdd,
//   onEdit,
//   event,
//   onDelete,
// }) => {
//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(new Date());

//   const FormValidationSchema = yup
//     .object({
//       title: yup.string().required("Event Name is required"),

//       cata: yup
//         .string()
//         .when("title", {
//           is: (title) => title.length > 0,
//           then: yup.string().required("Category is required"),

//           otherwise: yup.string().notRequired(),
//         })
//         .required("Category is required"),
//     })
//     .required();

//   useEffect(() => {
//     if (selectedEvent) {
//       setStartDate(selectedEvent.date);
//       setEndDate(selectedEvent.date);
//     }
//     if (event) {
//       setStartDate(event.event.start);
//       setEndDate(event.event.end);
//     }
//     reset(event);
//   }, [selectedEvent, event]);

//   const {
//     register,
//     control,
//     reset,
//     formState: { errors },
//     handleSubmit,
//   } = useForm({
//     resolver: yupResolver(FormValidationSchema),
//     mode: "all",
//   });

//   const onSubmit = (data) => {
//     const updatedEvent = {
//       ...event,
//       title: data.title,
//       start: startDate,
//       end: endDate,
//       allDay: false,
//       extendedProps: {
//         calendar: data.cata,
//       },
//     }; // Create the updated todo object
//     if (event) {
//       onEdit(updatedEvent);
//       toast.info("Event Updated Successfully");
//     } else {
//       onAdd({
//         title: data.title,
//         start: startDate,
//         end: endDate,
//         allDay: false,
//         extendedProps: {
//           calendar: data.cata,
//         },
//       });
//       toast.success("Event Add Successfully");
//     }

//     onClose();
//     reset();
//   };

//   const handleDelete = (id) => {
//     onClose();
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#22c55e",
//       cancelButtonColor: "#ef4444",
//       confirmButtonText: "Yes, delete it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         onDelete(id);
//         Swal.fire("Deleted!", "Your file has been deleted.", "success");
//       }
//     });
//   };
//   return (
//     <div>
//       <Modal
//         title={event ? "Edit Event" : "Add Event"}
//         activeModal={showModal}
//         onClose={onClose}
//       >
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
//           <Textinput
//             name="title"
//             label="Event Name"
//             type="text"
//             placeholder="Enter Event Name"
//             register={register}
//             error={errors.title}
//             defaultValue={event ? event.event.title : ""}
//           />

//           <FormGroup
//             label="Start Date"
//             id="default-picker"
//             error={errors.startDate}
//           >
//             <Controller
//               name="startDate"
//               control={control}
//               render={({ field }) => (
//                 <Flatpickr
//                   className="text-control py-2"
//                   id="default-picker"
//                   placeholder="yyyy, dd M"
//                   value={startDate}
//                   onChange={(date) => setStartDate(date[0])}
//                   options={{
//                     altInput: true,
//                     altFormat: "F j, Y",
//                     dateFormat: "Y-m-d",
//                   }}
//                 />
//               )}
//             />
//           </FormGroup>
//           <FormGroup
//             label="End Date"
//             id="default-picker2"
//             error={errors.endDate}
//           >
//             <Controller
//               name="endDate"
//               control={control}
//               render={({ field }) => (
//                 <Flatpickr
//                   className="text-control py-2"
//                   id="default-picker2"
//                   placeholder="yyyy, dd M"
//                   value={endDate}
//                   onChange={(date) => setEndDate(date[0])}
//                   options={{
//                     altInput: true,
//                     altFormat: "F j, Y",
//                     dateFormat: "Y-m-d",
//                   }}
//                 />
//               )}
//             />
//           </FormGroup>
//           <Select
//             label="Basic Select"
//             options={categories}
//             register={register}
//             error={errors.cata}
//             name="cata"
//           />
//           <div className="ltr:text-right rtl:text-left  space-x-3">
//             {event && (
//               <button
//                 type="button"
//                 className="btn btn-danger"
//                 onClick={() => handleDelete(event?.event.id)}
//               >
//                 Delete
//               </button>
//             )}
//             <button className="btn btn-dark  text-center">
//               {event ? "Update" : "Add"} Event
//             </button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default EventModal;
import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import { useForm, Controller } from "react-hook-form";
import Select from "@/components/ui/Select";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import Flatpickr from "react-flatpickr";
import FormGroup from "@/components/ui/FormGroup";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import axios from "axios"; // Import axios to fetch employees

const EventModal = ({
  showModal,
  onClose,
  selectedEvent,
  onAdd,
  onEdit,
  event,
  onDelete,
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [employees, setEmployees] = useState([]); // State for employees
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const FormValidationSchema = yup
    .object({
      employee: yup.string().required("Employee is required"), // Employee validation
    })
    .required();

  useEffect(() => {
    // Fetching Employees
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/admin/employe/get-employees`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Ensure response structure is correct before accessing employees
        if (response.data && response.data.employees) {
          setEmployees(
            response.data.employees.map((employee) => ({
              value: employee._id,
              label: employee.employeeName,
            }))
          );
        } else {
          toast.error("No employees found.");
        }
      } catch (error) {
        console.error("Error fetching Employees:", error);
        toast.error("Failed to fetch employees.");
      }
    };

    fetchEmployees(); // Call the fetch function

    if (selectedEvent) {
      setStartDate(selectedEvent.start);
      setEndDate(selectedEvent.end);
    }
    reset(event);
  }, [selectedEvent, event]);

  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  const onSubmit = (data) => {
    const updatedEvent = {
      ...event,
      start: startDate,
      end: endDate,
      assignedEmployee: selectedEmployee, // Add selected employee
    };

    if (event) {
      onEdit(updatedEvent);
      toast.info("Event Updated Successfully");
    } else {
      onAdd({
        start: startDate,
        end: endDate,
        assignedEmployee: selectedEmployee, // Add selected employee
      });
      toast.success("Event Added Successfully");
    }

    onClose();
    reset();
  };

  const handleDelete = (id) => {
    onClose();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  return (
    <Modal
      title={event ? "Edit Event" : "Add Event"}
      activeModal={showModal}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
        <FormGroup
          label="Start Date"
          id="start-picker"
          error={errors.startDate}
        >
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <Flatpickr
                className="text-control py-2"
                id="start-picker"
                placeholder="Select Start Date"
                value={startDate}
                onChange={(date) => setStartDate(date[0])}
                options={{
                  altInput: true,
                  altFormat: "F j, Y",
                  dateFormat: "Y-m-d",
                  enableTime: true, // Enable time selection
                  noCalendar: false,
                  dateFormat: "Y-m-d H:i",
                }}
              />
            )}
          />
        </FormGroup>

        <FormGroup label="End Date" id="end-picker" error={errors.endDate}>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <Flatpickr
                className="text-control py-2"
                id="end-picker"
                placeholder="Select End Date"
                value={endDate}
                onChange={(date) => setEndDate(date[0])}
                options={{
                  altInput: true,
                  altFormat: "F j, Y",
                  dateFormat: "Y-m-d H:i",
                  enableTime: true, // Enable time selection
                  noCalendar: false,
                }}
              />
            )}
          />
        </FormGroup>

        <Select
          label="Select Employee"
          options={employees} // Use already formatted options
          register={register}
          error={errors.employee}
          name="employee"
          onChange={(e) => setSelectedEmployee(e.target.value)} // Track selected employee
        />

        <div className="ltr:text-right rtl:text-left space-x-3">
          {event && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => handleDelete(event.id)}
            >
              Delete
            </button>
          )}
          <button className="btn btn-dark text-center">
            {event ? "Update" : "Add"} Event
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EventModal;
