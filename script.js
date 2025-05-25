const list = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');
const statusDiv = document.getElementById('status');


const DB_URL = "https://lab7-1336b-default-rtdb.firebaseio.com/";

let todos = [];

async function loadFromFirebase() {
  statusDiv.textContent = 'Завантаження...';
  try {
    const response = await fetch(`${DB_URL}.json`);
    const data = await response.json();

    todos = [];
    if (data) {
      for (let id in data) {
        todos.push({ id, ...data[id] });
      }
    }

    statusDiv.textContent = '';
    render();
    updateCounter();
  } catch (e) {
    statusDiv.textContent = '❌ Помилка завантаження даних';
    console.error(e);
  }
}

async function addTodo(text) {
  try {
    const response = await fetch(`${DB_URL}.json`, {
      method: 'POST',
      body: JSON.stringify({ text: text, done: false }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    const todo = { id: data.name, text, done: false };
    todos.push(todo);
    render();
    updateCounter();
  } catch (e) {
    statusDiv.textContent = '❌ Помилка додавання справи';
    console.error(e);
  }
}

function newTodo() {
  const text = prompt("Введіть нову справу:");
  if (text) {
    addTodo(text);
  }
}

function renderTodo(todo) {
  return `
    <li class="list-group-item">
      <input type="checkbox" class="form-check-input me-2" id="${todo.id}" ${todo.done ? 'checked' : ''} onchange="checkTodo('${todo.id}')" />
      <label for="${todo.id}">
        <span class="${todo.done ? 'text-success text-decoration-line-through' : ''}">
          ${todo.text}
        </span>
      </label>
      <button class="btn btn-danger btn-sm float-end" onclick="deleteTodo('${todo.id}')">delete</button>
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

async function deleteTodo(id) {
  try {
    await fetch(`${DB_URL}/${id}.json`, {
      method: 'DELETE'
    });
    todos = todos.filter(todo => todo.id !== id);
    render();
    updateCounter();
  } catch (e) {
    statusDiv.textContent = '❌ Помилка видалення справи';
    console.error(e);
  }
}

async function checkTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;

  const updated = { done: !todo.done };

  try {
    await fetch(`${DB_URL}/${id}.json`, {
      method: 'PATCH',
      body: JSON.stringify(updated),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    todo.done = !todo.done;
    render();
    updateCounter();
  } catch (e) {
    statusDiv.textContent = '❌ Помилка оновлення справи';
    console.error(e);
  }
}


loadFromFirebase();
