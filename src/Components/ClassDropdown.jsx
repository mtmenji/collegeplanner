// components/ClassDropdown.jsx
import React, { useState } from 'react';
import ClassForm from './ClassForm';

const ClassDropdown = ({ classes, selectedClassIndex, onSelectClass, onUpdateClass }) => {
    const [classDetails, setClassDetails] = useState(classes[selectedClassIndex]);

    const handleSelectChange = (event) => {
        const index = event.target.value;
        onSelectClass(index);
        setClassDetails(classes[index]);
    };

    const handleChange = (name, value) => {
        setClassDetails({ ...classDetails, [name]: value });
    };

    const handleMeetingDayChange = (day) => {
        const meetingDays = classDetails.meetingDays.includes(day)
            ? classDetails.meetingDays.filter(d => d !== day)
            : [...classDetails.meetingDays, day];
        setClassDetails({ ...classDetails, meetingDays });
    };

    const handleSave = () => {
        onUpdateClass(selectedClassIndex, classDetails);
    };

    return (
        <div>
            <label htmlFor="class-select">Select a class: </label>
            <select id="class-select" value={selectedClassIndex} onChange={handleSelectChange}>
                {classes.map((cls, index) => (
                    <option key={index} value={index}>
                        {cls.className}
                    </option>
                ))}
            </select>

            <div>
                <h2>Class Details</h2>
                <ClassForm
                    classDetails={classDetails}
                    onChange={handleChange}
                    onMeetingDayChange={handleMeetingDayChange}
                />
                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    );
};

export default ClassDropdown;