const data = [
  {
    'folder': true,
    'title': 'Pictures',
    'children': [
      {
        'title': 'logo.png'
      },
      {
        'folder': true,
        'title': 'Vacations',
        'children': [
          {
            'title': 'spain.jpeg'
          }
        ]
      }
    ]
  },
  {
    'folder': true,
    'title': 'Desktop',
    'children': [
      {
        'folder': true,
        'title': 'screenshots',
        'children': null
      }
    ]
  },
  {
    'folder': true,
    'title': 'Downloads',
    'children': [
      {
        'folder': true,
        'title': 'JS',
        'children': null
      },
      {
        'title': 'nvm-setup.exe'
      },
      {
        'title': 'node.exe'
      }
    ]
  },
  {
    'title': 'credentials.txt'
  }
];

const rootNode = document.getElementById('root');
let contextMenu = null;
let contextMenuOverlay = null; 
let choiceElement = null;
let input = null;

function renderContextMenu() {
  let div = document.createElement('div');
  div.classList.add('contextMenu', 'hide');
  div.innerHTML = '<p class="rename">Rename</p><p class="delete">Delete</p>';
  document.body.appendChild(div);
  document.querySelector('.rename').addEventListener('click', renameNode);
  document.querySelector('.delete').addEventListener('click', deleteNode);
}
function renderContextMenuOverlay(){
  let div = document.createElement('div');
  div.classList.add('contextMenuOverlay', 'hide');
  document.body.appendChild(div);
}
function renderFolder(el, parent) {
  let div = document.createElement('div');
  let wrapper = renderWrapper('folder', el);
  div.classList.add('folder');
  if (parent !== rootNode){
    div.classList.add('hide');
  }
  div.appendChild(wrapper);
  parent.appendChild(div);
  return div;
}
function renderFile(el, parent) {
  let div = document.createElement('div');
  let wrapper = renderWrapper('insert_drive_file', el);
  div.classList.add('file');
  if (parent !== rootNode){
    div.classList.add('hide');
  }
  div.appendChild(wrapper);
  parent.appendChild(div);
  return div;
}
function renderWrapper(typeIcon, el){ 
  let wrapper = document.createElement('div');
  wrapper.classList.add('wrapper');
  wrapper.appendChild(renderIcon(typeIcon));
  wrapper.appendChild(renderTitle(`${el.title}`));
  if (el.folder){
    wrapper.addEventListener('click', openCloseFolder);
    wrapper.addEventListener('contextmenu', ev => {
      choiceElement = ev.currentTarget;
    });
  }else if(!el.folder){
    wrapper.addEventListener('contextmenu', ev => {
      choiceElement = ev.currentTarget;
    });
  }
  return wrapper;
}
function renderIcon(typeIcon) {
  let i = document.createElement('i');
  i.classList.add('material-icons', 'icon');
  i.innerText = `${typeIcon}`;
  return i;
}
function renderTitle(title) {
  let p = document.createElement('p');
  p.classList.add('title');
  p.innerText = `${title}`;
  return p;
}
function renderInput(text){
  input = document.createElement('input');
  input.type = 'text';
  input.autofocus = true;
  input.value = text;
  input.classList.add('input');
}
function renderEmptyFolderStr(){
  let p = document.createElement('p');
  p.classList.add('emptyFolder')
  p.innerText = 'Folder is empty';
  return p;
}

rootNode.addEventListener('contextmenu', ev => {
  this.positionContextMenu.bind(this, ev)();
  this.positionContextMenuOverlay.bind(this, ev)();
  if(ev.target.id === 'root'){
    choiceElement = null;
    contextMenuOverlay.style.zIndex = '10';
  }else{
    contextMenuOverlay.style.zIndex = '-10';
  }
});
document.addEventListener('click', closeContextMenu);
function positionContextMenu(ev) {
  document.oncontextmenu = () => false;
  contextMenu.classList.remove('hide');
  contextMenu.style.top = ev.clientY + 'px';
  contextMenu.style.left = ev.clientX + 'px';
}
function positionContextMenuOverlay(ev) {
  contextMenuOverlay.classList.remove('hide');
  contextMenuOverlay.style.top = ev.clientY + 'px';
  contextMenuOverlay.style.left = ev.clientX + 'px';
}
function closeContextMenu() {
  contextMenu.classList.add('hide');
  contextMenuOverlay.classList.add('hide');
}
function openCloseFolder(ev){
  let filesInsideFolder = ev.currentTarget.parentElement.children;
  let tag_i = [...ev.currentTarget.children][0];
  if([...filesInsideFolder].length === 1){ 
    toggleEmpty([...filesInsideFolder][0].parentElement, true);
    changeIcon(tag_i);
  }else if ([...filesInsideFolder][1].classList.contains('emptyFolder')){ 
    toggleEmpty([...filesInsideFolder][1].parentElement, false);
    changeIcon(tag_i);
  }else{ 
    [...filesInsideFolder].forEach(el => {
      if(el.classList.contains('folder') || el.classList.contains('file')){
        el.classList.toggle('hide');
      }
    })
    changeIcon(tag_i);
  }
}
function renameNode(){
  input = null
  document.querySelectorAll('.input').forEach(el => el.remove());
  if(choiceElement){ 
    let p = [...choiceElement.children][1];
    let value = p.innerText;
    let indexDot = value.lastIndexOf('.');
    renderInput(value);
    p.classList.add('hide');
    choiceElement.appendChild(input);
    input.focus();
    if(indexDot !== -1){
      input.setSelectionRange(0, indexDot);
    }else{
      input.setSelectionRange(0, value.length);
    }  
    input.addEventListener('input', ev => {
      value = ev.target.value;
    });
    input.addEventListener('blur', () => {
      input.classList.add('hide');
      p.classList.remove('hide');
      p.innerText = value;        
      input.remove();
    })
    input.addEventListener('keydown', ev => {
      if(ev.code === 'Enter'){  
        input.classList.add('hide');
        p.classList.remove('hide');
        p.innerText = value; 
        input.blur();
        input.remove();
      }
    });
  }
}
function deleteNode() {
  if(choiceElement){    
    let fileOrFolder = choiceElement.parentElement;
    let parent = fileOrFolder.parentElement;
    parent.removeChild(fileOrFolder);
    if(parent.children.length === 1){
      toggleEmpty(parent, true);      
    }
  }
}
function changeIcon(tag_i) { 
  if(tag_i.innerText === 'folder'){
    tag_i.innerText = 'folder_open';
  }else if (tag_i.innerText === 'folder_open') {
    tag_i.innerText = 'folder';
  }
}
function toggleEmpty(element, isClose){ 
  if(isClose){
    element.appendChild(renderEmptyFolderStr());
  }else if(!isClose){
    element.removeChild(element.querySelector('.emptyFolder'));
  }
}
function createTree(data){
  let count = -1; 
  let parent ;
  return function renderTree(arr = data) { 
    if (!Array.isArray(arr)) {
      return;
    } else {
      count ++;
      arr.forEach(el => {
        if(!count) {
          parent = rootNode;
        }
        if(el.folder) {
          if(!el.children){
            renderFolder(el, parent);
          }else{
            parent = renderFolder(el, parent);
          }
          renderTree(el.children);
        } else {
          renderFile(el, parent);
        }
      })
    }
    count--;
  }();
}

document.addEventListener('DOMContentLoaded', () => {
  renderContextMenu();
  renderContextMenuOverlay();
  createTree.bind(this, data)();
  contextMenu = document.querySelector('.contextMenu');
  contextMenuOverlay = document.querySelector('.contextMenuOverlay');
});
