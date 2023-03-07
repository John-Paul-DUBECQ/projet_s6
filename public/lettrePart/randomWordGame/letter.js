
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



function isWord(text) {
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
    const { letters } = this.props; // access the letters prop

    event.preventDefault();
    const word = this.state.inputText.trim();
    isWord(word).then( (result) => {
      if (result && word !== '' && containsLetters(word, letters )) {
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

class Decrementer extends React.Component {

  constructor(props) {
    super(props)
    this.state = { n: props.start, timer: null }
    this.timer = null
    this.pause = this.pause.bind(this)
    this.play = this.play.bind(this)
  }

  componentDidMount() {
    this.play()
  }

  componentwillUnmount() {
    this.pause()
  }

  increment() {
    this.setState((state, props) => ({ n: parseInt(state.n) - 1 }))
    if (this.state.n == 0) {
      this.pause()
    }

  }

  pause() {
    window.clearInterval(this.state.timer)

    this.setState({
      timer: null
    })
  }

  play() {
    window.clearInterval(this.state.timer)
    this.setState({
      timer: window.setInterval(this.increment.bind(this), 1000)
    })
  }

  render() {

    return <div>
      Valeur  {this.state.n}
      {this.state.timer ?
        <button onClick={this.pause}>Pause</button> :
        <button onClick={this.play}>Lecture</button>}
    </div>
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      letters: []
    };
  }

  componentDidMount() {
    createArrayLetters().then((letters) => {
      this.setState({ letters: letters });
    }).catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <div>
        <LetterArea letters={this.state.letters} />
        <GuessPart letters={this.state.letters} />
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.querySelector('#app'))