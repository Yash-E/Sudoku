import React, { useState } from 'react';
import './Sudoku.css'; // Import your CSS file
const Sudoku = () => {
  const [numSelected, setNumSelected] = useState(null);
  const [errors, setErrors] = useState(0);

  const board = [
    "--74916-5",
    "2---6-3-9",
    "-----7-1-",
    "-586----4",
    "--3----9-",
    "--62--187",
    "9-4-7---2",
    "67-83----",
    "81--45---"
  ];

  const solution = [
    "387491625",
    "241568379",
    "569327418",
    "758619234",
    "123784596",
    "496253187",
    "934176852",
    "675832941",
    "812945763"
  ];

  const setGame = () => {
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
        const tileContent = board[r][c] !== '-' ? board[r][c] : '';

        tiles.push(
          <div
            key={tileId}
            id={tileId}
            className={`tile ${
              board[r][c] !== '-' ? 'tile-start' : ''
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
        <h2 id="mistakes">{errors}</h2>

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