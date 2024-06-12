'use strict'

const questionTime = 180 // seconds
let questionTimeout = questionTime
let questionTimerID = null

const backgroundMusic = new Audio('https://chelovek-gorod.github.io/front-quiz/bgm.mp3')
const soundTrue = new Audio('https://chelovek-gorod.github.io/front-quiz/true.mp3')
const soundFalse = new Audio('https://pixabay.com/ru/sound-effects/error-10-206498/')

const questionsList = [
    {
        question: 'Значение sin(30°)',
        answers:[
            '1/2',
            '√3/2',
            '√2/2',
            '√3/3'
        ],
        right: 0
    },

    {
        question: 'Найдите корни уравнения -x²+7x-10=0',
        answers:[
            '5; 2',
            '2; 3',
            '7; 10',
            '-2; 4'
        ],
        right: 0
    },
  
   {
        question: 'Площадь треугольника MNK равна 80 см². Высота MH равна 10 см. Найдите длину стороны NK.',
        answers:[
            '10 cм',
            '14 см',
            '16 см',
            '18 см'
        ],
        right: 2 // правильный ответ (нумерация с нуля)
    },

    {
        question: 'Найдите сопротивление тока в проводе длинной l = 2 метра и площадью поперечного сечения S = 1 мм². Удельное сопротивление меди ρ равно примерно 1.68E-6 Ом*м.',
        answers:[
            '0.0336 Ом',
            '0.04233 Ом',
            '0.02203 А',
            '0.0337 Ом'
        ],
        right: 0 // правильный ответ (нумерация с нуля)
    },

    {
        question: 'Автомобиль массой 1200 кг движется со скоростью 20 м/с. Какова работа, которую необходимо совершить, чтобы остановить автомобиль?',
        answers:[
            '240001 Дж',
            '120000 Дж',
            '200000 Дж',
            '240000 Вт'
        ],
        right: 3 // правильный ответ (нумерация с нуля)
    },

    {
        question: 'В цепи есть проводник длиной l = 2 метра, через который протекает ток силой I = 5 ампер. Проводник находится в магнитном поле с индукцией B = 0.3 тесла. Определите силу F, действующую на проводник в магнитном поле.',
        answers:[
            '5 Н',
            '3 Н',
            '3 кН',
            '7 Ом'
        ],
        right: 1 // правильный ответ (нумерация с нуля)
    },

    {
        question: 'В арифметической прогрессии первый член равен 10, а разность равна 4. Найдите сумму первых 8 членов этой прогрессии.',
        answers:[
            '192',
            '3 попугая',
            '158',
            '203'
        ],
        right: 0 // правильный ответ (нумерация с нуля)
    },

    {
        question: 'Формула для нахождения расстояния между двумя точками это:',
        answers:[
            'd²=(x2-x1)² + (y2-y1)²',
            'd=x1²-4*(y2-y1)*x2',
            'd=x1 * x1 * y1 * sin(y2)',
            'Ни одна из перечисленных выше'
        ],
        right: 0 // правильный ответ (нумерация с нуля)
    }
]
questionsList.sort( arrayRandomSort )
function arrayRandomSort() {
    // Math.random() генерирует случайное число от 0 до 1 (не включая 1)
    return Math.random() - 0.5
}

let score = 0 // число очков (начисляем при правильном ответе за оставшееся время)
let rightAnswers = 0 // число правильных ответов

let rightText = '' // текст правильного ответа (обновляем задавая новый вопрос)
let answer = '' // ответ, выбранный игроком (обновляем при клике игрока на ответ)

let questionCounter = 0 // счетчик заданных вопросов
const questionNumber = questionsList.length // число всех вопросов


// получаем ссылки на HTML-теги, для работы с ними
const startButton = document.querySelector('.start')

const gameContainer = document.querySelector('#game-container')

const divInfo = document.querySelector('#info')
const qNumberSpan = document.querySelector('#q-number')
const qAllSpan = document.querySelector('#q-all')
const qTimerSpan = document.querySelector('#q-timer')
const divQuestion = document.querySelector('.question')

const divAns1 = document.querySelector('#ans1')
const divAns2 = document.querySelector('#ans2')
const divAns3 = document.querySelector('#ans3')
const divAns4 = document.querySelector('#ans4')

const divResult = document.querySelector('#result')
const spanScore = document.querySelector('#score')
const spanRight = document.querySelector('#rightCount')

// создаем массив из тегов <div> с ответами
const answers = [divAns1, divAns2, divAns3, divAns4]
// создаем массив из тегов <span> в тегах <div> с ответами
const answerSpans = [
    divAns1.querySelector('span'),
    divAns2.querySelector('span'),
    divAns3.querySelector('span'),
    divAns4.querySelector('span'),
]

// подключаем слушатель клика к кнопкам ответа
for(let i = 0; i < answers.length; i++) {
    answers[i].onclick = getAnswerClick
    // answers[i].onclick = function() { getAnswerClick(i) }
}

// функция - обработчик клика по ответу
function getAnswerClick( event ) {
    if (answer) return // если ответ уже дан - выходим

    const divAnswer = event.target // получаем <div> по которому кликнул игрок
    const spanAnswer = divAnswer.querySelector('span') // получаем <span> в <div>
    answer = spanAnswer.innerText // достаем текст ответа из <span>
    // проверка правильности произойдет в функции updateTimer()

    if (answer = rightText) {
        soundTrue.play()
    } else {
        soundFalse.play()
    }
}

startButton.onclick = startQuiz

function startQuiz() {
    backgroundMusic.play()

    startButton.style.display = 'none'
    gameContainer.style.display = 'block'
  
    qAllSpan.innerText = questionNumber
    nextQuestion()
}

function updateTimer() {
    if (answer) {
        if(rightText === answer) {
            score += questionTimeout
            rightAnswers = rightAnswers + 1
        }
        return nextQuestion()
    }

    questionTimeout--
    qTimerSpan.innerText = questionTimeout
    if (questionTimeout > 0) {
        setTimeout(updateTimer, 1000)
    } else {
        setTimeout(nextQuestion, 1000)
    }
}

function nextQuestion() {
    answer = ''
    // clearTimeout(questionTimerID)

    questionCounter++
  
    if (questionCounter > questionNumber) {
        return showResults()
    }
  
    questionTimeout = questionTime
    qNumberSpan.innerText = questionCounter
    qTimerSpan.innerText = questionTimeout 

    let question = questionsList.pop()
    rightText = question.answers[ question.right ]

    divQuestion.innerText = question.question

    answerSpans.forEach( (ansSpan, index) => {
        ansSpan.innerText = question.answers[index]
    })
  
    setTimeout(updateTimer, 1000)
}

function showResults() {
    gameContainer.style.display = 'none'

    spanScore.innerText = score
    spanRight.innerText = rightAnswers
    divResult.style.display = 'block'
}