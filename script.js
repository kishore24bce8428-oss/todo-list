const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskDateInput = document.getElementById('task-date-input');
const taskTimeInput = document.getElementById('task-time-input');
const addTaskBtn = document.getElementById('add-task-btn');
const tasksContainer = document.getElementById('tasks-container');

let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
let editingTaskId = null;

const setLocalStorage=() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
}

const createTaskElement = (taskId, taskText, taskDate, taskTime) => {
        const date=taskDate.split('-');
        const time=taskTime.split(':');

        const taskContainer = document.createElement('div');
        taskContainer.classList.add('task-container');
        taskContainer.setAttribute('id', taskId);

        const taskDateHolder=document.createElement('p');
        taskDateHolder.classList.add('task-date');
        taskDateHolder.textContent=`${date[2]}/${date[1]}/${date[0]}`;

        const taskDetails=document.createElement('p');
        taskDetails.classList.add('task-details');

        const taskDescription = document.createElement('span');
        taskDescription.classList.add('task-description');
        taskDescription.textContent = taskText;

        const taskTimeHolder=document.createElement('span');
        taskTimeHolder.classList.add('task-time');
        taskTimeHolder.textContent=` ${time[0]%12}:${time[1]} ${time[0]>=12?'PM':'AM'}`;

        taskDetails.appendChild(taskDescription);
        taskDetails.appendChild(taskTimeHolder);

        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => {
                taskInput.value = taskText;
                addTaskBtn.textContent = 'Update Task';
                editingTaskId = taskId;
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
                taskContainer.remove();
                tasks=tasks.filter((task) => task.id!==taskId);
                setLocalStorage();
        });


        taskContainer.appendChild(taskDateHolder);
        taskContainer.appendChild(taskDetails);
        taskContainer.appendChild(editBtn);
        taskContainer.appendChild(deleteBtn);
        tasksContainer.appendChild(taskContainer);

}

const loadTasks=() => {
        tasks.forEach(task => {
                createTaskElement(task.id, task.text, task.date, task.time);
        });
}

const addTask=() => {

        const taskText = taskInput.value.trim();
        const taskDate = taskDateInput.value;
        const taskTime = taskTimeInput.value;
        const taskId=Date.now();

        tasks.push({id: taskId, text: taskText, date: taskDate, time: taskTime});
        createTaskElement(taskId,taskText, taskDate, taskTime);
        setLocalStorage();

        taskInput.value = '';
        taskDateInput.value = '';
        taskTimeInput.value = '';

}

const editTask=() => {
        const updatedTaskText = taskInput.value.trim();
        const taskId=editingTaskId;
        const taskEle=document.getElementById(taskId);
        const taskDescription=taskEle.querySelector('.task-description');
        taskDescription.textContent=updatedTaskText;

        const editingTask=tasks.find((task) => task.id===taskId);
        editingTask.text=updatedTaskText;
        setLocalStorage();

        addTaskBtn.textContent = 'Add Task';
        taskInput.value='';
        editingTaskId = null;
}

const manageFormSubmission = (event) => {
        event.preventDefault();
        if(addTaskBtn.textContent === 'Add Task') {
                addTask();
        }else{
                editTask();
        }
}
taskForm.addEventListener('submit',manageFormSubmission);
loadTasks();