import React from 'react';
import { useParams } from 'react-router-dom';
import './Week.css';
import PlannerNav from '../Components/PlannerNav';

const Week = () => {
    const { id, weekid } = useParams();

    return (
        <div className="weekPage">
            <PlannerNav />
            <h1>{weekid} of Planner {id}</h1>
        </div>
    );
};

export default Week;