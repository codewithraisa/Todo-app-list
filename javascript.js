let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');
const counter = document.getElementById('counter');

function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function render() {
  list.innerHTML = '';
  let filtered = todos.filter(t => {
    if(currentFilter === 'active') return !t.completed;
    if(currentFilter === 'completed') return t.completed;
    return true;
    
  });

  filtered.forEach(todo => {
    let li = document.createElement('li');
    
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.onchange = () => {
      todo.completed = !todo.completed;
      save(); render();
    };

    let done = todos.filter(t=>t.completed).length;
document.getElementById('progress-fill').style.width = todos.length ? (done/todos.length*100)+'%' : '0%';

    let span = document.createElement('span');
    span.textContent = todo.text;
    if(todo.completed) span.style.textDecoration = 'line-through';
    span.style.opacity = todo.completed ? '0.5' : '1';

    // Double click to edit - PRO feature
   span.ondblclick = () => {
    let i = document.createElement('input');
   i.value = todo.text;
   i.style.flex = '1';
   span.replaceWith(i);
   i.focus();
   i.onblur = () => { todo.text = i.value.trim() || todo.text; save(); render(); }
   i.onkeydown = (e) => { if(e.key === 'Enter') i.blur(); }
};

    let del = document.createElement('button');
    del.textContent = '✕';
    del.onclick = () => {
      todos = todos.filter(x => x.id !== todo.id);
      save(); render();
    };

    li.append(checkbox, span, del);
    list.appendChild(li);
  });

  counter.textContent = `${todos.filter(t=>!t.completed).length} tasks left • Double-click to edit`;
}

addBtn.onclick = () => {
  let text = input.value.trim();
  if(!text) return;
  todos.push({ id: Date.now(), text, completed: false });
  input.value = '';
  save(); render();
};

input.addEventListener('keypress', (e) => {
  if(e.key === 'Enter') addBtn.click();
});

document.querySelectorAll('.filter').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  }
});

render();

