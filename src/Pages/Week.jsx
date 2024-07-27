import React, { useState, useEffect } from 'react';
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

const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
};

const Week = () => {
    const { id, weekid } = useParams();
    const { planner, loading } = usePlanner(id);
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => {
        setShowDetails(prev => !prev);
    };

    useEffect(() => {
        if (planner) {
            const selectedDays = planner.selectedDays || [];
            document.documentElement.style.setProperty('--columns-count', selectedDays.length + 1);
        }
    }, [planner]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!planner) {
        return <div>Planner not found.</div>;
    }

    const weekIndex = parseInt(weekid.replace('week', ''), 10);
    const weekDates = getWeekDates(planner.startDate, weekIndex);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Get selected days from planner
    const selectedDays = planner.selectedDays || [];
    const selectedDayIndices = selectedDays.map(day => daysOfWeek.indexOf(day));

    // Calculate the total number of cells
    const totalCells = selectedDayIndices.length * (planner.classes ? planner.classes.length : 0);

    return (
        <div className="weekPage">
            <PlannerNav />
            <div className={`plannerGrid ${showDetails ? 'showDetails' : 'hideDetails'}`}>
                <button className="gridHeader" onClick={toggleDetails}>
                    {showDetails ? 'Hide' : 'Show'}
                </button>
                {selectedDayIndices.map((index) => (
                    <div key={index} className="dayHeader">
                        <div className="dayName">{daysOfWeek[index]}</div>
                        <div className="dayDate">{formatDate(weekDates[index])}</div>
                    </div>
                ))}
                {planner.classes && planner.classes.map((cls, classIndex) => (
                    <React.Fragment key={classIndex}>
                        <div className="courseGrid">
                            <div className="courseCode">{cls.courseCode}</div>
                            <div className={`courseDetails ${showDetails ? 'show' : 'hide'}`}>
                                <div>{cls.className}</div>
                                <div>{cls.location}</div>
                                <div>{cls.meetingDays.join(', ')}</div>
                                <div>{cls.startTime} - {cls.endTime}</div>
                            </div>
                        </div>
                        {selectedDayIndices.map((_, dayIndex) => (
                            <div key={`${classIndex}-${dayIndex}`} className="gridCell">
                                {/* Add any content or styling for the cell here */}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Week;