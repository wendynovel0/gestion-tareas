document.addEventListener('DOMContentLoaded', (event) => {
    loadTasks();

    document.querySelector('button[type="submit"]').addEventListener('click', (e) => {
        e.preventDefault();
        addTask();
    });
});

function addTask() {
    const taskNameInput = document.getElementById('taskName');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const responsibleInput = document.getElementById('responsible');

    if (!taskNameInput.value.trim()) {
        taskNameInput.setCustomValidity('Este campo es obligatorio.');
        taskNameInput.reportValidity();
        return;
    } else {
        taskNameInput.setCustomValidity('');
    }

    if (!startDateInput.value) {
        startDateInput.setCustomValidity('Este campo es obligatorio.');
        startDateInput.reportValidity();
        return;
    } else {
        startDateInput.setCustomValidity('');
    }

    if (!endDateInput.value) {
        endDateInput.setCustomValidity('Este campo es obligatorio.');
        endDateInput.reportValidity();
        return;
    } else {
        endDateInput.setCustomValidity('');
    }

    if (!responsibleInput.value.trim()) {
        responsibleInput.setCustomValidity('Este campo es obligatorio.');
        responsibleInput.reportValidity();
        return;
    } else {
        responsibleInput.setCustomValidity('');
    }

    if (new Date(startDateInput.value) > new Date(endDateInput.value)) {
        endDateInput.setCustomValidity('La fecha de fin no puede ser menor que la fecha de inicio.');
        endDateInput.reportValidity();
        return;
    } else {
        endDateInput.setCustomValidity('');
    }

    const task = {
        id: Date.now(),
        name: taskNameInput.value.trim(),
        startDate: startDateInput.value,
        endDate: endDateInput.value,
        responsible: responsibleInput.value.trim(),
        completed: false
    };

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    displayTask(task);
    clearForm();

    // Mostrar mensaje de confirmación
    const confirmationMessage = document.getElementById('confirmationMessage');
    confirmationMessage.textContent = 'Tarea agregada exitosamente.';
    confirmationMessage.style.display = 'block';
    
    // Ocultar el mensaje después de unos segundos
    setTimeout(() => {
        confirmationMessage.style.display = 'none';
    }, 3000);
}



function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        displayTask(task);
    });
}

function displayTask(task) {
    const taskList = document.getElementById('taskList');
    const taskItem = document.createElement('li');
    taskItem.className = 'list-group-item';
    const currentDate = new Date();
    const endDate = new Date(task.endDate);
    
    if (task.completed) {
        taskItem.classList.add('completed');
    } else if (currentDate > endDate) {
        taskItem.classList.add('expired');
    } else {
        taskItem.classList.add('pending');
    }
    
    taskItem.innerHTML = `
        <span class="task-text">
            ${task.name} (Responsable: ${task.responsible})<br>
            Inicio: ${task.startDate} - Fin: ${task.endDate}
        </span>
        <div class="task-actions">
            ${!task.completed && currentDate <= endDate ? `<button class="btn task-btn task-btn-success" onclick="markTaskCompleted(${task.id})"><i class="fi fi-tr-comment-alt-check"></i> Marcar Completada</button>` : ''}
            ${task.completed ? `<button class="btn task-btn task-btn-warning" onclick="unmarkTaskCompleted(${task.id})"><i class="fi fi-ts-undo"></i> Desmarcar</button>` : ''}
            <button class="btn task-btn task-btn-danger" onclick="deleteTask(${task.id})"><i class="fi fi-tr-trash-plus"></i> Eliminar</button>
        </div>
    `;
    taskList.appendChild(taskItem);
}

function markTaskCompleted(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            task.completed = true;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    refreshTaskList();
}

function unmarkTaskCompleted(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            task.completed = false;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    refreshTaskList();
}

function deleteTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    refreshTaskList();
}

function refreshTaskList() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    loadTasks();
}

function clearForm() {
    document.getElementById('taskName').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('responsible').value = '';
}

function searchTasks() {
    const searchTerm = document.getElementById('searchTask').value.toLowerCase();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => 
        task.name.toLowerCase().includes(searchTerm) || 
        task.responsible.toLowerCase().includes(searchTerm)
    );
    tasks.forEach(task => {
        displayTask(task);
    });
}
