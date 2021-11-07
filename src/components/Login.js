import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { TextField, Button } from "@material-ui/core";

import { 
    verifyEmailLogin,
    verifySignIn,
    setUserData,
    setVerificationCode,
    resendVerificationCode, 
} from "../actions/authActions";

import { openErrorsPopup } from "../actions/errorActions";

import '../styles/Login.css';

const Login = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const auth = useSelector((state) => state.auth);

    const { results, userData, verificationCode } = auth;
    const { email } = userData;
    const { _id, token } = results;

    // _id === -1 represents successful OTP verification and new user -> redirected to register route
    useEffect(() => {
        if (_id && _id !== -1) {
            history.push('/');
        }
        if (_id && _id === -1) {
            history.push('/register');
        }
    }, [_id]);
    
    //Handler to resend Verification Code
    const submitResendCode = () => {
        const data = {
            email: email,
            token: String(token),
        };
        dispatch(resendVerificationCode(data));
    };

    //Verification Code Checks before connecting to Sign_in API
    const submitSignInHandler = () => {
        const errors = [];
        if (verificationCode.length !== 6) {
            errors.push('Verification Code of 6 digits required.');
        }
        if (errors.length > 0) {
            const data = {
                success: false,
                message: errors[0],
            };
            dispatch(openErrorsPopup(data));
        } else {
            const data = {
                email: email,
                token: token,
                verificationCode: verificationCode,
            };
            dispatch(verifySignIn(data));
        }
    };

    return (
        <div className='main-container'>
            <h3 className="login-header">Welcome to HZD!</h3>
                <div className='container'>
                <div className='outlined-box'>
                    <h3 className='box-header'>Signin</h3>
                    <br />
                    <TextField
                        required
                        variant="outlined"
                        className="user-input"
                        label="Enter Email"
                        value={email}
                        InputProps={{
                            readOnly: token ? true: false,
                        }}
                        onChange={(e) => {
                            const newData = { ...userData, email: e.target.value };
                            dispatch(setUserData(newData));
                        }}
                    />
                    <br />
                    {
                        token
                        && 
                        <div>
                            <TextField
                                required
                                variant="outlined"
                                className="user-input"
                                label="Enter 6-digit code"
                                placeholder="112233"
                                value={verificationCode}
                                onChange={(e) => {
                                    dispatch(setVerificationCode(e.target.value))
                                }}
                            />
                            <br />
                            <p 
                                className="resend-code"
                                onClick={submitResendCode}
                            >
                                Resend Verification Code?
                            </p>
                        </div>
                    }
                    {
                        token ? 
                        (
                            <Button
                                style={{ margin: '7px' }}
                                variant="contained"
                                color="primary"
                                onClick={submitSignInHandler}
                            >
                                Login
                            </Button> 
                        ) : (
                            <Button
                                style={{ margin: '7px' }}
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    const data = { email: email };
                                    dispatch(verifyEmailLogin(data));
                                }}
                            >
                                Request OTP
                            </Button> 
                        )
                    }
                </div>
            </div>
        </div>
    )
};

export default Login;