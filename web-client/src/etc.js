export let hashStr = (s) => {
    var hash = 0;
    if (s.length == 0) {
        return hash;
    }
    for (var i = 0; i < s.length; i++) {
        var char = s.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

export let error_data = (e) => e ? ({ name: e.name, message: e.message }) : e; // null safe

export let a_sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export let do_result = async (async_f) => {
    var left, right;
    try {
        right = async_f();
        try {
            right = await right;
        }
        catch (e) {
            // Promise rejection
            left = e;
        }
    }
    catch (e) {
        // Runtime exception
        left = e;
    }
    return [left, right];
};

export let parseResult = ([err, v]) => ({ "result/error": err, "result/success": v });

export let doSwagger = async (async_f) => {
    let [err, v] = await do_result(async_f);
    let result = [error_data(err), v ? v.body : v]; // v.body is parsed
    return parseResult(result);
};

export let mergeState = (cursor, k, v) => {
    let [state, setState] = cursor;
    setState({...state, [k]: v});
};
