import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Reorder } from 'framer-motion'; 
import TaskItem from './TaskItem';

/**
 * TaskList Component
 * Renders a carousel of tasks with drag-and-drop reordering capabilities.
 */
const TaskList = ({ tasks, onDelete, onToggle, onReorder }) => {
    // Tracks the current index for carousel navigation
    const [currentIndex, setCurrentIndex] = useState(0);

    // Empty state: Check if there are no tasks to display
    if (!tasks || tasks.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                No tasks found. Add one above!
            </div>
        );
    }

    // Navigation Logic: Move to the next slide (infinite loop)
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex === tasks.length - 1) {
                return 0; // Return to start
            }
            return prevIndex + 1;
        });
    };

    // Navigation Logic: Move to the previous slide (infinite loop)
    const prevSlide = () => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex === 0) {
                return tasks.length - 1; // Go to end
            }
            return prevIndex - 1;
        });
    };

    return (
        <div className="carousel-container">
            {/* Left navigation button */}
            <button className="nav-button nav-prev" onClick={prevSlide}>
                <ChevronLeft size={24} />
            </button>

            {/* Viewport: Clips the content overflow */}
            <div className="carousel-track-container" style={{ overflow: 'hidden' }}>
                
                {/* The sliding track - implemented as a Framer Motion Reorder Group 
                  to allow drag-and-drop functionality.
                */}
                <Reorder.Group 
                    axis="x"               // Enable horizontal dragging only
                    values={tasks}         // The data array to be reordered
                    onReorder={onReorder}  // Callback to update state in App.js
                    className="carousel-track"
                    style={{
                        display: 'flex',
                        gap: '20px',
                        // Shift the track horizontally based on the current index
                        transform: `translateX(-${currentIndex * (100 / 3)}%)`, 
                        transition: 'transform 0.5s ease-in-out',
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                    }}
                >
                    {tasks.map((task) => (
                        /* Wrap each task in Reorder.Item to make it draggable */
                        <Reorder.Item 
                            key={task.id} 
                            value={task}
                            style={{ 
                                // Each card ocupies roughly 1/3 of the container width
                                flex: '0 0 calc(33.333% - 14px)',
                                // Remove shadow during drag to prevent visual glitching/stacking
                                boxShadow: 'none' 
                            }}
                        >
                            <TaskItem 
                                task={task} 
                                onDelete={onDelete} 
                                onToggle={onToggle} 
                            />
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </div>

            {/* Right navigation button */}
            <button className="nav-button nav-next" onClick={nextSlide}>
                <ChevronRight size={24} />
            </button>
        </div>
    );
};

export default TaskList;