import React, { useState, useEffect } from 'react';
import './Planners.css';
import { useAuth } from '../Contexts/AuthContext';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import CreatePlannerForm from '../Components/CreatePlannerForm';

const Planners = () => {
    const { currentUser } = useAuth();
    const firestore = getFirestore();
    const [planners, setPlanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchPlanners = async () => {
            setLoading(true);
            const plannersCollection = collection(firestore, 'planners');
            const q = query(plannersCollection, where('userId', '==', currentUser.uid));
            const querySnapshot = await getDocs(q);
            const plannersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPlanners(plannersList);
            setLoading(false);
        };

        if (currentUser) {
            fetchPlanners();
        }
    }, [currentUser, firestore]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="plannersPage">
            <h1>Planners Page</h1>
            <button onClick={() => setShowForm(true)}>Create New Planner</button>
            {showForm && <CreatePlannerForm onClose={() => setShowForm(false)} />}
            <ul>
                {planners.map(planner => (
                    <li key={planner.id}>
                        <a href={`/planners/${planner.id}`}>Planner {planner.name}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Planners;