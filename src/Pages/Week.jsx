import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './Week.css';
import PlannerNav from '../Components/PlannerNav';

const Week = () => {
    const { id, weekid } = useParams();
    const firestore = getFirestore();
    const [weeks, setWeeks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlanner = async () => {
            const plannerDoc = doc(firestore, 'planners', id);
            const plannerSnapshot = await getDoc(plannerDoc);
            if (plannerSnapshot.exists()) {
                const plannerData = plannerSnapshot.data();
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

    return (
        <div className="weekPage">
            <PlannerNav weeks={weeks} />
            <h1>{weekid} of Planner {id}</h1>
        </div>
    );
};

export default Week;