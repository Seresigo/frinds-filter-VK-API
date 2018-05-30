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
		options.v = '5.64';
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
			apiId: 6334245
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
