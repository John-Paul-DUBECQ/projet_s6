// if (btn) {
//     btn.addEventListener('click', () => {
//         const text = inputText.value;
//          isWord(text);
//         inputText.value = null;
//     });
// }
// import removeAccents from "remove-accents";

function searchFromIndex () {
  const todayDate = new Date()
  const randomNumberFromDate = (todayDate.getMonth() * todayDate.getDate() * 445447 * todayDate.getFullYear() * 1259) % 336530;
  console.log(randomNumberFromDate);
}
searchFromIndex()
// console.log((testDate.getMonth() * testDate.getDate() * 445447 * testDate.getFullYear() * 1259) % 336530);
const letters = new Array();


function intToChar(int) {
  // 👇️ for Uppercase letters, replace `a` with `A`
  const code = 'a'.charCodeAt(0);
  return String.fromCharCode(code + int);
}

function getRandomInt(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}
function createArrayLetters() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/getRandomWordByDate',
      type: 'GET',
      dataType: 'json',
      data: { minLength: 7 },
      success: function (data) {
        // 'data' contient le mot aléatoire récupéré depuis la base de données
        const letter = [...data];
        // Ajouter des lettres jusqu'à ce que la longueur de 'letters' soit égale à 10
        while (letter.length < 10) {
          const randomLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
          letter.push(randomLetter);
        }
        // Mettre à jour le state de l'application avec le nouveau mot et les lettres
        const shuffleArray = array => {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
          }
        }
        
        shuffleArray(letter)
        resolve(letter);
      },      
      error: function (e) {
        reject(e);
      }
    });
  });
}

function isWord(text) {
  console.log();
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/search',
      type: 'GET',
      data: { word: text },
      success: function (data) {
        if (data[0] != null) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      error: function (e) {
        reject(e);
      }
    });
  });
}

function containsLetters(word, letters) {
  const wordLetters = word.toLowerCase().split("");
  const remainingLetters = [...letters];
  for (const letter of wordLetters) {
    const index = remainingLetters.indexOf(letter);
    console.log(letters);
    console.log(remainingLetters.indexOf(letter));
    if (index === -1) {
      return false;
    }
    remainingLetters.splice(index, 1);
  }
  return true;

}

class LetterArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      letters: []
    };
  }

  componentDidMount() {
    createArrayLetters().then((letters) => {
      this.setState({letters});
    }).catch((error) => {
      console.error(error);
    });
  }


  render() {

    return (
      <div id="letterPart">
        {this.state.letters.map((elem) => (
          <div className="letterArea">{elem}</div>
        ))}
      </div>
    )
  }  
  
}


class GuessPart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      words: [],
      letters: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddWord = this.handleAddWord.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleInputChange(event) {
    this.setState({ inputText: event.target.value });
  }

  handleAddWord(event) {
    const {letters} = this.props

    event.preventDefault();
    const word = this.state.inputText.trim();
    isWord(word).then( (result) => {
      if (result && word !== '' && containsLetters(word, letters)) {
        this.setState((prevState) => ({ words: [word, ...prevState.words], inputText: '' }));
        this.props.incrementScore(word.length)
      } else {
        console.log('Mot invalide.');
      }
      }
    )
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.handleAddWord(event);
      this.setState(() => ({  inputText: '' }));

    }
  }

  render() {
    const { inputText, words } = this.state;
    return (
      <div className="guess-part">
        <div className="guess-form">
          <form onSubmit={this.handleAddWord}>
            <input type="text" value={inputText} onChange={this.handleInputChange} onKeyPress={this.handleKeyPress} />
            <button type="submit">Ajouter</button>
          </form>
        </div>
        <div className="guess-words">
          <h2>Mots ajoutés :</h2>
          <ul>
            {words.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      letters: [],
      score: 0,
      isCooldownActive: false,
      secondsLeft: 60
    };
    this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this);
  }

  componentDidMount() {
    createArrayLetters().then((letters) => {
      this.setState({ letters: letters });
    }).catch((error) => {
      console.error(error);
    });
    this.interval = setInterval(() => {
      if (this.state.isCooldownActive) {
        if (this.state.secondsLeft === 0) {
          this.setState({ isCooldownActive: false, secondsLeft: 60 });
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
    this.setState({ isCooldownActive: true });
  }

  incrementScore (n) {
    this.setState({ score: this.state.score + n });
  }

  render() {
    const { isCooldownActive, secondsLeft } = this.state;
    return (
      <div className="game">
        {isCooldownActive ? (
          <div className="cooldown">
            <p>{`Cooldown: ${secondsLeft}`}</p>
            <LetterArea letters={this.state.letters} />
            <GuessPart letters={this.state.letters} />
          </div>
        ) : (
          <div>
          <button className="play-button" onClick={this.handlePlayButtonClick}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          
        </div>
        )}
      </div>
    );
  }

}

ReactDOM.render(<Game />, document.querySelector('#app'))