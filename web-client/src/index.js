import React, {useState} from "react";
import ReactDOM from "react-dom";
import Header from './components/Header';
import Swagger from 'swagger-client';


function testSwagger (setState) {
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
                    setState({foo: a.body})
                })
        })
}

function HelloWorld () {
    const [state, setState] = useState({foo: "bar", count: 0});
    return (
        <div>
            <h1>Test react working</h1>
            <p>You clicked {state.count} times</p>
            <button onClick={() => setState({...state, count: state.count + 1})}>
                Click me
            </button>
            <h1>Real stuff</h1>
            <button onClick={testSwagger.bind(undefined, setState)}>swag!</button>
            <pre>
                {JSON.stringify(state.foo, undefined, 2)}
            </pre>
        </div>
    );
}

ReactDOM.render(<HelloWorld/>, document.getElementById("app"));
