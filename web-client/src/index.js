import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import Swagger from 'swagger-client';

const SERVICE_URL = "http://localhost:3000/api-docs"; // "http://petstore.swagger.io/v2/swagger.json"

//Swagger.http.withCredentials = true; // Access to fetch at 'http://localhost:8080/api-docs' from origin 'http://localhost:1234' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

let error2data = (e) => ({ name: e.name, message: e.message });

let a_sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function testSwagger(client, [state, setState]) {
    // tag name == `pet`; operationId == `addPet`
    try {
        const x = await client.apis.pet.addPet({
            id: 1,
            body: {
                name: "bobby",
                status: "available"
            }
        });
        setState({...state, response: x.body});
    }
    catch (e) {
        setState({...state, error: error2data(e)});
    }
}

async function fetchInventory (client, [state, setState]) {
    try {
        const response = await client.apis.store.getInventory();
        setState({...state, response: response.body});
    }
    catch (e) {
        setState({...state, error: error2data(e)});
    }
}

function HelloWorld ({client}) {
    const cursor = useState({response: {}, count: 0});
    const [state, setState] = cursor;
    return (
        <div>
            <h1>Hello world</h1>
            <button onClick={() => setState({...state, count: (state.count || 0) + 1})}>Inc!</button>
            <button onClick={testSwagger.bind(undefined, client, cursor)}>Bobby!</button>
            <button onClick={fetchInventory.bind(undefined, client, cursor)}>Inventory!</button>
            <pre>
                {JSON.stringify(state, undefined, 2)}
            </pre>
        </div>
    );
}

function Init () {
    const [state, setState] = useState({ client: null, error: null });
    useEffect(() => {
        (async () => {
            try {
                var client = Swagger({ url: SERVICE_URL}); // fire immediately before delay
                await a_sleep(1500); // So we can see the loading state
                setState({...state, client: await client});
            }
            catch (err) {
                setState({...state, error: error2data(err)});
            }
        })();
    }, []);

    return (
        <div>
            <h1>Swagger Client</h1>
            <pre>{JSON.stringify(state, undefined, 2)}</pre>
            {state.client !== null ? <HelloWorld client={state.client}/>
                : state.error !== null ? <h1>Error loading swagger client</h1>
                    : <h1>Loading swagger client</h1>}
        </div>


    );
}

ReactDOM.render(<Init/>, document.getElementById("app"));
