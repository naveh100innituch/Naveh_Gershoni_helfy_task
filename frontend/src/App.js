import React, { useState, useEffect, useMemo } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskFilter from './components/TaskFilter';
import { Sun, Moon, Search } from 'lucide-react';
import { getTasks, createTask, deleteTask, toggleTaskStatus } from './services/api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('none');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync body class with state for global theme styles
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode-body');
    } else {
      document.body.classList.remove('dark-mode-body');
    }
  }, [isDarkMode]);

  // Load initial dataa
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data || []);
    } catch (err) {
      console.error("App: Error fetching tasks", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Adds a new task.
   * WORKAROUND: The API response doesn't include the 'dueDate' yet,
   * so we manually merge the form data to make sure it shows up in the UI immediately.
   */
  const handleAddTask = async (taskData) => {
    try {
      const newTaskFromApi = await createTask(taskData);
      
      const finalTask = {
        ...newTaskFromApi, // ID and createdAt from server
        ...taskData,       // Force client-side data (title, dueDate) into the state
        completed: false
      };

      setTasks(prev => [...prev, finalTask]);
    } catch (err) {
      console.error("App: Failed to add task", err);
    }
  };

  const handleDeleteTask = async (id) => {
    // Quick confirm to prevent accidents
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("App: Failed to delete task", err);
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const updated = await toggleTaskStatus(id);
      
      setTasks(prev => prev.map(t => {
        if (t.id === id) {
          // Safety check: if server returns partial data, fallback to flipping the boolean locally
          const isCompleted = updated.completed !== undefined ? updated.completed : !t.completed;
          return { ...t, completed: isCompleted };
        }
        return t;
      }));
    } catch (err) {
      console.error("App: Failed to toggle status", err);
    }
  };

  const handleReorder = (newOrder) => {
    setTasks(newOrder);
  };

  // Main logic for filtering and sorting.
  // Using useMemo here because the list might get long and we don't want to re-calc on every render.
  const processedTasks = useMemo(() => {
    let result = [...tasks];

    //Filter by Status & Search
    result = result.filter(t => {
      const matchesFilter = filter === 'all' ? true : filter === 'completed' ? t.completed : !t.completed;
      
      // Simple case-insensitive serch
      const titleMatch = t.title.toLowerCase().includes(search.toLowerCase());
      const descMatch = t.description && t.description.toLowerCase().includes(search.toLowerCase());
      
      return matchesFilter && (titleMatch || descMatch);
    });

    // Sort result
    if (sortBy !== 'none') {
      result.sort((a, b) => {
        switch (sortBy) {
          case 'priority':
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
          
          case 'date':
            return new Date(b.createdAt) - new Date(a.createdAt);
          
          case 'dueDate':
              // Handle null dates push them to the bottom
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
          
          default:
            return 0;
        }
      });
    }

    return result;
  }, [tasks, filter, search, sortBy]);

  return (
    <div className={`app-wrapper ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="app-container">
        
        <button 
          className="theme-toggle" 
          onClick={() => setIsDarkMode(!isDarkMode)}
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <h1>Task Manager</h1>
        
        <TaskForm onAddTask={handleAddTask} />

        {/* Controls: Search & Sort */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '20px 0' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#888' }} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="form-input" 
              style={{ paddingLeft: '35px', width: '200px' }}
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </div>

          <select 
            className="form-select" 
            style={{ width: '150px' }} 
            onChange={(e) => setSortBy(e.target.value)}
            value={sortBy}
          >
            <option value="none">Sort by...</option>
            <option value="priority">High Priority</option>
            <option value="date">Newest First</option>
            <option value="dueDate">Due Date (Soonest)</option>
          </select>
        </div>

        <TaskFilter currentFilter={filter} onFilterChange={setFilter} />

        {loading ? (
          <div className="loading-state">Loading tasks...</div>
        ) : (
          <TaskList 
            tasks={processedTasks} 
            onDelete={handleDeleteTask} 
            onToggle={handleToggleTask} 
            onReorder={handleReorder}
          />
        )}
      </div>
    </div>
  );
}

export default App;