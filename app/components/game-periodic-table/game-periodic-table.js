export default async function gamePeriodicTable() {
    const elementsList = await getElementList();
    let options = randomElementArray();
    let correctAnswer = getCorrectAnswer(options);
    const optionsContainerHTML = document.getElementById('table-question-options');
    const checkBtn = document.getElementById('check-btn');
    const startGameButton = document.getElementById('start-game');
    const timer = document.getElementById('timer');
    const showCorrectDialog = document.getElementById('dialog-correct');
    const showWrongDialog = document.getElementById('dialog-wrong');
    const showEndGameDialogHTML = document.getElementById('dialog-end');
    const closeGameBtnHTML = document.getElementById('close-game-btn');
    let questionTimeout;
    let selectedAnswerHTML = null;
    let score = 0;
    let currentQuestion = 0;
    let maxQuestions = 5;
    let time = 10000;
    let counterTime = time;
    let intervalId  = null;
    const correctSound = new Audio();
    const wrongSound = new Audio();
    
    correctSound.src = '/app/assets/sounds/correct.wav';
    wrongSound.src = '/app/assets/sounds/wrong.wav';

    async function getElementList() {
        try {
            const response = await fetch('elements_all.json');
            if (!response.ok) throw new Error('Error en la respuesta HTTP: ' + response.status);
            const data = await response.json();
            return data.Table.Row.map(element => element.Cell);
        } catch (error) {
            console.error('Error fetching element list:', error);
            return [];
        }
    }

    function getRandomElement(elements) {
        return elements[Math.floor(Math.random() * elements.length)];
    }

    function randomElementArray() {
        const options = [];
        for (let i = 0; options.length < 3; i++) {
            const option = getRandomElement(elementsList);
            if (!options.includes(option)) {
                options.push(option);
            }
        }
        return options;
    }

    function getCorrectAnswer(options) {
        return getRandomElement(options);
    }
    
    function generateNewQuestion() {
        options = randomElementArray();
        correctAnswer = getCorrectAnswer(options);
        handleTimer();
    }

    function handleTimer() {
        if (questionTimeout) clearTimeout(questionTimeout);
        if (intervalId) clearInterval(intervalId); 
        questionTimeout = setTimeout(() => {
            playWrongSound();
            validateGame();
        }, time);
        counterTime = time;
        timer.textContent = counterTime / 1000;
        intervalId = setInterval(() => {
            counterTime -= 1000;
            timer.textContent = counterTime / 1000;
            if (counterTime <= 0) {
                clearInterval(intervalId);
            }
        }, 1000);
    }

    function handleResponse(e) {
        const optionButton = e.target.closest('[role="radio"]');
        if (optionButton) {
            document.querySelectorAll('[role="radio"]').forEach(btn => {
                btn.setAttribute('aria-checked', 'false');
            });
            optionButton.setAttribute('aria-checked', 'true');
            const optionParent = optionButton.parentElement
            selectedAnswerHTML = optionParent;
            checkBtn.disabled = false;
        }
    }

    function handleCorrectDialogOpen() {
        showCorrectDialog.showModal();
        setTimeout(() => {
            handleCorrectDialogClose();
            validateGame();
        }, 1000);
    }

    function handleCorrectDialogClose() {
        showCorrectDialog.close();
    }

    function handleWrongDialogOpen(checkAnswer) {
        const elementName = document.getElementById('correct-answer');
        elementName.textContent = checkAnswer;
        showWrongDialog.showModal();
        setTimeout(() => {
            handleWrongDialogClose();
            validateGame();
        }, 1000);
    }

    function handleWrongDialogClose() {
        showWrongDialog.close();
    }

    function handledInputCorrectAnswer(optionId) {
        const optionElement = document.getElementById(optionId);
        optionElement.classList.add('checked');
    }

    function handlInputWrongAnswer(optionId) {
        const optionElement = document.getElementById(optionId);
        optionElement.classList.add('wrong');
    }

    function handleSubmit() {
        let selectedAnswer = selectedAnswerHTML.textContent.replace(/\s/g,'').trim();
        const selectedId = selectedAnswerHTML.id;
        if (selectedAnswer) {
            const checkAnswer = correctAnswer[2];
            if (selectedAnswer === checkAnswer) {
                playCorrectSound();
                handledInputCorrectAnswer(selectedId);
                handleCorrectDialogOpen();
                score++;
                renderScore();
            } else {
                playWrongSound();
                handlInputWrongAnswer(selectedId);
                handleWrongDialogOpen(checkAnswer);
                renderScore();
            }
            checkBtn.disabled = true;
            selectedAnswerHTML = null;
            document.querySelectorAll('[role="radio"]').forEach(btn => {
                btn.setAttribute('aria-checked', 'false');
            });
        }
    }

    function handleStartGame() {
        startGameButton.classList.add('hidden');
        document.getElementById('container-table').classList.remove('hidden');
        startGame();
    }

    function handleEndGame() {
        console.log('handleEndGame');
        closeEndGameDialog();
    }

    function subcribeEvents() {
        checkBtn.addEventListener('click', handleSubmit);
        optionsContainerHTML.addEventListener('click', handleResponse);
        startGameButton.addEventListener('click', handleStartGame);
        closeGameBtnHTML.addEventListener('click', handleEndGame);
    }

    function render(){
        const symbol = correctAnswer[1];
        const tableQuestionSymbol = document.getElementById('table-question-symbol');
        tableQuestionSymbol.classList.remove('hidden');
        tableQuestionSymbol.textContent = symbol;
        optionsContainerHTML.innerHTML = '';
        options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.id = `option-${index + 1}`;
            optionElement.classList.add('table-question-option');
            optionElement.innerHTML = `
                <button style="height: 15px; width: 15px; margin-right: 15px; border-radius: 50%;" type="button" role="radio" aria-checked="false"></button>
                ${option[2]}
            `;
            optionsContainerHTML.appendChild(optionElement);
        });
    }

    function renderScore() {
        const scoreElementHTML = document.getElementById('score');
        scoreElementHTML.textContent = score;
    }

    function createNextQuestion() {
        generateNewQuestion();
        render();
    }

    function resetGame() {
        currentQuestion = 0;
        score = 0;
        clearInterval(intervalId);
        clearTimeout(questionTimeout);
    }

    function validateGame() {
        currentQuestion++;
        if (currentQuestion < maxQuestions) {
            createNextQuestion();
        }
        else {
            showEndGameDialog();
            endGame();
        }
    }
    
    function startGame() {
        timer.classList.remove('hidden');
        createNextQuestion();
        changeRouteEvent();
    }

    function endGame() {
        const scoreElementHTML = document.getElementById('score-end');
        scoreElementHTML.textContent = score;
        resetGame();
        startGameButton.classList.remove('hidden');
        document.getElementById('container-table').classList.add('hidden');
        document.getElementById('timer').classList.add('hidden');
        timer.textContent = 0;
    }

    function showEndGameDialog() {
        showEndGameDialogHTML.showModal();
    }

    function closeEndGameDialog() {
        showEndGameDialogHTML.close();
    }

    function playCorrectSound() {
        try {
            correctSound.currentTime = 0;
            correctSound.play();
        } catch (error) {
            console.log("Error al reproducir sonido:", error);
        }
    }

    function playWrongSound() {
        try {
            wrongSound.currentTime = 0;
            wrongSound.play();
        } catch (error) {
            console.log("Error al reproducir sonido:", error);
        }
    }

    function changeRouteEvent() {
        window.addEventListener('hashchange', () => {
            endGame();
        });
    }
    
    
    subcribeEvents();
}