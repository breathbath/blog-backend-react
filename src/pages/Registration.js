import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Link, withRouter} from 'react-router-dom';
import {apiMakePost} from "../components/ApiFetcher";
import {Redirect} from "react-router-dom"
import {getValidationErrorText, isFieldInvalid} from "../components/ErrorsProcessor";
import FlashMessage from "../components/FlashMessage";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Recaptcha from "../components/Recaptcha";
import {loginFormStyles} from "../components/LoginFormStyles";
import CopyRight from "./CopyRight";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {email: "", fullname: "", password: "", rpassword: ""},
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
        this.setState({form: curFormValues});
    };

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setFormValue(name, value);
    }

    handleSubmit(event) {
        this.setState({loading: true});
        event.preventDefault();
        apiMakePost("/api/register", this.state.form)
            .then(
                res => this.setState({operationSuccess: res.Success, loading: false}),
                res => {
                    this.recaptcha.reset();
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

    renderErrorFlash() {
        if (this.state.generalError !== "") {
            return (
                <FlashMessage
                    variant="error"
                    message={this.state.generalError}
                    autoHideDuration={4000}
                />
            );
        }
        return null;
    }

        updateRecaptchaValue(token) {
        this.setFormValue("recaptcha", token);
    }

    componentDidMount() {
        // custom rule will have name 'isPasswordMatch'
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.form.password) {
                return false;
            }
            return true;
        });
    }

    componentWillUnmount() {
        // remove rule when it is not needed
        ValidatorForm.removeValidationRule('isPasswordMatch');
    }

    render() {
        if (this.state.operationSuccess !== '') {
            return <Redirect to={{pathname: '/signin', flashMessage: this.state.operationSuccess }} />;
        }
        const {classes} = this.props;
        const { email, fullname, password, rpassword } = this.state.form;
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    {this.renderErrorFlash()}
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <ValidatorForm
                        ref="form"
                        onSubmit={this.handleSubmit}
                        onError={errors => console.log(errors)}
                    >
                        <TextValidator
                            required
                            variant="outlined"
                            label="Full Name"
                            onChange={this.handleInputChange}
                            name="fullname"
                            value={fullname}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            error={isFieldInvalid("fullname", this.state.validationErrors)}
                            helperText={getValidationErrorText("fullname", this.state.validationErrors)}
                            margin="normal"
                            fullWidth
                            autoFocus
                        />
                        <TextValidator
                            required
                            variant="outlined"
                            label="Email"
                            onChange={this.handleInputChange}
                            name="email"
                            value={email}
                            validators={['required', 'isEmail']}
                            errorMessages={['This field is required', 'email is not valid']}
                            error={isFieldInvalid("email", this.state.validationErrors)}
                            helperText={getValidationErrorText("email", this.state.validationErrors)}
                            margin="normal"
                            fullWidth
                        />
                        <TextValidator
                            required
                            variant="outlined"
                            label="Password"
                            onChange={this.handleInputChange}
                            name="password"
                            value={password}
                            validators={['required', 'minStringLength:10']}
                            errorMessages={['This field is required', 'Password should be at least 10 chars length']}
                            error={isFieldInvalid("password", this.state.validationErrors)}
                            helperText={getValidationErrorText("password", this.state.validationErrors)}
                            margin="normal"
                            fullWidth
                            type="password"
                        />
                        <TextValidator
                            required
                            variant="outlined"
                            label="Repeat Password"
                            onChange={this.handleInputChange}
                            name="rpassword"
                            value={rpassword}
                            validators={['required', 'isPasswordMatch']}
                            errorMessages={['This field is required', 'Password mismatch']}
                            error={isFieldInvalid("rpassword", this.state.validationErrors)}
                            helperText={getValidationErrorText("rpassword", this.state.validationErrors)}
                            margin="normal"
                            fullWidth
                            type="password"
                        />
                        <Recaptcha ref={ref => this.recaptcha = ref} action="login" updateCallback={(token) => this.updateRecaptchaValue(token)} />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign Up
                            {this.state.loading && <CircularProgress
                                className={classes.spinner}
                                size={20}
                            />}
                        </Button>
                        <Grid container>
                            <Grid item>
                                Having an account?&nbsp;
                                <Link to="/signin" variant="body2">
                                    {"Sign In"}
                                </Link>
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </div>
                <Box mt={5}>
                    <CopyRight/>
                </Box>
            </Container>
        );
    }
}

export default withRouter(withStyles(loginFormStyles)(Registration));