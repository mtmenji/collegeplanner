import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './PlannerNav.css'; // Ensure the CSS file is updated accordingly

const PlannerNav = ({ refetch }) => {
    const { id } = useParams();
    const location = useLocation();
    const currentPath = location.pathname;
    const currentWeek = currentPath.split('/').pop(); // Get the current week from URL

    const [hoveredWeek, setHoveredWeek] = useState(null);
    const [weeks, setWeeks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

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
    }, [id, refetch]);

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

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="plannerNav">
            <button className="dropdown-toggle" onClick={toggleMenu}>
                Planner Menu <span className="dropdown-arrow">▼</span>
            </button>
            <div className={`dropdown-menu ${menuOpen ? 'show' : ''}`}>
                <Link
                    to={`/planners/${id}/calendar`}
                    className={`plannerTab ${currentPath.endsWith('calendar') ? 'active' : ''}`}
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
                    className={`plannerTab ${currentPath.endsWith('settings') ? 'active' : ''}`}
                >
                    Settings
                </Link>
            </div>
        </nav>
    );
};

export default PlannerNav;