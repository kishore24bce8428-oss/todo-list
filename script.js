const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskDateInput = document.getElementById('task-date-input');
const taskTimeInput = document.getElementById('task-time-input');
const addTaskBtn = document.getElementById('add-task-btn');
const tasksContainer = document.getElementById('tasks-container');
const filterTasksInput=document.getElementById('filter-tasks-input');

let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
let dueTasks;
let todayTasks;
let upcomingTasks;
let filteredTasks= tasks;
let editingTaskId = null;
const currentDate=new Date();
currentDate.setHours(0,0,0,0);

const filterTasks=() => {
        const inputText=filterTasksInput.value.toLowerCase();
        filteredTasks=tasks.filter(task => {
                const taskText=task.text.toLowerCase();
                return taskText.includes(inputText);
        });
        loadTasks();
}

filterTasksInput.addEventListener('input',filterTasks);

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
        taskTimeHolder.textContent=` ${time[0]%12||12}:${time[1]} ${time[0]>=12?'PM':'AM'}`;

        taskDetails.appendChild(taskDescription);
        taskDetails.appendChild(taskTimeHolder);

        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.type='button';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => {
                taskInput.value = taskText;
                addTaskBtn.textContent = 'Update Task';
                editingTaskId = taskId;
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.type='button';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
                tasks=tasks.filter((task) => task.id !==taskId);
                filterTasks();
        });


        taskContainer.appendChild(taskDateHolder);
        taskContainer.appendChild(taskDetails);
        taskContainer.appendChild(editBtn);
        taskContainer.appendChild(deleteBtn);
        return taskContainer;

}

const loadDueTasks=() => {
        if(dueTasks.length>0 || todayTasks.length>0){
                const dueTasksContainer=document.createElement('div');
                dueTasksContainer.setAttribute('id','due-tasks-container');
                const dueHeading=document.createElement('h2');
                dueHeading.textContent='Due Tasks';
                dueTasksContainer.appendChild(dueHeading);
                
                dueTasks.forEach(task => {
                        const taskContainer=createTaskElement(task.id,task.text,task.date,task.time);
                        dueTasksContainer.appendChild(taskContainer);
                });
                if(todayTasks.length>0){
                        const todayTasksContainer=document.createElement('div');
                        todayTasksContainer.setAttribute('id','today-tasks-container');
                        const todayHeading=document.createElement('h3');
                        todayHeading.textContent='Today';
                        todayTasksContainer.appendChild(todayHeading);
                        todayTasks.forEach((task) => {
                                const taskContainer=createTaskElement(task.id,task.text,task.date,task.time);
                                taskContainer.querySelector('.task-date').remove();
                                todayTasksContainer.appendChild(taskContainer);
                        });
                        dueTasksContainer.appendChild(todayTasksContainer);
                }
                tasksContainer.appendChild(dueTasksContainer);
        }
}

const loadUpcomingTasks=() => {
        if(upcomingTasks.length>0){
                const upcomingTasksContainer=document.createElement('div');
                upcomingTasksContainer.setAttribute('id','upcoming-tasks-container');
                const upcomingHeading=document.createElement('h2');
                upcomingHeading.textContent='Upcoming Tasks';
                upcomingTasksContainer.appendChild(upcomingHeading);
                upcomingTasks.forEach((task) => {
                        const taskContainer=createTaskElement(task.id,task.text,task.date,task.time);
                        upcomingTasksContainer.appendChild(taskContainer);
                });
                tasksContainer.appendChild(upcomingTasksContainer);
        }
}

const loadTasks=() => {
        tasksContainer.innerHTML='';
        dueTasks=filteredTasks.filter((task) => {
                const taskDate=new Date(`${task.date}`);
                taskDate.setHours(0,0,0,0);
                return taskDate<currentDate;
        });
        todayTasks=filteredTasks.filter((task) => {
                const taskDate=new Date(`${task.date}`);
                taskDate.setHours(0,0,0,0);
                return taskDate.getTime()===currentDate.getTime();
        });
        upcomingTasks=filteredTasks.filter((task) => {
                const taskDate=new Date(`${task.date}`);
                taskDate.setHours(0,0,0,0);
                return taskDate>currentDate;
        });
        setLocalStorage();
        loadDueTasks();
        loadUpcomingTasks();
}

const addTask=() => {

        const taskText = taskInput.value.trim();
        const taskDate = taskDateInput.value;
        const taskTime = taskTimeInput.value;
        const taskId=Date.now();

        tasks.push({id: taskId, text: taskText, date: taskDate, time: taskTime});
        filterTasks();

        taskInput.value = '';
        taskDateInput.value = '';
        taskTimeInput.value = '';

}

const editTask=() => {
        const updatedTaskText = taskInput.value.trim();
        const taskId=editingTaskId;

        const editingTask=tasks.find((task) => task.id===taskId);
        editingTask.text=updatedTaskText;
        filterTasks();

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