import React, { useState, useEffect } from 'react';
import './Sudoku.css'; // Import your CSS file
const Sudoku = () => {
    const [numSelected, setNumSelected] = useState(null);
    const [errors, setErrors] = useState(0);
    const [board, setBoard] = useState([]);
    const [solution, setSolution] = useState([]);
    const [timer, setTimer] = useState(0);
    const [isSolved, setIsSolved] = useState(false);
  
    useEffect(() => {
      generateBoard();
    }, []);
  
    useEffect(() => {
      if (!isSolved) {
        const interval = setInterval(() => {
          setTimer((prevTimer) => prevTimer + 1);
        }, 1000);
  
        return () => clearInterval(interval);
      }
    }, [isSolved]);
  
    useEffect(() => {
      if (isSolved) {
        clearInterval(timer);
      }
    }, [isSolved]);
    const generateBoard = () => {
      const newBoard = [];
      const newSolution = [];
  
      // Initialize board and solution arrays
      for (let i = 0; i < 9; i++) {
        newBoard.push([]);
        newSolution.push([]);
  
        for (let j = 0; j < 9; j++) {
          newBoard[i].push('');
          newSolution[i].push('');
        }
      }
  
      // Generate a random solved Sudoku board
      solveSudoku(newBoard, newSolution);
      setBoard([...newBoard]);
      setSolution([...newSolution]);
  
      // Randomly remove numbers from the board to create the puzzle
      const puzzle = removeNumbers([...newBoard]);
      setBoard([...puzzle]);
    };
  
    const solveSudoku = (board, solution) => {
      if (solveHelper(board, solution)) {
        return true;
      } else {
        return false;
      }
    };
  
    const solveHelper = (board, solution) => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === '') {
            for (let num = 1; num <= 9; num++) {
              if (isValidMove(board, row, col, num)) {
                board[row][col] = num.toString();
                solution[row][col] = num.toString();
  
                if (solveHelper(board, solution)) {
                  return true;
                } else {
                  board[row][col] = '';
                  solution[row][col] = '';
                }
              }
            }
            return false;
          }
        }
      }
      return true;
    };
  
    const isValidMove = (board, row, col, num) => {
      for (let i = 0; i < 9; i++) {
        if (board[row][i] === num.toString() || board[i][col] === num.toString()) {
          return false;
        }
      }
  
      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
  
      for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
          if (board[i][j] === num.toString()) {
            return false;
          }
        }
      }
  
      return true;
    };
  
    const removeNumbers = (board) => {
      const puzzle = [];
  
      for (let row = 0; row < 9; row++) {
        const newRow = [];
    
        for (let col = 0; col < 9; col++) {
          newRow.push(board[row][col]);
        }
    
        puzzle.push(newRow);
      }
    
      // Remove 6 random numbers from each row
      const numbersToRemove = 6;
    
      for (let row = 0; row < 9; row++) {
        const removedIndices = [];
        for (let i = 0; i < numbersToRemove; i++) {
          let col;
          do {
            col = Math.floor(Math.random() * 9);
          } while (removedIndices.includes(col));
    
          puzzle[row][col] = '';
          removedIndices.push(col);
        }
      }
    
      return puzzle;
    };
  
    const setGame = () => {
      // Check if board and solution arrays are populated
      if (board.length === 0 || solution.length === 0) {
        return null;
      }
  
      // Digits 1-9
      const numbers = [];
      for (let i = 1; i <= 9; i++) {
        numbers.push(
          <div
            key={i}
            id={i}
            className={`number ${numSelected === i ? 'number-selected' : ''}`}
            onClick={selectNumber}
          >
            {i}
          </div>
        );
      }
  
      // Board 9x9
      const tiles = [];
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const tileId = `${r}-${c}`;
          const tileContent = board[r][c] !== '' ? board[r][c] : '';
  
          tiles.push(
            <div
              key={tileId}
              id={tileId}
              className={`tile ${
                board[r][c] !== '' ? 'tile-start' : ''
              } ${r === 2 || r === 5 ? 'horizontal-line' : ''} ${
                c === 2 || c === 5 ? 'vertical-line' : ''
              }`}
              onClick={selectTile}
            >
              {tileContent}
            </div>
          );
        }
      }
  
      return (
        <div>
          <h1>Sudoku</h1>
          <hr />
          <h2 id="mistakes">Mistakes: {errors}</h2>
          <div id="timer">Timer: {timer}</div> {/* Timer display */}
          <div id="board">{tiles}</div>
          <br />
          <div id="digits">{numbers}</div>
        </div>
      );
    };
  
  
    const selectNumber = (e) => {
      const selectedNumber = parseInt(e.target.id);
  
      if (numSelected === selectedNumber) {
        setNumSelected(null);
      } else {
        setNumSelected(selectedNumber);
      }
    };
  
    const selectTile = (e) => {
      const { id } = e.target;
  
      if (numSelected) {
        if (e.target.innerText !== '') {
          return;
        }
  
        const coords = id.split('-');
        const r = parseInt(coords[0]);
        const c = parseInt(coords[1]);
  
        if (solution[r][c] === numSelected.toString()) {
          e.target.innerText = numSelected.toString();
        } else {
          setErrors(errors + 1);
        }
      }
    };
  
    return setGame();
  };
  
  export default Sudoku;