'use strict';

// удаляем прелоадер после одной секунды
// не совсем корректноработает, так как прелоадер прыгает на некоторых экранах

document.body.onload = function () {
    setTimeout(() => {
        const preloader = document.getElementById('page-preloader');
        if (!preloader.classList.contains('done')) {
            preloader.classList.add('done');
        }
    }, 1000);
};

const images = [
    {
        theme: '.peach',
        srcElements: [
            './images/peach-elements/orange.png',
            './images/peach-elements/peach.png',
            './images/peach-elements/peach-tagline.png',
            './images/peach-elements/peach-newBanner.png'
        ],
        classList: [
            'orange_img absolute_elements appear',
            'peach_img absolute_elements appear',
            'tagline_img absolute_elements',
            'banner_img absolute_elements'
        ]
    },
    {
        theme: '.pepermint',
        srcElements: [
            './images/pepermint-elements/pepermint-1.png',
            './images/pepermint-elements/pepermint-2.png',
            './images/pepermint-elements/seed-1.png',
            './images/pepermint-elements/seed-2.png',
            './images/pepermint-elements/strawberry-1.png',
            './images/pepermint-elements/strawberry-2.png',
            './images/pepermint-elements/upper tagline - 1.png',
            './images/pepermint-elements/peppermint-newBanner.png'
        ],
        classList: [
            'pepermint1_img absolute_elements appear',
            'pepermint2_img absolute_elements appear',
            'seed1_img absolute_elements appear',
            'seed2_img absolute_elements appear',
            'strawberry1_img absolute_elements appear',
            'strawberry2_img absolute_elements appear',
            'tagline_img absolute_elements',
            'banner_img absolute_elements'
        ]
    },
    {
        theme: '.raspberry',
        srcElements: [
            './images/raspberry-elements/Lemon.png',
            './images/raspberry-elements/petal-2.png',
            './images/raspberry-elements/petal-3.png',
            './images/raspberry-elements/petal-4.png',
            './images/raspberry-elements/petal-5.png',
            './images/raspberry-elements/Raspberry2.png',
            './images/raspberry-elements/Raspberry3.png',
            './images/raspberry-elements/raspberry-tagline.png',
            './images/raspberry-elements/Raspberry1.png',
            './images/raspberry-elements/raspberry-new.png'
        ],
        classList: [
            'lemon_img absolute_elements appear',
            'petal2_img absolute_elements appear',
            'petal3_img absolute_elements appear',
            'petal4_img absolute_elements appear',
            'petal5_img absolute_elements appear',
            'raspberry2_img absolute_elements appear',
            'raspberry3_img absolute_elements appear',
            'tagline_img absolute_elements',
            'raspberry1_img absolute_elements appear',
            'banner_img absolute_elements'
        ]
    }
];

// выбираем все элементы с классом .slide-single - этим классом отмечены картинки с продуктами
const slides = document.querySelectorAll('.slide-single');
const slider = [];
// выбираем обертку всего слайдера
const div = document.querySelector('.infinity-slider-wrap');
// удаляем все картинки с продуктами, их ссылки сохраняем в массив slider
for (let i = 0; i < slides.length; i++) {
    slider[i] = slides[i].src;
    slides[i].remove();
}

// выбираем все обертки для продуктов
const allSlides = document.querySelectorAll('.infinity-slider div');

// задаем счетчик слайдера
let current = 0;

// навешиваем функцию слушатель listener на событие клик по слайдеру
const listener = function (event) {
    if (event.target.id == 'right_arrow') {
        changeBackgroundRight('right');
    }
    if (event.target.id == 'left_arrow') {
        changeBackgroundLeft('left');
    }
};
div.addEventListener('click', listener);



// ===========================

// функция отрисовки всех допполнительных элементов слайда, кроме кнопок
// срабатывает один раз, если будет больше сладйов чем три есть необходимость рисовать только текущие элементы
// тк функция отрисовывает сразу все
function DrawElements(imgs, i) {
    const { classList } = imgs[i];
    const setImages = imgs[i].srcElements.map(function (item, i) {
        const image = document.createElement('img');
        image.setAttribute('class', classList[i]);
        image.setAttribute('src', item);
        return image;
    });

    const pea = document.querySelector(imgs[i].theme);
    pea.append(...setImages);
}
// ===========================

// функция убирает прозрачность у текущего слайда и добавляет прозрачность всем остальным
// вызывает функцию changeProduct и передает в нее сторону
function Slider(side) {
    for (let i = 0; i < allSlides.length; i++) {
        allSlides[i].classList.add('opacity0');
    }
    allSlides[current].classList.remove('opacity0');
    changeProduct(side);
}
// ===========================

// функция добавляе анимацию всем элементам с классом appear (вместо него лучше использовать дата атрибут)
// тк класс ничего не делает
// и смещает картинки с продуктами в лево или право в зависимости от переданной стороны

function changeProduct(side) {
    div.removeEventListener('click', listener);
    const element = document.getElementById(String(current));
    const element1 = element.querySelectorAll('.appear');

    element1.forEach(function (item) {
        item.classList.add('appear_img');
        setTimeout(e => {
            item.classList.remove('appear_img');
        }, 1000);
    });

    const slides2 = document.querySelectorAll('.slide-single');

    if (side == 'right') {
        slides2.forEach(function (item) {
            switch (item.style.left) {
                case '23%':
                    item.style.left = '-60%';
                    break;

                case '100%':
                    item.style.left = '23%';
                    break;

                default:
                    item.remove();
            }
        });
        setTimeout(function () {
            slides2.forEach(function (item) {
                if (item.style.left == '-60%') {
                    item.remove();
                }
            });
            DrawProduct(true);
        }, 1000);
    } else {
        slides2.forEach(function (item) {
            switch (item.style.left) {
                case '23%':
                    item.style.left = '100%';
                    break;

                case '-60%':
                    item.style.left = '23%';
                    break;

                default:
                    item.remove();
            }
        });
    }
    setTimeout(function () {
        slides2.forEach(function (item) {
            if (item.style.left == '100%') {
                item.remove();
            }
        });
        DrawProduct(true);
        div.addEventListener('click', listener);
    }, 1000);
}
// ===========================

// функция, которая проверяет не достигли ли мы начала массива со слайдами
function changeBackgroundLeft(side) {
    if (current - 1 == -1) {
        current = allSlides.length - 1;
    } else {
        current--;
    }
    Slider(side);
}
// функция, которая проверяет не достигли ли мы конца массива со слайдами
function changeBackgroundRight(side) {
    if (current + 1 == allSlides.length) {
        current = 0;
    } else {
        current++;
    }
    Slider(side);
}

DrawElements(images, 0);
DrawElements(images, 1);
DrawElements(images, 2);
Slider();

// функция отрисовки продукта, если flag передан, она отрисовывает три продукта, 
// если нет, то один  - центральный, при загрузке
function DrawProduct(flag) {
    if (flag) {
        const imgProductRight = document.createElement('img');
        const imgProductLeft = document.createElement('img');

        if (current + 1 == slider.length) {
            imgProductRight.src = slider[0];
        } else {
            imgProductRight.src = slider[current + 1];
        }

        if (current - 1 == -1) {
            imgProductLeft.src = slider[slider.length - 1];
        } else {
            imgProductLeft.src = slider[current - 1];
        }

        imgProductRight.classList.add('slide-single');
        imgProductLeft.classList.add('slide-single');

        imgProductRight.style.left = '100%';
        imgProductLeft.style.left = '-60%';

        document.getElementById('0').after(imgProductRight);
        document.getElementById('0').after(imgProductLeft);
    } else {
        const element = document.getElementById(String(current));
        const imgProductRight = document.createElement('img');
        const element1 = element.querySelectorAll('.appear');
        imgProductRight.src = slider[current];
        imgProductRight.classList.add('slide-single');
        imgProductRight.style.left = '100%';
        element.after(imgProductRight);
        setTimeout(() => {
            element1.forEach(function (item) {
                item.classList.add('appear_img');
            });
            imgProductRight.style.left = '23%';
        }, 1500);
        setTimeout(() => {
            element1.forEach(function (item) {
                item.classList.remove('appear_img');
            });
        }, 2500);
    }
}
// отрисовали центральный продукт
DrawProduct();
// отрисовали продукт слева и справа
DrawProduct(true);

// функция слушатель, добавляющая заглушку при повороте
// не совсем еще разобралась с этим событием
//  функция не корректно работает если загружать слайд в альбомном расположении экрана

window.addEventListener('orientationchange', e => {
    const block = document.createElement('div');
    block.innerHTML = `
    <img src="./images/not_available.png" style="width: 20%; position: absolute; top: 40%;
    left: 40%;">
    `;
    block.classList.add('preloader');
    console.log('[block]', block);
    console.log(
        'the orientation of the device is now ' +
            e.target.screen.orientation.angle
    );
    if (e.target.screen.orientation.angle == 90) {
        div.before(block);
    }
    if (e.target.screen.orientation.angle == 0) {
        const element = document.querySelector('.preloader');
        console.log(window.orientation);
        element.remove();
    }
});

// let list = document.getElementById('0').getElementById('4');
// let list = document.querySelectorAll('.appear').querySelectorAll('.absolute_elements');
// console.log('[list]', list);
