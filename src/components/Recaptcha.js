import React from 'react';
import { ReCaptcha } from 'react-recaptcha-v3';

export default class Recaptcha extends React.Component {
    constructor(props) {
        super(props);

        let isEnabled = true;
        if (!process.env.REACT_APP_RECAPTCHA_SITE_KEY) {
            console.log("No recaptcha key is set");
            isEnabled = false;
        }

        this.state = {token: "", isEnabled: isEnabled};
        this.recaptcha = null;
    }

    verifyCallback = (recaptchaToken) => {
        this.props.updateCallback(recaptchaToken);
    };

    reset() {
        this.recaptcha.execute();
    }

    render() {
        if (!this.state.isEnabled) {
            return null;
        }

        return (
            <ReCaptcha
                ref={ref => this.recaptcha = ref}
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                action={this.props.action}
                verifyCallback={this.verifyCallback}
            />
        );
    }
}