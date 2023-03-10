
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
            <div class="block"></div>
        </div>
        )
    }
}

ReactDOM.render(<Menu />, document.querySelector('#app'))