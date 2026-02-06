import React from 'react';

/**
 * TaskFilter Component
 * Provides a UI for switching between different task visibility states: 'all', 'completed', or 'pending'.
 */
const TaskFilter = ({ currentFilter, onFilterChange }) => {
    return (
        <div className="filters">
            {/* Filter button for showing all tasks */}
            <button 
                // Dynamically applies the 'active' class if 'all' is the current selection
                className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
                onClick={() => onFilterChange('all')}
            >
                All Tasks
            </button>
            
            {/* Filter button for showing only completed tasks */}
            <button 
                className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
                onClick={() => onFilterChange('completed')}
            >
                Completed
            </button>
            
            {/* Filter button for showing only tasks that are still pending */}
            <button 
                className={`filter-btn ${currentFilter === 'pending' ? 'active' : ''}`}
                onClick={() => onFilterChange('pending')}
            >
                Pending
            </button>
        </div>
    );
};

export default TaskFilter;