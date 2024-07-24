// Week.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import './Week.css'; // Add your CSS file for styling

const Week = () => {
    const { plannerid, weekid } = useParams();
    console.log(plannerid);

    return (
        <div className="weekPage">
            <h1>Week {weekid} of Planner {plannerid}</h1>
            {/* Add additional content for the week page */}
        </div>
    );
};

export default Week;