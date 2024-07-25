// CreatePlannerForm.jsx
import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ClassForm from '../Components/ClassForm';

const CreatePlannerForm = ({ onClose }) => {
    const { currentUser } = useAuth();
    const firestore = getFirestore();
    const navigate = useNavigate();
    const [plannerDetails, setPlannerDetails] = useState({
        name: '',
        startDate: '',
        endDate: '',
        classes: [{ className: '', courseCode: '', location: '', startTime: '12:00 AM', endTime: '12:00 AM', meetingDays: [] }]
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlannerDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleClassChange = (index, name, value) => {
        const newClasses = [...plannerDetails.classes];
        newClasses[index] = {
            ...newClasses[index],
            [name]: value
        };
        setPlannerDetails(prevDetails => ({
            ...prevDetails,
            classes: newClasses
        }));
    };

    const handleMeetingDayChange = (index, day) => {
        const newClasses = [...plannerDetails.classes];
        const meetingDays = newClasses[index].meetingDays.includes(day)
            ? newClasses[index].meetingDays.filter(d => d !== day)
            : [...newClasses[index].meetingDays, day];
        newClasses[index].meetingDays = meetingDays;
        setPlannerDetails(prevDetails => ({
            ...prevDetails,
            classes: newClasses
        }));
    };

    const addClass = () => {
        setPlannerDetails(prevDetails => ({
            ...prevDetails,
            classes: [...prevDetails.classes, { className: '', courseCode: '', location: '', startTime: '12:00 AM', endTime: '12:00 AM', meetingDays: [] }]
        }));
    };

    const removeClass = (index) => {
        const newClasses = plannerDetails.classes.filter((_, i) => i !== index);
        setPlannerDetails(prevDetails => ({
            ...prevDetails,
            classes: newClasses
        }));
    };

    const createPlanner = async (e) => {
        e.preventDefault();
        const plannersCollection = collection(firestore, 'planners');
        const docRef = await addDoc(plannersCollection, {
            ...plannerDetails,
            userId: currentUser.uid,
            createdAt: new Date()
        });
        onClose();  // Close the form after submission
        navigate(`/planners/${docRef.id}`);  // Redirect to the new planner page
    };

    return (
        <form onSubmit={createPlanner} className="plannerForm">
            <div>
                <label>Name of Planner:</label>
                <input type="text" name="name" value={plannerDetails.name} onChange={handleChange} required />
            </div>
            <div>
                <label>Start Date:</label>
                <input type="date" name="startDate" value={plannerDetails.startDate} onChange={handleChange} required />
            </div>
            <div>
                <label>End Date:</label>
                <input type="date" name="endDate" value={plannerDetails.endDate} onChange={handleChange} required />
            </div>
            {plannerDetails.classes.map((cls, index) => (
                <ClassForm
                    key={index}
                    classDetails={cls}
                    onChange={(name, value) => handleClassChange(index, name, value)}
                    onMeetingDayChange={(day) => handleMeetingDayChange(index, day)}
                    onRemove={() => removeClass(index)}
                />
            ))}
            <button type="button" onClick={addClass}>Add Another Class</button>
            <button type="submit">Save Planner</button>
        </form>
    );
};

export default CreatePlannerForm;