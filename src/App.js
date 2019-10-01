import React from 'react';
import './App.css';
import Board from './Board';

const MaxHeight = 20;
const MaxWidth = 20;
let value = -1;
let backupvalue = -1;
let colorsArray = Array(400).fill('#dbbc8c');

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(400).fill(null),
          position: -1
        }
      ],
      xIsNext: true,
      stepNumber: 0,
      isIncrease: true,
    };
  }

  isBlock2Ends = (squares, type, competitor) => {
    const row = Math.floor(value / 20);
    const column = value % 20;
    let hasCompetitor = false;

    switch (type) {
      // Chặn 2 đầu ngang
      case 'horizontal':
        for (let i = column - 1; i >= 0; i -= 1) {
          if (squares[row * MaxWidth + i] === competitor) {
            hasCompetitor = true;
            break;
          }
        }

        if (hasCompetitor) {
          for (let i = column + 1; i < MaxWidth; i += 1) {
            if (squares[row * MaxWidth + i] === competitor) {
              return true;
            }
          }
        } else {
          return false;
        }

        break;

      // Chặn 2 đầu dọc
      case 'vertical':
        for (let i = row - 1; i >= 0; i -= 1) {
          if (squares[i * MaxWidth + column] === competitor) {
            hasCompetitor = true;
            break;
          }
        }

        if (hasCompetitor) {
          for (let i = row + 1; i < MaxHeight; i += 1) {
            if (squares[i * MaxWidth + column] === competitor) {
              return true;
            }
          }
        } else {
          return false;
        }

        break;

      // Chặn 2 đầu chéo "/"
      case 'slash':
        for (let i = 1; row + i < MaxHeight - 1 && column - i >= 0; i += 1) {
          if (squares[(row + i) * MaxWidth + column - i] === competitor) {
            hasCompetitor = true;
            break;
          }
        }

        if (hasCompetitor) {
          for (let i = 1; row - i >= 0 && column + i < MaxWidth; i += 1) {
            if (squares[(row - i) * MaxWidth + column + i] === competitor) {
              return true;
            }
          }
        } else {
          return false;
        }
        break;

      // Chặn 2 đầu chéo "\"
      case 'backslash':
        for (let i = 1; row - i >= 0 && column - i >= 0; i += 1) {
          if (squares[(row - i) * MaxWidth + column - i] === competitor) {
            hasCompetitor = true;
            break;
          }
        }

        if (hasCompetitor) {
          for (
            let i = 1;
            row + i < MaxHeight && column + i < MaxWidth;
            i += 1
          ) {
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
  };

  jumpTo = step => {

    const { history } = this.state;

    if (step !== history.length - 1) {
      value = -1;
      colorsArray = Array(400).fill('#dbbc8c');
      this.setState({
        stepNumber: step,
        xIsNext: step % 2 === 0,
      });
    } else {
      value = backupvalue;
      this.setState({
        stepNumber: step,
        xIsNext: step % 2 === 0
      });
    }

    for (let i = 0; i < history.length; i += 1) {
      if (i === step) {
        document.getElementById(i).style.background = '#0c4517';
      } else document.getElementById(i).style.background = '#4CAF50';
    }
  };

  paintWinLine = winLine => {
    colorsArray = Array(400).fill('#dbbc8c');
    for (let count = 0; count < 5; count += 1) {
      colorsArray[winLine[count]] = '#2aed18';
    }
  };

  calculateWinner(squares) {
    if (value === -1) {
      return null;
    }

    const row = Math.floor(value / 20);
    const column = value % 20;

    const thisValue = squares[row * 20 + column];
    let winLine = Array(5).fill(null);
    // Kiểm tra hàng dọc chứa điểm vừa đánh
    for (let index = row - 4; index <= row; index += 1) {
      winLine = Array(5).fill(null);
      // Nếu ô row + index (Ô đầu tiên của dãy 5) nằm ngoài bàn cờ
      if (index < 0) {
        // continue;
      }

      // Trường hợp đủ 5 con trong bàn cờ
      let isWon = true;

      for (let i = index; i < index + 5; i += 1) {
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

      if (
        isWon === true &&
        !this.isBlock2Ends(squares, 'vertical', thisValue === 'X' ? 'O' : 'X')
      ) {
        this.paintWinLine(winLine);
        return thisValue;
      }
    }

    // // Kiểm tra hàng ngang chứa điểm vừa đánh
    for (let index = column - 4; index <= column; index += 1) {
      winLine = Array(5).fill(null);

      // Nếu ô column + index (Ô đầu tiên của dãy 5) nằm ngoài bàn cờ
      if (index < 0) {
        // continue;
      }

      // Trường hợp đủ 5 con trong bàn cờ
      let isWon = true;
      for (let i = index; i < index + 5; i += 1) {
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

      if (
        isWon === true &&
        !this.isBlock2Ends(squares, 'horizontal', thisValue === 'X' ? 'O' : 'X')
      ) {
        this.paintWinLine(winLine);
        return thisValue;
      }
    }

    // // Kiểm tra hàng chéo từ trái qua, trên xuống chứa điểm vừa đánh
    for (let index = -4; index <= 0; index += 1) {
      winLine = Array(5).fill(null);

      // Nếu ô column + index (Ô đầu tiên của dãy 5) nằm ngoài bàn cờ
      if (index + column < 0 || index + row < 0) {
        // continue;
      }

      // Trường hợp đủ 5 con trong bàn cờ
      let isWon = true;
      for (let i = index; i < index + 5; i += 1) {
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

      if (
        isWon === true &&
        !this.isBlock2Ends(squares, 'backslash', thisValue === 'X' ? 'O' : 'X')
      ) {
        this.paintWinLine(winLine);
        return thisValue;
      }
    }

    // // Kiểm tra hàng chéo từ trái qua, dưới lên chứa điểm vừa đánh
    for (let index = -4; index <= 0; index += 1) {
      winLine = Array(5).fill(null);

      // Nếu ô column + index (Ô đầu tiên của dãy 5) nằm ngoài bàn cờ
      if (index + column < 0 || row - index > MaxHeight - 1) {
        // continue;
      }

      // Trường hợp đủ 5 con trong bàn cờ
      let isWon = true;
      for (let i = index; i < index + 5; i += 1) {
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

      if (
        isWon === true &&
        !this.isBlock2Ends(squares, 'slash', thisValue === 'X' ? 'O' : 'X')
      ) {
        this.paintWinLine(winLine);
        return thisValue;
      }
    }

    return null;
  }

  handleClickReset() {
    colorsArray = Array(400).fill('#dbbc8c');

    const { history } = this.state;

    for (let i = 0; i < history.length; i += 1) {
      document.getElementById(i).style.fontWeight = 'normal';
    }

    value = -1;

    this.setState({
      xIsNext: true,
      history: [
        {
          squares: Array(400).fill(null),
          position: -1
        }
      ],
      stepNumber: 0,
    });
  }

  handleClickSort() {
    const { isIncrease } = this.state;

    this.setState({
      isIncrease: !isIncrease
    });
  }

  handleClick(i) {

    const { history, stepNumber, xIsNext } = this.state;

    const histories = history.slice(0, stepNumber + 1);
    const current = histories[histories.length - 1];
    const squares = current.squares.slice();

    const winner = this.calculateWinner(squares);
    if (winner || squares[i]) {
      return;
    }

    for (let j = 0; j < histories.length; j += 1) {
      document.getElementById(j).style.background = '#4CAF50';
    }
    value = i;
    backupvalue = value;
    squares[i] = xIsNext ? 'X' : 'O';

    this.setState({
      history: histories.concat([
        {
          squares,
          position: value
        }
      ]),
      stepNumber: histories.length,
      xIsNext: !xIsNext,
    });
  }

  render() {
    const {
      history,
      stepNumber,
      isIncrease,
      xIsNext
    } = this.state;
    const current = history[stepNumber];
    const winner = this.calculateWinner(current.squares);
    const Style = {
      margin: '5px',
      background: '#4CAF50' /* Green */,
      border: 'none',
      color: 'white',
      padding: '0px',
      width: '160px',
      height: '40px'
    };

    const moves = [];
    if (isIncrease) {
      for (let i = 0; i < history.length; i += 1) {
        const desc = i
          ? `Đi lại bước ${i}: [${Math.floor(
              history[i].position / MaxWidth
            )};${history[i].position % MaxWidth}]`
          : 'Đi lại từ đầu';

        moves.push(
          <li key={i}>
            <button
              type="button"
              style={Style}
              onClick={() => this.jumpTo(i)}
              id={i}
            >
              {desc}
            </button>
          </li>
        );
      }
    } else {
      for (let i = history.length - 1; i >= 0; i -= 1) {
        const desc = i
          ? `Đi lại bước ${i}: [${Math.floor(
              history[i].position / MaxWidth
            )};${history[i].position % MaxWidth}]`
          : 'Đi lại từ đầu';

        moves.push(
          <li key={i}>
            <button
              type="button"
              style={Style}
              onClick={() => this.jumpTo(i)}
              id={i}
            >
              {desc}
            </button>
          </li>
        );
      }
    }

    let status;
    if (winner) {
      status = `${winner} chiến thắng`;
    } else {
      status = `${xIsNext ? 'X' : 'O'} tiếp theo`;
    }

    const sourceImgSort = isIncrease
      ? 'https://imgur.com/6l1wdoQ.png'
      : 'https://imgur.com/y0uioJc.png';

    return (
      <div className="App">
        <header className="App-header">
          <div className="game">
            <div className="status">
              <button type="button" onClick={() => this.handleClickReset()} style={{border: 'none', background: 'transparent'}}>
                <img src="https://i.imgur.com/n2W67wf.png" alt="Chơi lại" />
              </button>
            </div>
            <div className="game-board">
              <Board
                squares={current.squares}
                colors={colorsArray}
                onClick={i => this.handleClick(i)}
              />
            </div>

            <div style={{ marginLeft: '15px' }} className="game-info">
              <div>{status}</div>
              <button type="button" onClick={() => this.handleClickSort()} style={{border: 'none', background: 'transparent'}}>
                <img
                  src={sourceImgSort}
                  alt="Sắp xếp danh sách"
                  style={{ width: '40px', height: '40px', float: 'right' }}
                />
              </button>

              <div style={{ height: '88vh', overflow: 'scroll' }}>
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
