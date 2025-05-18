const list = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');

let todos = [];
let nextId = 1;

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
  const saved = localStorage.getItem('todos');
  if (saved) {
    todos = JSON.parse(saved);
    nextId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
  }
}

function newTodo() {
  const text = prompt("Введіть нову справу:");
  if (text) {
    const todo = {
      id: nextId++,
      text: text,
      done: false
    };
    todos.push(todo);
    saveTodos();
    render();
    updateCounter();
  }
}

function renderTodo(todo) {
  return `
    <li class="list-group-item">
      <input type="checkbox" class="form-check-input me-2" id="${todo.id}" ${todo.done ? 'checked' : ''} onchange="checkTodo(${todo.id})" />
      <label for="${todo.id}">
        <span class="${todo.done ? 'text-success text-decoration-line-through' : ''}">
          ${todo.text}
        </span>
      </label>
      <button class="btn btn-danger btn-sm float-end" onclick="deleteTodo(${todo.id})">delete</button>
    </li>
  `;
}

function render() {
  list.innerHTML = todos.map(renderTodo).join('');
}

function updateCounter() {
  itemCountSpan.textContent = todos.length;
  uncheckedCountSpan.textContent = todos.filter(todo => !todo.done).length;
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  render();
  updateCounter();
}

function checkTodo(id) {
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    todo.done = !todo.done;
    saveTodos();
    render();
    updateCounter();
  }
}

loadTodos();
render();
updateCounter();
