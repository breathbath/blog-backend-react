import {getToken} from "./TokenManager";

export function apiMakePost(uri, payload) {
    return new Promise((resolve, reject) => {
        fetch(process.env.REACT_APP_API_URL + uri, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(payload)
        }).then(res => res.json(), () => {
            handlePromiseFailure(reject, resolve);
        })
            .then(
                (result) => {
                    handleResult(result, reject, resolve);
                },
                () => {
                    handlePromiseFailure(reject, resolve);
                },
            )
    });
}

function handlePromiseFailure(rejectCallback, successCallback) {
    let result = {error: "Remote server failure", code: 502};
    handleResult(result, rejectCallback, successCallback);
}

export function handleResult(result, rejectCallback, successCallback) {
    if (typeof result != "object") {
        let result = {error: "Invalid response format", code: 500};
        rejectCallback(result);
        return;
    }

    if (result.error) {
        rejectCallback(result);
        return;
    }

    successCallback(result);
}