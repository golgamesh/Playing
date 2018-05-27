import React from "react";
import { render } from "react-dom";
import { Header } from "./components/header";
import { Home } from "./components/home";

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            homeLink: "Home"
        };
    }

    onGreat() {
        alert('hello');
    }

    onChangeLinkName(newName) {
        this.setState({
            homeLink: newName
        });
    }

    render() {

        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-10 col-xs-offset-1">
                        <Header homeLink={this.state.homeLink} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-10 col-xs-offset-1">
                        <Home name={"Max"} 
                                initialAge={9} 
                                greet={this.onGreat}
                                changeLink={this.onChangeLinkName.bind(this)}
                                initialLinkName={this.state.homeLink} />
                    </div>
                    
                </div>
            </div>
        );
    }
}

render(<App/>, window.document.getElementById('app'));
