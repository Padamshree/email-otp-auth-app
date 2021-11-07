import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TextField, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import { setReferralCode, setUserData, verifyReferralCode, verifySignUp } from "../actions/authActions";
import { openErrorsPopup } from "../actions/errorActions";

import '../styles/Login.css';

const Signup = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const auth = useSelector((state) => state.auth);

    const { results, userData, referralCode, verificationCode } = auth;
    const { _id } = results;
    const { referralToken, referralVerified } = referralCode;

    useEffect(() => {
        if (_id && _id !== -1) {
            history.push('/');
        }
        if (!_id) {
            history.push('/login');
        }
    }, [_id]);

    // Checking ReferralCode for Verification and calling verifyReferralCode API on token length of 6.
    useEffect(() => {
        if (!referralVerified && referralToken.length === 6) {
            dispatch(verifyReferralCode(referralToken));
        };
    }, [referralCode]);

    // Handler to check requirements before connecting to Sign-up API.
    const submitSignUpHandler = () => {
        const errors = [];
        if (!userData.firstName) {
            errors.push('Please add First Name.');
        }
        if (!userData.lastName) {
            errors.push('Please add Last Name.');
        }
        if (!userData.phoneNumber) {
            errors.push('Please add Phone Number');
        }
        if (userData.phoneNumber < 0) {
            errors.push('Phone Number cannot be negative.');
        }
        if (userData.phoneNumber.length !== 10) {
            errors.push('10-digit Phone Number is required.');
        }
        if (verificationCode.length !== 6) {
            errors.push('Verification Code Of 6 digits required.')
        }

        if(errors.length > 0) {
            const data = {
                success: false,
                message: errors[0],
            };
            dispatch(openErrorsPopup(data));
        } else {
            const data = {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                phoneNumber: userData.phoneNumber,
                token: String(results.token),
                referredCodeKey: referralVerified ? referralToken : '',
                verificationCode: verificationCode,
                agreeToPrivacyPolicy: true,
                source: "WEB_APP",
            };
            dispatch(verifySignUp(data));
        }
    };

    const changeReferralHandler = () => {
        const data = {
            referralToken: '',
            referralVerified: false,
        };
        dispatch(setReferralCode(data));
    };

    return (
        <div className='container'>
            <div className='outlined-box-signup'>
                <h3 className='box-header'>Signup</h3>
                <br />
                <TextField
                    required
                    variant="outlined"
                    className="user-input"
                    label="Email"
                    value={userData.email}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <br />
                <TextField
                    required
                    variant="outlined"
                    className="user-input"
                    label="First Name"
                    value={userData.firstName}
                    onChange={(e) => {
                        const data = { ...userData, firstName: e.target.value };
                        dispatch(setUserData(data));
                    }}
                />
                <br />
                <TextField
                    required
                    variant="outlined"
                    className="user-input"
                    label="Last Name"
                    value={userData.lastName}
                    onChange={(e) => {
                        const data = { ...userData, lastName: e.target.value };
                        dispatch(setUserData(data));
                    }}
                />
                <br />
                <TextField
                    required
                    variant="outlined"
                    className="user-input"
                    label="Phone Number"
                    type="number"
                    value={userData.phoneNumber}
                    onChange={(e) => {
                        const data = { ...userData, phoneNumber: e.target.value };
                        dispatch(setUserData(data));
                    }}
                />
                <br />
                <TextField
                    variant="outlined"
                    className="user-input"
                    label="Enter Referral"
                    value={referralToken}
                    onChange={(e) => {    
                        if (!referralVerified) {
                            const data = { ...referralCode, referralToken: e.target.value };
                            dispatch(setReferralCode(data));
                        }
                    }}
                />
                <p
                    className="resend-code"
                    onClick={changeReferralHandler}
                >
                    Change Referral?
                </p>
                <br />
                <div>
                <Button
                    style={{ margin: '7px' }}
                    variant="contained"
                    color="primary"
                    onClick={submitSignUpHandler}
                >
                    Signup
                </Button>
                </div>
            </div>
        </div>
    )
};

export default Signup;
