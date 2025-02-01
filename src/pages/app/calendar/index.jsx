import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import axios from "axios";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EventModal from "./EventModal";
import LoaderCircle from "@/components/Loader-circle";
import ExternalDraggingevent from "./dragging-events";
import "./../../../assets/scss/utility/_full-calender.scss";

const CalendarPage = () => {
  const calendarComponentRef = useRef(null);
  const [address, setAddress] = useState('');

  const [calendarEvents, setCalendarEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);


  const currentMonth = new Date().getMonth() + 1; // 1 for January, 12 for December
  const currentYear = new Date().getFullYear();
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/admin/location/get-locations`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setLocations(response.data);
        if (response.data.length > 0) {
          setSelectedLocation(response.data[0]._id); // Set the first location by default
        }
      })
      .catch((error) => console.error("Error fetching locations:", error));
  }, []);

  //event added

  useEffect(() => {
    if (selectedLocation) {
      // Fetch events for both the current and next month whenever the location changes
      fetchEvents(selectedLocation, currentMonth, currentYear); // Current month
      fetchEvents(selectedLocation, nextMonth, nextYear); // Next month
    }
  }, [selectedLocation]); // When location is selected or changed

  useEffect(() => {
    if (calendarComponentRef.current) {
      const calendarApi = calendarComponentRef.current.getApi();
      const draggableElements = document.querySelectorAll("#external-events .fc-event");

      draggableElements.forEach((element) => {
        new Draggable(element, {
          eventData: function (eventEl) {
            return {
              title: eventEl.innerText.trim(),
              start: new Date(),
            };
          },
        });
      });

      calendarApi.on("eventReceive", (info) => {
        console.log("Event received:", info.event);

        const newEvent = {
          title: info.event.title,
          start: info.event.start,
          end: info.event.end,
        };

        axios
          .post(
            `${process.env.REACT_APP_BASE_URL}/admin/schedule/create-schedule`,
            newEvent,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then(() => {
            fetchEvents(selectedLocation, currentMonth, currentYear); // Fetch current month data
            fetchEvents(selectedLocation, nextMonth, nextYear); // Fetch next month data
          })
          .catch((error) => {
            console.error("Error adding event:", error);
          });
      });
    }
  }, [calendarEvents]);

  const fetchEvents = (locationId, month = currentMonth, year = currentYear) => {
    setIsLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/admin/schedule/get-schedules?locationId=${locationId}&month=${month}&year=${year}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        const colors = ["primary", "secondary", "danger", "info", "warning", "success", "dark"];
  
        const events = response.data.map((schedule, index) => ({
          id: schedule._id,
          title: schedule.events.length > 0 ? schedule.events[0].assignedEmployee : "No Event",
          start: new Date(schedule.date), // Ensure date is parsed correctly
          end: new Date(schedule.date),
          classNames: [colors[index % colors.length]],
          extendedProps: {
            startTime: schedule.events.length > 0 ? schedule.events[0].startTime : "",
            endTime: schedule.events.length > 0 ? schedule.events[0].endTime : "",
          },
        }));
  
        // Instead of merging with previous events, replace the state with new events
        setCalendarEvents(events);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setIsLoading(false);
      });
  };
  
  

  const handleAddEvent = (newEvent) => {
    const eventDate = new Date(newEvent.date);  
    const utcDate = new Date(Date.UTC(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()));  
    const formattedDate = utcDate.toISOString(); // Ensures UTC storage

    axios.post(`${process.env.REACT_APP_BASE_URL}/admin/schedule/create-schedule`, 
      {
        locationId: selectedLocation,
        date: formattedDate, // ✅ Send UTC-formatted date
        events: [
          {
            startTime: newEvent.startTime,
            endTime: newEvent.endTime,
            assignedEmployee: newEvent.assignedEmployee,
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
      fetchEvents(selectedLocation, currentMonth, currentYear);
      fetchEvents(selectedLocation, nextMonth, nextYear);
    })
    .catch((error) => 
      console.error("Error adding event:", error.response ? error.response.data : error)
    );
};


  const handleDateClick = (arg) => {
    setEditEvent(null);
    setShowModal(true);
    setSelectedEvent(arg.date);
  };

  const handleEventClick = (arg) => {
    setShowModal(true);
    setEditEvent(arg.event._def);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditEvent(null);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = async (eventId) => {
    setCalendarEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    );
    fetchEvents(selectedLocation, currentMonth, currentYear); // Re-fetch after deletion
    fetchEvents(selectedLocation, nextMonth, nextYear); // Re-fetch after deletion
  };

  const onEdit = (updatedSchedule) => {
    fetchEvents(selectedLocation, currentMonth, currentYear); // Re-fetch after edit
    fetchEvents(selectedLocation, nextMonth, nextYear); // Re-fetch after edit
  };

  if (isLoading) {
    return <LoaderCircle />;
  }

  const handleLocationChange = (e) => {
    const locationId = e.target.value;
    setSelectedLocation(locationId);

    // Find the selected location
    const selectedLocationObj = locations.find((location) => location._id === locationId);

    if (selectedLocationObj) {
      // Update address and schedule
      setAddress(selectedLocationObj.address); // Assuming the location has an 'address' property
      setSchedule(selectedLocationObj.schedule || []); // Assuming the location has a 'schedule' property
    } else {
      setAddress('');
      setSchedule([]); // Clear schedule if no location is selected
    }
  };

  return (
    <div className="dashcode-calender">
      <div className="grid grid-cols-12 gap-4">
        <Card className="lg:col-span-3 col-span-12">
          <div className="mb-4">
            <label htmlFor="location-select">Select Location:</label>
            <select
        id="location-select"
        value={selectedLocation}
        onChange={handleLocationChange}
        className="w-full mt-2 p-2 border border-gray-300 mb-2"
      >
        <option value="">Select a location</option>
        {locations.map((location) => (
          <option key={location._id} value={location._id}>
            {location.locationName}
          </option>
        ))}
      </select>
      <div>
      <label htmlFor="location-select">Address</label>

        <p>{address}</p>
      </div>
          </div>

          <Button
            icon="heroicons-outline:plus"
            text=" Add Event"
            className="btn-dark w-full block"
            onClick={() => setShowModal(!showModal)}
          />

          <div id="external-events" className="space-y-1.5 mt-6">
            <p className="text-sm pb-2">
              Drag and drop your event or click in the calendar
            </p>
            <div>
          <h3>Schedule:</h3>
          {schedule.length > 0 ? (
            <ul>
              {schedule.map((item, index) => (
                <li key={index} >
                  <strong className="text-blue-400"> {item.day}:</strong>
                  <ul>
                    {item.intervals.map((interval, idx) => (
                      <li key={idx }className="mb-2">
                        <strong className="text-green-400 mb-4">Start Time:</strong> {interval.startTime} 
                        <strong className="text-red-400 mb-2"> End Time:</strong> {interval.endTime}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>No schedule available</p>
          )}
        </div>
          </div>
         
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
            eventContent={(arg) => {
              const { startTime, endTime } = arg.event.extendedProps;
              return (
                <div>
                  <div
                    style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      maxWidth: "100%",
                      lineHeight: "1.2",
                    }}
                  >
                    {arg.event.title}
                  </div>
                  <div
                    style={{
                      fontSize: "1rem",
                      color: "#ffffff",
                      textAlign: "center",
                    }}
                  >
                    {startTime} - {endTime}
                  </div>
                </div>
              );
            }}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventDrop={(arg) => {
              const assignedEmployee = arg.event.title;
              const eventDate = new Date(arg.event.start); // Get original date
              const utcDate = new Date(Date.UTC(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())); // Convert to UTC
            
              const newEvent = {
                locationId: selectedLocation,
                date: utcDate.toISOString(), // ✅ Send correct UTC date
                events: [
                  {
                    startTime: arg.event.extendedProps.startTime,
                    endTime: arg.event.extendedProps.endTime,
                    assignedEmployee: assignedEmployee,
                  },
                ],
              };
            
              axios.post(`${process.env.REACT_APP_BASE_URL}/admin/schedule/create-schedule`, newEvent, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
              .then(() => {
                fetchEvents(selectedLocation, currentMonth, currentYear);
                fetchEvents(selectedLocation, nextMonth, nextYear);
              })
              .catch((error) => {
                console.error("Error adding event:", error.response ? error.response.data : error);
              });
            }}
            
            initialView="dayGridMonth" // Shows the full month, 1-30 or 1-31
            views={{
              dayGridMonth: {
                showNonCurrentDates: false,
              },
            }}
            />
        </Card>
      </div>

      <EventModal
        showModal={showModal}
        onClose={handleCloseModal}
        onAdd={handleAddEvent}
        onEdit={onEdit}
        selectedEvent={selectedEvent}
        event={editEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
};

export default CalendarPage;
