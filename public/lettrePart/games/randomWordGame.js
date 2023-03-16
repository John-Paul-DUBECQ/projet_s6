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
function createArrayLetters(updateRandomWord) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/getRandomWord',
      type: 'GET',
      dataType: 'json',
      data: { minLength: 7 },
      success: function (data) {
        updateRandomWord(data)
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
  render() {
    const { letters } = this.props;
    return (
      <div id="letterPart">
        {letters && letters.map((elem) => <div className="letterArea">{elem.toUpperCase()}</div>)}
      </div>
    );
  }
}

class GuessPart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      words: []
    };
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleAddWord = this.handleAddWord.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  handleInputChange(event) {
    this.setState({ inputText: event.target.value })
  }

  handleAddWord(event) {
    const { incrementScore, letters } = this.props

    event.preventDefault();
    const word = this.state.inputText.trim();
    isWord(word).then((result) => {
      if (result && word !== '' && containsLetters(word, letters) && !this.state.words.includes(word)) {
        this.setState((prevState) => ({ words: [word, ...prevState.words], inputText: '' }));
        incrementScore(word.length)
      } else {
        console.log('Mot invalide.');
      }
    })
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.handleAddWord(event);
      this.setState(() => ({ inputText: '' }));
    }
  }

  render() {
    const { score } = this.props;

    const { inputText, words } = this.state;
    return (
      <div className="guess-part">
        <h2>Score:  {score}</h2>
        <form onSubmit={this.handleAddWord} className="guess-form">
            <input type="text" value={inputText} onChange={this.handleInputChange} onKeyPress={this.handleKeyPress} />
            <button type="submit">Ajouter</button>
          </form>
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
      inputText: ""
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddWord = this.handleAddRecord.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleInputChange(event) {
    this.setState({ inputText: event.target.value });
  }

  handleAddRecord(event) {
    const { score, returnToMenu } = this.props

    event.preventDefault();
    if (this.state.inputText != "") {
      addRecord(this.state.inputText, score)
      document.location.href = '../lettrePartIndex.html'
    } else {
      console.log("zone de texte vide");
    }
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.handleAddWord(event);
      this.setState(() => ({ inputText: '' }));
    }
  }

  render() {
    const { score, randomWord, returnToMenu } = this.props

    return (
      <div>
        <ReturnButton returnToMenu={() => returnToMenu()} />
        <div className="endGameScreen">
          <h1>Game Over!</h1>
          <p>Ton score est de: {score}</p>
          <p>Le mot aléatoire était: {randomWord.toUpperCase()}</p>
          Envoyez votre score:
        </div>
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      randomWord: "",
      score: 0,
      isCooldownActive: false,
      secondsLeft: 60,
      letters: null,
      isFound: false
    };
    this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this);
  }

  componentDidMount() {
    createArrayLetters((updateRandomWord) => {
      this.setState({ randomWord: updateRandomWord, isFound: true });

    }).then((newLetters) => {
      this.setState({ letters: newLetters });
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
    if (this.state.isFound) {
    this.setState({ isCooldownActive: true });
    }
  }

  returnToMenu() {
    document.location.href = '../lettrePartIndex.html'
  }

  incrementScore(n) {
    this.setState((prevState) => ({ score: prevState.score + n }));
  }

  render() {
    const { isCooldownActive, secondsLeft, letters, score, randomWord, isFound } = this.state;

    //le timer est fini
    if (isCooldownActive && secondsLeft === 0) {
    return (
        <EndingScreen score={score} randomWord={randomWord} returnToMenu={() => this.returnToMenu()} />
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
          {letters && <LetterArea letters={letters} />} 
          <GuessPart letters={letters} incrementScore={(n) => this.incrementScore(n)} score={this.state.score} />
        </div>
      )
    } else {
      if (isFound) {
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