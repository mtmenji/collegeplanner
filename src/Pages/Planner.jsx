import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const Planner = () => {
    const { id } = useParams();
    const firestore = getFirestore();
    const [planner, setPlanner] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlanner = async () => {
            const plannerDoc = doc(firestore, 'planners', id);
            const plannerSnapshot = await getDoc(plannerDoc);
            if (plannerSnapshot.exists()) {
                setPlanner(plannerSnapshot.data());
            }
            setLoading(false);
        };

        fetchPlanner();
    }, [id, firestore]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!planner) {
        return <div>Planner not found.</div>;
    }

    return (
        <div>
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
    );
};

export default Planner;