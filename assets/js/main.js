const $ = document.querySelector.bind(document);

const addTaskModal = $("#addTaskModal");

const addBtn = $(".add-btn");
const closeBtn = $(".modal-close");
const submitBtn = $(".btn-primary");
const cancelBtn = $(".btn-secondary");

const todoAppForm = $(".todo-app-form");
const inputElement = $("#taskTitle");
const taskDescription = $("#taskDescription");
const taskCategory = $("#taskCategory");
const taskPriority = $("#taskPriority");
const startTime = $("#startTime");
const endTime = $("#endTime");
const taskDate = $("#taskDate");
const taskColor = $("#taskColor");

const taskGrid = $(".task-grid");

const markComplete = $(".dropdown-item.complete");

const todoTasks = [];

// Render Task Function
function renderTasks() {
  let html = todoTasks
    .map((task) => {
      return `
        <div class="task-card ${task.cardColor}">
          <div class="task-header">
            <h3 class="task-title">${task.title}</h3>
            <button class="task-menu">
              <i class="fa-solid fa-ellipsis fa-icon"></i>
              <div class="dropdown-menu">
                <div class="dropdown-item">
                  <i class="fa-solid fa-pen-to-square fa-icon"></i>
                  Edit
                </div>
                <div class="dropdown-item complete">
                  <i class="fa-solid fa-check fa-icon"></i>
                  Mark as Complete
                </div>
                <div class="dropdown-item delete">
                  <i class="fa-solid fa-trash fa-icon"></i>
                  Delete
                </div>
              </div>
            </button>
          </div>
          <p class="task-description">
            ${task.description}
          </p>
          <div class="task-time">${task.startTime} - ${task.endTime}</div>
        </div>`;
    })
    .join("");

  taskGrid.innerHTML = html;
}

// Open Modal Function
function openModal() {
  addTaskModal.className = "modal-overlay show";
}

// Close Modal Function
function closeModal() {
  addTaskModal.className = "modal-overlay";
}

// Open modal + Auto focus input
addBtn.onclick = () => {
  openModal();
  setTimeout(() => {
    inputElement.focus();
  }, 50);
};

// Button close modal
closeBtn.onclick = closeModal;
cancelBtn.onclick = closeModal;

// Handle form submit
todoAppForm.onsubmit = (event) => {
  event.preventDefault();

  const newTask = {
    title: inputElement.value,
    description: taskDescription.value,
    category: taskCategory.value,
    priority: taskPriority.value,
    startTime: startTime.value,
    endTime: endTime.value,
    DueDate: taskDate.value,
    cardColor: taskColor.value,
    isCompleted: false,
  };

  todoAppForm.reset();

  todoTasks.unshift(newTask);

  renderTasks();
  closeModal();
};
