/* Обработка клика по плюсу и крестику */
let common_friends_list = document.querySelector('.common_friends_list ul');
let selected_friend_list = document.querySelector('.selected_friend_list ul');
let responseVK = null;

common_friends_list.addEventListener('click', (e) => {
	if(e.target.getAttribute('class') === 'plus') {
		e.target.setAttribute('class', 'remove');
		selected_friend_list.appendChild(e.target.parentNode);
	}
});
selected_friend_list.addEventListener('click', (e) => {
	if(e.target.getAttribute('class') == 'remove') {
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
        for(let i = 0; i < response.items.length; i++){
            if(!response.items[i].photo_200){
                response.items[i].photo_200 = 'img/1.png';
            }
        } 		// При первой загрузке страницы загружает первый список
        document.querySelector('.common_friends_list ul').innerHTML = templateFn(response);
        return new Promise((resolve) => {

            /* Вывести из хранилища если есть там что то*/
            if(localStorage.data){
                let arrSelected = JSON.parse(localStorage.data);
                resolve(arrSelected);
            }
        });
    })
    .then( (arrSelected) => {
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
    for(let i = 0; i < arrLi.length; i++){
        reestablish[i] = arrLi[i].getAttribute('id');
    }
    storage.data = JSON.stringify(reestablish);
});
