import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import './PlannerNav.css'; // Add or update CSS file for styling

const PlannerNav = ({ weeks }) => {
    const { id } = useParams();
    const location = useLocation();
    const currentWeek = location.pathname.split('/').pop(); // Get the current week from URL

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
            {weeks.map((week, index) => (
                <Link
                    key={index}
                    to={`/planners/${id}/week${index + 1}`}
                    className={`weekTab ${currentWeek === `week${index + 1}` ? 'active' : ''}`}
                >
                    <div className="plannerNavWeek">
                        Week {index + 1}
                    </div>
                    <div className='plannerNavDate'>
                        ({formatDateRange(week.weekStart, week.weekEnd)})
                    </div>
                </Link>
            ))}
        </nav>
    );
};

export default PlannerNav;