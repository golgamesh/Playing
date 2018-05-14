import React from 'react';

export class Home extends React.Component {

    constructor(props) {
        super();
        this.state = {
            age: props.initialAge,
            status: 0
        };
    }

    onMakeOlder() {
        this.setState({
            age: this.state.age + 3
        });
    }

    render() {
        var text = "something";
        console.log(this.props);
        return (
            <div>
                <p>In a new component</p>
                <div>Your name is {this.props.name}, your age is {this.state.age}</div>
                <p>Status: {this.state.status}</p>
                <hr/>
                <button onClick={() => this.onMakeOlder()} className="btn btn-primary">Make me older!</button>
            </div>
        );
    }
}

Home.propTypes = {
    name: React.PropTypes.string,
    initialAge: React.PropTypes.number
};