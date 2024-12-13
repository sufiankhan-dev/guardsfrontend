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
          setSelectedLocation(response.data[0]._id);
        }
      })
      .catch((error) => console.error("Error fetching locations:", error));
  }, []);

  //event added

  useEffect(() => {
    if (selectedLocation) {
      fetchEvents(selectedLocation);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (calendarComponentRef.current) {
      const calendarApi = calendarComponentRef.current.getApi();

      const draggableElements = document.querySelectorAll(
        "#external-events .fc-event"
      );

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
            fetchEvents(selectedLocation);
          })
          .catch((error) => {
            console.error("Error adding event:", error);
          });
      });
    }
  }, [calendarEvents]);

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
        const colors = [
          "primary",
          "secondary",
          "danger",
          "info",
          "warning",
          "success",
          "dark",
        ];
        const events = response.data.map((schedule, index) => {
          const eventDate = new Date(schedule.date);
          eventDate.setHours(0, 0, 0, 0);
          const timezoneOffset = eventDate.getTimezoneOffset() * 60000;
          eventDate.setTime(eventDate.getTime() + timezoneOffset);

          const formatTime = (time) => {
            const date = new Date(`1970-01-01T${time}Z`);
            return date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          };

          const startTime = formatTime(schedule.events[0].startTime);
          const endTime = formatTime(schedule.events[0].endTime);

          return {
            date: schedule.date,
            id: schedule._id,
            title: `${schedule.events[0].assignedEmployee}`,
            start: schedule.date,
            end: schedule.date,
            classNames: [colors[index % colors.length]],
            extendedProps: {
              startTime: schedule.events[0].startTime,
              endTime: schedule.events[0].endTime,
            },
          };
        });
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
    eventDate.setHours(0, 0, 0, 0);
    const formattedDate = eventDate.toISOString();

    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/admin/schedule/create-schedule`,
        {
          locationId: selectedLocation,
          date: formattedDate,
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
        fetchEvents(selectedLocation);
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
    fetchEvents(selectedLocation);
  };

  const onEdit = (updatedSchedule) => {
    fetchEvents(selectedLocation);
  };

  if (isLoading) {
    return <LoaderCircle />;
  }

  const events = [
    { id: 1, title: "Admin", tag: "business" },
    { id: 2, title: "Employees", tag: "meeting" },
  ];

  return (
    <div className="dashcode-calender">
      <div className="grid grid-cols-12 gap-4">
        <Card className="lg:col-span-3 col-span-12">
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

          <div id="external-events" className="space-y-1.5 mt-6">
            <p className="text-sm pb-2">
              Drag and drop your event or click in the calendar
            </p>
            {events.map((event) => (
              <ExternalDraggingevent key={event.id} event={event} />
            ))}
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
              const newEvent = {
                locationId: selectedLocation,
                date: arg.event.start.toLocaleDateString().split("T")[0],
                events: [
                  {
                    startTime: arg.event.extendedProps.startTime,
                    endTime: arg.event.extendedProps.endTime,
                    assignedEmployee: assignedEmployee,
                  },
                ],
              };

              console.log("New Event Payload:", newEvent);

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
                  fetchEvents(selectedLocation);
                })
                .catch((error) => {
                  console.error(
                    "Error adding event:",
                    error.response ? error.response.data : error
                  );
                });
            }}
            initialView="dayGridMonth"
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
