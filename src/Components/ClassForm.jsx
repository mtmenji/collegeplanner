import './ClassForm.css';

const ClassForm = ({ classDetails, onChange, onMeetingDayChange, onRemove }) => {
    const handleChange = (event) => {
        const { name, value } = event.target;
        onChange(name, value);
    };

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const [startHours, startMinutes] = classDetails.startTime.split(':').map(val => val.split(' ')[0]);
    const [endHours, endMinutes] = classDetails.endTime.split(':').map(val => val.split(' ')[0]);
    const startPeriod = classDetails.startTime.split(' ')[1] || "AM";
    const endPeriod = classDetails.endTime.split(' ')[1] || "AM";

    return (
        <div className="class-section">
            <label>Class Name:</label>
            <input type="text" name="className" value={classDetails.className} onChange={handleChange} required />
            <label>Course Code:</label>
            <input type="text" name="courseCode" value={classDetails.courseCode} onChange={handleChange} required />
            <label>Location:</label>
            <input type="text" name="location" value={classDetails.location} onChange={handleChange} required />

            <div>
                <label>Start Time:</label>
                <input
                    type="number"
                    name="startHours"
                    min="1"
                    max="12"
                    value={startHours}
                    onChange={(e) => {
                        const value = Math.max(1, Math.min(12, e.target.value));
                        handleChange({ target: { name: 'startTime', value: `${value}:${startMinutes} ${startPeriod}` } });
                    }}
                    required
                    placeholder="H"
                />
                :
                <input
                    type="number"
                    name="startMinutes"
                    min="0"
                    max="59"
                    value={startMinutes}
                    onChange={(e) => {
                        const value = Math.max(0, Math.min(59, e.target.value)).toString().padStart(2, '0');
                        handleChange({ target: { name: 'startTime', value: `${startHours}:${value} ${startPeriod}` } });
                    }}
                    required
                    placeholder="M"
                />
                <select
                    name="startPeriod"
                    value={startPeriod}
                    onChange={(e) => handleChange({ target: { name: 'startTime', value: `${startHours}:${startMinutes} ${e.target.value}` } })}
                >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
            </div>

            <div>
                <label>End Time:</label>
                <input
                    type="number"
                    name="endHours"
                    min="1"
                    max="12"
                    value={endHours}
                    onChange={(e) => {
                        const value = Math.max(1, Math.min(12, e.target.value));
                        handleChange({ target: { name: 'endTime', value: `${value}:${endMinutes} ${endPeriod}` } });
                    }}
                    required
                    placeholder="H"
                />
                :
                <input
                    type="number"
                    name="endMinutes"
                    min="00"
                    max="59"
                    value={endMinutes}
                    onChange={(e) => {
                        const value = Math.max(0, Math.min(59, e.target.value)).toString().padStart(2, '0');
                        handleChange({ target: { name: 'endTime', value: `${endHours}:${value} ${endPeriod}` } });
                    }}
                    required
                    placeholder="M"
                />
                <select
                    name="endPeriod"
                    value={endPeriod}
                    onChange={(e) => handleChange({ target: { name: 'endTime', value: `${endHours}:${endMinutes} ${e.target.value}` } })}
                >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
            </div>

            <fieldset>
                <legend>Meeting Days:</legend>
                <div className="days-of-week">
                    {daysOfWeek.map(day => (
                        <div key={day}>
                            <input
                                type="checkbox"
                                id={day}
                                checked={classDetails.meetingDays.includes(day)}
                                onChange={() => onMeetingDayChange(day)}
                            />
                            <label htmlFor={day}>{day}</label>
                        </div>
                    ))}
                </div>
            </fieldset>
            {onRemove && <button className='buttonRemove' type="button" onClick={onRemove}>Remove Class</button>}
        </div>
    );
};

export default ClassForm;