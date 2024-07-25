import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import './PlannerNav.css'; // Add or update CSS file for styling

const PlannerNav = ({ weeks }) => {
    const { id } = useParams();
    const location = useLocation();
    const currentWeek = location.pathname.split('/').pop(); // Get the current week from URL
    const [hoveredWeek, setHoveredWeek] = useState(null);

    if (!weeks || weeks.length === 0) {
        return null; // Render nothing if weeks is undefined or empty
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