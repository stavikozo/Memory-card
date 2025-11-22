const startBtn = document.getElementById("start-btn");
const cards = document.querySelectorAll(".card");
const timer = document.getElementById("timer");
const ModalBox = document.getElementById("popup-box");
const ClosePopUp = document.getElementById("close-popup");
const ModalTitle = document.getElementById("modal-title");

let gameStarted = false;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchCounter = 0;
let second = 60;
let interval = null;

function flipCard() {
    if (!gameStarted || lockBoard || this === firstCard) return;

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
        timer.innerHTML = `${second} secs`;
        if (second === 0) {
            clearInterval(interval);
            lose();
        }
        second--;
    }, 1000);
}

function checkForMatch() {
    const isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
    isMatch ? handleMatch() : unflipCards();
}

function handleMatch() {
    matchCounter++;
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();

    if (matchCounter === 6) {
        clearInterval(interval);
        win();
    }
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipCard');
        secondCard.classList.remove('flipCard');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard, firstCard, secondCard] = [false, false, null, null];
}

function shuffle() {
    cards.forEach(c => {
        c.style.order = Math.floor(Math.random() * cards.length);
    });
}

function win() {
    ModalTitle.innerHTML = 'You win! 🙌🎉';
    ModalBox.classList.add('modal--open');
}

function lose() {
    ModalTitle.innerHTML = 'You Lost! 😢';
    ModalBox.classList.add('modal--open');
}

function resetGame() {
    gameStarted = false;
    matchCounter = 0;
    resetBoard();

    clearInterval(interval);
    interval = null;
    second = 60;
    timer.innerHTML = "60 secs";

    ModalBox.classList.remove("modal--open");

    cards.forEach(c => {
        c.classList.remove("flipCard");
        c.addEventListener("click", flipCard);
    });
    timer.style.display='none';
    shuffle();
}

startBtn.addEventListener("click", () => {
    startTimer();
    gameStarted = true;
    timer.classList.add("animate");
    timer.style.display='block';
});

cards.forEach(c => c.addEventListener('click', flipCard));
ClosePopUp.addEventListener('click', resetGame);
