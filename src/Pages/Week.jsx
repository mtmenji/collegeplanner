// Week.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import './Week.css';
import PlannerNav from '../Components/PlannerNav';
import usePlanner from '../Hooks/usePlanner';

const getWeekDates = (startDateStr, weekIndex) => {
    const startDate = new Date(startDateStr);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Set to Sunday of the starting week

    const weekStart = new Date(startDate);
    weekStart.setDate(weekStart.getDate() + (weekIndex - 1) * 7); // Calculate the start date of the selected week

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        weekDates.push(date);
    }
    return weekDates;
};

const Week = () => {
    const { id, weekid } = useParams();
    const { planner, loading } = usePlanner(id);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!planner) {
        return <div>Planner not found.</div>;
    }

    const weekIndex = parseInt(weekid.replace('week', ''), 10);
    const weekDates = getWeekDates(planner.startDate, weekIndex);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <div className="weekPage">
            <PlannerNav />
            <h1>{weekid} of {planner.name} Planner</h1>
            <div className="weekDates">
                {weekDates.map((date, index) => (
                    <div key={index} className="weekDate">
                        <strong>{daysOfWeek[index]}:</strong> {date.toLocaleDateString('en-US')}
                    </div>
                ))}
            </div>
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

export default Week;