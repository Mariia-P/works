'use strict';

// суть алгоритма заключается в том, чтобы создать популяцию из n элементов (n задаем константой вне класса,
// какое именно количество n оптимально для решения задачи будет оптимальным не уточняю)
// для тестирования работы алгоритма с 5ю ионными капсулами  n=70 позволяло найти оптимальное решение при
// каждом запуске программы

// один элемент в популяции это объект, со свойствами mainThruster, secThruster, rest, deltaVelocity

// mainThruster - это массив из прирощений, которые будет использовать первый двигатель
// длина этого массива равна длине массива secThruster и равна длине массива ускорений, которые задает
// пользователь. этот массив заполняется при создании популяции в том случае, если число среди ионных
// капсул равно числу среди массива ускорений, которые нам нужно достичь
// тк, на мой взгляд, это оптимальное использование ионной капсулы

// secThruster - это массив из прирощений, которые будет использовать второй двигатель
// при создании популяции он остается заполненный 0

// rest - это остаток ионных капсул которые еще не задействованы в двигателях
// deltaVelocity - это прирощение скорости, которое является показателем для отбора лучшего элемента
// среди популяции

// минусы данного алгоритма в том, что он основан только на теории вроятности, и не
// имеет метода, который бы обеспечивал сходимость, обучение и пр.
// спутники запускать лучше такие, которые потом будет не жалко

class IonEngine {
    constructor({ corrections, cells }, n) {
        // массив ускорений, которые необходимо достичь
        this.corrections = corrections;
        // массив доступных ионных капсул
        this.cells = cells;
        // массив из объектов решений (популяция)
        this.population = [];
        // массив из n количества случайный образом перемешанным массивом имеющихся ионных двигателей
        this.randomCellsArray = [];
        // количество элементов в популяции
        this.countExample = n;
    }

    // метод для создания 1го массива капсул перемешанных случайным образом
    // думаю, что именно он обеспечивает более менее сносную работу алгоритма
    // при большом количестве элементов в популяции, так как дает равномерную случайную
    // перестановку элементов массива

    _shuffleArrayRandom() {
        const sampleCorrections = this.cells.slice();
        let j, temp;

        for (let i = sampleCorrections.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = sampleCorrections[j];
            sampleCorrections[j] = sampleCorrections[i];
            sampleCorrections[i] = temp;
        }
        return sampleCorrections;
    }

    // метод для создания n массивов капсул перемешанных случайным образом
    makeSetArray() {
        for (let i = 0; i < this.countExample; i++) {
            this.randomCellsArray.push({ set: this._shuffleArrayRandom() });
        }
    }

    //метод для создания начальной популяции из пересортрованных массивов капсул

    createPopulation() {
        // открываем цикл для перебора массива
        for (let n = 0; n < this.countExample; n++) {
            // создаем объект экземпляра для популяции
            const newExample = {
                mainThruster: [],
                secThruster: [],
                rest: [],
                deltaVelocity: []
            };

            // заполняем значения ускорений двигателей нулями
            for (let n = 0; n < this.corrections.length; n++) {
                newExample.mainThruster.push(0);
                newExample.secThruster.push(0);
            }

            const tempArray = this.randomCellsArray[n].set;
            //открываем цикл для перебора массивов ускорений
            for (let i = 0; i < tempArray.length; i++) {
                let a = tempArray[i];
                //открываем цикл для перебора значений ускорений в первом двигателе
                //  если значение не заполнено (=0) и ускорение которого надо достичь
                //  равно имеющейся ионной капсуле
                // то удаляем эту ионную капсулу из массива ионных капсул и добавляем его в первый двигатель
                // если же эта капсула не равна ни одному из искомых ускорений добавляем ее в остаток
                for (let j = 0; j < this.corrections.length; j++) {
                    if (
                        a == this.corrections[j] &&
                        newExample.mainThruster[j] == 0
                    ) {
                        newExample.mainThruster.splice(j, 1, a);
                        break;
                    } else {
                        if (j == this.corrections.length - 1) {
                            newExample.rest.push(a);
                        }
                    }
                }
            }
            // добавляем полученный объект в массив популяции
            this.population.push({ ...newExample });
        }
    }

    // метод для заполнения пустых элементов первого и второго двигателя неиспользованными капсулами,
    //  оставшимися в массивах rest
    //  поочередно берем каждую капсулу и подставляем ее сначала в первый двигатель
    // если она не подходит для первого двигателя, тогда подставляем ее во второй
    // получаем популяцию в которой неслучайно оказались только ионные капсулы в первом двигателе,
    // которые были равны искомым ускорениям

    updateDescendant() {
        const restLength = this.population[0].rest.length;
        // открываем цикл для перебора элементов в популяции
        for (let n = 0; n < this.countExample; n++) {
            const tempSet1 = this.population[n].mainThruster;
            const tempSet2 = this.population[n].secThruster;
            // это ссылка на массив остатков, который мы будем изменять
            const tempRest = this.population[n].rest;
            // скопировали массив остатков который мы будем перебирать, но не изменять, чтобы перебрать все
            // элементы по порядку
            const cloneTempRest = this.population[n].rest.slice();
            // открываем цикл для перебора массива остатков ионных капсул
            for (let i = 0; i < restLength; i++) {
                let a = cloneTempRest[i];
                // открываем цикл для перебора массива значений первого двигателя
                for (let j = 0; j < this.corrections.length; j++) {
                    if (tempSet1[j] == 0 && a < this.corrections[j]) {
                        tempSet1.splice(j, 1, a);
                        let indForDelete = tempRest.indexOf(a);
                        tempRest.splice(indForDelete, 1);
                        break;
                    }
                    // если все ячейки первого двигателя пройдены подставляем капсулы во второй двигатель
                    else {
                        if (j == this.corrections.length - 1) {
                            for (let m = 0; m < this.corrections.length; m++) {
                                if (
                                    tempSet2[m] == 0 &&
                                    tempSet1[m] + a / 2 <= this.corrections[m]
                                ) {
                                    tempSet2.splice(m, 1, a);
                                    let indForDelete = tempRest.indexOf(a);
                                    tempRest.splice(indForDelete, 1);
                                    break;
                                }
                            }
                        }
                    }
                    continue;
                }
            }
        }
    }

    // метод для вычисления  deltaVelocity - ускорения двигателей в популяции
    _setDeltaVelocity() {
        for (let n = 0; n < this.countExample; n++) {
            const {
                deltaVelocity,
                mainThruster,
                secThruster
            } = this.population[n];
            const sum1 =
                secThruster.reduce(function (accum, item) {
                    return accum + item;
                }, 0) / 2;
            const sum2 = mainThruster.reduce(function (accum, item) {
                return accum + item;
            }, 0);
            deltaVelocity[0] = sum1 + sum2;
        }
        // console.log('[this.population]', this.population);
    }

    // метод для сортировки попуяции по значению deltaVelocity, элемент с самым большим ускорением
    // оказывается к конце, для более удобного доступа к нему
    _sortPopulation() {
        this.population.sort(function (a, b) {
            return a.deltaVelocity - b.deltaVelocity;
        });
    }

    // метод для выбора лучшего элемента среди получившейся популяции, который и является решением

    chooseExample() {
        this._setDeltaVelocity();
        this._sortPopulation();
        const bestExample = this.population.pop();
        console.log('[bestExample]', bestExample);
        alert(
            `Fill the first engine like this ${bestExample.mainThruster} \n and fill the second engine like this ${bestExample.secThruster}. \n You will get an delta velocity equal to ${bestExample.deltaVelocity}`
        );
    }

    // соласно генетическому алгоритму, необходимо предусмотреть скрещивание элементов, для получения потомков
    // думаю правильно было бы скрещивать значения ускорений для
    // двигателей внутри одного объекта, при этом создавать популяцию из меньшего количества потомков
    // таким образом оптимизировав использование ресурсов памяти, а остаток неиспользованных ионных капсул
    // задействовать для метода "мутации"
}
// функция для ввода строки состоящей из набора чисел через пробел
function input(message, defaultValue, validate) {
    let inp = prompt(message, defaultValue)
        .split(' ')
        .map(string => +string);

    while (true) {
        const answer = validate(inp);
        if (answer == true) break;
        alert('Enter only numbers separated by space');
        inp = prompt(message, defaultValue)
            .split(' ')
            .map(string => +string);
    }
    return inp;
}

// валидация введенного пользователем значения
function validateNumber(inp) {
    const validArray = inp.map(function (num) {
        if (!Number.isFinite(num)) {
            return 1;
        } else return 0;
    });

    if (validArray.includes(1)) return false;

    return true;
}
let enteredCorrections;
let enteredCells;
while (true) {
    enteredCorrections = input(
        `enter an array of ion engine velocity increments separated by space`,
        '',
        validateNumber
    );

    enteredCells = input(
        `enter an array of available capsules separated by space`,
        '',
        validateNumber
    );
    if (enteredCorrections.length > enteredCells.length) {
        alert(
            'Please get more ion capsules to avoid satellite disruption. Their number cannot be less than the number of velocity increments'
        );
    } else break;
}

// задаем количество потомков
const n = 100;
const myEngine = new IonEngine(
    {
        corrections: enteredCorrections,
        cells: enteredCells
    },
    n
);

myEngine.makeSetArray();
myEngine.createPopulation();
myEngine.updateDescendant();
myEngine.chooseExample();
