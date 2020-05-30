// menu
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const SERVER = 'https://api.themoviedb.org/3';
const API_KEY = '61159cc0067b3c9a7b4cbdb42f629192';

const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal'),
    tvShows = document.querySelector('.tv-shows'),
    tvCardImg = document.querySelector('.tv-card__img'),
    modalTitle = document.querySelector('.modal__title'),
    genresList = document.querySelector('.genres-list'),
    rating = document.querySelector('.rating'),
    description = document.querySelector('.description'),
    modalLink = document.querySelector('.modal__link'),
    searchForm = document.querySelector('.search__form'),
    searchFormInput = document.querySelector('.search__form-input');
    

const loading = document.createElement('div');
loading.className = 'loading';

// Создание класса обращения к БД

const DBService = class {
    getData = async (url) => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}`);
        }
    }

    getTestData = () => {
        return this.getData('test.json');
    }

    getTestCard = () => {
        return this.getData('card.json');
    }

    getSearchResult = (query) => {
        return this.getData(`${SERVER}/search/tv?api_key=${API_KEY}&language=ru-RU&page=1&query=${query}&include_adult=false`);
    }

}


const renderCard = (response) => {
    console.log(response);
    tvShowsList.textContent = '';

    response.results.forEach(item => {
        const  { 
            backdrop_path: backdrop, 
            name: title, 
            poster_path: poster, 
            vote_average: vote
        }  = item;
        const posterIMG = poster ? IMG_URL + poster : './img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop : '';
        const voteElem = vote ?  `<span class="tv-card__vote"> ${vote} </span>` : '';
        console.log(item);

        const card = document.createElement('li');
        card.className = 'tv-shows__item';
        card.innerHTML = `
            <a href="#" class="tv-card">
                ${voteElem}
                <img class="tv-card__img"
                    src="${posterIMG}"
                    data-backdrop="${backdropIMG}"
                    alt="${title}">
                <h4 class="tv-card__head"> ${title} </h4>
            </a>
        `;
        loading.remove();
        tvShowsList.append(card);
    });


}

searchForm.addEventListener('submit', event => {
    event.preventDefault(); //запрещает при нажатии Enter перезагружать страницу
    const value = searchFormInput.value;
    tvShows.append(loading);
    new DBService().getSearchResult(value).then(renderCard);
});

// открытие и закрытие меню

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.addEventListener('click', (event) => {
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');       
    }
});

leftMenu.addEventListener('click', (event) => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});

// Открытие модального акна

tvShowsList.addEventListener('click', (event) => {
    event.preventDefault(); /* препятствует при клике переходу в начатало страницы */
    const target = event.target;
    const card = target.closest('.tv-card');
    if (card) {

        // данный response не относится к предыдущему, можно назвать как угодно
        new DBService().getTestCard().then(response => {
            console.log(response);
            tvCardImg.src = IMG_URL + response.poster_path;
            modalTitle.textContent = response.name;
            genresList.textContent = ''; // Сначала очищаем жанр от верстки
            for(const item of response.genres) {
                genresList.innerHTML += ` 
                    <li>${item.name}</li>
                `; //+= тоже самое что а = a + b
            }
            // response.genres.forEach(item => {
            //     genresList.innerHTML += ` 
            //     <li>${item.name}</li>
            // `; 
            // }); // получение через массив как пример
            rating
            description
            modalLink
        })
        .then(() => {
            document.body.style.overflow = 'hidden';
            modal.classList.remove('hide');
        }); // добавлени еще один then для асинхронности загрузки данных в браузере

    }
});

// Закрытие модального окна

modal.addEventListener('click', (event) => {
    if (event.target.closest('.cross') || 
        event.target.classList.contains('modal')) {
        document.body.style.overflow = 'visible';
        modal.classList.add('hide');
    }
});

// Смена картинки карточки

const changeImage = (event) => {
    const card = event.target.closest('.tv-shows__item');
    if (card) {
        const img = card.querySelector('.tv-card__img');
        const changeImg = img.dataset.backdrop;
        if (changeImg) {
            img.dataset.backdrop = img.src;
            img.src = changeImg;
        }
    }
};

tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);

