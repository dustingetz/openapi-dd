import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import Header from './components/Header';
import Swagger from 'swagger-client';


async function testSwagger (client, setState) {
    const x = await client
        .apis
        .pet // tag name == `pet`
        .addPet({ // operationId == `addPet`
            id: 1,
            body: {
                name: "bobby",
                status: "available"
            }
        });
    setState({foo: x.body});
}

function HelloWorld ({client}) {
    const [state, setState] = useState({foo: "bar", count: 0});
    return (
        <div>
            <h1>Test react working</h1>
            <p>You clicked {state.count} times</p>
            <button onClick={() => setState({...state, count: state.count + 1})}>
                Click me
            </button>
            <h1>Real stuff</h1>
            <button onClick={testSwagger.bind(undefined, client, setState)}>swag!</button>
            <pre>
                {JSON.stringify(state.foo, undefined, 2)}
            </pre>
        </div>
    );
}

function Init () {
    const [client, setClient] = useState(null);
    useEffect(() => {
        (async () => {
            setClient(await Swagger({ url: "http://petstore.swagger.io/v2/swagger.json" }));
        })();
    }, []);

    return (
        client === null
            ? <h1>Loading</h1>
            : <HelloWorld client={client}/>
    );
}

ReactDOM.render(<Init/>, document.getElementById("app"));
