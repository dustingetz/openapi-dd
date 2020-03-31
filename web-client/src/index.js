import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import Swagger from 'swagger-client';
import Table from 'react-bootstrap/Table';
import {a_sleep, doSwagger, error_data, mergeState, hashStr} from "./etc"


// const SERVICE_URL = "http://petstore.swagger.io/v2/swagger.json";
// const SERVICE_URL = "//localhost:5000/spec/openapi.yaml";
const SERVICE_URL = "//localhost:3000/spec/openapi.yaml";

let ioFetchInventory = async (client, cursor) => {
    let result = await doSwagger(() => client.apis.store.getInventory());
    mergeState(cursor, "inventory/result", result);
};

let ioFetchPets = async (client, cursor) => {
    let result = await doSwagger(() => client.apis.default.findPets());
    mergeState(cursor, "pets/result", result);
};

let ioAddPet = async (client, cursor) => {
    let result = await doSwagger(() => {
        let directive = { id: 1, body: { name: "bobby", status: "available" }};
        // tag name == `pet`; operationId == `addPet`
        return client.apis.pet.addPet(directive);
    });
    mergeState(cursor, "addPet/result", result);
};

let renderTable = (colspec, records) =>
    <Table striped bordered hover size="sm">
        <thead>
        <tr>{colspec.map(k => <th>{k.substring(0, 20)}</th>)}</tr>
        </thead>
        <tbody>
        {records.map(record =>
            <tr key={hashStr(record.toString())}>
                {Object.entries(record).map(([k, v]) =>
                    <td>{v}</td>)}
            </tr>)}
        </tbody>
    </Table>;

let renderForm = (record) => renderTable(Object.keys(record[0]), [record]);

function HelloWorld ({client}) {
    const cursor = useState({"hello-world/count": 0});
    const [state, setState] = cursor;
    return (
        <div>
            <h1>Hello world</h1>
            <button onClick={() => setState({...state, "hello-world/count": state["hello-world/count"] + 1})}>Inc!
            </button>
            {/*<button onClick={() => ioAddPet(client, cursor)} disabled={!client}>AddPet!</button>*/}
            <button onClick={() => ioFetchInventory(client, cursor)} disabled={!client}>Inventory!</button>
            <button onClick={() => ioFetchPets(client, cursor)} disabled={!client}>Pets!</button>
            {/*{renderTable([{name: "Alice"}, {name: "Becky"}, {name: "Charles"}])}*/}
            {/*{state["inventory/result"] ? renderForm(state["inventory/result"]["result/success"]) : null}*/}
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
                await a_sleep(1000); // Slow down the loading state
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
