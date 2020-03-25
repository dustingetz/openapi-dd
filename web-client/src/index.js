import React from "react";
import ReactDOM from "react-dom";
import Header from './components/Header';
import Swagger from 'swagger-client';


class HelloMessage extends React.Component {

    state = {
        foo: "bar"
    };

    testSwag = () => {
        Swagger({ url: "http://petstore.swagger.io/v2/swagger.json" })
            .then((client) => {
                client
                    .apis
                    .pet // tag name == `pet`
                    .addPet({ // operationId == `addPet`
                        id: 1,
                        body: {
                            name: "bobby",
                            status: "available"
                        }
                    })
                    .then((a,b,c) => {
                        debugger;

                    })
            })
    };

    render() {
        return <div>
            <Header/>
            <div className="container">
                <h1>Hello {this.props.name}</h1>
            </div>
            <button onClick={this.testSwag}>swag!</button>
            <pre>
                {JSON.stringify(this.state, undefined, 2)}
            </pre>
        </div>
    }
}

let App = document.getElementById("app");

ReactDOM.render(<HelloMessage name="Yomi"/>, App);
