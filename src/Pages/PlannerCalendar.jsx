// PlannerCalendar.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import PlannerNav from '../Components/PlannerNav'; // Import PlannerNav component
import './PlannerCalendar.css';
import usePlanner from '../Hooks/usePlanner';

const PlannerCalendar = () => {
    const { id } = useParams();
    const { planner, loading } = usePlanner(id);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!planner) {
        return <div>Planner not found.</div>;
    }

    return (
        <div className="plannerCalendarPage">
            <PlannerNav />
            <h1>Calendar for {planner.name} Planner</h1>
            <div className="plannerContent">
                <h2>{planner.name}</h2>
                <p><strong>Start Date:</strong> {planner.startDate}</p>
                <p><strong>End Date:</strong> {planner.endDate}</p>
                {planner.classes && planner.classes.map((cls, index) => (
                    <div key={index}>
                        <h3>Class {index + 1}</h3>
                        <p><strong>Class Name:</strong> {cls.className}</p>
                        <p><strong>Course Code:</strong> {cls.courseCode}</p>
                        <p><strong>Location:</strong> {cls.location}</p>
                        <p><strong>Meeting Time:</strong> {cls.meetingTime}</p>
                        <p><strong>Meeting Days:</strong> {cls.meetingDays}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlannerCalendar;