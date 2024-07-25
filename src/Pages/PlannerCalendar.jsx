import React from 'react';
import { useParams } from 'react-router-dom';
import PlannerNav from '../Components/PlannerNav'; // Import PlannerNav component
import './PlannerCalendar.css';

const PlannerCalendar = () => {
    const { id } = useParams();

    return (
        <div className="plannerCalendarPage">
            <PlannerNav />
            <h1>Calendar for Planner {id}</h1>
            {/* Display calendar data here */}
            {/* Use appropriate state and effect hooks to fetch and display calendar data */}
        </div>
    );
};

export default PlannerCalendar;