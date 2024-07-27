import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import PlannerNav from '../Components/PlannerNav';
import './PlannerSettings.css';
import usePlanner from '../Hooks/usePlanner';
import EditClassForm from '../Components/EditClassForm';
import ClassForm from '../Components/ClassForm';

const PlannerSettings = () => {
    const { id } = useParams();
    const { planner, loading, refetch } = usePlanner(id);
    const firestore = getFirestore();

    const [plannerDetails, setPlannerDetails] = useState({
        name: '',
        startDate: '',
        endDate: ''
    });

    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedClassIndex, setSelectedClassIndex] = useState(0);
    const [isAddingClass, setIsAddingClass] = useState(false);
    const [isEditingClass, setIsEditingClass] = useState(true);
    const [newClassDetails, setNewClassDetails] = useState({
        className: '',
        courseCode: '',
        location: '',
        startTime: '',
        endTime: '',
        meetingDays: []
    });

    useEffect(() => {
        if (planner) {
            setPlannerDetails({
                name: planner.name,
                startDate: planner.startDate,
                endDate: planner.endDate
            });
            setSelectedDays(planner.selectedDays || []);
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
        refetch();
        alert('Class updated successfully!');
    };

    const handleDeleteClass = async (index) => {
        if (window.confirm('Are you sure you want to delete this class?')) {
            const updatedClasses = [...planner.classes];
            updatedClasses.splice(index, 1);
            const plannerDoc = doc(firestore, 'planners', id);
            await updateDoc(plannerDoc, { classes: updatedClasses });
            setSelectedClassIndex(Math.max(0, index - 1));
            refetch();
            alert('Class deleted successfully!');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlannerDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleDayChange = (day) => {
        const updatedDays = selectedDays.includes(day)
            ? selectedDays.filter(d => d !== day)
            : [...selectedDays, day];
        updatedDays.sort((a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b));
        setSelectedDays(updatedDays);
    };

    const handleSavePlannerDetails = async () => {
        const plannerDoc = doc(firestore, 'planners', id);
        await updateDoc(plannerDoc, {
            name: plannerDetails.name,
            startDate: plannerDetails.startDate,
            endDate: plannerDetails.endDate,
            selectedDays
        });
        alert('Planner details updated successfully!');
        refetch();
    };

    const handleAddClass = async () => {
        const updatedClasses = [...planner.classes, newClassDetails];
        const plannerDoc = doc(firestore, 'planners', id);
        await updateDoc(plannerDoc, { classes: updatedClasses });
        setIsAddingClass(false);
        setIsEditingClass(true);
        setNewClassDetails({
            className: '',
            courseCode: '',
            location: '',
            startTime: '',
            endTime: '',
            meetingDays: []
        });
        refetch();
        alert('Class added successfully!');
    };

    const handleNewClassChange = (name, value) => {
        setNewClassDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleNewClassMeetingDayChange = (day) => {
        const meetingDays = newClassDetails.meetingDays.includes(day)
            ? newClassDetails.meetingDays.filter(d => d !== day)
            : [...newClassDetails.meetingDays, day];
        setNewClassDetails(prevDetails => ({
            ...prevDetails,
            meetingDays
        }));
    };

    const handleCancelAddClass = () => {
        setIsAddingClass(false);
        setIsEditingClass(true);
        setNewClassDetails({
            className: '',
            courseCode: '',
            location: '',
            startTime: '',
            endTime: '',
            meetingDays: []
        });
    };

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <div className="plannerSettingsPage">
            <PlannerNav refetch={refetch}/>
            <h1>Settings for {plannerDetails.name} Planner</h1>
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
                <div>
                    <label><strong>Select Days:</strong></label>
                    {daysOfWeek.map(day => (
                        <div key={day}>
                            <input
                                type="checkbox"
                                checked={selectedDays.includes(day)}
                                onChange={() => handleDayChange(day)}
                            />
                            {day}
                        </div>
                    ))}
                </div>
                <button onClick={handleSavePlannerDetails}>Save Planner Details</button>
                <hr/>
                {planner.classes && isEditingClass && (
                    <EditClassForm
                        classes={planner.classes}
                        selectedClassIndex={selectedClassIndex}
                        onSelectClass={handleSelectClass}
                        onUpdateClass={handleUpdateClass}
                        onDeleteClass={handleDeleteClass}
                    />
                )}
                {!isAddingClass && (
                    <button className="add-class-button" onClick={() => { setIsAddingClass(true); setIsEditingClass(false); }}>Add a Class</button>
                )}
                {isAddingClass && (
                    <div className="add-class-form">
                        <h1>Add a Class</h1>
                        <ClassForm
                            classDetails={newClassDetails}
                            onChange={handleNewClassChange}
                            onMeetingDayChange={handleNewClassMeetingDayChange}
                        />
                        <button onClick={handleAddClass}>Save</button>
                        <button onClick={handleCancelAddClass}>Cancel</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlannerSettings;