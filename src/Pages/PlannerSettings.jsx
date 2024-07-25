import React from 'react';
import { useParams } from 'react-router-dom';
import PlannerNav from '../Components/PlannerNav'; // Import PlannerNav component
import './PlannerSettings.css';

const PlannerSettings = () => {
    const { id } = useParams();

    return (
        <div className="plannerSettingsPage">
            <PlannerNav />
            <h1>Settings for Planner {id}</h1>
            {/* Display settings data here */}
            {/* Use appropriate state and effect hooks to fetch and display settings data */}
        </div>
    );
};

export default PlannerSettings;