const API_URL = '/api/tasks';

// Get all tasks
export const getTasks = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch');
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Create task
export const createTask = async (taskData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Delete task
export const deleteTask = async (id) => {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Toggle status
export const toggleTaskStatus = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}/toggle`, { method: 'PATCH' });
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};