import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './App.css';
import Routes from './routes';
import { blueGrey, indigo } from '@material-ui/core/colors';
import { loadReCaptcha } from 'react-recaptcha-v3';

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: blueGrey[900]
    },
    primary: {
      main: indigo[700]
    }
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '"Lato"',
      'sans-serif'
    ].join(',')
  }
});

class App extends Component {
  componentDidMount() {
    if (process.env.REACT_APP_RECAPTCHA_SITE_KEY) {
      loadReCaptcha(process.env.REACT_APP_RECAPTCHA_SITE_KEY);
    }

    if (!process.env.REACT_APP_API_URL) {
      throw new Error("Api url is not set in REACT_APP_API_URL");
    }
  }

  render() {
    return (
        <div>
          <MuiThemeProvider theme={theme}>
            <Routes />
          </MuiThemeProvider>
        </div>
    );
  }
}

export default App;