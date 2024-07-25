import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import PlannerNav from '../Components/PlannerNav'; // Import PlannerNav component
import './Planner.css'; // Add or update CSS file for styling

const Planner = () => {
    const { id } = useParams();
    const firestore = getFirestore();
    const [planner, setPlanner] = useState(null);
    const [weeks, setWeeks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlanner = async () => {
            const plannerDoc = doc(firestore, 'planners', id);
            const plannerSnapshot = await getDoc(plannerDoc);
            if (plannerSnapshot.exists()) {
                const plannerData = plannerSnapshot.data();
                setPlanner(plannerData);
                calculateWeeks(plannerData.startDate, plannerData.endDate);
            }
            setLoading(false);
        };

        fetchPlanner();
    }, [id, firestore]);

    const calculateWeeks = (startDateStr, endDateStr) => {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        let currentWeekStart = new Date(startDate);
        currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay()); // Set to Sunday of the starting week

        const weeks = [];
        while (currentWeekStart <= endDate) {
            const weekEnd = new Date(currentWeekStart);
            weekEnd.setDate(weekEnd.getDate() + 6); // Set to Saturday of the current week

            weeks.push({
                weekStart: new Date(currentWeekStart),
                weekEnd: new Date(weekEnd)
            });

            // Move to the next week
            currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        }

        setWeeks(weeks);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!planner) {
        return <div>Planner not found.</div>;
    }

    return (
        <div className="plannerPage">
            <PlannerNav weeks={weeks} /> {/* Use PlannerNav component */}
            <div className="plannerContent">
                <h1>{planner.name}</h1>
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

export default Planner;