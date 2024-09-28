// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom";
// import "../css/main.css"
// import "../css/util.css"

// export default function Login() {
//     const [phone, setPhone] = useState('');
//     const [password, setPassword] = useState('');
//     const navigate = useNavigate()

//     const handleLogin = async (event) => {
//         event.preventDefault()
//         if (!phone) {
//             alert("Vui lòng nhập số điện thoại")
//             return
//         }
//         if (!password) {
//             alert("Vui lòng nhập mật khẩu")
//             return
//         }
//         let response = await fetch(
//             `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`,
//             {
//                 method: "POST",
//                 body: JSON.stringify({
//                     "phone_num": phone,
//                     "password": password
//                 }),
//                 headers:{
//                     "Content-Type": "application/json"
//                 }
//             }
//         )
//         let responseJson = await response.json()
//         if (response.ok){
//             navigate("/")
//         }
//         else{
//             alert("Số điện thoại hoặc mật khẩu không đúng")
//         }
//     };

//     const handleSignup = () => {
//         navigate("/signup")
//     };

//     return (
//         <div className="limiter">
//             <div className="container-login100">
//                 <div className="wrap-login100">
//                     <form className="login100-form validate-form">
//                         <span className="login100-form-title p-b-26">Welcome</span>

//                         <div className="d-flex justify-content-center mb-3" style={{
//                             justifyContent: "center",
//                             alignItems: "center",
//                             display: "flex",
//                         }}>
//                             <img src={require('../images/logo.png')} alt="Logo" />
//                         </div>

//                         <div className="wrap-input100 validate-input" data-validate="Valid email is: a@b.c">
//                             <input
//                                 className="input100"
//                                 type="text"
//                                 name="phone"
//                                 value={phone}
//                                 onChange={(e) => setPhone(e.target.value)}
//                             />
//                             <span className="focus-input100" data-placeholder="Phone Number"></span>
//                         </div>

//                         <div className="wrap-input100 validate-input" data-validate="Enter password">
//                             <span className="btn-show-pass">
//                                 <i className="zmdi zmdi-eye"></i>
//                             </span>
//                             <input
//                                 className="input100"
//                                 type="password"
//                                 name="pass"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                             />
//                             <span className="focus-input100" data-placeholder="Password"></span>
//                         </div>

//                         <div className="container-login100-form-btn">
//                             <div className="wrap-login100-form-btn">
//                                 <div className="login100-form-bgbtn"></div>

//                                 <button className="login100-form-btn btn-login" onClick={handleLogin}>
//                                     Login
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="text-center p-t-115">
//                             <span className="txt1">Don’t have an account ? </span>

//                             <a className="txt2" onClick={handleSignup} href="#">
//                                 Sign Up
//                             </a>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Login() {
    const navigate = useNavigate()
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // console.log({
        //   email: data.get('email'),
        //   password: data.get('password'),
        // });
        if (!data.get('username') || !data.get('password')) {
            alert("Please enter your username and password")
        }
        let response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`,
            {
                method: "POST",
                body: JSON.stringify({
                    "username": data.get('username'),
                    "password": data.get('password'),
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        // let responseJson = await response.json()
        if (response.ok) {
            let responseJson = await response.json()
            localStorage.setItem("access_token", responseJson.access_token)
            navigate("/")
        }
        else {
            alert("Wrong username or password")
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
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
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
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
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}