import { testDictionary, realDictionary } from './dictionary.js';

//import {score} from 'src/score.json';

// for testing purposes, make sure to use the test dictionary | за тестови цели не забравяйте да използвате тестовия речник | для тестування обов’язково використовуйте тестовий словник
console.log('test dictionary:', testDictionary);

const dictionary = realDictionary;
let state;



// var f = "score.json";

// writeTextFile(f, "Spoon")
// writeTextFile(f, "Cheese monkey")
// writeTextFile(f, "Onion")

// function writeTextFile(afilename, output)
// {
//   var txtFile =new File(afilename);
//   txtFile.writeln(output);
//   txtFile.close();
// }



function drawGrid(container) {
  const grid = document.createElement('div');
  grid.className = 'grid';

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
      drawBox(grid, i, j);
    }
  }

  container.appendChild(grid);
}

function updateGrid() {
  for (let i = 0; i < state.grid.length; i++) {
    for (let j = 0; j < state.grid[i].length; j++) {
      const box = document.getElementById(`box${i}${j}`);
      box.textContent = state.grid[i][j];
    }
  }
}

function drawBox(container, row, col, letter = '') {
  const box = document.createElement('div');
  box.className = 'box';
  box.textContent = letter;
  box.id = `box${row}${col}`;

  container.appendChild(box);
  return box;
}



function registerKeyboardEvents() {
  let counter = 1;
  document.body.onkeydown = (e) => {
    const key = e.key;
    if (key === 'Enter') {
      if (state.currentCol === 5) {
        const word = getCurrentWord();
        if (isWordValid(word)) {
          const result = revealWord(word);
          document.getElementById("scoreelem").value = `Shadow Word: ${state.secret} 
Attempts: ${counter}
Result: ${result}`;
console.log(state.secret);
          state.currentRow++;
          counter += 1;
          state.currentCol = 0;
        } else {
          alert('Not a valid word.');
         }
      } 
    }
    if (key === 'Backspace') {
      removeLetter();
    }
    if (isLetter(key)) {
      addLetter(key);
    }

    updateGrid();
  };
}

function getCurrentWord() {
  return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function isWordValid(word) {
  return dictionary.includes(word);
}

function getNumOfOccurrencesInWord(word, letter) {
  let result = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      result++;
    }
  }
  return result;
}

function getPositionOfOccurrence(word, letter, position) {
  let result = 0;
  for (let i = 0; i <= position; i++) {
    if (word[i] === letter) {
      result++;
    }
  }
  return result;
}

function revealWord(guess) {
  const row = state.currentRow;
  const animation_duration = 500; // ms миллисекунды

  for (let i = 0; i < 5; i++) {
    const box = document.getElementById(`box${row}${i}`);
    const letter = box.textContent;
    const numOfOccurrencesSecret = getNumOfOccurrencesInWord(
      state.secret,
      letter
    );
    const numOfOccurrencesGuess = getNumOfOccurrencesInWord(guess, letter);
    const letterPosition = getPositionOfOccurrence(guess, letter, i);

    setTimeout(() => {
      if (
        numOfOccurrencesGuess > numOfOccurrencesSecret &&
        letterPosition > numOfOccurrencesSecret
      ) {
        box.classList.add('empty');
      } else {
        if (letter === state.secret[i]) {
          box.classList.add('right');
        } else if (state.secret.includes(letter)) {
          box.classList.add('wrong');
        } else {
          box.classList.add('empty');
        }
      }
    }, ((i + 1) * animation_duration) / 2);

    box.classList.add('animated');
    box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
  }

  const isWinner = state.secret === guess;
  const isGameOver = state.currentRow === 5;

  setTimeout(() => {
    if (isWinner) {
      Swal.fire({
        title: 'Congratulations!',
        text:'Your guess the word',
        icon: 'success',
    })
    } else if (isGameOver) {
      //alert(`Better luck next time! The word was ${state.secret}.`);
      Swal.fire({
        icon: 'error',
        title: 'Lose',
        text: `Better luck next time! The word was - "${state.secret}".`,
        //footer: '<a href="">Why do I have this issue?</a>'
      })
    }
  }, 3 * animation_duration);
  return isWinner ? 'win' : 'loose';
}

function isLetter(key) {
  return key.length === 1 && key.match(/[а-я]/i);
}

function addLetter(letter) {
  if (state.currentCol === 5) return;
  state.grid[state.currentRow][state.currentCol] = letter;
  state.currentCol++;
}

function removeLetter() {
  if (state.currentCol === 0) return;
  state.grid[state.currentRow][state.currentCol - 1] = '';
  state.currentCol--;
}

function startup(isInnit) {
  const game = document.getElementById('game');
  if(isInnit){
  game.innerHTML = ''
  // дополнить объект с историей предыдущей игры
  } 

  console.log(isInnit);
  drawGrid(game);
  state = {
    secret: dictionary[Math.floor(Math.random() * dictionary.length)],
    grid: Array(6)
      .fill()
      .map(() => Array(5).fill('')),
    currentRow: 0,
    currentCol: 0,
  };
  document.getElementById ("btnrestart").blur()
  registerKeyboardEvents();
}



startup(false);

document.getElementById ("btnrestart").addEventListener ("click", startup, false);


