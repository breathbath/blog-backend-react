import React from 'react';
import { ReCaptcha } from 'react-recaptcha-v3';

export default class Recaptcha extends React.Component {
    constructor(props) {
        super(props);

        this.state = {token: ""};
        this.recaptcha = null;
    }

    verifyCallback = (recaptchaToken) => {
        this.props.updateCallback(recaptchaToken);
    };

    reset() {
        this.recaptcha.execute();
    }

    render() {
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