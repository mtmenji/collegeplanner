import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import './Week.css';
import PlannerNav from '../Components/PlannerNav';
import usePlanner from '../Hooks/usePlanner';
import { v4 as uuidv4 } from 'uuid';

const getWeekDates = (startDateStr, weekIndex) => {
    const startDate = new Date(startDateStr);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const weekStart = new Date(startDate);
    weekStart.setDate(weekStart.getDate() + (weekIndex - 1) * 7);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        weekDates.push(date);
    }
    return weekDates;
};

const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
};

const Week = () => {
    const { id, weekid } = useParams();
    const { planner, loading } = usePlanner(id);
    const [showDetails, setShowDetails] = useState(false);
    const [cellsContent, setCellsContent] = useState({});
    const [inputValues, setInputValues] = useState({});
    const firestore = getFirestore();

    const toggleDetails = () => {
        setShowDetails(prev => !prev);
    };

    const handleAddContent = async (cellKey, classIndex, dayIndex) => {
        const newTaskId = uuidv4();
        const newTask = { id: newTaskId, text: '', completed: false, editing: true };
      
        setInputValues(prev => ({ ...prev, [cellKey]: '' }));
        setCellsContent(prev => {
          const newContents = { ...prev };
          if (!Array.isArray(newContents[cellKey])) {
            newContents[cellKey] = [];
          }
          newContents[cellKey] = [...newContents[cellKey], newTask];
          return newContents;
        });
      
        // Calculate week index and date
        const weekIndex = parseInt(weekid.replace('week', ''), 10);
        const weekDates = getWeekDates(planner.startDate, weekIndex);
        const taskDate = weekDates[dayIndex].toISOString().split('T')[0];
      
        // Update Firestore
        const docRef = doc(firestore, 'planners', id);
        const plannerDoc = await getDoc(docRef);
        const tasks = plannerDoc.data().tasks || {};
      
        if (!tasks[`week${weekIndex}`]) {
          tasks[`week${weekIndex}`] = {};
        }
      
        if (!tasks[`week${weekIndex}`][cellKey]) {
          tasks[`week${weekIndex}`][cellKey] = [];
        }
      
        tasks[`week${weekIndex}`][cellKey].push({ id: newTaskId, date: taskDate, classIndex, dayIndex, text: '', completed: false });
      
        await updateDoc(docRef, { tasks });
    };    
      
    const handleRemoveContent = async (cellKey, taskId) => {
        setCellsContent(prev => {
            const newContents = { ...prev };
            if (Array.isArray(newContents[cellKey])) {
                newContents[cellKey] = newContents[cellKey].filter(task => task.id !== taskId);
                if (newContents[cellKey].length === 0) {
                    delete newContents[cellKey];
                }
            }
            return newContents;
        });
        
        // Update Firestore
        const weekIndex = parseInt(weekid.replace('week', ''), 10);
        const docRef = doc(firestore, 'planners', id);
        const plannerDoc = await getDoc(docRef);
        const tasks = plannerDoc.data().tasks || {};
        if (tasks[`week${weekIndex}`] && Array.isArray(tasks[`week${weekIndex}`][cellKey])) {
            tasks[`week${weekIndex}`][cellKey] = tasks[`week${weekIndex}`][cellKey].filter(task => task.id !== taskId);
            if (tasks[`week${weekIndex}`][cellKey].length === 0) {
                delete tasks[`week${weekIndex}`][cellKey];
            }
        }
        
        await updateDoc(docRef, { tasks });
    };        

    const handleToggleComplete = async (cellKey, taskId) => {
        setCellsContent(prev => {
          const newContents = { ...prev };
          if (Array.isArray(newContents[cellKey])) {
            const cellContents = [...newContents[cellKey]];
            const taskIndex = cellContents.findIndex(task => task.id === taskId);
            const item = { ...cellContents[taskIndex] };
            item.completed = !item.completed;
            cellContents[taskIndex] = item;
            newContents[cellKey] = cellContents;
          }
          return newContents;
        });
      
        // Update Firestore
        const weekIndex = parseInt(weekid.replace('week', ''), 10);
        const docRef = doc(firestore, 'planners', id);
        const plannerDoc = await getDoc(docRef);
        const tasks = plannerDoc.data().tasks || {};
        if (tasks[`week${weekIndex}`] && Array.isArray(tasks[`week${weekIndex}`][cellKey])) {
          const taskIndex = tasks[`week${weekIndex}`][cellKey].findIndex(task => task.id === taskId);
          tasks[`week${weekIndex}`][cellKey][taskIndex].completed = !tasks[`week${weekIndex}`][cellKey][taskIndex].completed;
        }
      
        await updateDoc(docRef, { tasks });
    };    
      

    const handleInputChange = async (cellKey, taskId, value) => {
        setInputValues(prev => ({ ...prev, [cellKey]: value }));
        setCellsContent(prev => {
          const newContents = { ...prev };
          if (Array.isArray(newContents[cellKey])) {
            const cellContents = [...newContents[cellKey]];
            const taskIndex = cellContents.findIndex(task => task.id === taskId);
            cellContents[taskIndex].text = value;
            newContents[cellKey] = cellContents;
          }
          return newContents;
        });
      
        // Update Firestore
        const weekIndex = parseInt(weekid.replace('week', ''), 10);
        const docRef = doc(firestore, 'planners', id);
        const plannerDoc = await getDoc(docRef);
        const tasks = plannerDoc.data().tasks || {};
        if (tasks[`week${weekIndex}`] && Array.isArray(tasks[`week${weekIndex}`][cellKey])) {
          const taskIndex = tasks[`week${weekIndex}`][cellKey].findIndex(task => task.id === taskId);
          tasks[`week${weekIndex}`][cellKey][taskIndex].text = value;
        }
      
        await updateDoc(docRef, { tasks });
    };
    
    const handleInputBlur = (cellKey, taskId) => {
        setCellsContent(prev => {
            const newContents = { ...prev };
            if (Array.isArray(newContents[cellKey])) {
                const cellContents = [...newContents[cellKey]];
                const taskIndex = cellContents.findIndex(task => task.id === taskId);
                cellContents[taskIndex].editing = false;
                newContents[cellKey] = cellContents;
            }
            return newContents;
        });
    };    

    const handleEditContent = (cellKey, taskId) => {
        setCellsContent(prev => {
            const newContents = { ...prev };
            if (Array.isArray(newContents[cellKey])) {
                const cellContents = [...newContents[cellKey]];
                const taskIndex = cellContents.findIndex(task => task.id === taskId);
                cellContents[taskIndex].editing = true;
                newContents[cellKey] = cellContents;
            }
            return newContents;
        });
        setInputValues(prev => ({
            ...prev,
            [cellKey]: cellsContent[cellKey].find(task => task.id === taskId)?.text || ''
        }));
    };    

    useEffect(() => {
        if (planner) {
            const selectedDays = planner.selectedDays || [];
            document.documentElement.style.setProperty('--columns-count', selectedDays.length + 1);
        }
    }, [planner]);

    const fetchTasks = async () => {
        if (planner) {
            const weekIndex = parseInt(weekid.replace('week', ''), 10);
            const docRef = doc(firestore, 'planners', id);
            const plannerDoc = await getDoc(docRef);
            const tasks = plannerDoc.data().tasks || {};
            setCellsContent(tasks[`week${weekIndex}`] || {});
        }
    };
    
    useEffect(() => {
        fetchTasks();
    }, [planner, weekid]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!planner) {
        return <div>Planner not found.</div>;
    }

    const weekIndex = parseInt(weekid.replace('week', ''), 10);
    const weekDates = getWeekDates(planner.startDate, weekIndex);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const selectedDays = planner.selectedDays || [];
    const selectedDayIndices = selectedDays.map(day => daysOfWeek.indexOf(day));

    return (
        <div className="weekPage">
            <PlannerNav plannerId={id}/>
            <div className={`plannerGrid ${showDetails ? 'showDetails' : 'hideDetails'}`}>
                <button className="gridHeader" onClick={toggleDetails}>
                    {showDetails ? 'Hide' : 'Show'}
                </button>
                {selectedDayIndices.map((index) => (
                    <div key={index} className="dayHeader">
                        <div className="dayName">{daysOfWeek[index]}</div>
                        <div className="dayDate">{formatDate(weekDates[index])}</div>
                    </div>
                ))}
                {planner.classes && planner.classes.map((cls, classIndex) => (
                    <React.Fragment key={classIndex}>
                        <div className="courseGrid">
                            <div className="courseCode">{cls.courseCode}</div>
                            <div className={`courseDetails ${showDetails ? 'show' : 'hide'}`}>
                                <div>{cls.className}</div>
                                <div>{cls.location}</div>
                                <div>{cls.meetingDays}</div>
                                <div>{cls.startTime} - {cls.endTime}</div>
                            </div>
                        </div>
                        {selectedDayIndices.map((dayIndex) => {
                            const cellKey = `${classIndex}-${dayIndex}`;
                            return (
                                <div key={cellKey} className="gridCell">
                                    {Array.isArray(cellsContent[cellKey]) && cellsContent[cellKey].map((task) => (
                                        <div key={task.id} className={`contentWrapper cellItem ${task.completed ? 'completed' : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => handleToggleComplete(cellKey, task.id)}
                                                className="taskCheckbox"
                                            />
                                            {task.editing ? (
                                                <input
                                                    type="text"
                                                    value={inputValues[cellKey] || ''}
                                                    onChange={(e) => handleInputChange(cellKey, task.id, e.target.value)}
                                                    onBlur={() => handleInputBlur(cellKey, task.id)}
                                                    autoFocus
                                                    className="taskInput"
                                                />
                                            ) : (
                                                <div className="taskText" onClick={() => handleEditContent(cellKey, task.id)}>
                                                    {task.text}
                                                </div>
                                            )}
                                            <div className="gridCellButtons">
                                                <button 
                                                    className="editButton" 
                                                    onClick={() => handleEditContent(cellKey, task.id)}
                                                >
                                                    ✎
                                                </button>
                                                <button 
                                                    className="removeButton" 
                                                    onClick={() => handleRemoveContent(cellKey, task.id)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="addButton" onClick={() => handleAddContent(cellKey, classIndex, dayIndex)}>+</button>
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Week;