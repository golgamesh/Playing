import React from 'react';

export class Home extends React.Component {

    constructor(props) {
        super();
        this.state = {
            age: props.initialAge,
<<<<<<< HEAD
            homeLink: props.initialLinkName
        };
        this.name = props.name;
    }

    increaseMyAge() {
=======
            status: 0
        };
    }

    onMakeOlder() {
>>>>>>> ca6f6dd8dbe58856d6f45290f7b5b0c1d028101f
        this.setState({
            age: this.state.age + 3
        });
    }

<<<<<<< HEAD
    onChangeLink() {
        this.props.changeLink(this.state.homeLink);
    }

    onHandleChange(event) {
        this.setState({
            homeLink: event.target.value 
        });
    }

=======
>>>>>>> ca6f6dd8dbe58856d6f45290f7b5b0c1d028101f
    render() {
        var text = "something";
        console.log(this.state);
        return (
            <div>
                <p>In a new component</p>
<<<<<<< HEAD
                <div>Your name is {this.props.name}, your age is {this.state.age}.</div>
                <hr/>
                <button onClick={() => this.increaseMyAge()} className="btn btn-primary">Up my Age</button>
                <hr/>
                <button onClick={() => this.props.greet()} className="btn btn-primary">Greet</button>
                <hr/>
                <input type="text" value={this.state.homeLink} onChange={(event) => this.onHandleChange(event)} />
                <button onClick={() => this.onChangeLink()} className="btn btn-primary">Change Header Link</button>
=======
                <div>Your name is {this.props.name}, your age is {this.state.age}</div>
                <p>Status: {this.state.status}</p>
                <hr/>
                <button onClick={() => this.onMakeOlder()} className="btn btn-primary">Make me older!</button>
>>>>>>> ca6f6dd8dbe58856d6f45290f7b5b0c1d028101f
            </div>
        );
    }
}

Home.propTypes = {
    name: React.PropTypes.string,
<<<<<<< HEAD
    initialAge: React.PropTypes.number,
    greet: React.PropTypes.function,
    initialLinkName: React.PropTypes.string
=======
    initialAge: React.PropTypes.number
>>>>>>> ca6f6dd8dbe58856d6f45290f7b5b0c1d028101f
};