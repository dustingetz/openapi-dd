import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import Swagger from 'swagger-client';


async function testSwagger(client, setState) {
    // tag name == `pet`; operationId == `addPet`
    const x = await client.apis.pet.addPet({
        id: 1,
        body: {
            name: "bobby",
            status: "available"
        }
    });
    setState({response: x.body});
}

async function fetchInventory (client, setState) {
    const response = await client.apis.store.getInventory();
    setState({response: response.body});
}

function HelloWorld ({client}) {
    const [state, setState] = useState({response: {}, count: 0});
    return (
        <div>
            <h1>Test react working</h1>
            <p>You clicked {state.count} times</p>
            <button onClick={() => setState({...state, count: (state.count || 0) + 1})}>
                Click me
            </button>
            <h1>Swagger PetStore</h1>
            <button onClick={testSwagger.bind(undefined, client, setState)}>Bobby!</button>
            <button onClick={fetchInventory.bind(undefined, client, setState)}>Inventory!</button>
            <pre>
                {JSON.stringify(state, undefined, 2)}
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
