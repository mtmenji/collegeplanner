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
    const weekNum = 'Week ' + weekIndex;
    const weekDates = getWeekDates(planner.startDate, weekIndex);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <div className="weekPage">
            <PlannerNav />
            <h1>{weekNum} of {planner.name} Planner</h1>
            <div className="plannerGrid">
                <div className="gridHeader">{weekNum}</div>
                {daysOfWeek.map((day, index) => (
                    <div key={index} className="gridHeader">{day}</div>
                ))}
                {planner.classes && planner.classes.map((cls, index) => (
                    <div key={index} className="courseGrid">
                        <div className="courseCode">{cls.courseCode}</div>
                        <div className="courseDetails">
                            <div>{cls.className}</div>
                            <div>{cls.location}</div>
                            <div>{cls.meetingDays} {cls.startTime}-{cls.endTime}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Week;