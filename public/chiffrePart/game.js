let operations = new Array();


function generateNumberGame() {
  return new Promise((resolve, reject) => {
    // Generate six random numbers between 1 and 100
    const numbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 25) + 1);
    console.log("The numbers are:", numbers);

    const result = calculateResult(numbers)
    console.log("result is:" + result);
    console.log("operations are:" + operations);
    var results = new Array();
    results['numberToFind'] = result;
    results['operations'] = operations;
    results['numbers'] = numbers;

    resolve(results)
  });
}

function calculateResult(numbers) {
  operations = []
  // shuffle the array and pick three or more numbers
  const shuffled = numbers.sort(() => Math.random() - 0.5);
  const count = Math.floor(Math.random() * 4) + 3;
  const selected = shuffled.slice(0, count);
  console.log("selected are  " + selected);

  // perform random mathematical operations until result is greater than 150
  let result = selected[0];
  operations.push(selected[0])
  for (let i = 1; i < selected.length; i++) {
    console.log("temporary result is " + result);
    const operator = ['+', '-', '*'][Math.floor(Math.random() * 4)];
    switch (operator) {
      case '+':
        result += selected[i];
        operations.push("+")
        operations.push(selected[i])
        break;
      case '-':
        result -= selected[i];
        operations.push("-")
        operations.push(selected[i])
        break;
      case '*':
        result *= selected[i];
        operations.push("*")
        operations.push(selected[i])
        break;
    }
    if (result > 150) {
      return result;
    } 
  }
  
  if (result < 150 || result === null) {
    return calculateResult(numbers)
  }
  // if result is still not greater than 150, recurse with remaining numbers
  if (selected.length < numbers.length) {
    const remaining = numbers.filter(num => !selected.includes(num));
    return calculateResult([...selected, ...remaining]);
  }

  // if all numbers have been used and result is still not greater than 150, return null
  return null;
}

class ReturnButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { returnToMenu } = this.props
    return (
      <div onClick={() => returnToMenu()}>
        <button className="returnButton" ><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" /></svg>
        </button>
      </div>
    )
  }
}

class EndingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    this.setState({ inputText: event.target.value });
  }

  render() {
    const { isFound, numberToFind, returnToMenu , operations} = this.props

    return (
      <div>
        <ReturnButton returnToMenu={() => returnToMenu()} />
        <div className="endGameScreen">
          <h1>Game Over!</h1>
          {isFound ?
            <p>Tu as réussi à trouver le nombre: Bravo</p> :
            <p>Tu n'as malheureusement pas trouvé le nombre, dommage, tu feras mieux la prochaine fois</p> 
          }
          
          <p>Le nombre à trouver était: {numberToFind}</p>
          <p>Pour y arriver, il fallait faire:</p>
          <div className="operationList">
            {
              operations.map((elem) => <p>({elem.toString()})</p>)
            }
          </div>
        </div>
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberToFind: 0,
      operations: null,
      isCooldownActive: false,
      secondsLeft: 10,
      isNumbersGenerated: false,
      numbers: null,
      isFound: false
    };
    this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this)
  }

  componentDidMount() {
    generateNumberGame().then((results) => {
      this.setState({ numberToFind: results.numberToFind, operations: results.operations, isNumbersGenerated: true, numbers: results.numbers });
      console.log(results.operations);
    }).catch((error) => {
      console.error(error);
    });

    this.interval = setInterval(() => {
      if (this.state.isCooldownActive) {
        if (this.state.secondsLeft === 0) {
          this.setState({ isCooldownActive: true });
        } else {
          this.setState((prevState) => ({ secondsLeft: prevState.secondsLeft - 1 }));
        }
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  handlePlayButtonClick() {
    //on active le cooldown quand on a déjà trouvé le mot
    if (this.state.isNumbersGenerated) {
      this.setState({ isCooldownActive: true });
    }
  }

  returnToMenu() {
    document.location.href = './chiffrePartIndex'
  }


  render() {
    const { isCooldownActive, secondsLeft, isNumbersGenerated , numberToFind, operations, isFound} = this.state;

    //le timer est fini
    if (isCooldownActive && secondsLeft === 0) {
      return (
        <EndingScreen numberToFind={numberToFind} operations={operations} returnToMenu={() => this.returnToMenu()} isFound={isFound} />
      );
    }

    //jeu en cours
    if (isCooldownActive) {
      return(
        <div className="game">
          <div className="topPart">
            <ReturnButton returnToMenu={() => this.returnToMenu()}/>
            <p className="chrono">{secondsLeft}</p>
          </div>
          {/* {letters && <LetterArea letters={letters} />} 
          <GuessPart letters={letters} incrementScore={(n) => this.incrementScore(n)} score={this.state.score} /> */}
        </div>
      )
    } else {
      if (isNumbersGenerated) {
        return (
          /*Le jeu n'a pas encore commencé*/
          <div className="chargementScreen">
            <ReturnButton returnToMenu={() => this.returnToMenu()}/>
            <button className="play-button" onClick={this.handlePlayButtonClick}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        )
      } else {
        //si le nombre a cherché n'a pas encore chargé, on patiente (peu de chance d'arriver)
        return ( 
          <div className="chargementScreen">
            <ReturnButton returnToMenu={() => this.returnToMenu()}/>
            Chargement ...
          </div>
        )
      }
    } 
  }
}

ReactDOM.render(<Game />, document.querySelector('#app'))
