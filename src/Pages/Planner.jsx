// Planner.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../Contexts/AuthContext';
import PlannerNav from '../Components/PlannerNav';
import './Planner.css';
import usePlanner from '../Hooks/usePlanner';

const Planner = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const firestore = getFirestore();
    const { planner, loading } = usePlanner(id);

    useEffect(() => {
        const fetchLastRoute = async () => {
            const plannerDoc = await getDoc(doc(firestore, 'planners', id));
            if (plannerDoc.exists()) {
                const lastRoute = plannerDoc.data().lastRoute;
                if (lastRoute) {
                    navigate(lastRoute);
                }
            }
        };

        fetchLastRoute();
    }, [id, navigate, firestore]);

    useEffect(() => {
        const saveLastRoute = async () => {
            const currentRoute = window.location.pathname;
            await updateDoc(doc(firestore, 'planners', id), {
                lastRoute: currentRoute,
            });
        };

        const handleBeforeUnload = () => {
            saveLastRoute();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            saveLastRoute();
        };
    }, [id, firestore]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!planner) {
        return <div>Planner not found.</div>;
    }

    return (
        <div className="plannerPage">
            <PlannerNav /> {/* Use PlannerNav component */}
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