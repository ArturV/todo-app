let today = new Date().toISOString().split(".")[0];

const minInputLength = 3;
const maxInputLength = 160;
const formInputLengthError = "Todo must be between 3 and 160 characters";

const todoItems = JSON.parse(localStorage.getItem("todo") || "[]");

const testDataTodo = {
  id: generateID(),
  todo: "Go to the moon",
  deadline: "2023-12-30T00:00",
  addedData: getTodayDate(),
  completed: false,
};

const testDataTodo2 = {
  id: generateID() + 1,
  todo: "Buy a chocolate for wife",
  deadline: "2023-07-30T00:00",
  addedData: getTodayDate(),
  completed: false,
};

const generateID = () => {
  return Date.now() + Math.round(Math.random() * 1_000);
};

const getTodayDate = () => {
  return new Date().toISOString().split(".")[0];
  // return new Date().toLocaleString("lt-LT");
};

window.addEventListener("storage", () => {
  window.location.reload(true);
});

window.onload = loadTodo();

function loadTodo() {
  if (localStorage.getItem("todo") === null) {
    localStorage.setItem(
      "todo",
      JSON.stringify([
        ...JSON.parse(localStorage.getItem("todo") || "[]"),
        testDataTodo,
        testDataTodo2,
      ])
    );
    renderTodo();
  } else {
    renderTodo();

    todoItems.forEach((todoItem) => {
      const doneCheckbox = document.getElementById(
        `doneCheckbox-${todoItem.id}`
      );
      if (todoItem.completed) {
        doneCheckbox.checked = true;

        const h3 = document.getElementById(`todo-${todoItem.id}`);
        if (h3) {
          h3.style.textDecoration = true ? "line-through" : "none";
        }
      }
    });
  }
}

window.onload = loadTodo();

const handleFormSubmit = (event) => {
  event.preventDefault();
  getInputFields(event);
  window.location.reload();
};

const getInputFields = (event) => {
  event.preventDefault();
  const todoInput = document.body.querySelector("input[name=todoInput]").value;
  const dateInput = document.body.querySelector("input[name=dateInput]").value;

  if (todoInput.length < minInputLength || todoInput.length > maxInputLength) {
    alert(formInputLengthError);
  } else {
    if (dateInput === "") {
      console.log("date");
      addTodo();
    } else {
      if (dateInput < today) {
        console.log(dateInput, today);

        alert("Date must be today or later");
      } else {
        console.log("date");
        addTodo();
      }
    }
  }
  resetForm();
};

const resetForm = () => {
  document.body.querySelector("input[name=todoInput]").value = "";
  document.body.querySelector("input[name=dateInput]").value = "";
};

const addTodo = () => {
  localStorage.setItem(
    "todo",
    JSON.stringify([
      ...JSON.parse(localStorage.getItem("todo") || "[]"),
      {
        id: generateID(),
        todo: todoInput.value,
        deadline: dateInput.value,
        addedData: getTodayDate(),
        completed: false,
      },
    ])
  );
  renderTodo();
};

function renderTodo() {
  const todoList = document.body.querySelector(".todoList");
  todoList.innerHTML = `<div class="todoItemHead"><p>Todo item |</p><p>Time left |</p> <p>Navigations</p></div>`;

  todoItems.forEach((todoItem) => {
    const todoItemElement = document.createElement("li");
    todoItemElement.className = "todo-item";
    todoItemElement.innerHTML = `
                <div class="todoItem">
                    <h3 id="todo-${todoItem.id}">${todoItem.todo}</h3>
                  
                    <div class="timeleft"><p>${timeLeft(
                      today,
                      todoItem.deadline
                    )}</p></div>
                    <div class="buttons">
                    <input type="checkbox" name="doneCheckbox" id="doneCheckbox-${
                      todoItem.id
                    }"  onchange="todoDone(${todoItem.id})" />
                    <button onclick="handleToDelete(${
                      todoItem.id
                    })" type="delete" id="edit">Delete</button>
                </div>
                </div>

            `;
    todoList.appendChild(todoItemElement);
  });
}

const handleToDelete = (id) => {
  const shouldDelete = window.confirm("Are you want to delete?");

  if (!shouldDelete) {
    return;
  } else {
    const filterId = todoItems.filter((element) => element.id !== id);

    localStorage.setItem("todo", JSON.stringify(filterId));
    window.location.reload();
  }
};

const todoDone = (id) => {
  const filterComplete = todoItems.findIndex((element) => element.id === id);

  if (filterComplete !== -1) {
    todoItems[filterComplete].completed = true;
    localStorage.setItem("todo", JSON.stringify(todoItems));
  }

  const h3 = document.getElementById(`todo-${id}`);
  if (h3) {
    h3.style.textDecoration = event.target.checked ? "line-through" : "none";
  }
};

function timeLeft(today, calcDeadline) {
  const diff = new Date(today) - new Date(calcDeadline);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${days}d, ${hours}h, ${minutes}min`.replace(/-/g, "");
}
