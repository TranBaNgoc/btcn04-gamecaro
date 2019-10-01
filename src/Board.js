import React from 'react';
import './App.css';
import Square from './Square';

class Board extends React.Component {
    renderSquare(i) {

        const {squares, onClick, colors} = this.props;

      return (
        <Square
          value={squares[i]}
          onClick={() => onClick(i)}
          id={`s${i}`}
          background={colors[i]}
        />
      );
    }
  
    render() {
      const board = [];
      for (let i = 0; i < 20; i+=1) {
        const rowBoard = [];
        for (let j = 0; j < 20; j+=1) {
          rowBoard.push(this.renderSquare(i * 20 + j))
        }
        board.push(<div className="board-row">
          {rowBoard}
        </div>)
      }
  
      return (
        <div>
          {board}
        </div>
      );
    }
  }

  export default Board;