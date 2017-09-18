import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    var _numbers = [];
    var curr = '';
    this.resetRemainingNumbers();
    if(window.localStorage.housieNumbers) {
      _numbers = JSON.parse(window.localStorage.housieNumbers);
      if(_numbers.length >0) {
        curr = _numbers[_numbers.length-1];
      }
    } else {
      window.localStorage.setItem("housieNumbers", JSON.stringify(_numbers));
    }
    for(var i=0; i<_numbers.length; i++) {
      var element = _numbers[i];
      var index = this.remainingNumbers.indexOf(element);
      if (index > -1) {
        this.remainingNumbers.splice(index, 1);
      }
    }
    this.state = {
      completed: _numbers,
      currentNumber: curr,
      isActive: true
    }
  }

  resetRemainingNumbers() {
    this.remainingNumbers = [];
    for(var i = 0;i < 90; i++) {
      this.remainingNumbers.push(i+1);
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  onNewNumberClick() {
    if(this.remainingNumbers.length===0){
      this.setState({
        currentNumber: '',
        isActive: false
      })
      return;
    }
    var newNumberIndex = this.getRandomInt(0,this.remainingNumbers.length);
    var newNumber = this.remainingNumbers[newNumberIndex];
    this.remainingNumbers.splice(newNumberIndex, 1);
    var arr = this.state.completed;
    arr.push(newNumber);
    window.localStorage.setItem("housieNumbers", JSON.stringify(arr));    
    this.setState({
      completed: arr,
      currentNumber: newNumber.toString()
    })
  }

  onReset() {
    window.localStorage.setItem("housieNumbers", JSON.stringify([]));
    this.resetRemainingNumbers();
    this.setState({
      completed: [],
      currentNumber: '',
      isActive: true
    });
  }

  renderPreviousNumbers() {
    var iter = 5;
    var content = [];
    if(this.state.completed.length > 1) {
      content.push(<i key="0" className="fa fa-history message"></i>);
    }
    if(this.state.completed.length < 6) {
      iter = this.state.completed.length - 1;
    }
    var gameOver = this.state.isActive ? 0 : 1;
    for(var i = 1; i <= iter; i++) {
      var cl = "badge token space_front completed " + ((i===1) ?"big-font" :"");
      content.push(<div key={i} className= {cl}>{this.state.completed[this.state.completed.length - 1 - i + gameOver]}</div>);
    }
    return content;
  }

  renderNumbers() {
    var content = [];
    for(var i = 0; i < 90; i++) {
      var completed = false;
      if ( this.state.completed.indexOf(i+1) > -1 ) {
        completed = true;
      }
      if(i%10 === 0) {
        content.push(<br key={i*100}/>);
      }
      var curr = (i + 1).toString();
      if( curr === this.state.currentNumber) {
        content.push(<div key={i+1} className="badge token current"> {i<9? "0": ""}{curr} </div>);        
      } else if(completed) {
        content.push(<div key={i+1} className="badge token completed"> {i<9? "0": ""}{curr} </div>);            
      } else {
        content.push(<div key={i+1} className="badge token notCompleted"> {i<9? "0": ""}{curr} </div>);    
      }
    }
    return content;
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <h2>Online Housie</h2>
        </div>
        <div>
          <div className="col-xs-4">
            {this.renderPreviousNumbers()}
            <div className="newNumber">{this.state.currentNumber}</div>
          </div>
          <div className="col-xs-6">
            <div className = {this.state.isActive? "message active": "message inactive"}>{this.state.isActive? 'Game On!': 'Game Over!'}</div>
            {this.renderNumbers()}
          </div>
          <div className="col-xs-2">
            <button type="button" onClick = {this.onNewNumberClick.bind(this)} className="btn btn-success space">New Number</button>
            <button type="button" onClick = {this.onReset.bind(this)} className="btn btn-danger">Reset</button>
          </div>          
        </div>
      </div>
    );
  }
}

export default App;
