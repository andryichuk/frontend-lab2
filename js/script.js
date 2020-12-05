function add_event_to_class(class_name, event, fun) {
    let elements = document.getElementsByClassName(class_name);
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener(event, fun);
    }
}

let errors_mess = {
    'text low len': 'Слишком короткое описание задачи! необходимо более 3 символов.',
    'text large len': 'Слишком длинное описание задачи! допускаеться не более 100 символов.',
    'id false': 'Задачи с таким id не существует'
}

function get_left(date) {
    let now = new Date();
    let left = 0;

    left += (parseInt(now.getFullYear()) - parseInt(date.substring(0, 4))) * 365;
    left += (parseInt(now.getMonth()) + 1 - parseInt(date.substring(5, 7))) * 30;
    left += (parseInt(now.getDate()) - parseInt(date.substring(8)));

    if(left < 0) { left = 0; }

    return left;
}

function load_list() {
    fetch('../php/getTask.php')
    .then((response) => {
        return response.text();
    }).then((response) => {
        arr = JSON.parse(response);
        let resault = ""; 

        for (key in arr) {
            resault += `<div class="list__item">
                            <div class="list__text">${arr[key]['text']}</div>
                            <div class="list__date">${arr[key]['date']}</div>
                            <div class="list__left">${get_left(arr[key]['date'])}</div>

                            <button class="list__btn" task-id="${key}">X</button>
                        </div>`;
        }

        document.getElementById('list').innerHTML = resault;
        add_event_to_class('list__btn', 'click', delete_task);
    });
}

function create_task() {
    let data = {};
    let task_text =  document.getElementById('task-text').value;
    let task_date =  document.getElementById('task-date').value;

    data['text'] = task_text;
    data['date'] = task_date;

    fetch("../php/addTask.php", {
        method: 'POST',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
        },
        body: 'param=' + JSON.stringify(data),
    }).then((response) => {
        return response.text(); 
    }).then((response) => {
        if(response in errors_mess) {
            document.getElementById('error').innerText = errors_mess[response];
            document.getElementById('popup-error').classList.add('open');
            return;
        }

        if(response === 'success') { load_list(); }
    }).catch((error) => { 
        document.getElementById('error').innerText = error;
        document.getElementById('popup-error').classList.add('open');
    });
}

function delete_task(event) {
    let id = event.target.getAttribute('task-id');
    let data = {};

    data['id'] = id;

    fetch("../php/deleteTask.php", {
        method: 'POST',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
        },
        body: 'param=' + JSON.stringify(data),
    }).then((response) => {
        return response.text(); 
    }).then((response) => {
        if(response in errors_mess) {
            document.getElementById('error').innerText = errors_mess[response];
            document.getElementById('popup-error').classList.add('open');
            return;
        }

        if(response === 'success') { 
            load_list();
        }
    }).catch((error) => {
        document.getElementById('error').innerText = error;
        document.getElementById('popup-error').classList.add('open');
    });
}

window.onload = function() {
   load_list();

   document.getElementById('task-btn').onclick = create_task;

   document.onclick = function(e){
    if ( e.target.className != 'popup__content' ) {
        document.getElementById('popup-error').classList.remove('open');
    };
};
   
};