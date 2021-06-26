import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//to start a new terminal, use "cd myapp", followed by "npm start"
//import reportWebVitals from './reportWebVitals';
let num;
num = 0;

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
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
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(findWinner(squares) === null && squares[i] === null){
      num = num + 1;
      if(num%2 === 1)
        squares[i] = 'X';
      else
        squares[i] = 'O';  
      this.setState({
        history: history.concat([{
          squares: squares
        }]),
        stepNumber: history.length,
      });    
    }
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
    });
    num = step ;
  }

  render() {
    const history = this.state.history;
    console.log(history);
    const current = history[this.state.stepNumber];
    const winner =findWinner(current.squares);

    const moves = history.map((step, move)=>{
      const desc = (move !== 0)? ('Back to this move'): ('Go to game start');
      let player;
      if(move%2 === 1)
        player = this.props.u1Data;
      else  player = this.props.u2Data;
      let descrip;
      if(move === 0)
        descrip = "Game Started";
      else
        descrip = "Player " + player + "'s move";
      return (
        <li key={move}>
          {descrip}
          <button onClick={() => {
            this.jumpTo(move);
            
            }}>{desc}</button>
        </li>
      );
    });

    let playerID;
    if(num%2 === 0)
      playerID = this.props.u1Data;
    else  playerID = this.props.u2Data;
    let status;
    let winnerName;
    let statusAlert;
    if(winner === 'X')
      winnerName = this.props.u1Data;
    else  winnerName = this.props.u2Data;
    if(winner!== null) {
      status = 'WINNER IS: ' + winnerName;
      statusAlert = winnerName + ' Has Won !!!';
    }
    else
      status = 'Next player: ' + playerID;
    if(num >=9 && winner === null)
      status = 'DRAW';
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div> {this.props.u1Data} plays X</div>
          <div> {this.props.u2Data} plays O</div>
          <div className = "stats">{status}</div>
          
          <ol>{moves}</ol>
          <div className="winner-alert">{statusAlert}</div>
        </div>
      </div>
    );
  }
}

class PlayGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: false,
      display2: true,
      user1: "",
      user2: "",
    };
    this.onInputchange = this.onInputchange.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
  }
  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onSubmitForm() {
    console.log(this.state)
  }

  handle() {
    //const { items } = this.state;
    this.setState({display: true,})
    this.setState({display2: false,})            
  }
  render() {
    return (
      <div>
        <div>{this.state.display2 &&
        <div>
        <div className = "name-input">
          <label>
            Player 1's Name :
            <input
              name="user1"
              type="text"
              value={this.state.user1}
              onChange={this.onInputchange}
            />
          </label>
        </div>
        <div className = "name-input">
          <label >
            Player 2's Name :
            <input
              name="user2"
              type="text"
              value={this.state.user2}
              onChange={this.onInputchange}
            />
          </label>
        </div>
        <div>
            <button className="submission" 
                    onClick={ this.onSubmitForm}>
              Submit
            </button>
        </div>
        </div>
        }</div>
      <div className="game-info">
        <button className="submission" onClick={()=> this.handle()}>
          Click To START GAME
        </button>
        {this.state.display 
        && 
        <Game 
         u1Data = {this.state.user1} 
         u2Data = {this.state.user2} 
        />}  
      </div>
      </div>
      
    );// this return is where the problem is. It isnt responding,
    // but if I simply use {this.handle} instead of the whole button element
    //it shows no problem
  }
}

ReactDOM.render(
  <PlayGame />,
  document.getElementById('root')
);
function findWinner (squares) {
  const solutions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for( let i = 0; i < solutions.length; i++){
    const [a, b, c] = solutions[i];
    if(squares[a] && squares[b] === squares[a] && squares[c] === squares[a])
      return squares[a];
  }
  return null;
} 
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
