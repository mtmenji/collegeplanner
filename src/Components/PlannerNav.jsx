// PlannerNav.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './PlannerNav.css'; // Add or update CSS file for styling

const PlannerNav = ({ refetch }) => { // Accept refetch as a prop
    const { id } = useParams();
    const location = useLocation();
    const currentWeek = location.pathname.split('/').pop(); // Get the current week from URL
    const [hoveredWeek, setHoveredWeek] = useState(null);
    const [weeks, setWeeks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlanner = async () => {
            const firestore = getFirestore();
            const plannerDoc = doc(firestore, 'planners', id);
            const plannerSnapshot = await getDoc(plannerDoc);
            if (plannerSnapshot.exists()) {
                const plannerData = plannerSnapshot.data();
                calculateWeeks(plannerData.startDate, plannerData.endDate);
            }
            setLoading(false);
        };

        fetchPlanner();
    }, [id, refetch]); // Include refetch in dependencies

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

    if (!weeks.length) {
        return <div>Weeks data not found.</div>;
    }

    const formatDateRange = (start, end) => {
        const options = { month: 'numeric', day: 'numeric' };
        const startDate = start.toLocaleDateString('en-US', options);
        const endDate = end.toLocaleDateString('en-US', options);
        return `${startDate} - ${endDate}`;
    };

    return (
        <nav className="plannerNav">
            <Link
                to={`/planners/${id}/calendar`}
                className={`plannerTab ${location.pathname.endsWith('calendar') ? 'active' : ''}`}
            >
                Calendar
            </Link>

            {weeks.map((week, index) => (
                <Link
                    key={index}
                    to={`/planners/${id}/week${index + 1}`}
                    className={`weekTab ${currentWeek === `week${index + 1}` ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredWeek(index)}
                    onMouseLeave={() => setHoveredWeek(null)}
                >
                    {hoveredWeek === index ? (
                        <div className='plannerNavDate'>
                            ({formatDateRange(week.weekStart, week.weekEnd)})
                        </div>
                    ) : (
                        `Week ${index + 1}`
                    )}
                </Link>
            ))}

            <Link
                to={`/planners/${id}/settings`}
                className={`plannerTab ${location.pathname.endsWith('settings') ? 'active' : ''}`}
            >
                Settings
            </Link>
        </nav>
    );
};

export default PlannerNav;