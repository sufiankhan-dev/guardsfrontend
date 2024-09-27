import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import axios from "axios";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import EventModal from "./EventModal";
import LoaderCircle from "@/components/Loader-circle";

const CalendarPage = () => {
  const calendarComponentRef = useRef(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Fetch available locations
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/admin/location/get-locations`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setLocations(response.data);
        console.log(response.data);
        if (response.data.length > 0) {
          setSelectedLocation(response.data[0]._id); // Default to first location
        }
      })
      .catch((error) => console.error("Error fetching locations:", error));
  }, []);

  useEffect(() => {
    // Fetch events when the location changes
    if (selectedLocation) {
      fetchEvents(selectedLocation);
    }
  }, [selectedLocation]);

  const fetchEvents = (locationId) => {
    setIsLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/admin/schedule/get-schedules?locationId=${locationId}&month=${currentMonth}&year=${currentYear}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        const events = response.data.map((schedule) => ({
          title: schedule.events[0].assignedEmployee.employeeName,
          start: schedule.date,
          end: schedule.date,
          extendedProps: {
            startTime: schedule.events[0].startTime,
            endTime: schedule.events[0].endTime,
          },
        }));
        setCalendarEvents(events);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setIsLoading(false);
      });
  };

  const handleAddEvent = (newEvent) => {
    console.log("Selected Location:", selectedLocation); // Check if locationId is present
    console.log("Event Date:", newEvent.date); // Check if date is valid
    console.log("Event Start Time:", newEvent.startTime); // Check if startTime is valid
    console.log("Event End Time:", newEvent.endTime); // Check if endTime is valid
    console.log("Assigned Employee ID:", newEvent.assignedEmployeeId);
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/admin/schedule/create-schedule`,
        {
          locationId: selectedLocation,
          date: newEvent.date,
          events: [
            {
              startTime: newEvent.startTime,
              endTime: newEvent.endTime,
              assignedEmployee: newEvent.assignedEmployeeId,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      .then(() => {
        fetchEvents(selectedLocation); // Refresh events after adding
      })
      .catch((error) =>
        console.error(
          "Error adding event:",
          error.response ? error.response.data : error
        )
      );
  };

  const handleDateClick = (arg) => {
    setEditEvent(null);
    setShowModal(true);
    setSelectedEvent(arg);
  };

  const handleEventClick = (arg) => {
    setShowModal(true);
    setEditEvent(arg);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditEvent(null);
    setSelectedEvent(null);
  };

  if (isLoading) {
    return <LoaderCircle />;
  }

  return (
    <div className="dashcode-calender">
      <div className="grid grid-cols-12 gap-4">
        <Card className="lg:col-span-3 col-span-12">
          {/* Location Dropdown */}
          <div className="mb-4">
            <label htmlFor="location-select">Select Location:</label>
            <select
              id="location-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300"
            >
              {locations.map((location) => (
                <option key={location._id} value={location._id}>
                  {location.locationName}
                </option>
              ))}
            </select>
          </div>

          <Button
            icon="heroicons-outline:plus"
            text=" Add Event"
            className="btn-dark w-full block"
            onClick={() => setShowModal(!showModal)}
          />
        </Card>

        <Card className="lg:col-span-9 col-span-12">
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            ref={calendarComponentRef}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            events={calendarEvents}
            editable={true}
            selectable={true}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            initialView="dayGridMonth"
          />
        </Card>
      </div>

      <EventModal
        showModal={showModal}
        onClose={handleCloseModal}
        onAdd={handleAddEvent}
        selectedEvent={selectedEvent}
        event={editEvent}
      />
    </div>
  );
};

export default CalendarPage;
