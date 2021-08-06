function GameHeader(props) {
    return (
        <header>
            <div id="game-logo">
                <h1>Supermarket</h1>
            </div>
            <div id="welcome-panel">
                <p id="hello">Hello, <span id="username">{props.username}</span>!</p>
                <p id="welcome-info">{props.dateTime} | {props.weatherIcon} {props.temperature}</p>
            </div>
            <div id="menu">
                <a href="#" id="save-link" class="self-center">Save</a>
                <span class="menu-separator self-center">|</span>
                <a href="#" id="settings-link" class="self-center">Settings</a>
                <span class="menu-separator self-center">|</span>
                <a href="#" id="promotion-link">
                    <p id="new-vips">{props.vipsToClaim}</p>
                    <p id="promote-text">Promotions</p>
                </a>
            </div>
        </header>
    );
}

export default GameHeader;