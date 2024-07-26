import React, { useState, useEffect } from 'react';
import ClassForm from './ClassForm';

const EditClassForm = ({ classes, selectedClassIndex, onSelectClass, onUpdateClass, onDeleteClass }) => {
    const [classDetails, setClassDetails] = useState(classes[selectedClassIndex] || {});

    useEffect(() => {
        setClassDetails(classes[selectedClassIndex] || {});
    }, [selectedClassIndex, classes]);

    if (!classes || classes.length === 0) {
        return <div>No classes available.</div>;
    }

    const handleSelectChange = (event) => {
        const index = event.target.value;
        onSelectClass(index);
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

    const handleDelete = () => {
        onDeleteClass(selectedClassIndex);
    };

    return (
        <div>
            <h1>Edit Class Details</h1>
            <label htmlFor="class-select">Select a class: </label>
            <select id="class-select" value={selectedClassIndex} onChange={handleSelectChange}>
                {classes.map((cls, index) => (
                    <option key={index} value={index}>
                        {cls.className}
                    </option>
                ))}
            </select>

            {classDetails && (
                <div>
                    <ClassForm
                        classDetails={classDetails}
                        onChange={handleChange}
                        onMeetingDayChange={handleMeetingDayChange}
                    />
                    <button onClick={handleSave}>Save Changes to {classDetails.courseCode}</button>
                    <button onClick={handleDelete}>Delete {classDetails.courseCode}</button>
                </div>
            )}
        </div>
    );
};

export default EditClassForm;