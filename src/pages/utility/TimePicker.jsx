import React, { useState } from "react";

const TimePickerInput = ({ label, value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    onChange(newTime); // Call the provided onChange handler
  };

  const handleTextInputChange = (e) => {
    onChange(e.target.value); // Update state on text input change
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={handleTextInputChange}
        placeholder="HH:MM"
        className="mt-1 block w-full py-2 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
        onFocus={() => setShowPicker(true)}
      />
      {showPicker && (
        <input
          type="time"
          value={value}
          onChange={handleTimeChange}
          className="absolute top-10 right-0 py-2 px-2 z-10 mt-8 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
          onBlur={() => setShowPicker(false)}
        />
      )}
    </div>
  );
};

export default TimePickerInput;
