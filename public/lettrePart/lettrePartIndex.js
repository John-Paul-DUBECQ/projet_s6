//retourne le top 10 des joueurs
function getTopPlayers() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/getTopPlayersOfDay',
            type: 'GET',
            success: function (data) {
                if (data[0] != null) {
                    resolve(data);
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

class ReturnButton extends React.Component {
    constructor(props) {
        super(props);
    }

    returnToMenu() {
        document.location.href = '../index.html'
    }

    render() {
        return (
            <div onClick={() => this.returnToMenu()}>
                <button className="returnButton" ><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" /></svg>
                </button>
            </div>
        )
    }
}
//block pour le random letter
class Block1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHover: false
        };
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
    }

    handleMouseEnter() {
        this.setState({ isHover: true })
    };

    handleMouseLeave() {
        this.setState({ isHover: false })
    };

    render() {
        const { isHover } = this.state;

        return (
            <a href="games/randomLetterGame.html" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                {isHover ? (<div className="block"><div className="insideBlock">Essayez de trouver le plus de mot avec des lettres générées au hasard!</div></div>) :
                    (<div className="block"><div className="insideBlock"><span>Mode libre</span><span>Lettres aléatoires</span></div></div>)
                }
            </a>
        )
    }
}
//block pour le daily word
class Block2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHover: false
        };
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
    }

    handleMouseEnter() {
        this.setState({ isHover: true })
    };

    handleMouseLeave() {
        this.setState({ isHover: false })
    };

    render() {
        const { isHover } = this.state;

        return (
            <a href="games/dailyGame.html" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                {isHover ? (<div className="block"><div className="insideBlock">À vous de trouver le mot du jour. C'est le même pour tous!!!</div></div>) :
                    (<div className="block"><div className="insideBlock"><span>Mots du jour</span></div></div>)
                }
            </a>
        )
    }
}
//block pour le random word
class Block3 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHover: false
        };
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
    }

    handleMouseEnter() {
        this.setState({ isHover: true })
    };

    handleMouseLeave() {
        this.setState({ isHover: false })
    };

    render() {
        const { isHover } = this.state;

        return (
            <a href="games/randomWordGame.html" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                {isHover ? (<div className="block"><div className="insideBlock">Essayez de trouver le plus de mot. La grille est basée sur un mot choisi au hasard</div></div>) :
                    (<div className="block"><div className="insideBlock"><span>Mode libre</span><span>Mots aléatoires</span></div></div>)
                }
            </a>
        )
    }
}
//block pour le top 10
class Block4 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: new Array(),
            resultFound: false
        };
    }

    componentDidMount() {
        getTopPlayers().then((newResults) => {
            this.setState({ results: newResults, resultFound: true });
        }).catch((error) => {
            console.error(error);
        });
    }

    render() {
        const { results, resultFound } = this.state;

        return (
            <div className="blockTop">
                <div className="ligne firstline">
                    <div>Pseudo</div>
                    <div>Score</div>
                </div>
                <div className="ligne firstline">
                    <div> </div>
                    <div> </div>
                </div>
                {results ?
                    (
                        results.map((result) => (
                            <div className="ligne">
                                <div>{result.name} </div>
                                <div>{result.score}</div>
                            </div>
                        ))
                    ) :
                    //on vérifie le cas où il n'y a encore aucun résultat 
                    resultFound ? (<div>0 résultats trouvés</div>) : (<div>En attente du top...</div>)
                }
            </div>
        );
    }
}

class Menu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <ReturnButton />
                <div className="blocks">
                    <Block1 />
                    <Block2 />
                    <Block3 />
                    <Block4 />
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Menu />, document.querySelector('#app'))