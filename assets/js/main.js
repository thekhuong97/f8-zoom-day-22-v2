const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const addTaskModal = $("#addTaskModal");
const addBtn = $(".add-btn");
const closeBtn = $(".modal-close");
const submitBtn = $(".btn-primary");
const cancelBtn = $(".btn-secondary");
const todoAppForm = $(".todo-app-form");
const inputElement = $("#taskTitle");
const taskGrid = $(".task-grid");
const markComplete = $(".dropdown-item.complete");

const todoTasks = JSON.parse(localStorage.getItem("todoTasks")) ?? [];

let editIndex = null;

// Open Modal + Auto Focus Function
function openModal() {
  addTaskModal.className = "modal-overlay show";
  setTimeout(() => {
    inputElement.focus();
  }, 50);
}

// Close Modal Function
function closeModal() {
  addTaskModal.className = "modal-overlay";

  const modalTitle = addTaskModal.querySelector(".modal-title");
  if (modalTitle.dataset.origin) {
    modalTitle.textContent = modalTitle.dataset.origin;
    delete modalTitle.dataset.origin;
  }

  const modalSubmitBtn = addTaskModal.querySelector(".btn-submit");
  if (modalSubmitBtn.dataset.origin) {
    modalSubmitBtn.textContent = modalSubmitBtn.dataset.origin;
    delete modalSubmitBtn.dataset.origin;
  }

  todoAppForm.reset();

  editIndex = null;

  // Xử lý cuộn lên trên khi đóng form
  const modal = addTaskModal.querySelector(".modal");
  setTimeout(() => {
    modal.scrollTop = 0;
  }, 200);
}

// Save Task Local Storage Function
function saveTaskLocal() {
  localStorage.setItem("todoTasks", JSON.stringify(todoTasks));
}

// Render Task Function
function renderTasks() {
  if (!todoTasks.length) {
    taskGrid.innerHTML = "<p>Chưa có task nào!</p>";
    return;
  }

  let html = todoTasks
    .map((task, index) => {
      return `
        <div class="task-card ${task.cardColor} ${
        task.isCompleted ? "completed" : ""
      }">
          <div class="task-header">
            <h3 class="task-title">${task.title}</h3>
            <button class="task-menu">
              <i class="fa-solid fa-ellipsis fa-icon"></i>
              <div class="dropdown-menu">
                <div class="dropdown-item edit-btn" data-index="${index}">
                  <i class="fa-solid fa-pen-to-square fa-icon"></i>
                  Edit
                </div>
                <div class="dropdown-item complete complete-btn" data-index="${index}">
                  <i class="fa-solid fa-check fa-icon"></i>
                  ${task.isCompleted ? "Mark as Active" : "Mark as Complete"}
                </div>
                <div class="dropdown-item delete delete-btn" data-index="${index}">
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

// Open modal + Auto focus input
addBtn.onclick = () => {
  openModal();
};

// Button close modal
closeBtn.onclick = closeModal;
cancelBtn.onclick = closeModal;

// Handle form submit
todoAppForm.onsubmit = (event) => {
  event.preventDefault();

  const formData = Object.fromEntries(new FormData(todoAppForm));

  // Bóc tách logic xử lý nếu ở chế độ sửa hoặc thêm mới
  if (editIndex) {
    todoTasks[editIndex] = formData;
  } else {
    formData.isCompleted = false;
    todoTasks.unshift(formData);
  }

  //Lưu danh sách các task vào Local Storage:
  saveTaskLocal();

  closeModal();

  renderTasks();
};

// Handle click edit
taskGrid.onclick = (event) => {
  const editBtn = event.target.closest(".edit-btn");
  const deleteBtn = event.target.closest(".delete-btn");
  const completeBtn = event.target.closest(".complete-btn");

  if (editBtn) {
    const taskIndex = editBtn.dataset.index;
    const task = todoTasks[taskIndex];

    editIndex = taskIndex;

    for (let key in task) {
      const value = task[key];
      const inputElement = $(`[name="${key}"]`);
      if (inputElement) {
        inputElement.value = value;
      }
    }

    const modalTitle = addTaskModal.querySelector(".modal-title");
    modalTitle.dataset.origin = modalTitle.textContent;
    modalTitle.textContent = "Edit Task";

    const modalSubmitBtn = addTaskModal.querySelector(".btn-submit");
    modalSubmitBtn.dataset.origin = modalSubmitBtn.textContent.trim();
    modalSubmitBtn.textContent = "Save Task";

    openModal();
  }

  if (deleteBtn) {
    const deleteIndex = deleteBtn.dataset.index;
    const task = todoTasks[deleteIndex];

    if (confirm(`Bạn chắc chắn muốn xoá công việc ${task.title}`)) {
      todoTasks.splice(deleteIndex, 1);
      saveTaskLocal();
      renderTasks();
    }
  }

  if (completeBtn) {
    completeIndex = completeBtn.dataset.index;
    const completeTask = todoTasks[completeIndex];
    completeTask.isCompleted = !completeTask.isCompleted;
    saveTaskLocal();
    renderTasks();
  }
};

// Render when the page loads
renderTasks();
