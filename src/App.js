import React, {useState}  from 'react';


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Square({value, onSquareClick}) {
  return <button className='square' onClick={onSquareClick}>{value}</button>
}

function generateBoard(squares, handleClick) {
  const board = [];

  for (let i = 0; i < 3; ++i) {
    const row = [];
    board.push();
    for (let j = 0; j < 3; ++j) {
      let index = i * 3 + j;

      row.push(
        <Square 
          value={squares[index]} 
          onSquareClick={() => handleClick(index)} />)
    }
    board.push(<div className='board-row'>{row}</div>);
  }

  return board;
}

function Board({xIsNext,squares, onPlay}) {  
  function handleClick(index) {
    const nextSquares = squares.slice();
    
    if (squares[index] || calculateWinner(squares)) {
      return;
    }
    
    if (xIsNext) {
      nextSquares[index] = 'X';
    } else {
      nextSquares[index] = 'O'
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div>
      <div className='status'>{status}</div>
      {generateBoard(squares, handleClick)}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;

    if(move === currentMove) {
      description = `You\'re at move #${move + 1}`;
    } else if (move > 0) {
      description = 'Go to move #' + (move + 1);
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        <button className='button' onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

