const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const tasksList = document.getElementById('tasks-list');
    const emptyState = document.getElementById('empty-state');

    let tasks = JSON.parse(localStorage.getItem('pomodoroTasks')) || [];
    
    function saveTasks() 
    {
      localStorage.setItem('pomodoroTasks', JSON.stringify(tasks));
    }

    function renderTasks() 
    {
      tasksList.innerHTML = '';
      
      if (tasks.length === 0)
        emptyState.style.display = 'block';
      else 
      {
        emptyState.style.display = 'none';
        
        tasks.forEach((task, index) => {
          const li = document.createElement('li');
          li.className = 'task-item';
          
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'task-checkbox';
          checkbox.checked = task.completed;
          checkbox.addEventListener('change', () => toggleTask(index));
          
          const span = document.createElement('span');
          span.className = 'task-text';
          if (task.completed)
            span.classList.add('completed');

          span.textContent = task.text;
          
          const deleteBtn = document.createElement('button');
          deleteBtn.className = 'delete-btn';
          deleteBtn.textContent = 'Delete';
          deleteBtn.addEventListener('click', () => deleteTask(index));
          
          li.appendChild(checkbox);
          li.appendChild(span);
          li.appendChild(deleteBtn);
          tasksList.appendChild(li);
        });
      }
    }

    function addTask() 
    {
      const text = taskInput.value.trim();
      if (text === '') 
      {
        alert('Please enter a task');
        return;
      }
      
      tasks.push({ text, completed: false });
      taskInput.value = '';
      saveTasks();
      renderTasks();
    }

    function toggleTask(index) 
    {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    }

    function deleteTask(index) 
    {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    }

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addTask();
    });

    renderTasks();