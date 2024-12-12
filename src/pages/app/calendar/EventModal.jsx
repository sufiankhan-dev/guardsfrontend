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
import axios from "axios";

const EventModal = ({
  showModal,
  onClose,
  selectedEvent,
  onAdd,
  onEdit,
  event,
  onDelete,
  selectedDate, // Added selectedDate prop for date from calendar
}) => {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [employees, setEmployees] = useState([]);

  const FormValidationSchema = yup
    .object({
      // startTime: event
      //   ? yup.mixed().nullable()
      //   : yup.string().required("Start time is required"),
      // endTime: event
      //   ? yup.mixed().nullable()
      //   : yup.string().required("End time is required"),
    })
    .required();

  useEffect(() => {
    if (showModal) {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/admin/employe/get-employees`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setEmployees(response.data.employees);
        })
        .catch((error) => console.error("Error fetching employees:", error));
    }
  }, [showModal]);

  useEffect(() => {
    if (selectedEvent) {
      setStartTime(new Date(selectedEvent.startTime));
      setEndTime(new Date(selectedEvent.endTime));
    } else {
      setStartTime(selectedDate); // Set initial start time from calendar
      setEndTime(new Date(selectedDate)); // Initialize end time to the same date
    }
    reset(event);
  }, [selectedEvent, selectedDate, event]);

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
    // const formattedEvent = {
    //   date: new Date(selectedEvent).toISOString(),
    //   startTime: startTime.toLocaleString("en-US", {
    //     hour: "2-digit",
    //     minute: "2-digit",
    //     hour12: true,
    //   }),
    //   endTime: endTime.toLocaleString("en-US", {
    //     hour: "2-digit",
    //     minute: "2-digit",
    //     hour12: true,
    //   }),
    //   assignedEmployeeId: data.employee,
    // };

    const formattedEvent = {
      date: new Date(selectedEvent).toISOString(),
      assignedEmployee: data.employee,
    };

    // Only include start and end times for new events
    if (!event) {
      formattedEvent.startTime = startTime.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      formattedEvent.endTime = endTime.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    if (event) {
      axios
        .put(
          `${process.env.REACT_APP_BASE_URL}/admin/schedule/update-schedule/${event.publicId}`,
          {
            date: formattedEvent.date,
            events: [formattedEvent],
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          toast.success("Event updated successfully!");
          onEdit(response.data.schedule);
          onClose();
        })
        .catch((error) => {
          console.error("Error updating event:", error);
          toast.error("Failed to update event.");
        });
    } else {
      onAdd(formattedEvent);
      toast.success("Event added successfully!");
      onClose();
    }
  };

  const handleDelete = (id) => {
    // Directly delete the event without confirmation
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
        // Optionally, you can show a success message
        toast.success("Event Deleted Successfully!");
        // Swal.fire("Deleted!", "Your event has been deleted.", "success");
        onClose();
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
        Swal.fire("Error!", "There was an error deleting the event.", "error");
      });
  };

  const handleTimeChange = (e) => {
    setStartTime(e.target.value); // Use the passed "e" parameter
  };
  const handleTimeChnages = (e) => {
    setEndTime(e.target.value); // Use the passed "e" parameter
  };
  return (
    <Modal
      title={event ? "Edit Event" : "Add Event"}
      activeModal={showModal}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!event && (
          <>
            <FormGroup
              label="Start Time"
              id="start-time"
              error={errors.startTime}
            >
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <input
                    id="start-time"
                    className="text-control border-2 rounded-md px-2 py-2 text-base"
                    type="time" // HTML time picker
                    value={startTime} // Bind the state
                    onChange={handleTimeChange} // Update state on change
                    placeholder="Select Start Time" // Placeholder (may not show in some browsers when type="time")
                  />
                )}
              />
            </FormGroup>

            <FormGroup label="End Time" id="end-time" error={errors.endTime}>
              <Controller
                name="endTime"
                control={control}
                render={({ field }) => (
                  <input
                    type="time"
                    className="text-control py-2  border-2 rounded-md px-2"
                    placeholder="Select End Time"
                    id="end-time"
                    value={endTime}
                    onChange={handleTimeChnages}
                    options={{
                      enableTime: true,
                      noCalendar: true,
                      dateFormat: "h:i K",
                      minTime: startTime,
                    }}
                  />
                )}
              />
            </FormGroup>
          </>
        )}

        <FormGroup
          label="Assigned Employee"
          id="employee"
          error={errors.employee}
        >
          <select
            {...register("employee")}
            className="w-full mt-2 p-2 rounded-md border-2 px-2 border-gray-300"
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee.value}>
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
              onClick={() => handleDelete(event?.publicId)}
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
