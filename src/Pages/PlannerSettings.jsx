// PlannerSettings.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import PlannerNav from '../Components/PlannerNav'; // Import PlannerNav component
import './PlannerSettings.css';
import usePlanner from '../Hooks/usePlanner'; // Import usePlanner hook

const PlannerSettings = () => {
    const { id } = useParams();
    const { planner, loading } = usePlanner(id);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!planner) {
        return <div>Planner not found.</div>;
    }

    return (
        <div className="plannerSettingsPage">
            <PlannerNav /> {/* Use PlannerNav component */}
            <h1>Settings for Planner {planner.name}</h1>
            <div className="plannerSettingsContent">
                <p><strong>Planner Name:</strong> {planner.name}</p>
                <p><strong>Start Date:</strong> {planner.startDate}</p>
                <p><strong>End Date:</strong> {planner.endDate}</p>
                {planner.classes && planner.classes.map((cls, index) => (
                    <div key={index}>
                        <h2>Class {index + 1}</h2>
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

export default PlannerSettings;