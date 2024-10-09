import React, { useState } from "react";

const CallingTimeDialog = ({ onClose, onSubmit }) => {
  const [callingTime, setCallingTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (callingTime) {
      onSubmit(callingTime);
    }
    onClose(); // Close the dialog after submission
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded p-4">
        <h2 className="text-lg font-bold">Add Calling Time</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="callingTime" className="block mt-2">
            Calling Time:
            <input
              type="datetime-local"
              id="callingTime"
              value={callingTime}
              onChange={(e) => setCallingTime(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 mt-1 w-full"
            />
          </label>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white rounded p-2"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 bg-gray-300 text-black rounded p-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CallingTimeDialog;

// const CallingTimeDialog = ({ confirmationCallId, onClose }) => {
//   const [callingTime, setCallingTime] = useState("");

//   const handleSubmitCallingTime = async (event) => {
//     event.preventDefault();

//     const formattedTime = new Date(callingTime).toISOString();

//     const apiUrl = `${process.env.REACT_APP_BASE_URL}/admin/call/add-calling-time/${row.original._id}`;

//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({ callingTime: formattedTime }),
//       });

//       if (response.ok) {
//         // Handle successful submission, e.g., refresh data
//         onClose(); // Close the dialog
//       } else {
//         console.error("Error adding calling time:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div>
//       {/* Your dialog UI with a form to submit the calling time */}
//       <form onSubmit={handleSubmitCallingTime}>
//         <input
//           type="datetime-local"
//           value={callingTime}
//           onChange={(e) => setCallingTime(e.target.value)}
//           required
//         />
//         <button type="submit">Submit</button>
//       </form>
//       <button onClick={onClose}>Close</button>
//     </div>
//   );
// };
