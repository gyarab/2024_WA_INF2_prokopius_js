const app = document.getElementById('app');

let boardSize = 4; 
let board = [];
let firstCard = null;
let secondCard = null;
let currentPlayer = 1;
let scores = [0, 0];
let moves = 0;
let pairsFound = 0;

const emojiSet = ["😀", "🐱", "🍕", "🚗", "🎉", "🌍", "🌞", "🍎", "⚽", "🚀", "🎃", "🦄", "🐶", "🌈", "🍔", "🚲", "🌻", "📚", "🐸", "🎸", "🧩", "🎈", "🍩", "🚤", "🥨", "🍣", "🌕", "🛸"];

function createBoard(size) {
    const totalCards = size * size;

    const selectedEmojis = shuffleArray(emojiSet).slice(0, totalCards / 2);
    let cardValues = [];

    selectedEmojis.forEach(emoji => {
        cardValues.push(emoji, emoji);
    });

    cardValues = shuffleArray(cardValues);

    board = cardValues.map(value => ({
        value,
        matched: false
    }));
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function renderBoard() {
    const boardElement = document.createElement('div');
    boardElement.className = 'board';
    boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    
    board.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card hidden';
        cardElement.dataset.index = index;

        cardElement.addEventListener('click', () => handleCardClick(index));

        boardElement.appendChild(cardElement);
    });

    app.innerHTML = '';
    app.appendChild(boardElement);
    renderInfo();
}

function renderInfo() {
    let infoElement = document.getElementById('info');
    
    if (!infoElement) {
        infoElement = document.createElement('div');
        infoElement.id = 'info';
        
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restartovat hru';
        restartButton.addEventListener('click', startGame);
        
        const sizeSelect = document.createElement('select');
        sizeSelect.id = 'sizeSelect';
        [2, 4, 6].forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = `${size} x ${size}`;
            sizeSelect.appendChild(option);
        });
        sizeSelect.value = boardSize;
        sizeSelect.addEventListener('change', (event) => {
            boardSize = parseInt(event.target.value);
            startGame();
        });

        const sizeLabel = document.createElement('label');
        sizeLabel.textContent = 'Velikost pole: ';
        sizeLabel.appendChild(sizeSelect);
        
        app.appendChild(sizeLabel);
        app.appendChild(infoElement);
        app.appendChild(restartButton);
    }
    
    infoElement.innerHTML = `
        <p>Hráč 1 skóre: ${scores[0]}</p>
        <p>Hráč 2 skóre: ${scores[1]}</p>
        <p>Aktuální hráč: ${currentPlayer}</p>
        <p>Počet tahů: ${moves}</p>
    `;
}

function handleCardClick(index) {
    if (firstCard !== null && secondCard !== null) return;

    const card = board[index];
    if (card.matched || card === firstCard) return;

    const cardElement = document.querySelector(`.card[data-index='${index}']`);
    cardElement.textContent = card.value;
    cardElement.classList.remove('hidden');
    cardElement.classList.add('flipped');

    if (firstCard === null) {
        firstCard = { card, index };
    } else {
        secondCard = { card, index };
        checkMatch();
    }
}

function checkMatch() {
    moves++;
    if (firstCard.card.value === secondCard.card.value) {
        board[firstCard.index].matched = true;
        board[secondCard.index].matched = true;
        pairsFound++;

        scores[currentPlayer - 1]++;
        firstCard = secondCard = null;
        if (pairsFound === board.length / 2) {
            setTimeout(() => alert(`Hra končí! Hráč 1: ${scores[0]}, Hráč 2: ${scores[1]}`), 500);
        }
        renderInfo();
    } else {
        setTimeout(() => {
            const firstElement = document.querySelector(`.card[data-index='${firstCard.index}']`);
            const secondElement = document.querySelector(`.card[data-index='${secondCard.index}']`);
            firstElement.textContent = '';
            secondElement.textContent = '';
            firstElement.classList.add('hidden');
            secondElement.classList.add('hidden');
            firstElement.classList.remove('flipped');
            secondElement.classList.remove('flipped');
            firstCard = secondCard = null;
            switchPlayer();
            renderInfo();
        }, 1000);
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
}

function startGame() {
    pairsFound = 0;
    scores = [0, 0];
    moves = 0;
    currentPlayer = 1;
    firstCard = secondCard = null;
    createBoard(boardSize);
    renderBoard();
}

startGame();

