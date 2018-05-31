/* Обработка клика по плюсу и крестику */
let common_friends_list = document.querySelector('.common_friends_list ul');
let selected_friend_list = document.querySelector('.selected_friend_list ul');
let responseVK = null;

common_friends_list.addEventListener('click', (e) => {
    if (e.target.getAttribute('class') === 'plus') {
        e.target.setAttribute('class', 'remove');
        selected_friend_list.appendChild(e.target.parentNode);
    }
});
selected_friend_list.addEventListener('click', (e) => {
    if (e.target.getAttribute('class') == 'remove') {
        e.target.setAttribute('class', 'plus');
        common_friends_list.appendChild(e.target.parentNode);
    }
});

/* VK API */
function vkApi(method, options) {
    if (!options.v) {
        options.v = '5.78';
    }

    return new Promise((resolve, reject) => {
        VK.api(method, options, data => {
            if (data.error) {
                reject(new Error(data.error.error_msg));
            } else {
                responseVK = data.response;
                resolve(data.response);
            }
        });
    });
}

function vkInit() { // Инициализация приложения
    return new Promise((resolve, reject) => {
        VK.init({
            apiId: 6486204
        });

        VK.Auth.login(data => { // Логинимся
            if (data.session) {
                resolve();
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    });
}

/* HandelBars */
let template = `
{{#each items}}
    <li draggable="true" id="{{id}}" ondragstart="return dragStart(event)" class="item">
        <img src="{{photo_200}}" alt="img">
        <p>{{first_name}} {{last_name}}</p>
        <div class="plus">✚</div>
    </li>
{{/each}}
`;
let templateFn = Handlebars.compile(template);

new Promise(resolve => window.onload = resolve)
    .then(() => vkInit())
    .then(() => vkApi('friends.get', {fields: 'photo_200'}))
    .then(response => {
        document.querySelector('.common_friends_list ul').innerHTML = templateFn(response);
        return new Promise((resolve) => {
            /* Вывести из хранилища если есть там что то*/
            if (localStorage.data) {
                let arrSelected = JSON.parse(localStorage.data);
                resolve(arrSelected);
            }
        });
    })
    .then((arrSelected) => {
        for (let prop in arrSelected) {
            document.getElementById(arrSelected[prop]).lastElementChild.setAttribute('class', 'remove');
            document.getElementById('selected_friend_list').appendChild(document.getElementById(arrSelected[prop]));
        }
    })
    .catch(e => alert('Ошибка: ' + e.message));

/* localStorage */
let storage = localStorage;
let reestablish = {};

document.querySelector('.save a').addEventListener('click', () => {
    let arrLi = document.querySelectorAll('.selected_friend_list ul li');
    for (let i = 0; i < arrLi.length; i++) {
        reestablish[i] = arrLi[i].getAttribute('id');
    }
    storage.data = JSON.stringify(reestablish);
});

/* Drag and Drop */
function dragStart(ev) { // Событие взятие элемента
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData('text', ev.target.id); // Кладёт id поднимаемого элемента
    ev.dataTransfer.setDragImage(ev.target, 135, 22);
    return true;
}

function dragEnter(ev) {
    event.preventDefault();
    return true;
}

function dragOver(ev) {
    event.preventDefault();
}

function dragDrop(ev) { // Событие отпускания элемента
    let data = ev.dataTransfer.getData('text'); // Берёт id поднятого элемента
    document.getElementById(data).lastElementChild.setAttribute('class', 'remove');
    ev.currentTarget.appendChild(document.getElementById(data));
    ev.stopPropagation(); // Останавливает дальнейшее погружение события
    return false;
}

/* Перенос обратно */
function dragstart(ev) { // Событие взятие элемента
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData('text', ev.target.id); // Кладёт id поднимаемого элемента
    ev.dataTransfer.setDragImage(ev.target, 135, 22);
    return true;
}

function dragenter(ev) {
    event.preventDefault();
    return true;
}

function dragover(ev) {
    event.preventDefault();
}

function dragdrop(ev) { // Событие отпускания элемента
    let data = ev.dataTransfer.getData('text'); // Берёт id поднятого элемента
    document.getElementById(data).lastElementChild.setAttribute('class', 'plus');
    ev.currentTarget.appendChild(document.getElementById(data));
    ev.stopPropagation(); // Останавливает дальнейшее погружение события
    return false;
}
