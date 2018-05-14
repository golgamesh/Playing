import React from 'react';

export class Home extends React.Component {
    render() {
        var text = "something";
        console.log(this.props);
        return (
            <div>
                <p>In a new component</p>
                <div>Your name is {this.props.name}, your age is {this.props.age}</div>
                <div>
                    <ul>
                        {this.props.user.hobbies.map((hobby, i) => <li key={i}>{hobby}</li>)}
                    </ul>
                </div>
                <hr/>
                {this.props.children}
            </div>
        );
    }
}

Home.propTypes = {
    name: React.propTypes.string,
    age: React.propTypes.number,
    user: React.propTypes.object,
    children: React.propTypes.required
};