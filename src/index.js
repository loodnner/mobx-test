import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 没有state所以改成函数组件
// function Square(props) {
//   return (
//     <button className="square" onClick={props.onClick}>
//       {props.value}
//     </button>
//   );
// }

/**
 * Square：单个格子，无state，靠props传入value和onClick的回调
 * Board：九宫格，挂9个square，封装一个renderSquare的函数，params是0-9，通过props接收，并传递
 * Game：分成棋盘区和历史信息区两部分
 */
class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => {
          this.props.onClick();
        }}
      >
        {this.props.value}
      </button>
    );
  }
}

// 在board里面传入了每个格子的标志0-8

const tableStruc = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
];
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => {
          this.props.onClick(i);
        }}
      />
    );
  }

  render() {
    return (
      <div>
        {tableStruc.map((item) => {
          return (
            <div className="board-row">
              {item.map((item) => this.renderSquare(item))}
            </div>
          );
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  handleClick = (i) => {
    // 回到过去之后，history数组也要因此而改变
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const coordinates = current.coordinates.slice();
    // 如果已经有值或者成功就return
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'x' : 'o';
    coordinates[0] = Math.floor(i / 3) + 1;
    coordinates[1] = (i % 3) + 1;
    this.setState({
      history: history.concat([
        {
          squares: squares,
          coordinates: coordinates,
        },
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  };

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  toggle() {
    this.setState({
      isAscending: !this.state.isAscending,
    });
  }

  /**
   * squares:长度为9的数组，记录棋盘状态；
   * .slice() 函数对 squares 数组进行拷贝，而非直接修改现有的数组。
   * history:history 数组保存了从第一步到最后一步的所有的棋盘状态，all squares数组。
   * stepNumber:当前正在查看哪一项历史记录
   * xIsNext：利用布尔值记录先手、后手，移动一步就反转
   *
   */

  // 在构造函数中初始化 state
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          coordinates: Array(2),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true,
    };
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // step是item，move是index
    const moves = history.map((step, move) => {
      const index = this.state.isAscending ? move : history.length - move - 1;
      const desc = index
        ? `Go to index #${index}, coordinate:(${step.coordinates.join(',')})`
        : 'Go to game start';
      return (
        <li key={index}>
          <button
            onClick={() => {
              this.jumpTo(index);
            }}
            style={
              index === this.state.stepNumber ? { fontWeight: 'bold' } : {}
            }
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner：' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => {
              this.handleClick(i);
            }}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div className="info-order">
          <button
            onClick={() => {
              this.toggle();
            }}
          >
            {this.state.isAscending ? '正序' : '降序'}
          </button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
