import React from "react";
import { Header } from "./header";
import { Home } from "./home";
import { connect } from "react-redux";


export class App extends React.Component {

    constructor() {
        super();
    }

    onGreat() {
        alert('hello');
    }

    onChangeLinkName(newName) {

    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-10 col-xs-offset-1">
                        <Header homeLink="Home" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-10 col-xs-offset-1">
                        <Home name={this.props.user.name} initialAge={9} />
                    </div>
                    
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        math: state.math
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setName: (name) => {
            dispatch({
                type: "SET_NAME",
                payload: name
            });
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);