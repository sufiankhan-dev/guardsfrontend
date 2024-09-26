// import React, { useState, useEffect, useRef } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
// import listPlugin from "@fullcalendar/list";

// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import Checkbox from "@/components/ui/Checkbox";
// import ExternalDraggingevent from "./dragging-events";
// import EventModal from "./EventModal";

// const CalendarPage = () => {
//   const calendarComponentRef = useRef(null);

//   // Static categories and events data
//   const categoriesData = [
//     { value: "business", label: "Business", activeClass: "bg-blue-500" },
//     { value: "meeting", label: "Meeting", activeClass: "bg-green-500" },
//     { value: "holiday", label: "Holiday", activeClass: "bg-red-500" },
//     { value: "etc", label: "Etc", activeClass: "bg-yellow-500" },
//   ];

//   const eventsData = [
//     {
//       title: "Team Meeting",
//       start: "2024-09-25T10:00:00",
//       end: "2024-09-25T12:00:00",
//       extendedProps: { calendar: "meeting" },
//     },
//     {
//       title: "Holiday",
//       start: "2024-09-26",
//       end: "2024-09-27",
//       extendedProps: { calendar: "holiday" },
//     },
//   ];

//   const [calendarEvents, setCalendarEvents] = useState(eventsData);
//   const [categories, setCategories] = useState(categoriesData);
//   const [selectedCategories, setSelectedCategories] = useState(
//     categoriesData.map((c) => c.value)
//   );
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [editEvent, setEditEvent] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const events = [
//     { title: "New Event Planning", id: "1", tag: "business" },
//     { title: "Meeting", id: "2", tag: "meeting" },
//     { title: "Generating Reports", id: "3", tag: "holiday" },
//     { title: "Create New theme", id: "4", tag: "etc" },
//   ];

//   useEffect(() => {
//     const draggableEl = document.getElementById("external-events");

//     if (draggableEl) {
//       new Draggable(draggableEl, {
//         itemSelector: ".fc-event",
//         eventData: function (eventEl) {
//           const title = eventEl.getAttribute("title");
//           const id = eventEl.getAttribute("data");
//           const event = events.find((e) => e.id === id);
//           const tag = event ? event.tag : "";
//           return {
//             title,
//             id,
//             extendedProps: {
//               calendar: tag,
//             },
//           };
//         },
//       });
//     }
//   }, []);

//   const handleDateClick = (arg) => {
//     setEditEvent(null);
//     setShowModal(true);
//     setSelectedEvent(arg);
//   };

//   const handleEventClick = (arg) => {
//     setShowModal(true);
//     setEditEvent(arg);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditEvent(null);
//     setSelectedEvent(null);
//   };

//   const handleCategorySelection = (category) => {
//     if (selectedCategories.includes(category)) {
//       setSelectedCategories(selectedCategories.filter((c) => c !== category));
//     } else {
//       setSelectedCategories([...selectedCategories, category]);
//     }
//   };

//   const handleClassName = (arg) => {
//     switch (arg.event.extendedProps.calendar) {
//       case "holiday":
//         return "danger";
//       case "business":
//         return "primary";
//       case "personal":
//         return "success";
//       case "family":
//       case "etc":
//         return "info";
//       case "meeting":
//         return "warning";
//       default:
//         return "";
//     }
//   };

//   const filteredEvents = calendarEvents?.filter((event) =>
//     selectedCategories.includes(event.extendedProps.calendar)
//   );

//   return (
//     <div className="dashcode-calender">
//       <div className="grid grid-cols-12 gap-4">
//         <Card className="lg:col-span-3 col-span-12">
//           <Button
//             icon="heroicons-outline:plus"
//             text=" Add Event"
//             className="btn-dark w-full block"
//             onClick={() => setShowModal(!showModal)}
//           />
//           <div id="external-events" className=" space-y-1.5 mt-6">
//             <p className="text-sm pb-2">
//               Drag and drop your event or click in the calendar
//             </p>
//             {events.map((event) => (
//               <ExternalDraggingevent key={event.id} event={event} />
//             ))}
//           </div>

//           <div className="block py-4 text-slate-800 dark:text-slate-400 font-semibold text-xs uppercase mt-4">
//             FILTER
//           </div>
//           <ul className="space-y-2">
//             <li>
//               <Checkbox
//                 label="All"
//                 activeClass="ring-primary-500 bg-primary-500"
//                 value={selectedCategories?.length === categories?.length}
//                 onChange={() => {
//                   if (selectedCategories?.length === categories?.length) {
//                     setSelectedCategories([]);
//                   } else {
//                     setSelectedCategories(categories.map((c) => c.value));
//                   }
//                 }}
//               />
//             </li>
//             {categories?.map((category) => (
//               <li key={category.value}>
//                 <Checkbox
//                   activeClass={category.activeClass}
//                   label={category.label}
//                   value={selectedCategories.includes(category.value)}
//                   onChange={() => handleCategorySelection(category.value)}
//                 />
//               </li>
//             ))}
//           </ul>
//         </Card>
//         <Card className="lg:col-span-9 col-span-12">
//           <FullCalendar
//             plugins={[
//               dayGridPlugin,
//               timeGridPlugin,
//               interactionPlugin,
//               listPlugin,
//             ]}
//             ref={calendarComponentRef}
//             headerToolbar={{
//               left: "prev,next today",
//               center: "title",
//               right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
//             }}
//             events={filteredEvents}
//             editable={true}
//             rerenderDelay={10}
//             eventDurationEditable={false}
//             selectable={true}
//             selectMirror={true}
//             droppable={true}
//             dayMaxEvents={2}
//             weekends={true}
//             eventClassNames={handleClassName}
//             dateClick={handleDateClick}
//             eventClick={handleEventClick}
//             initialView="dayGridMonth"
//           />
//         </Card>
//       </div>
//       <EventModal
//         showModal={showModal}
//         onClose={handleCloseModal}
//         categories={categories}
//         selectedEvent={selectedEvent}
//         event={editEvent}
//       />
//     </div>
//   );
// };

// export default CalendarPage;

import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import axios from "axios";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EventModal from "./EventModal";
import { useSelector } from "react-redux";

const CalendarPage = () => {
  const user = useSelector((state) => state.auth.user);
  const calendarComponentRef = useRef(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editEvent, setEditEvent] = useState(null);

  // Fetch locations from API
  useEffect(() => {
    async function fetchLocations() {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/${user.type}/location/get-locations`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setLocations(response.data);
      setSelectedLocation(response.data[0]?._id); // default to the first location
    }
    fetchLocations();
  }, [user.type]);

  // Fetch events for the selected location
  useEffect(() => {
    if (selectedLocation) {
      fetchEvents(selectedLocation);
    }
  }, [selectedLocation]);

  const fetchEvents = async (locationId) => {
    const response = await axios.get(
      `https://dashcart-backend-production.up.railway.app/api/admin/schedule/get-schedules?locationId=${locationId}&month=9&year=2024`
    );
    const events = response.data.map((event) => ({
      id: event._id,
      title: event.events[0]?.assignedEmployee?.employeeName,
      start: event.date,
      end: event.date,
      extendedProps: { calendar: "business" },
    }));
    setCalendarEvents(events);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleDateClick = (arg) => {
    setEditEvent(null);
    setSelectedEvent(arg); // Set selected date
    setShowModal(true);
  };

  const handleEventClick = (arg) => {
    setShowModal(true);
    setEditEvent(arg.event); // get the event object
    setSelectedEvent({
      start: arg.event.start,
      end: arg.event.end,
    });
  };

  const handleCreateEvent = async (newEvent) => {
    const payload = {
      locationId: selectedLocation,
      date: newEvent.start,
      events: [
        {
          startTime: newEvent.start.toISOString(), // Ensure date is in ISO format
          endTime: newEvent.end.toISOString(),
          assignedEmployee: newEvent.assignedEmployee,
        },
      ],
    };

    const response = await axios.post(
      "https://dashcart-backend-production.up.railway.app/api/admin/schedule/create-schedule",
      payload
    );

    // Create a new event object based on the response and add it to the calendarEvents
    const createdEvent = {
      id: response.data._id, // Make sure your API returns the created event ID
      title: newEvent.assignedEmployee.employeeName, // Adjust this based on your event structure
      start: newEvent.start,
      end: newEvent.end,
      extendedProps: { calendar: "business" },
    };

    // Update calendar events state with the new event
    setCalendarEvents((prevEvents) => [...prevEvents, createdEvent]);

    // Optionally fetch events again to ensure everything is in sync
    // fetchEvents(selectedLocation);
  };

  const handleUpdateEvent = async (updatedEvent) => {
    const payload = {
      eventId: updatedEvent.id,
      date: updatedEvent.start, // Updated date for the event
      events: [
        {
          startTime: updatedEvent.start.toISOString(), // Ensure date is in ISO format
          endTime: updatedEvent.end.toISOString(),
          assignedEmployee: updatedEvent.assignedEmployee,
        },
      ],
    };

    await axios.put(
      `https://dashcart-backend-production.up.railway.app/api/admin/schedule/update-schedule/${updatedEvent.id}`,
      payload
    );
    fetchEvents(selectedLocation); // refresh calendar
  };

  return (
    <div className="dashcode-calender">
      <div className="grid grid-cols-12 gap-4">
        <Card className="lg:col-span-3 col-span-12">
          <div className="mb-4">
            <label htmlFor="location">Select Location</label>
            <select
              id="location"
              value={selectedLocation}
              onChange={handleLocationChange}
              className="block w-full p-2 border"
            >
              {locations.map((location) => (
                <option key={location._id} value={location._id}>
                  {location.locationName}
                </option>
              ))}
            </select>
          </div>

          <Button
            text="Add Event"
            className="btn-dark w-full block"
            onClick={() => {
              setEditEvent(null); // reset for a new event
              setSelectedEvent({ start: new Date(), end: new Date() }); // reset selected event for new event
              setShowModal(true);
            }}
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
            events={calendarEvents}
            editable={true}
            selectable={true}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
          />
        </Card>
      </div>

      {showModal && (
        <EventModal
          showModal={showModal}
          onClose={() => setShowModal(false)}
          onAdd={handleCreateEvent} // Handle adding events
          onEdit={handleUpdateEvent} // Handle editing events
          event={editEvent} // Pass the selected event for editing
          selectedEvent={selectedEvent} // Pass the date selected for new events
        />
      )}
    </div>
  );
};

export default CalendarPage;
