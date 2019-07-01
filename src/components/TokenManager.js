/**
 * @returns {string}
 * @constructor
 */
export function getToken() {
    let token = sessionStorage.getItem("token");
    if (!token) {
        token = localStorage.getItem("token");
    }
    return token;
}

/**
 * @param {string} token
 * @param isRemembered
 * @constructor
 */
export function setToken(token, isRemembered) {
    clearToken();

    if (isRemembered) {
        localStorage.setItem("token", token);
        return;
    }

    sessionStorage.setItem("token", token);
}

export function clearToken() {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
}

export function hasValidToken() {
    let token = getToken();
    if (!token) {
        return false;
    }

    var jwt_decode = require('jwt-decode');
    try {
        let decodedToken = jwt_decode(token);
        return Date.now() < decodedToken.exp * 1000;
    } catch (e) {
        return false;
    }
}