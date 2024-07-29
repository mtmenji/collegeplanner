import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Week.css';
import PlannerNav from '../Components/PlannerNav';
import usePlanner from '../Hooks/usePlanner';

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

    const toggleDetails = () => {
        setShowDetails(prev => !prev);
    };

    const handleAddContent = (cellKey) => {
        setInputValues(prev => ({ ...prev, [cellKey]: '' }));
        setCellsContent(prev => {
            const newContents = { ...prev };
            if (!newContents[cellKey]) {
                newContents[cellKey] = [];
            }
            newContents[cellKey] = [...newContents[cellKey], { text: '', completed: false, editing: true }];
            return newContents;
        });
    };

    const handleRemoveContent = (cellKey, index) => {
        setCellsContent(prev => {
            const newContents = { ...prev };
            if (newContents[cellKey]) {
                newContents[cellKey] = newContents[cellKey].filter((_, i) => i !== index);
                if (newContents[cellKey].length === 0) {
                    delete newContents[cellKey];
                }
            }
            return newContents;
        });
    };

    const handleToggleComplete = (cellKey, index) => {
        setCellsContent(prev => {
            const newContents = { ...prev };
            if (newContents[cellKey]) {
                const cellContents = [...newContents[cellKey]];
                const item = { ...cellContents[index] };
                item.completed = !item.completed;
                cellContents[index] = item;
                newContents[cellKey] = cellContents;
            }
            return newContents;
        });
    };

    const handleInputChange = (cellKey, index, value) => {
        setInputValues(prev => ({ ...prev, [cellKey]: value }));
        setCellsContent(prev => {
            const newContents = { ...prev };
            if (newContents[cellKey]) {
                const cellContents = [...newContents[cellKey]];
                cellContents[index].text = value;
                newContents[cellKey] = cellContents;
            }
            return newContents;
        });
    };

    const handleInputBlur = (cellKey, index) => {
        setCellsContent(prev => {
            const newContents = { ...prev };
            if (newContents[cellKey]) {
                const cellContents = [...newContents[cellKey]];
                cellContents[index].editing = false;
                newContents[cellKey] = cellContents;
            }
            return newContents;
        });
    };

    const handleEditContent = (cellKey, index) => {
        setCellsContent(prev => {
            const newContents = { ...prev };
            if (newContents[cellKey]) {
                const cellContents = [...newContents[cellKey]];
                cellContents[index].editing = true;
                newContents[cellKey] = cellContents;
            }
            return newContents;
        });
        setInputValues(prev => ({
            ...prev,
            [cellKey]: cellsContent[cellKey][index].text,
        }));
    };

    useEffect(() => {
        if (planner) {
            const selectedDays = planner.selectedDays || [];
            document.documentElement.style.setProperty('--columns-count', selectedDays.length + 1);
        }
    }, [planner]);

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
            <PlannerNav />
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
                                <div>{cls.meetingDays.join(', ')}</div>
                                <div>{cls.startTime} - {cls.endTime}</div>
                            </div>
                        </div>
                        {selectedDayIndices.map((_, dayIndex) => {
                            const cellKey = `${classIndex}-${dayIndex}`;
                            return (
                                <div key={cellKey} className="gridCell">
                                    {cellsContent[cellKey] && cellsContent[cellKey].map((content, index) => (
                                        <div key={index} className="contentWrapper">
                                            <input 
                                                type="checkbox" 
                                                className="checkbox"
                                                checked={content.completed}
                                                onChange={() => handleToggleComplete(cellKey, index)}
                                            />
                                            {content.editing ? (
                                                <input
                                                    type="text"
                                                    value={inputValues[cellKey] || ''}
                                                    onChange={(e) => handleInputChange(cellKey, index, e.target.value)}
                                                    onBlur={() => handleInputBlur(cellKey, index)}
                                                    className="contentInput"
                                                />
                                            ) : (
                                                <p 
                                                    className={content.completed ? 'completed' : ''}
                                                    onClick={() => handleToggleComplete(cellKey, index)}
                                                >
                                                    {content.text}
                                                </p>
                                            )}
                                            <div className="gridCellButtons">
                                                <button 
                                                    className="editButton"
                                                    onClick={() => handleEditContent(cellKey, index)}
                                                >
                                                    ✎
                                                </button>
                                                <button 
                                                    className="removeButton"
                                                    onClick={() => handleRemoveContent(cellKey, index)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button 
                                        className="addButton"
                                        onClick={() => handleAddContent(cellKey)}
                                    >
                                        +
                                    </button>
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