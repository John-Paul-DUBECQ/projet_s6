let operations = new Array();

function generateNumberGame() {
   return new Promise((resolve, reject) => {
      // génère 6 nombre entre 1 et 25 (pas de doublons)
      const numbers = new Array();
      while (numbers.length < 6) {
         const number = Math.floor(Math.random() * 25) + 1;
         if (!numbers.includes(number)) {
            numbers.push(number);
         }
      }
      const result = calculateResult(numbers)
      var results = new Array();
      results['numberToFind'] = result;
      results['operations'] = operations;
      results['numbers'] = numbers;

      resolve(results)
   });
}

function calculateResult(numbers) {
   operations = []
   // on shuffle les chiffres et on en prend un minimum
   const shuffled = numbers.sort(() => Math.random() - 0.5);
   const count = Math.floor(Math.random() * 4) + 3;
   const selected = shuffled.slice(0, count);

   // on les fait agir aléatoirement entre eux jusqu'à >200
   let result = selected[0];
   operations.push(selected[0])//on ajoute dans opérations dès qu'on calcule
   for (let i = 1; i < selected.length; i++) {
      const operator = ['+', '-', '*'][Math.floor(Math.random() * 4)];
      switch (operator) {
         case '+':
            result += selected[i];
            operations.push(" + ")
            operations.push(selected[i])
            break;
         case '-':
            result -= selected[i];
            operations.push(" - ")
            operations.push(selected[i])
            break;
         case '*':
            if (selected[i] === 1) {
               result *= selected[i];
            } else {
               operations.unshift("(")//les parenthèses pour la priorité
               result *= selected[i];
               operations.push(" ) " + " * ")
               operations.push(selected[i])
            }
            break;
      }
   }

   if (result <= 200 || result > 899 || result === null) {
      return calculateResult(numbers)
   }

   if (result > 200) {
      return result;
   }

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
      const { isWin, numberToFind, returnToMenu, operations } = this.props

      return (
         <div className="endGameScreen">
            <ReturnButton returnToMenu={() => returnToMenu()} />
            <div>
               <h1>Game Over!</h1>
               {isWin ?
                  <p>Tu as réussi à trouver le nombre: Bravo</p> :
                  <p>Tu n'as malheureusement pas trouvé le nombre, dommage, tu feras mieux la prochaine fois</p>
               }

               <p>Le nombre à trouver était: {numberToFind}</p>
               <p>Pour y arriver, on pouvait faire:</p>
               <div className="operationList">
                  {
                     operations.map((elem) => <p>{elem.toString()}</p>)
                  }
               </div>
            </div>
         </div>
      )
   }
}

class PlayPart extends React.Component {
   constructor(props) {
      super(props);
      const { numbers } = this.props;
      this.state = {
         numbers: [
            numbers[0],
            numbers[1],
            numbers[2],
            numbers[3],
            numbers[4],
            numbers[5]
         ],
         operatorSelected: null,
         operators: [
            "+",
            "-",
            "*"
         ],
         selectedNumber1: null,
         selectedNumber2: null
      }
      this.handleSendClick = this.handleSendClick.bind(this);
      this.handleResetClick = this.handleResetClick.bind(this);
   }

   // fct quand on envoie un calcul
   handleSendClick() {
      const { numberToFind, endingGame } = this.props;

      const { selectedNumber1, selectedNumber2, operatorSelected, numbers } = this.state;
      if (selectedNumber1 && selectedNumber2 && operatorSelected != null) {
         const a = selectedNumber1
         const b = selectedNumber2
         let result;
         switch (operatorSelected) {
            case "+":
               result = a + b;
               break;
            case "-":
               if ((a - b) > 0) {
                  result = a - b;
               }else {
                  result = b - a;
               }
               break;
            case "*":
               result = a * b;
               break;
            default:
               result = 0;
               break;
         }

         console.log(result);

         if (result === numberToFind) {
            endingGame()
         }
         //on crée un nouveau tableau où on enlève les deux éléments et on ajoute le nouveau
         const numbersCopy = [...numbers];
         const indexA = numbersCopy.findIndex((number) => number === selectedNumber1);
         numbersCopy.splice(indexA, 1);
         const indexB = numbersCopy.findIndex((number) => number === selectedNumber2);
         numbersCopy.splice(indexB, 1);

         numbersCopy.push(result);
console.log(numbersCopy);
         // update le tableau dans le state
         this.setState({ numbers: numbersCopy, operatorSelected: null });
      }

   };

   //reset les calculs
   handleResetClick() {
      const { numbers } = this.props;

      this.setState({
         operatorSelected: null,
         numbers: [
            numbers[0],
            numbers[1],
            numbers[2],
            numbers[3],
            numbers[4],
            numbers[5]
         ],
         selectedNumber1: null,
         selectedNumber2: null
      });
   };

   // on clique sur une case (nombre)
   handleNumberClick = (number, index) => {
      const {  selectedNumber1, selectedNumber2 } = this.state;

      if (!selectedNumber1 && !selectedNumber2) {
         this.setState({ selectedNumber1: number })
      } else if (selectedNumber1 && !selectedNumber2) {
         this.setState({ selectedNumber2: number })
      } else {
         this.setState({ selectedNumber1: selectedNumber2 })
         this.setState({ selectedNumber2: number })
      }
   };

   // on clique sur une case (operator)
   handleOperatorClick = (operatorSelected) => {
      this.setState({ operatorSelected });
   };

   render() {
      const { numbers, selectedNumber1, selectedNumber2, operatorSelected, operators } = this.state;

      return (
         <div className="gamePart">
            <button className="reset" onClick={this.handleResetClick}>
               Reset
            </button>
            <div className="columns">
               <div className="column">
                  {numbers.map((number, index) => (
                     <React.Fragment>
                        
                        {(number === selectedNumber1 || number === selectedNumber2) &&
                           <button className="number selected" onClick={() => this.handleNumberClick(number)}>
                           {number}
                        </button>
                        }
                        {(number != selectedNumber1 && number != selectedNumber2) &&
                           <button className="number" onClick={() => this.handleNumberClick(number)}>
                           {number}
                        </button>
                        }
                     </React.Fragment>
                  ))}
               </div>
               <div className="column">
                  {operators.map((operator) => (
                     <React.Fragment>
                        {operator === operatorSelected &&
                           <button className="operator selected">
                              {operator}
                           </button>
                        }
                        {operator != operatorSelected &&
                           <button className="operator" onClick={() => this.handleOperatorClick(operator)}>
                              {operator}
                           </button>
                        }
                     </React.Fragment>
                  ))}
               </div>
            </div>
            <button className="send" onClick={this.handleSendClick}>
               Send
            </button>
         </div>
      );
   }
}

class Game extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         numberToFind: 0,
         operations: null,
         isCooldownActive: false,
         secondsLeft: 90,
         isNumbersGenerated: false,
         numbers: null,
         isWin: false
      };
      this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this)
   }

   componentDidMount() {
      //on génère le tableau avec tous les chiffres
      generateNumberGame().then((results) => {
         this.setState({ numberToFind: results.numberToFind, operations: results.operations, isNumbersGenerated: true, numbers: results.numbers });
      }).catch((error) => {
         console.error(error);
      });
      //on lance le chrono
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
      document.location.href = '../index.html'
   }

   endingGame() {
      this.setState({ isCooldownActive: true, secondsLeft: 0, isWin: true })
   }

   render() {
      const { isCooldownActive, secondsLeft, isNumbersGenerated, numbers, numberToFind, operations, isWin } = this.state;

      //le timer est fini
      if (isCooldownActive && secondsLeft === 0) {
         return (
            <EndingScreen numberToFind={numberToFind} operations={operations} returnToMenu={() => this.returnToMenu()} isWin={isWin} />
         );
      }

      //jeu en cours
      if (isCooldownActive) {
         return (
            <div className="game">
               <div className="topPart">
                  <ReturnButton returnToMenu={() => this.returnToMenu()} />
                  <div className="numberToFind">{numberToFind}</div>
                  <p className="chrono">{secondsLeft}</p>
               </div>
               <PlayPart numbers={numbers} numberToFind={numberToFind} isCooldownActive={isCooldownActive} secondsLeft={secondsLeft} endingGame={() => this.endingGame()} />
            </div>
         )
      } else {
         if (isNumbersGenerated) {
            return (
               /*Le jeu n'a pas encore commencé*/
               <div className="chargementScreen">
                  <ReturnButton returnToMenu={() => this.returnToMenu()} />
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
                  <ReturnButton returnToMenu={() => this.returnToMenu()} />
                  Chargement ...
               </div>
            )
         }
      }
   }
}

ReactDOM.render(<Game />, document.querySelector('#app'))
