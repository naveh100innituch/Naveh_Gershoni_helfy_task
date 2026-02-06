import React, { useState } from 'react';

const TaskForm = ({ onAddTask }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('low');
    const [dueDate, setDueDate] = useState('');

    // Get today's date string to prevent selecting past dates
    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!title.trim()) return;

        // Passing the object up to the parent component
        onAddTask({ 
            title, 
            description, 
            priority, 
            dueDate 
        });

        // Reset form state
        setTitle('');
        setDescription('');
        setPriority('low');
        setDueDate('');
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    type="text"
                    className="form-input"
                    placeholder="Task Title (Required)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    autoFocus // Nice UX touch for quick entry
                />
            </div>

            <div className="form-group">
                <textarea
                    className="form-textarea"
                    placeholder="Description (Optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
                <select
                    className="form-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={{ flex: 1 }}
                >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                </select>

                {/* Date input with min restriction */}
                <input
                    type="date"
                    className="form-input"
                    value={dueDate}
                    min={today} // Prevents picking yesterday
                    onChange={(e) => setDueDate(e.target.value)}
                    style={{ flex: 1 }}
                />
            </div>

            <button type="submit" className="btn-submit">Add Task</button>
        </form>
    );
};

export default TaskForm;