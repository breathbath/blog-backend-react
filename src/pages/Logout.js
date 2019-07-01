import React from 'react';
import {clearToken} from "../components/TokenManager";
import {apiMakePost} from "../components/HttpClient";
import {Redirect} from "react-router-dom";
import FlashMessage from "../components/FlashMessage";

export default function Logout() {
    return apiMakePost("/api/logout", {})
        .then(
            res => {
                console.log("Success logout");
                clearToken();
                return <Redirect to={{pathname: '/signin', state: {flashMessage:{message: res.success, isError: false}}}}/>;
            },
            res => {
                console.log("Error logout");
                let errText = "Logout failure";
                if (res.error !== "") {
                    errText = res.error;
                }
                return <Redirect to={{pathname: '/signin', state: {flashMessage:{message: errText, isError: true}}}}/>;
            }
        );
}