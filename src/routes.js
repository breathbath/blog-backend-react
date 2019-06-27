import React from 'react'
import {Route, HashRouter, Switch, Redirect} from 'react-router-dom'
import Main from './pages/Main'
import ScrollToTop from './components/ScrollToTop'
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import {hasValidToken} from "./components/TokenManager";
import Registration from "./pages/Registration";


const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        hasValidToken()
            ? <Component {...props} /> : <Redirect to={{pathname: '/signin'}} />
    )} />
);

const LoginRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        hasValidToken()
            ? <Redirect to={{pathname: '/admin'}} />: <Component {...props} />
    )} />
);

export default props => (
    <HashRouter>
        <ScrollToTop>
            <Switch>
                <PrivateRoute exact path='/admin' component={ Main } />
                <PrivateRoute exact path='/admin/main' component={ Main } />
                <PrivateRoute exact path='/admin/wizard' component={ Main } />
                <PrivateRoute exact path='/admin/cards' component={ NotFound } />
                <LoginRoute exact path='/signin' component={ SignIn } />
                <LoginRoute exact path='/register' component={ Registration } />
            </Switch>
        </ScrollToTop>
    </HashRouter>
)