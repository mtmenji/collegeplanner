import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import PlannerNav from '../Components/PlannerNav'; // Import PlannerNav component
import './PlannerCalendar.css';

const PlannerCalendar = () => {
  const { id } = useParams();
  const [calendarData, setCalendarData] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const firestore = getFirestore();

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        console.log(`Fetching calendar data for planner ID: ${id}`);
        const plannerDoc = doc(firestore, 'planners', id);
        const plannerSnapshot = await getDoc(plannerDoc);
        if (plannerSnapshot.exists()) {
          const plannerData = plannerSnapshot.data();
          setCalendarData(plannerData);
          calculateWeeks(plannerData.startDate, plannerData.endDate);
          console.log('Calendar data:', plannerData);
        } else {
          console.log('Calendar data not found for ID:', id);
        }
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      }
      setLoading(false);
    };

    fetchCalendarData();
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

  if (!calendarData) {
    return <div>Calendar data not found.</div>;
  }

  return (
    <div className="plannerCalendarPage">
      <PlannerNav weeks={weeks} />
      <h1>Calendar for Planner {id}</h1>
      {/* Display calendar data here */}
      <p><strong>Start Date:</strong> {calendarData.startDate}</p>
      <p><strong>End Date:</strong> {calendarData.endDate}</p>
      {/* Add other relevant calendar information here */}
    </div>
  );
};

export default PlannerCalendar;