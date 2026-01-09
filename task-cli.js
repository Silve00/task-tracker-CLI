"use strict mode "
/*
const fs = require('fs');
const filePath = "./tasks.json";

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([])); //This creates the file. the empty array for a task tracker is a list of collection of items
}

//In a CLI , the use sends a request to the computer through typing

const args = process.argv.slice(2); 
const action = args[0];
const taskDescription = args[1];
//process.argv is a list of array of everything you typed in the terminal
//argv[0] is the path to Node
//argv[1] is the path to your script
//slice 2 slices off  the first 2 useless items so the args[0] becomes the first word type e.g ADD

if (action === 'add') {
    //1. Reads what's in the file 
    const data = fs.readFileSync(filePath, 'utf8');
    const tasks = JSON.parse(data);

}
*/

const fs = require('fs'); // 'require' imports the built-in File System module.
const FILE_NAME = 'tasks.json'; // The name of our "database" file.

// 'process' is a global object in Node.js that provides info about the current process.
// 'argv' stands for "argument vector" (a list of words typed in the terminal).
const args = process.argv.slice(2); 

// .slice(2) is used because the first two elements are always:
// 0: The path to the Node engine
// 1: The path to your file
// We only care about everything AFTER those two.
const command = args[0]; // The first word (e.g., 'add')
const arg1 = args[1]; // The second word (e.g., the task description)
const arg2 = args[2];


// This function loads the tasks from the file
function getTasks() {
    // If the file doesn't exist, return an empty list []
    if (!fs.existsSync(FILE_NAME)) {
        return [];
    }
    // Read the file content
    const data = fs.readFileSync(FILE_NAME, 'utf8');
    // JSON.parse converts the text string back into a JavaScript Array/Object
    return JSON.parse(data);
}

// This function saves the tasks list to the file
function saveTasks(tasks) {
    // JSON.stringify converts the Array into a text string
    // null, 2 makes the JSON look "pretty" with indentations
    const data = JSON.stringify(tasks, null, 2);
    fs.writeFileSync(FILE_NAME, data);
}

if (command === 'add') {
    const tasks = getTasks();
    const newTask = {
        id: tasks.length + 1,
        description: arg1,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasks(tasks);
    console.log(`Task added successfully (ID: ${newTask.id})`);
}

if (command === 'list') {
    const tasks = getTasks();
    // Check if user typed 'list done' or 'list in-progress'
    const statusFilter = arg1; 

    tasks.forEach(task => {
        // If no filter, or if task status matches the filter, print it
        if (!statusFilter || task.status === statusFilter) {
            console.log(`${task.id}: ${task.description} [${task.status}]`);
        }
    });
}

if (command === 'update') {
    const tasks = getTasks();
    // We search through the list for a task with the ID provided in the terminal
    const task = tasks.find(t => t.id === parseInt(arg1));

    if (task) {
        task.description = arg2; // Update the text
        task.updatedAt = new Date(); // Update the timestamp
        saveTasks(tasks);
        console.log("Task updated successfully!");
    } else {
        console.log("Error: Task ID not found.");
    }
}

if (command === 'delete') {
    const tasks = getTasks();
    // .filter creates a NEW list excluding the ID we want to delete
    const filteredTasks = tasks.filter(t => t.id !== parseInt(arg1));
    
    saveTasks(filteredTasks);
    console.log("Task deleted.");
}

if (command === 'mark-in-progress') {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === parseInt(arg1));
    if (task) {
        task.status = 'in-progress';
        saveTasks(tasks);
        console.log("Task marked as in progress.");
    }
}

if (command === 'mark-done') {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === parseInt(arg1));
    if (task) {
        task.status = 'done';
        saveTasks(tasks);
        console.log("Task marked as done.");
    }
}

if (command === 'delete') {
    const tasks = getTasks();
    // .filter(t => ...) goes through every task (t). 
    // It keeps tasks where the ID is NOT equal to the one we want to delete.
    const newTasks = tasks.filter(task => task.id !== parseInt(arg1));
    
    saveTasks(newTasks);
    console.log("Task deleted successfully.");
}

if (command === 'mark-done') {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === parseInt(arg1));
    
    if (task) {
        task.status = 'done';
        task.updatedAt = new Date().toISOString();
        saveTasks(tasks);
        console.log("Task marked as done!");
    } else {
        console.log("Task not found.");
    }
}

const validCommands = ['add', 'list', 'update', 'delete', 'mark-in-progress', 'mark-done'];

// If the user types something like 'node task-cli.js dance'
if (command && !validCommands.includes(command)) {
    console.log(`Error: '${command}' is not a valid command.`);
    console.log("Try: add, list, update, delete, mark-in-progress, or mark-done");
}