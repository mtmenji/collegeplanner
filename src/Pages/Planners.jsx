import React, { useState, useEffect } from 'react';
import './Planners.css';
import { useAuth } from '../Contexts/AuthContext';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
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

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this planner? This action cannot be undone.');

        if (confirmDelete) {
            try {
                await deleteDoc(doc(firestore, 'planners', id));
                setPlanners(planners.filter(planner => planner.id !== id));
            } catch (error) {
                console.error('Error deleting planner:', error);
            }
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="plannersPage">
            <h1>Planners</h1>
            <ul className="plannerList">
                {planners.map(planner => (
                    <li className="plannerCard" key={planner.id}>
                        <div className="plannerDetails">
                            {planner.lastRoute ? (
                                <a href={planner.lastRoute}>{planner.name}</a>
                            ) : (
                                <a href={`/planners/${planner.id}/settings`}>Planner {planner.name}</a>
                            )}
                        </div>
                    <button className="buttonDelete" onClick={() => handleDelete(planner.id)}>×</button>
                    </li>
                ))}
            </ul>
            <button className={`buttonCreate ${showForm ? 'disabled' : ''}`} onClick={() => setShowForm(true)} disabled={showForm}>Create New Planner</button>
            {showForm && <CreatePlannerForm onClose={() => setShowForm(false)} />}
        </div>
    );
};

export default Planners;