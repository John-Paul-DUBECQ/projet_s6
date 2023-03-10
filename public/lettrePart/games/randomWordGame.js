import {intToChar, getRandomInt, isWord, containsLetters} from './functions.js'

function createArrayLetters() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/getRandomWord',
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

class LetterArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      letters: props.letters
    };
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
      words: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddWord = this.handleAddWord.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleInputChange(event) {
    this.setState({ inputText: event.target.value });
  }

  handleAddWord(event) {
    const { letters } = this.props;

    event.preventDefault();
    const word = this.state.inputText.trim();
    isWord(word).then( (result) => {
      if (result && word !== '' && containsLetters(word, letters)) {
        this.setState((prevState) => ({ words: [word, ...prevState.words], inputText: '' }));
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
          this.setState({ isCooldownActive: true});
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
      <div>
        {isCooldownActive ? (
          <div className="game">
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