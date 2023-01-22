import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {Alert, AlertTitle} from "@mui/material";
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LockIcon from '@mui/icons-material/Lock';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// eslint-disable-next-line
import { Navigate, useNavigate } from "react-router-dom";
import {useState} from "react";

// vgl. https://github.com/mui/material-ui/blob/v5.11.4/docs/data/material/getting-started/templates/sign-in/SignIn.tsx

const theme = createTheme();

interface Props {
  render: boolean;
  msg: string;
  severity;
}

const ErrorMessage:React.FC<Props> = (props) => {
  const render = props.render;
  const msg = props.msg;
  const severity = props.severity;
  return (
      <div>
        {
          render &&
          <Alert severity={severity}>
            <AlertTitle>Error</AlertTitle>
            {msg}
          </Alert>
        }
      </div>
  )
}


function Register() {
  const [renderAccountExistsError, setRenderAccountExistsError] = useState(false);
  const [renderPasswordNotMatchingError, setRenderPasswordNotMatchingError] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      console.log({
        email: data.get('email'),
        password: data.get('password'),
      });

      if(data.get('password') !== data.get('repeat-password')) {
        setRenderPasswordNotMatchingError(true);
        return;
      } else {
        if (renderPasswordNotMatchingError) setRenderPasswordNotMatchingError(false);
        let bodyContent = JSON.stringify({
          timestamp: Date.now(),
          username: data.get('username'),
          password: data.get('password'),
          email: data.get('email'),
        });
        console.log(bodyContent);
        console.log("trying to register");
        fetch('http://localhost:3001/users/insert', {
          method: 'POST',
          headers: {
            'Access-Control-Allow-Origin': '*',
            "Content-Type": "application/json"
          },
          body: bodyContent,
        }).then((res) => {
          console.log(res.status);
          if(res.ok) {
            navigate("/memePage");
          } else {
            setRenderAccountExistsError(true);
          }
        });
      }
  };

  return (<ThemeProvider theme={theme}>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
      >
        <LockOutlinedIcon/>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username"
              name="username"
              autoFocus
          />
          <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
          />
          <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
          />
          <ErrorMessage render={renderPasswordNotMatchingError} msg={"passwords are not matching"} severity={"warning"}/>
          <TextField
              margin="normal"
              required
              fullWidth
              name="repeat-password"
              label="Repeat Password"
              type="password"
              id="repeat-password"
              autoComplete="current-password"
          />
          <ErrorMessage render={renderAccountExistsError} msg={"Username and/or email already exists"} severity={"error"}/>
          <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/" variant="body2">
                {"You already have an account? Sign In"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  </ThemeProvider>);
}


function SignIn() {
  const navigate = useNavigate();

  const [renderError, setRenderError] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    fetch('http://localhost:3001/users/auth', {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: data.get('email'),
        password: data.get('password'),
      }),
    }).then((res) => {
      console.log("result from auth:");
      console.log(res);
      console.log(res.status);
      if(res.ok) {
        navigate("/memePage");
      }
      else {
        setRenderError(true);
        return res.text();
      }
    }).then((res) => {
      console.log(res);
    });
    
    //navigate("/memePage");
    //<Navigate to="/memePage"/>
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <LockOutlinedIcon/>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <ErrorMessage render={renderError} msg={"wrong email and/or password"} severity={"error"}/>
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export { SignIn, Register }