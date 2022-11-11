// ****** SELECT ITEMS **********
const alert =  document.querySelector('.alert');
const form =  document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');


// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** EVENT LISTENERS **********
// submit form
form.addEventListener('submit',addItem);
// clear items
clearBtn.addEventListener('click', clearItems);
// load items
window.addEventListener('DOMContentLoaded', setUpItems);
// ******End OF EVENT LISTENERS **********

// ****** FUNCTIONS **********
 function addItem(e) {
    e.preventDefault();
    const value = grocery.value;
    // console.log(value);
    const id = new Date().getTime().toString();
    // console.log(id);
    if(value && !editFlag){
        // creat Item
        createListItem(id, value);
        // display alert
        displayAlert('item added to the list', 'success');
        // show my container
        container.classList.add('show-container');
        // add to local storage
        addToLocalStorage(id, value);
        // set to back default
        setBackToDefault();

    }
    else if(value && editFlag){
        editElement.innerHTML = value;
        displayAlert('value changed successfully', 'success');
        // edit localstorage
        editLocalStorage(editID, value);
        setBackToDefault();
    }
    else{
        displayAlert('please enter a value', 'danger');
    }
};

// display alert
const displayAlert = (text, action) => {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    // set timeout
    setTimeout( () => {
        alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
    },1000);
};

// clear items
function clearItems () {
    const items =document.querySelectorAll('.grocery-item');
    if(items.length > 0){
        items.forEach((item) => {
            list.removeChild(item);
        });
    }
    container.classList.remove('show-container');
    displayAlert('deleted all items', 'danger');
    setBackToDefault();
    localStorage.removeItem('list');

};
// deleete item
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    id = element.dataset.id;
    list.removeChild(element);
    if (list.children.length === 0) {
        container.classList.remove("show-container");
      }
    // container.classList.remove('show-container');
    displayAlert('item removed', 'danger');
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}
// edit item
const editItem = (e) => {
    const element = e.currentTarget.parentElement.parentElement;
    // set edit element
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = 'edit';
};
// set back to default
const setBackToDefault = () => {
    // console.log("set back to default");
    grocery.value = '';
    editFlag = false;
    editID = '';
    submitBtn.textContent = 'submit';
};



// ****** END OF ALL FUNCTIONS **********



// ****** LOCAL STORAGE **********
// add to local storage
const addToLocalStorage = (id, value) => {
 const grocery = {id,value};
 let items = getLocalStorage();
// console.log(items);
items.push(grocery);
localStorage.setItem("list", JSON.stringify(items));
// console.log(items);

     
};
// remove from local storage
const removeFromLocalStorage = id =>{
    let items = getLocalStorage();
    items = items.filter((item) => {
        if(item.id !== id){
            return item;
        }
    });
    localStorage.setItem("list", JSON.stringify(items));
};
// edit local storage
const editLocalStorage = (id, value) => {
    const items =getLocalStorage();
    items.map((item) => {
        if(item.id === id){
            item.value = value;
        }
        return item
    });
    localStorage.setItem("list", JSON.stringify(items));
};
// get items from local storage
const getLocalStorage = () =>{
    return  localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};

// ****** SETUP ITEMS **********
function setUpItems() {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach((item) => {
            createListItem(item.id, item.value);
        });
    }
    container.classList.add('show-container')
}

// create items of list from the local storage
const createListItem = (id, value) =>{
    const element = document.createElement('article');
        // add class
        element.classList.add('grocery-item');
        // add id
        const attr = document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr);
        element.innerHTML = `<p class="title">${value}</p>
        <div class="btn-container">
          <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
          </button>
          <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>`
        // accessing the delete and edit btns
        const deleteBtn = element.querySelector('.delete-btn');
        const editBtn = element.querySelector('.edit-btn');
        // add eventlistner to btns
        deleteBtn.addEventListener('click', deleteItem);
        editBtn.addEventListener('click', editItem);
        // / append child
        list.appendChild(element);
};