


export let error_data = (e) => e ? ({ name: e.name, message: e.message }) : e; // null safe

export let a_sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export let do_result = async (async_f) => {
    var left, right;
    try {
        right = await async_f();
    }
    catch (e) {
        left = e;
    }
    return [left, right];
};

export let parseResult = ([err, v]) => ({ "result/err": err, "result/v": v });

export let doSwagger = async (async_f) => {
    let [err, v] = await do_result(async_f);
    let result = [error_data(err), v ? v.data : v];
    return parseResult(result);
};

export let mergeState = (cursor, k, v) => {
    let [state, setState] = cursor;
    setState({...state, [k]: v});
};
