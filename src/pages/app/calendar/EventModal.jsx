import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import { useForm, Controller } from "react-hook-form";
import Select from "@/components/ui/Select";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Flatpickr from "react-flatpickr";
import FormGroup from "@/components/ui/FormGroup";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import axios from "axios"; // Import axios for fetching employees

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
  const [employees, setEmployees] = useState([]); // State for storing employees

  console.log(selectedEvent?._id);

  // Form validation schema
  const FormValidationSchema = yup
    .object({
      // title: yup.string().required("Event Name is required"),
      employee: yup.string().required("Assigned Employee is required"), // New validation for employee
    })
    .required();

  // Fetch employees when the modal opens
  useEffect(() => {
    if (showModal) {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/admin/employe/get-employees`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setEmployees(response.data.employees); // Set fetched employees in state
        })
        .catch((error) => console.error("Error fetching employees:", error));
    }
  }, [showModal]);

  // Set start and end dates based on the selected event
  useEffect(() => {
    if (selectedEvent) {
      setStartDate(selectedEvent.date);
      setEndDate(selectedEvent.date);
    }
    if (event) {
      setStartDate(event.event.start);
      setEndDate(event.event.end);
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

  // Handle form submission
  const onSubmit = (data) => {
    const newEvent = {
      date: startDate.toISOString().split("T")[0], // Get date as YYYY-MM-DD
      // startTime: startDate.toISOString().split("T")[1].substring(0, 5), // Get time as HH:MM
      // endTime: endDate.toISOString().split("T")[1].substring(0, 5), // Get time as HH:MM
      startTime: startDate.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }), // Local time
      endTime: endDate.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }), // Local time
      assignedEmployeeId: data.employee, // Assuming employee ID is selected
    };

    // Check the values before submitting
    console.log(newEvent);

    onAdd(newEvent);
    toast.success("Event added successfully!");
    onClose();
  };

  const handleDelete = (id) => {
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
        axios
          .delete(
            `${process.env.REACT_APP_BASE_URL}/admin/schedule/delete-schedule/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token if necessary
              },
            }
          )
          .then((response) => {
            onDelete(id); // Call the onDelete prop to update the UI after deletion
            Swal.fire("Deleted!", "Your event has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting event:", error);
            Swal.fire(
              "Error!",
              "There was an error deleting the event.",
              "error"
            );
          });
      }
    });
  };

  return (
    <div>
      <Modal
        title={event ? "Edit Event" : "Add Event"}
        activeModal={showModal}
        onClose={onClose}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* <Textinput
            name="title"
            label="Event Name"
            type="text"
            placeholder="Enter Event Name"
            register={register}
            error={errors.title}
            defaultValue={event ? event.event.title : ""}
          /> */}

          {/* Start Date */}
          <FormGroup
            label="Start Time"
            id="start-date"
            error={errors.startDate}
          >
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <Flatpickr
                  className="text-control py-2"
                  id="start-date"
                  placeholder="yyyy, dd M"
                  value={startDate}
                  onChange={(date) => setStartDate(date[0])}
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i",
                  }}
                />
              )}
            />
          </FormGroup>

          {/* End Date */}
          <FormGroup label="End Time" id="end-date" error={errors.endDate}>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <Flatpickr
                  className="text-control py-2"
                  id="end-date"
                  placeholder="yyyy, dd M"
                  value={endDate}
                  onChange={(date) => setEndDate(date[0])}
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i",
                    minTime: startDate,
                  }}
                />
              )}
            />
          </FormGroup>

          {/* Employee Dropdown */}
          <FormGroup
            label="Assigned Employee"
            id="employee"
            error={errors.employee}
          >
            <select
              name="employee"
              {...register("employee")}
              className="w-full mt-2 p-2 border border-gray-300"
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.employeeName}
                </option>
              ))}
            </select>
          </FormGroup>

          <div className="ltr:text-right rtl:text-left space-x-3">
            {event && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleDelete(event?.event.id)}
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
    </div>
  );
};

export default EventModal;
