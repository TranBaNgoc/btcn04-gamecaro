import React from 'react';
import './App.css';

const MaxHeight = 20;
const MaxWidth = 20;
var value = -1;
var backupvalue = -1;
function Square(props) {
  return (
    <button className="square" onClick={props.onClick} id={props.id} style={{ background: props.background }}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        id={"s" + i}
        background={this.props.colors[i]}
      />
    );
  }

  render() {
    let board = [];
    for (let i = 0; i < 20; i++) {
      let rowBoard = [];
      for (let j = 0; j < 20; j++) {
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


class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(400).fill(null),
        position: -1,
      }],
      xIsNext: true,
      stepNumber: 0,
      colors: Array(400).fill('#f5d5ae'),
      isEnded: false,
      isIncrease: true,
    };
  }

  calculateWinner(squares) {

    if (value === -1) {
      return null;
    }

    var row = Math.floor(value / 20);
    var column = value % 20;

    var thisValue = squares[row * 20 + column];
    var winLine;
    // Kiểm tra hàng dọc chứa điểm vừa đánh
    for (var index = row - 4; index <= row; index++) {

      winLine = Array(5).fill(null)
      // Nếu ô row + index (Ô đầu tiên của dãy 5) nằm ngoài bàn cờ
      if (index < 0) {
        continue;
      }

      // Trường hợp đủ 5 con trong bàn cờ
      var isWon = true;

      for (var i = index; i < index + 5; i++) {
        winLine[i - index] = i * MaxWidth + column;
        if (i > MaxHeight - 1) {
          isWon = false;
          break;
        }

        if (squares[i * MaxWidth + column] !== thisValue) {
          isWon = false;
          break;
        }
      }

      if (isWon === true && !this.isBlock2Ends(squares, "vertical", thisValue === 'X' ? 'O' : 'X')) {
        this.paintWinLine(winLine);
        return thisValue;
      }
    }

    // // Kiểm tra hàng ngang chứa điểm vừa đánh
    for (index = column - 4; index <= column; index++) {
      winLine = Array(5).fill(null);

      // Nếu ô column + index (Ô đầu tiên của dãy 5) nằm ngoài bàn cờ
      if (index < 0) {
        continue;
      }

      // Trường hợp đủ 5 con trong bàn cờ
      isWon = true;
      for (i = index; i < index + 5; i++) {
        winLine[i - index] = row * MaxWidth + i;
        if (i > MaxWidth - 1) {
          isWon = false;
          break;
        }

        if (squares[row * MaxWidth + i] !== thisValue) {
          isWon = false;
          break;
        }
      }

      if (isWon === true && !this.isBlock2Ends(squares, "horizontal", thisValue === 'X' ? 'O' : 'X')) {
        this.paintWinLine(winLine);
        return thisValue;
      }
    }

    // // Kiểm tra hàng chéo từ trái qua, trên xuống chứa điểm vừa đánh
    for (index = - 4; index <= 0; index++) {
      winLine = Array(5).fill(null);

      // Nếu ô column + index (Ô đầu tiên của dãy 5) nằm ngoài bàn cờ
      if (index + column < 0 || index + row < 0) {
        continue;
      }

      // Trường hợp đủ 5 con trong bàn cờ
      isWon = true;
      for (i = index; i < index + 5; i++) {
        winLine[i - index] = (row + i) * MaxWidth + (column + i);
        if (i + column > MaxWidth - 1 || i + row > MaxHeight - 1) {
          isWon = false;
          break;
        }

        if (squares[(row + i) * MaxWidth + (column + i)] !== thisValue) {
          isWon = false;
          break;
        }
      }

      if (isWon === true && !this.isBlock2Ends(squares, "backslash", thisValue === 'X' ? 'O' : 'X')) {
        this.paintWinLine(winLine);
        return thisValue;
      }

    }

    // // Kiểm tra hàng chéo từ trái qua, dưới lên chứa điểm vừa đánh
    for (index = - 4; index <= 0; index++) {
      winLine = Array(5).fill(null)

      // Nếu ô column + index (Ô đầu tiên của dãy 5) nằm ngoài bàn cờ
      if (index + column < 0 || row - index > MaxHeight - 1) {
        continue;
      }

      // Trường hợp đủ 5 con trong bàn cờ
      isWon = true;
      for (i = index; i < index + 5; i++) {
        winLine[i - index] = (row - i) * MaxWidth + (column + i);
        if (i + column > MaxWidth - 1 || row - i < 0) {
          isWon = false;
          break;
        }

        if (squares[(row - i) * MaxWidth + (column + i)] !== thisValue) {
          isWon = false;
          break;
        }
      }

      if (isWon === true && !this.isBlock2Ends(squares, "slash", thisValue === 'X' ? 'O' : 'X')) {
        this.paintWinLine(winLine)
        return thisValue;
      }

    }

    return null;
  }

  paintWinLine(winLine) {
    for (let count = 0; count < 5; count++) {
      this.state.colors[winLine[count]] = '#37d422';
    }

    winLine = [];
  }

  isBlock2Ends(squares, type, competitor) {
    var row = Math.floor(value / 20);
    var column = value % 20;
    var hasCompetitor = false;

    switch (type) {

      // Chặn 2 đầu ngang
      case 'horizontal':
        for (var i = column - 1; i >= 0; i--) {
          if (squares[row * MaxWidth + i] === competitor) {
            hasCompetitor = true;
            break;
          }
        }

        if (hasCompetitor) {
          for (i = column + 1; i < MaxWidth; i++) {
            if (squares[row * MaxWidth + i] === competitor) {
              return true;
            }
          }
        } else {
          return false;
        }

        break;

      // Chặn 2 đầu dọc
      case "vertical":
        for (i = row - 1; i >= 0; i--) {
          if (squares[i * MaxWidth + column] === competitor) {
            hasCompetitor = true;
            break;
          }
        }

        if (hasCompetitor) {
          for (i = row + 1; i < MaxHeight; i++) {
            if (squares[i * MaxWidth + column] === competitor) {
              return true;
            }
          }
        } else {
          return false;
        }

        break;

      // Chặn 2 đầu chéo "/"
      case "slash":

        for (i = 1; row + i < MaxHeight - 1 && column - i >= 0; i++) {
          if (squares[(row + i) * MaxWidth + column - i] === competitor) {
            hasCompetitor = true;
            break;
          }
        }

        if (hasCompetitor) {
          for (i = 1; row - i >= 0 && column + i < MaxWidth; i++) {
            if (squares[(row - i) * MaxWidth + column + i] === competitor) {
              return true;
            }
          }
        } else {
          return false;
        }
        break;

      // Chặn 2 đầu chéo "\"
      case "backslash":
        for (i = 1; row - i >= 0 && column - i >= 0; i++) {
          if (squares[(row - i) * MaxWidth + column - i] === competitor) {
            hasCompetitor = true;
            break;
          }
        }

        if (hasCompetitor) {
          for (i = 1; row + i < MaxHeight && column + i < MaxWidth; i++) {
            if (squares[(row + i) * MaxWidth + column + i] === competitor) {
              return true;
            }
          }
        } else {
          return false;
        }
        break;
      default:
        break;
    }

    return false;
  }

  jumpTo(step) {

    if (step !== this.state.history.length - 1) {

      value = -1;
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
        colors: Array(400).fill('#f5d5ae'),
      });
    } else {
      value = backupvalue;
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    for (let i = 0; i < this.state.history.length; i++) {
      if (i === step) {
        document.getElementById(i).style.background = '#0c4517';
      }
      else document.getElementById(i).style.background = '#4CAF50';
    }
  }

  handleClickReset() {

    for (let i = 0; i < this.state.history.length; i++) {
      document.getElementById(i).style.fontWeight = '#4CAF50';
    }

    value = -1;

    this.setState({
      squares: Array(400).fill(null),
      xIsNext: true,
      history: [{
        squares: Array(400).fill(null),
        position: -1,
      }],
      stepNumber: 0,
      colors: Array(400).fill('#f5d5ae'),
      isEnded: false,
    });

  }

  handleClickSort() {
    this.setState({
      isIncrease: !this.state.isIncrease,
    })
  }

  handleClick(i) {
    console.log('flag: handlerClick')
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();



    if (this.calculateWinner(current.squares) || squares[i]) {
      return;
    }

    for (let i = 0; i < this.state.history.length; i++) {
      document.getElementById(i).style.background = '#4CAF50';
    }
    
    value = i;
    backupvalue = value;
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
        position: value,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);

    const Style = {
      margin: '5px',
      background: '#4CAF50', /* Green */
      border: 'none',
      color: 'white',
      padding: '0px',
      width: '160px',
      height: '40px'
    };

    var moves = [];
    if (this.state.isIncrease) {
      for (let i = 0; i < history.length; i++) {
        const desc = i ?
          'Đi lại bước ' + i + ': [' + Math.floor(history[i].position/MaxWidth) + ';' + ((history[i].position%MaxWidth)) + ']':
          'Đi lại từ đầu';

        moves.push(
          <li key={i}>
            <button style={Style} onClick={() => this.jumpTo(i)} id={i}>{desc}</button>
          </li>)
      }
    } else {
      for (let i = history.length - 1; i >= 0; i--) {
        const desc = i ?
        'Đi lại bước ' + i + ': [' + Math.floor(history[i].position/MaxWidth) + ';' + ((history[i].position%MaxWidth)) + ']':          'Đi lại từ đầu';

        moves.push(
          <li key={i}>
            <button style={Style} onClick={() => this.jumpTo(i)} id={i}>{desc}</button>
          </li>)
      }
    }

    let status;
    if (winner) {
      status = winner + ' chiến thắng';
    } else {
      status = (this.state.xIsNext ? 'X' : 'O') + ' tiếp theo';
    }

    var sourceImgSort = this.state.isIncrease ? "https://imgur.com/6l1wdoQ.png" : "https://imgur.com/y0uioJc.png";

    return (
      <div className="App">
        <header className="App-header">
          <div className="game">
            <div className="status">
              <img src={"https://i.imgur.com/n2W67wf.png"} alt="Chơi lại" onClick={() => this.handleClickReset()}></img>
            </div>
            <div className="game-board">
              <Board
                squares={current.squares}
                colors={this.state.colors}
                onClick={(i) => this.handleClick(i)}
              />
            </div>

            <div style={{ marginLeft: '15px' }} className="game-info">
              <div>{status}</div>
              <img src={sourceImgSort} alt="Sắp xếp danh sách" style={{ width: '40px', height: '40px', float: "right" }} onClick={() => this.handleClickSort()}></img>
              <div style={{height: '94.5vh', overflow: 'scroll'}}>
                <ul style={{ marginTop: '0px' }}>{moves}</ul>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default Game;
