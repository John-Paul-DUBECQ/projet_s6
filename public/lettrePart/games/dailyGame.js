//vérifier si un mot existe
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
//ajouter un score dans la db
function addRecord(playerName, playerScore) {
    $.ajax({
        url: "/saveRecord",
        type: "POST",
        data: {
            name: playerName,
            score: playerScore,
            date: new Date().toLocaleDateString()
        },
        success: function (response) {
            console.log("Record saved successfully!");
        },
        error: function (error) {
            console.error("Error saving record:", error);
        }
    });
}
//savoir si le mot proposé contient toutes les lettres présentes
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
//on crée le tableau de lettre
function createArrayLetters(dailyWord, updateDailyword) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/getRandomWordByDate',
            type: 'GET',
            dataType: 'json',
            data: { minLength: 7 },
            success: function (data) {
                updateDailyword(data)
                // 'data' contient le mot aléatoire récupéré depuis la base de données
                const letter = [...data];
                // Ajouter des lettres jusqu'à ce que la longueur de 'letters' soit égale à 10
                while (letter.length < 10) {
                    const randomLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
                    letter.push(randomLetter);
                }
                //on random l'ordre
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
//partie avec toutes les lettres
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
//partie centrale
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
    //méthode quand on essaye d'ajouter un mot
    handleAddWord(event) {
        const { incrementScore, letters } = this.props

        event.preventDefault();
        const word = this.state.inputText.trim();
        isWord(word).then((result) => {
            if (result && word !== '' && containsLetters(word, letters) && !this.state.words.includes(word.toLowerCase())) {
                this.setState((prevState) => ({ words: [word.toLowerCase(), ...prevState.words], inputText: '' }));
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
        const { score } = this.props

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
        const { score, dailyWord, returnToMenu } = this.props

        return (
            <div>
                <ReturnButton returnToMenu={() => returnToMenu()} />
                <div className="endGameScreen">
                    <h1>Game Over!</h1>
                    <p>Ton score est de: {score}</p>
                    <p>Le mot du jour était: {dailyWord.toUpperCase()}</p>
                    Envoyez votre score:
                    <form onSubmit={this.handleAddWord}>
                        Pseudo:
                        <input type="text" value={this.state.inputText} onChange={this.handleInputChange} onKeyPress={this.handleKeyPress} />
                        <button type="submit">Envoyer</button>
                    </form>
                </div>
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dailyWord: "",
            score: 0,
            isCooldownActive: false,//on change quand on acive le cooldown
            secondsLeft: 90,
            letters: null,//liste des lettres
            isFound: false//avons-nous trouvé le mot dans la db
        };
        this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this);
    }

    componentDidMount() {
        //on crée le tableau de lettres
        createArrayLetters(this.state.dailyWord, (updatedDailyWord) => {
            this.setState({ dailyWord: updatedDailyWord, isFound: true });

        }).then((newLetters) => {
            this.setState({ letters: newLetters });
        }).catch((error) => {
            console.error(error);
        });
        //on lance le compteur
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
        const { isCooldownActive, secondsLeft, letters, score, dailyWord, isFound } = this.state;

        //le timer est fini
        if (isCooldownActive && secondsLeft === 0) {
            return (
                <EndingScreen score={score} dailyWord={dailyWord} returnToMenu={() => this.returnToMenu()} />
            );
        }

        //jeu en cours
        if (isCooldownActive) {
            return (
                <div className="game">
                    <div className="topPart">
                        <ReturnButton returnToMenu={() => this.returnToMenu()} />
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
                /*Le mot charge*/
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