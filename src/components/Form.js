import React from 'react';
import {getValidationErrorText, isFieldInvalid, unsetValidationError} from "./ErrorsProcessor";
import {apiMakePost} from "./HttpClient";
import FlashMessage from "./FlashMessage";

class Form extends React.Component {
    formAction = '';

    constructor(props) {
        super(props);
        this.state = {
            generalError: "",
            validationErrors: [],
            operationSuccess: '',
            loading: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.recaptcha = null;
    }

    setFormValue = (key, value) => {
        let curFormValues = this.state.form;
        curFormValues[key] = value;
        let validationErrors = unsetValidationError(key, this.state.validationErrors);
        this.setState({form: curFormValues, validationErrors: validationErrors});
    };

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setFormValue(name, value);
    }

    submitCallback(res) {

    }

    handleSubmit(event) {
        if (!this.formAction) {
            throw new Error("Form action is not set");
        }
        this.setState({loading: true});
        event.preventDefault();
        apiMakePost(this.formAction, this.state.form)
            .then(
                res => {
                    this.submitCallback(res);
                },
                res => {
                    if (this.recaptcha) {
                        this.recaptcha.reset();
                    }

                    if (res.validationErrors && Object.keys(res.validationErrors).length) {
                        let curState = {validationErrors: res.validationErrors, loading: false};
                        if (isFieldInvalid("recaptcha", res.validationErrors)) {
                            curState.generalError = getValidationErrorText("recaptcha", res.validationErrors);
                        }
                        this.setState(curState);
                        return;
                    }

                    this.setState({generalError: res.error, loading: false});
                }
            );
    }

    renderFlash() {
        let errMsg = "";
        let successMsg = "";
        if (this.props.location && this.props.location.state && this.props.location.state.flashMessage) {
            if (this.props.location.state.flashMessage.isError) {
                errMsg = this.props.location.state.flashMessage.message;
            } else {
                successMsg = this.props.location.state.flashMessage.message;
            }
        }

        if (this.state.operationSuccess && this.state.operationSuccess !== "") {
            successMsg += this.state.operationSuccess;
        }

        if (this.state.generalError !== "") {
            errMsg += this.state.generalError;
        }

        if (errMsg !== "") {
            return (
                <FlashMessage
                    variant="error"
                    message={errMsg}
                    autoHideDuration={4000}
                />
            );
        }


        if (successMsg !== "") {
            return (
                <FlashMessage
                    variant="success"
                    message={successMsg}
                    autoHideDuration={4000}
                />
            );
        }
        return null;
    }

    updateRecaptchaValue(token) {
        this.setFormValue("recaptcha", token);
    }
}

export default Form;