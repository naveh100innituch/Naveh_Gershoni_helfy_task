const express = require('express'); //As required in the task
const cors = require('cors'); //As required in the task
// I used app.use to run the Middleware. 
// cors allows React to talk to the server, and express.json makes the server understand when send it information in JSON format.
const app = express(); //As required in the task
const PORT = 4000; //As required in the task

// Middleware configuration
app.use(cors()); // Resource Sharing between different origins
app.use(express.json()); // Parse incoming JSON payloads 

// In-memory data storage (instead of connecting to an external database (like MongoDB), should defined a simple variable that holds an empty array. All tasks are pushed into or filtered from it.)
let tasks = [];

// GET - Get all tasks
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// POST -Create a new task
app.post('/api/tasks', (req, res) => {
    const { title, description, priority } = req.body;

    // Basic validation (check if the user submitted a title. if not - stop the function and return an error.)
    if (!title) {
        return res.status(400).json({ error: 'Title is required' }); 
    }

    const newTask = {
        id: Date.now(), // Unique ID based on timestamp
        title,
        description: description || '',
        completed: false,
        createdAt: new Date(),
        priority: priority || 'low' // I added a priority field to the task, which can be 'low', 'medium', or 'high'. If the user doesn't provide a priority, it defaults to 'low' because he probably dont care about it.
    };

    tasks.push(newTask);
    res.status(201).json(newTask); // 201: Created
});

// 3. PUT- Update a task
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, priority } = req.body;
    
    // Find the task index
    const taskIndex = tasks.findIndex(t => t.id === Number(id));

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' }); // Dont delete or update a task that doesnt exist. Return an error if the task is not found.
    }

    // Update the task keeping other fields intact
    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title: title || tasks[taskIndex].title,
        description: description || tasks[taskIndex].description,
        priority: priority || tasks[taskIndex].priority
    };

    res.json(tasks[taskIndex]);
});

// 4. DELETE - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    // Filter out the task with the given ID
    tasks = tasks.filter(t => t.id !== Number(id));
    res.status(204).send(); // 204: No Content - I succeeded and I have no content to return to you because I deleted it.
});

// 5. PATCH - Toggle completion status
app.patch('/api/tasks/:id/toggle', (req, res) => {
    const { id } = req.params;
    const task = tasks.find(t => t.id === Number(id));

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    task.completed = !task.completed;
    res.json(task);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});