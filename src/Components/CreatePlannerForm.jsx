import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreatePlannerForm = ({ onClose }) => {
    const { currentUser } = useAuth();
    const firestore = getFirestore();
    const navigate = useNavigate();
    const [plannerDetails, setPlannerDetails] = useState({
        name: '',
        startDate: '',
        endDate: '',
        classes: [{ className: '', courseCode: '', location: '', startTime: '12:00 AM', endTime: '12:00 AM', meetingDays: [] }]
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlannerDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleClassChange = (index, e) => {
        const { name, value } = e.target;
        const newClasses = [...plannerDetails.classes];
        newClasses[index] = {
            ...newClasses[index],
            [name]: value
        };
        setPlannerDetails(prevDetails => ({
            ...prevDetails,
            classes: newClasses
        }));
    };

    const handleMeetingDayChange = (index, day) => {
        const newClasses = [...plannerDetails.classes];
        const meetingDays = newClasses[index].meetingDays.includes(day)
            ? newClasses[index].meetingDays.filter(d => d !== day)
            : [...newClasses[index].meetingDays, day];
        newClasses[index].meetingDays = meetingDays;
        setPlannerDetails(prevDetails => ({
            ...prevDetails,
            classes: newClasses
        }));
    };

    const addClass = () => {
        setPlannerDetails(prevDetails => ({
            ...prevDetails,
            classes: [...prevDetails.classes, { className: '', courseCode: '', location: '', startTime: '12:00 AM', endTime: '12:00 AM', meetingDays: [] }]
        }));
    };

    const removeClass = (index) => {
        const newClasses = plannerDetails.classes.filter((_, i) => i !== index);
        setPlannerDetails(prevDetails => ({
            ...prevDetails,
            classes: newClasses
        }));
    };

    const createPlanner = async (e) => {
        e.preventDefault();
        const plannersCollection = collection(firestore, 'planners');
        const docRef = await addDoc(plannersCollection, {
            ...plannerDetails,
            userId: currentUser.uid,
            createdAt: new Date()
        });
        onClose();  // Close the form after submission
        navigate(`/planners/${docRef.id}`);  // Redirect to the new planner page
    };

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <form onSubmit={createPlanner} className="plannerForm">
            <div>
                <label>Name of Planner:</label>
                <input type="text" name="name" value={plannerDetails.name} onChange={handleChange} required />
            </div>
            <div>
                <label>Start Date:</label>
                <input type="date" name="startDate" value={plannerDetails.startDate} onChange={handleChange} required />
            </div>
            <div>
                <label>End Date:</label>
                <input type="date" name="endDate" value={plannerDetails.endDate} onChange={handleChange} required />
            </div>
            {plannerDetails.classes.map((cls, index) => {
                const [startHours, startMinutes] = cls.startTime.split(':').map(val => val.split(' ')[0]);
                const [endHours, endMinutes] = cls.endTime.split(':').map(val => val.split(' ')[0]);
                const startPeriod = cls.startTime.split(' ')[1];
                const endPeriod = cls.endTime.split(' ')[1];

                return (
                    <div key={index} className="class-section">
                        <h3>Class {index + 1}</h3>
                        <label>Class Name:</label>
                        <input type="text" name="className" value={cls.className} onChange={(e) => handleClassChange(index, e)} required />
                        <label>Course Code:</label>
                        <input type="text" name="courseCode" value={cls.courseCode} onChange={(e) => handleClassChange(index, e)} required />
                        <label>Location:</label>
                        <input type="text" name="location" value={cls.location} onChange={(e) => handleClassChange(index, e)} required />

                        <div>
                            <label>Start Time:</label>
                            <input
                                type="number"
                                name="startHours"
                                min="1"
                                max="12"
                                value={startHours}
                                onChange={(e) => {
                                    const value = Math.max(1, Math.min(12, e.target.value));
                                    handleClassChange(index, { target: { name: 'startTime', value: `${value}:${startMinutes} ${startPeriod}` } });
                                }}
                                required
                                placeholder="Hour"
                            />
                            :
                            <input
                                type="number"
                                name="startMinutes"
                                min="0"
                                max="59"
                                value={startMinutes}
                                onChange={(e) => {
                                    const value = Math.max(0, Math.min(59, e.target.value));
                                    handleClassChange(index, { target: { name: 'startTime', value: `${startHours}:${value} ${startPeriod}` } });
                                }}
                                required
                                placeholder="Minutes"
                            />
                            <select
                                name="startPeriod"
                                value={startPeriod}
                                onChange={(e) => handleClassChange(index, { target: { name: 'startTime', value: `${startHours}:${startMinutes} ${e.target.value}` } })}
                            >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                        </div>

                        <div>
                            <label>End Time:</label>
                            <input
                                type="number"
                                name="endHours"
                                min="1"
                                max="12"
                                value={endHours}
                                onChange={(e) => {
                                    const value = Math.max(1, Math.min(12, e.target.value));
                                    handleClassChange(index, { target: { name: 'endTime', value: `${value}:${endMinutes} ${endPeriod}` } });
                                }}
                                required
                                placeholder="Hour"
                            />
                            :
                            <input
                                type="number"
                                name="endMinutes"
                                min="0"
                                max="59"
                                value={endMinutes}
                                onChange={(e) => {
                                    const value = Math.max(0, Math.min(59, e.target.value));
                                    handleClassChange(index, { target: { name: 'endTime', value: `${endHours}:${value} ${endPeriod}` } });
                                }}
                                required
                                placeholder="Minutes"
                            />
                            <select
                                name="endPeriod"
                                value={endPeriod}
                                onChange={(e) => handleClassChange(index, { target: { name: 'endTime', value: `${endHours}:${endMinutes} ${e.target.value}` } })}
                            >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                        </div>

                        <fieldset>
                            <legend>Meeting Days:</legend>
                            {daysOfWeek.map(day => (
                                <div key={day}>
                                    <input
                                        type="checkbox"
                                        id={day}
                                        checked={cls.meetingDays.includes(day)}
                                        onChange={() => handleMeetingDayChange(index, day)}
                                    />
                                    <label htmlFor={day}>{day}</label>
                                </div>
                            ))}
                        </fieldset>
                        <button type="button" onClick={() => removeClass(index)}>Remove Class</button>
                    </div>
                );
            })}
            <button type="button" onClick={addClass}>Add Another Class</button>
            <button type="submit">Save Planner</button>
        </form>
    );
};

export default CreatePlannerForm;