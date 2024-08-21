import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import './Week.css';
import PlannerNav from '../Components/PlannerNav';
import usePlanner from '../Hooks/usePlanner';
import { v4 as uuidv4 } from 'uuid';
import { usePlannerContext } from '../Contexts/PlannerContext';

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

const dayAbbreviations = {
    Sunday: 'Su',
    Monday: 'M',
    Tuesday: 'T',
    Wednesday: 'W',
    Thursday: 'R',
    Friday: 'F',
    Saturday: 'Sa'
};
const abbreviateDays = (days) => {
    return days.map(day => dayAbbreviations[day]).join('');
};

const Week = () => {
    const { id, weekid } = useParams();
    const { planner, loading } = usePlanner(id);
    const { setPlannerName } = usePlannerContext();
    const [showDetails, setShowDetails] = useState(false);
    const [cellsContent, setCellsContent] = useState({});
    const [inputValues, setInputValues] = useState({});
    const firestore = getFirestore();

    const toggleDetails = () => {
        setShowDetails(prev => !prev);
    };

    const handleAddContent = (cellKey) => {
        const newTaskId = uuidv4();
        const newTask = { id: newTaskId, text: '', completed: false, editing: true };
    
        setCellsContent(prev => {
            const newContents = { ...prev };
            if (!Array.isArray(newContents[cellKey])) {
                newContents[cellKey] = [];
            }
            // newContents[cellKey].push(newTask);
            // return newContents;
            const taskExists = newContents[cellKey].some(task => task.id === newTaskId);
            if (!taskExists) {
                newContents[cellKey].push(newTask);
            }
            return newContents;
        });
    
        setInputValues(prev => ({ ...prev, [cellKey]: '' }));
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

        const weekIndex = parseInt(weekid.replace('week', ''), 10);
        const weekDates = getWeekDates(planner.startDate, weekIndex);
        const taskDate = weekDates.find(date => {
            const task = cellsContent[cellKey]?.find(task => task.id === taskId);
            return task && task.date;
        })?.toISOString().split('T')[0];

        const docRef = doc(firestore, 'planners', id);
        const plannerDoc = await getDoc(docRef);
        const tasks = plannerDoc.data().tasks || {};
        if (tasks[taskDate] && Array.isArray(tasks[taskDate][cellKey])) {
            tasks[taskDate][cellKey] = tasks[taskDate][cellKey].filter(task => task.id !== taskId);
            if (tasks[taskDate][cellKey].length === 0) {
                delete tasks[taskDate][cellKey];
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

        const weekIndex = parseInt(weekid.replace('week', ''), 10);
        const weekDates = getWeekDates(planner.startDate, weekIndex);
        const taskDate = weekDates.find(date => {
            const task = cellsContent[cellKey]?.find(task => task.id === taskId);
            return task && task.date;
        })?.toISOString().split('T')[0];

        const docRef = doc(firestore, 'planners', id);
        const plannerDoc = await getDoc(docRef);
        const tasks = plannerDoc.data().tasks || {};
        if (tasks[taskDate] && Array.isArray(tasks[taskDate][cellKey])) {
            const taskIndex = tasks[taskDate][cellKey].findIndex(task => task.id === taskId);
            tasks[taskDate][cellKey][taskIndex].completed = !tasks[taskDate][cellKey][taskIndex].completed;
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

        const weekIndex = parseInt(weekid.replace('week', ''), 10);
        const weekDates = getWeekDates(planner.startDate, weekIndex);
        const taskDate = weekDates.find(date => {
            const task = cellsContent[cellKey]?.find(task => task.id === taskId);
            return task && task.date;
        })?.toISOString().split('T')[0];

        const docRef = doc(firestore, 'planners', id);
        const plannerDoc = await getDoc(docRef);
        const tasks = plannerDoc.data().tasks || {};
        if (tasks[taskDate] && Array.isArray(tasks[taskDate][cellKey])) {
            const taskIndex = tasks[taskDate][cellKey].findIndex(task => task.id === taskId);
            tasks[taskDate][cellKey][taskIndex].text = value;
        }

        await updateDoc(docRef, { tasks });
    };
    
    const handleInputBlur = async (cellKey, taskId) => {
        const textboxValue = inputValues[cellKey];
        if (!textboxValue) {
            console.log("No input value found for cellKey:", cellKey);
            return;
        }
    
        setCellsContent(prev => {
            const newContents = { ...prev };
            if (Array.isArray(newContents[cellKey])) {
                const cellContents = [...newContents[cellKey]];
                const taskIndex = cellContents.findIndex(task => task.id === taskId);
                if (taskIndex !== -1) {
                    cellContents[taskIndex].editing = false;
                    cellContents[taskIndex].text = textboxValue;
                    newContents[cellKey] = cellContents;
                }
            }
            return newContents;
        });
    
        // Assuming `getWeekDates` is a function to get the week's dates based on planner start date and week index
        const weekIndex = parseInt(weekid.replace('week', ''), 10);
        const weekDates = getWeekDates(planner.startDate, weekIndex);
        
        // `cellKey` may need to relate to a specific day in the week
        const dayIndex = parseInt(cellKey); // Assuming cellKey is a number representing the day index
        const taskDate = weekDates[dayIndex]?.toISOString().split('T')[0];
    
        if (!taskDate) {
            console.error("Task date is undefined for cellKey:", cellKey);
            return;
        }
    
        const docRef = doc(firestore, 'planners', id);
        const plannerDoc = await getDoc(docRef);
        const tasks = plannerDoc.data().tasks || {};
    
        if (!tasks[taskDate]) {
            tasks[taskDate] = {};
        }
    
        if (!tasks[taskDate][cellKey]) {
            tasks[taskDate][cellKey] = [];
        }
    
        const existingTaskIndex = tasks[taskDate][cellKey].findIndex(task => task.id === taskId);
        if (existingTaskIndex !== -1) {
            // Update the existing task
            tasks[taskDate][cellKey][existingTaskIndex].text = textboxValue;
        } else {
            // Add new task
            tasks[taskDate][cellKey].push({ id: taskId, date: taskDate, text: textboxValue, completed: false });
        }
    
        console.log("Updating document with tasks:", tasks);
    
        await updateDoc(docRef, { tasks });
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
            setPlannerName(planner.name);
        }
    }, [planner, setPlannerName]);

    const fetchTasks = async () => {
        if (planner) {
            const weekIndex = parseInt(weekid.replace('week', ''), 10);
            const weekDates = getWeekDates(planner.startDate, weekIndex);
            const dates = weekDates.map(date => date.toISOString().split('T')[0]);
            const docRef = doc(firestore, 'planners', id);
            const plannerDoc = await getDoc(docRef);
            const tasks = plannerDoc.data().tasks || {};
            const cellsContent = {};

            dates.forEach(date => {
                if (tasks[date]) {
                    Object.keys(tasks[date]).forEach(cellKey => {
                        if (!cellsContent[cellKey]) {
                            cellsContent[cellKey] = [];
                        }
                        cellsContent[cellKey] = [...cellsContent[cellKey], ...tasks[date][cellKey]];
                    });
                }
            });

            setCellsContent(cellsContent);
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
                                <div>&#128205;{cls.location}</div>
                                <div>&#128197;{abbreviateDays(cls.meetingDays)}</div>
                                <div>&#128338;{cls.startTime} - {cls.endTime}</div>
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