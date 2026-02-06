import React from 'react';
import { Trash2, CheckCircle, Circle, Calendar } from 'lucide-react'; 

/**
 * TaskItem Component
 * Represents an individual task card with status, priority styling, and actions.
 */
const TaskItem = ({ task, onDelete, onToggle }) => {
    
    // Helper function to format ISO date strings into a readable British format (DD/MM/YYYY)
    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-GB');
    };

    return (
        /* Dynamic class assignment based on task priority (e.g., priority-high) */
        <div className={`task-card priority-${task.priority}`}>
            <div className="card-header">
                {/* Apply line-through decoration if the task is marked as completed */}
                <h3 className="card-title" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                    {task.title}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#888' }}>
                    Created: {formatDate(task.createdAt)}
                </span>
            </div>

            <p className="card-desc">
                {/* Fallback text if no description is provided */}
                {task.description || 'No description provided'}
            </p>

            {/* Conditional Rendering: Only show the due date section if it exists */}
            {task.dueDate && (
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    fontSize: '0.85rem', 
                    color: '#e74c3c', // Reddish color to highlight the deadline urgency
                    marginBottom: '10px',
                    fontWeight: '500'
                }}>
                    <Calendar size={14} />
                    <span>Due: {formatDate(task.dueDate)}</span>
                </div>
            )}

            <div className="card-footer">
                {/* Toggle Completion Button: Switches between 'Completed' and 'Pending' UI states */}
                <button 
                    onClick={() => onToggle(task.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                    {task.completed ? (
                        <>
                            <CheckCircle size={20} color="#2ecc71" />
                            <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>Completed</span>
                        </>
                    ) : (
                        <>
                            <Circle size={20} color="#ccc" />
                            <span style={{ color: '#666' }}>Pending</span>
                        </>
                    )}
                </button>

                {/* Delete Button: Triggers the onDelete callback passed from parent */}
                <button 
                    onClick={() => onDelete(task.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c' }}
                    title="Delete Task"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
};

export default TaskItem;