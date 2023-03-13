function getTopPlayers(text) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/getTopPlayersOfDay',
        type: 'GET',
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
  
class Block1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHover: false
        };
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
    }

    handleMouseEnter () {
        this.setState({isHover: true})
    };
    
    handleMouseLeave () {
        this.setState({isHover: false})
    };

    render () {
        const { isHover } = this.state;

        return (
            <a href="games/randomLetterGame.html" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                {isHover ? (<div className="block reverseBlock">Essayez de trouver le mot avec des lettres générées au hasard!</div>) :
                            ( <div className="block normalBlock" >Mode libre<i class="bi bi-shuffle"></i></div> )
                }
            </a>
        )
    }
}

class Block4 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: new Array()
        };
    }

    componentDidMount() {
        getTopPlayers().then((result) => {
          this.setState({results:result})
        })
    }

    render () {
        const { results } = this.state;
        console.log(results);
        return (
            <div className="block">
                cx xc cxvw
                {/* {word.map((word, index) => (
                    <li key={index}>{word}</li>
                ))} */}
            </div>
        )
    }
}



class Menu extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
        <div className="blocks">
            <Block1/>
            <a href="games/dailyGame.html">
                <div class="block" >Niveau journalier <i class="bi bi-calendar"></i>
                </div>
            </a>
            <a href="games/randomWordGame.html">
                <div class="block" >Mode libre <p>A</p></div>
            </a>
            <Block4/>
        </div>
        )
    }
}

ReactDOM.render(<Menu />, document.querySelector('#app'))