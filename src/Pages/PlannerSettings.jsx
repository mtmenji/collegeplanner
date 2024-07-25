import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import PlannerNav from '../Components/PlannerNav'; // Import PlannerNav component
import './PlannerSettings.css';

const PlannerSettings = () => {
  const { id } = useParams();
  const [settingsData, setSettingsData] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const firestore = getFirestore();

  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        console.log(`Fetching settings data for planner ID: ${id}`);
        const plannerDoc = doc(firestore, 'planners', id);
        const plannerSnapshot = await getDoc(plannerDoc);
        if (plannerSnapshot.exists()) {
          const plannerData = plannerSnapshot.data();
          setSettingsData(plannerData);
          calculateWeeks(plannerData.startDate, plannerData.endDate);
          console.log('Settings data:', plannerData);
        } else {
          console.log('Settings data not found for ID:', id);
        }
      } catch (error) {
        console.error('Error fetching settings data:', error);
      }
      setLoading(false);
    };

    fetchSettingsData();
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

  if (!settingsData) {
    return <div>Settings data not found.</div>;
  }

  return (
    <div className="plannerSettingsPage">
      <PlannerNav weeks={weeks} />
      <h1>Settings for Planner {id}</h1>
      {/* Display settings data here */}
      <p><strong>Planner Name:</strong> {settingsData.name}</p>
      {/* Add other relevant settings information here */}
    </div>
  );
};

export default PlannerSettings;