const startBtn = document.getElementById("start-btn");
const card = document.querySelectorAll(".card");

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchCounter = 0;
let second = 60;
let timer = document.getElementById("timer");
let interval = null;
let isPaused = false;
let isLose = false;
let ModalBox = document.getElementById("popup-box"),
    ClosePopUp = document.getElementById("close-popup"),
    ModalTitle = document.getElementById("modal-title");


function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipCard');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    secondCard = this;
    hasFlippedCard = false;
    checkForMatch();
}

function startTimer() {
    if (interval) return;
    interval = setInterval(() => {
        timer.innerHTML = second + " secs";

        if (second === 0) {
            clearInterval(interval);
            interval = null;
            lose();
            return;
        }
        second--;
    }, 1000);
}

function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
    if (isMatch) {
        matchCounter++;
        disableCards();
        if (matchCounter === 6) {
            clearInterval(interval);
            win();
        }
    }
    else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {

        firstCard.classList.remove('flipCard');
        secondCard.classList.remove('flipCard');
        lockBoard = false;
        resetBoard();

    },
    1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard, firstCard, secondCard] = [false, false, null, null];
}

function shuffle() {
    card.forEach(card => {
        let cardOrder = Math.floor(Math.random() * 12);
        card.style.order = cardOrder.toString();
    });
}

function win() {
    isPaused = true;
    ModalTitle.innerHTML = 'You win! 🙌\n🎉';
    ModalBox.classList.add('modal--open');
}

function lose() {
    isLose = true;
    ModalTitle.innerHTML = 'You Lost! 😢';
    ModalBox.classList.add('modal--open');
}

function resetGame() {

    matchCounter = 0;
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;

    clearInterval(interval);
    interval = null;
    second = 60;
    timer.innerHTML = "60 secs";

    ModalBox.classList.remove("modal--open");

    card.forEach(c => {
        c.classList.remove("flipCard");
        c.addEventListener("click", flipCard);
    });

    shuffle();
}


startBtn.addEventListener("click", () => {
    startTimer();
    document.querySelector('.header-container').classList.add('move-timer');
});

card.forEach(card => card.addEventListener('click', flipCard));

ClosePopUp.addEventListener('click', () => {
    resetGame();
});

