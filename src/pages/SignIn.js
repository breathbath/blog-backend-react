import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {withRouter, Redirect, Link} from 'react-router-dom';
import {hasValidToken, setToken} from "../components/TokenManager";
import {getValidationErrorText, isFieldInvalid} from "../components/ErrorsProcessor";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Recaptcha from "../components/Recaptcha";
import CopyRight from "./CopyRight";
import {loginFormStyles} from "../components/LoginFormStyles";
import Form from "../components/Form";
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

class SignIn extends Form {
    constructor(props) {
        super(props);
        this.state.form = {email: "", password: "", isRememberMe: false, recaptcha: ""};
        this.state.isAuthorised = hasValidToken();
        this.formAction =  "/api/login";
    }

    submitCallback(res) {
        if (!res || !res.token) {
            this.recaptcha.reset();
            this.setState({generalError: "Invalid response format", loading: false});
            return;
        }

        setToken(res.token, this.state.form.isRememberMe);
        this.setState({isAuthorised: true, loading: false});
    }

    render() {
        if (this.state.isAuthorised) {
            return <Redirect to='/admin'  />;
        }
        const {classes} = this.props;
        const {email, password} = this.state.form;
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
                    <ValidatorForm
                        ref="form"
                        onSubmit={this.handleSubmit}
                        onError={errors => console.log(errors)}
                    >
                        <TextValidator
                            required
                            variant="outlined"
                            label="Email Address"
                            onChange={this.handleInputChange}
                            name="email"
                            id="email"
                            autoComplete="email"
                            value={email}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            error={isFieldInvalid("email", this.state.validationErrors)}
                            helperText={getValidationErrorText("email", this.state.validationErrors)}
                            margin="normal"
                            fullWidth
                            autoFocus
                        />
                        <TextValidator
                            required
                            variant="outlined"
                            label="Password"
                            onChange={this.handleInputChange}
                            name="password"
                            value={password}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            error={isFieldInvalid("password", this.state.validationErrors)}
                            helperText={getValidationErrorText("password", this.state.validationErrors)}
                            margin="normal"
                            fullWidth
                            type="password"
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
                    </ValidatorForm>
                </div>
                <Box mt={5}>
                    <CopyRight/>
                </Box>
            </Container>
        );
    }
}

export default withRouter(withStyles(loginFormStyles)(SignIn));