// usePlanner.js
import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const usePlanner = (id) => {
    const firestore = getFirestore();
    const [planner, setPlanner] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPlanner = async () => {
        const plannerDoc = doc(firestore, 'planners', id);
        const plannerSnapshot = await getDoc(plannerDoc);
        if (plannerSnapshot.exists()) {
            setPlanner(plannerSnapshot.data());
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPlanner();
    }, [id, firestore]);

    return { planner, loading, refetch: fetchPlanner };
};

export default usePlanner;
