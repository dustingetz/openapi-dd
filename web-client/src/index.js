import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import Swagger from 'swagger-client';
import {mergeState, doSwagger, a_sleep, error_data} from "./etc/swaggerUtil"


// http://petstore.swagger.io/v2/swagger.json
// http://localhost:3000/api-docs
const SERVICE_URL = "//localhost:3000/spec/openapi.yaml";

//Swagger.http.withCredentials = true; // Access to fetch at 'http://localhost:8080/api-docs' from origin 'http://localhost:1234' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

let ioFetchInventory = async (client, cursor) => {
    let result = await doSwagger(() => client.apis.store.getInventory());
    mergeState(cursor, "inventory/result", result);
};

let ioAddPet = async (client, cursor) => {
    let result = await doSwagger(() => {
        let directive = { id: 1, body: { name: "bobby", status: "available" }};
        // tag name == `pet`; operationId == `addPet`
        return client.apis.pet.addPet(directive);
    });
    mergeState(cursor, "addPet/result", result);
};

function HelloWorld ({client}) {
    const cursor = useState({"hello-world/count": 0});
    const [state, setState] = cursor;
    return (
        <div>
            <h1>Hello world</h1>
            <button onClick={() => setState({...state, "hello-world/count": state["hello-world/count"] + 1})}>Inc!</button>
            <button onClick={() => ioAddPet(client, cursor)} disabled={!client}>AddPet!</button>
            <button onClick={() => ioFetchInventory(client, cursor)} disabled={!client}>Inventory!</button>
            <pre>{JSON.stringify(state, undefined, 2)}</pre>
        </div>
    );
}

function Init () {
    var [state, setState] = useState({ "swagger/client_spec_url": null, "swagger/error_client_init": null});
    useEffect(() => {
        (async () => {
            try {
                var client = Swagger({ url: SERVICE_URL}); // fire immediately before delay
                await a_sleep(1500); // Slow down the loading state
                var client = await client;
                setState({...state, "swagger/client_spec_url": client.url, "swagger/client": client});
            }
            catch (err) {
                setState({...state, "swagger/error_client_init": error_data(err)});
            }
        })();
    }, []);

    var {"swagger/client": client, ...state} = state; // omit client from debug view

    return (
        <div>
            <h1>Swagger Client</h1>
            <pre>{JSON.stringify(state, undefined, 2)}</pre>
            {state.client !== null ? <HelloWorld client={client}/>
                : state.error !== null ? <h1>Error loading swagger client</h1>
                    : <h1>Loading swagger client</h1>}
        </div>


    );
}

ReactDOM.render(<Init/>, document.getElementById("app"));
