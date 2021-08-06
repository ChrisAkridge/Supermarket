import './index.css';
import GameHeader from '../GameHeader/index.js';
import DepartmentTree from '../DepartmentTree';
import MainStoreInfo from '../MainStoreInfo';
import UpgradesPanel from '../UpgradesPanel';
import React from 'react';
import Game from '../Core/Game';

class GameDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.game = new Game();
        this.state = { game: this.game };
        this.recalcFunction = this.recalculate.bind(this);
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => {
                this.game.update(1 / 30);
                this.setState({ game: this.game });
            },
        1 / 30);
    }

    recalculate() {
        this.game.recalculate();
        this.setState({ game: this.game});
    }

    render() {
        return (
            <div>
                <GameHeader />
    
                <section id="main-container">
                <DepartmentTree game={this.state.game} recalc={this.recalcFunction} />
                <MainStoreInfo game={this.state.game} />
                <UpgradesPanel />
                </section>
            </div>
        );
    }
}

export default GameDisplay;