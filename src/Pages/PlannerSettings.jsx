// PlannerSettings.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import PlannerNav from '../Components/PlannerNav';
import './PlannerSettings.css';
import usePlanner from '../Hooks/usePlanner';
import ClassDropdown from '../Components/ClassDropdown';

const PlannerSettings = () => {
    const { id } = useParams();
    const { planner, loading } = usePlanner(id);
    const firestore = getFirestore();
    
    const [plannerDetails, setPlannerDetails] = useState({
        name: '',
        startDate: '',
        endDate: ''
    });

    const [selectedClassIndex, setSelectedClassIndex] = useState(0);

    useEffect(() => {
        if (planner) {
            setPlannerDetails({
                name: planner.name,
                startDate: planner.startDate,
                endDate: planner.endDate
            });
        }
    }, [planner]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!planner) {
        return <div>Planner not found.</div>;
    }

    const handleSelectClass = (index) => {
        setSelectedClassIndex(index);
    };

    const handleUpdateClass = async (index, updatedClass) => {
        const updatedClasses = [...planner.classes];
        updatedClasses[index] = updatedClass;
        const plannerDoc = doc(firestore, 'planners', id);
        await updateDoc(plannerDoc, { classes: updatedClasses });
        alert('Class updated successfully!'); // Alert message
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlannerDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleSavePlannerDetails = async () => {
        const plannerDoc = doc(firestore, 'planners', id);
        await updateDoc(plannerDoc, {
            name: plannerDetails.name,
            startDate: plannerDetails.startDate,
            endDate: plannerDetails.endDate
        });
        alert('Planner details updated successfully!'); // Alert message
    };

    return (
        <div className="plannerSettingsPage">
            <PlannerNav />
            <h1>Settings for Planner {plannerDetails.name}</h1>
            <div className="plannerSettingsContent">
                <div>
                    <label><strong>Planner Name:</strong></label>
                    <input
                        type="text"
                        name="name"
                        value={plannerDetails.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label><strong>Start Date:</strong></label>
                    <input
                        type="date"
                        name="startDate"
                        value={plannerDetails.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label><strong>End Date:</strong></label>
                    <input
                        type="date"
                        name="endDate"
                        value={plannerDetails.endDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button onClick={handleSavePlannerDetails}>Save Planner Details</button>
                {planner.classes && (
                    <ClassDropdown
                        classes={planner.classes}
                        selectedClassIndex={selectedClassIndex}
                        onSelectClass={handleSelectClass}
                        onUpdateClass={handleUpdateClass}
                    />
                )}
            </div>
        </div>
    );
};

export default PlannerSettings;