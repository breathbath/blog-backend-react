import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {withRouter, Redirect, Link} from 'react-router-dom';
import {apiMakePost} from "../components/ApiFetcher";
import {hasValidToken, setToken} from "../components/TokenManager";
import {getValidationErrorText, isFieldInvalid} from "../components/ErrorsProcessor";
import FlashMessage from "../components/FlashMessage";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Recaptcha from "../components/Recaptcha";
import CopyRight from "./CopyRight";
import {loginFormStyles} from "../components/LoginFormStyles";

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {email: "", password: "", isRememberMe: false, recaptcha: ""},
            generalError: "",
            validationErrors: [],
            isAuthorised: hasValidToken(),
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
        apiMakePost("/api/login", this.state.form)
            .then(
                res => {
                    if (!res || !res.token) {
                        this.recaptcha.reset();
                        this.setState({generalError: "Invalid response format", loading: false});
                        return;
                    }

                    setToken(res.token, this.state.form.isRememberMe);
                    this.setState({isAuthorised: true, loading: false});
                },
                res => {
                    this.recaptcha.reset();
                    if (res.validationErrors && Object.keys(res.validationErrors).length) {
                        let curState = {validationErrors: res.validationErrors, loading: false};
                        if (isFieldInvalid("recaptcha", res.validationErrors)) {
                            curState.generalError = getValidationErrorText("recaptcha", res.validationErrors);
                        }
                        this.setState(curState);
                    } else {
                        this.setState({generalError: res.error, loading: false});
                    }
                }
            );
    }

    renderFlash() {
        if (this.state.generalError !== "") {
            return (
                <FlashMessage
                    variant="error"
                    message={this.state.generalError}
                    autoHideDuration={4000}
                />
            );
        }
        if (this.props.location.flashMessage) {
            return (
                <FlashMessage
                    variant="success"
                    message={this.props.location.flashMessage}
                    autoHideDuration={4000}
                />
            );
        }
        return null;
    }

    updateRecaptchaValue(token) {
        this.setFormValue("recaptcha", token);
    }

    render() {
        if (this.state.isAuthorised) {
            return <Redirect to='/admin'  />;
        }
        const {classes} = this.props;
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    {this.renderFlash()}
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} onSubmit={this.handleSubmit}>
                        <TextField
                            error={isFieldInvalid("email", this.state.validationErrors)}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            helperText={getValidationErrorText("email", this.state.validationErrors)}
                            onChange={this.handleInputChange}
                        />
                        <TextField
                            error={isFieldInvalid("password", this.state.validationErrors)}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            helperText={getValidationErrorText("password", this.state.validationErrors)}
                            autoComplete="current-password"
                            onChange={this.handleInputChange}
                        />
                        <FormControlLabel
                            control={<Checkbox value="isRememberMe" name="isRememberMe" color="primary"
                                               onChange={this.handleInputChange}/>}
                            label="Remember me"
                        />
                        <Recaptcha ref={ref => this.recaptcha = ref} action="login" updateCallback={(token) => this.updateRecaptchaValue(token)} />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                            {this.state.loading && <CircularProgress
                                className={classes.spinner}
                                size={20}
                            />}
                        </Button>
                        <Grid container>
                            <Grid item>
                                Don't have an account?&nbsp;
                                <Link to="/register" variant="body2">
                                    {"Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={5}>
                    <CopyRight/>
                </Box>
            </Container>
        );
    }
}

export default withRouter(withStyles(loginFormStyles)(SignIn));