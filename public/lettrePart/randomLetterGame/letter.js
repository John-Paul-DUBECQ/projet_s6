// if (btn) {
//     btn.addEventListener('click', () => {
//         const text = inputText.value;
//          isWord(text);
//         inputText.value = null;
//     });
// }
// import removeAccents from "remove-accents";

const letters = [];


function intToChar(int) {
  // 👇️ for Uppercase letters, replace `a` with `A`
  const code = 'a'.charCodeAt(0);
  return String.fromCharCode(code + int);
}

function getRandomInt(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

// export function addFoundWord(word) {
//     if (!foundWords.includes(word)) {
//         foundWords.push(word);
//         console.log(foundWords.length);
//         nbrFoundWords.innerText = foundWords.length;
//         var elem = document.createElement('label');
//         elem.innerText = "- " + word;    
//         rightPart.appendChild(elem );
//     }
// }

function createArrayLetters() {
  var quota = 0

  //permet d'avoir au moins 3 voyelles
  while (quota != 2) {
    const c = getRandomInt(0, 26)
    const cha = intToChar(c)
    if (cha === 'a' || cha === 'e' || cha === 'i' || cha === 'o' || cha === 'u') {
      letters.push(cha)
      quota++
    }
  }

  for (let index = 0; index < 8; index++) {
    const c = getRandomInt(0, 26)
    const cha = intToChar(c)
    if (cha === 'x' || cha === 'z' || cha === 'w' || cha === 'k' || cha === 'y') {
      const c = getRandomInt(0, 100)
      if (c > 80) {
        letters.push(cha)
      } else {
        index--
      }
    } else {
      letters.push(cha)
    }
  }
}

createArrayLetters()

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

function containsLetters(word) {

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
    super(props)
  }


  render() {
    return <div id="letterPart">
      {letters.map((elem) =>
        <div className="letterArea"> {elem} </div>
      )}
    </div>
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
    event.preventDefault();
    const word = this.state.inputText.trim();
    isWord(word).then( (result) => {
      console.log(this.state.words[word]);
      if (result && word !== '' && containsLetters(word)) {
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
      console.log("c'est bon");
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

function Home() {
  return <div>
    <Decrementer start="10" />
    <LetterArea />
    <GuessPart />
  </div>
}

ReactDOM.render(<Home />, document.querySelector('#app'))