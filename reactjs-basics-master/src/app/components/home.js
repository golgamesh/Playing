import React from 'react';

export class Home extends React.Component {

    constructor(props) {
        super();
        this.state = {
            age: props.initialAge,
            homeLink: props.initialLinkName
        };
        this.name = props.name;
    }

    increaseMyAge() {
        this.setState({
            age: this.state.age + 3
        });
    }

    onChangeLink() {
        this.props.changeLink(this.state.homeLink);
    }

    onHandleChange(event) {
        this.setState({
            homeLink: event.target.value 
        });
    }

    render() {
        var text = "something";
        console.log(this.state);
        return (
            <div>
                <p>In a new component</p>
                <div>Your name is {this.props.name}, your age is {this.state.age}.</div>
                <hr/>
                <button onClick={() => this.increaseMyAge()} className="btn btn-primary">Up my Age</button>
                <hr/>
                <button onClick={() => this.props.greet()} className="btn btn-primary">Greet</button>
                <hr/>
                <input type="text" value={this.state.homeLink} onChange={(event) => this.onHandleChange(event)} />
                <button onClick={() => this.onChangeLink()} className="btn btn-primary">Change Header Link</button>
            </div>
        );
    }
}

Home.propTypes = {
    name: React.PropTypes.string,
    initialAge: React.PropTypes.number,
    greet: React.PropTypes.function,
    initialLinkName: React.PropTypes.string
};