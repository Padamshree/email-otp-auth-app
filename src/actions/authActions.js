import axios from "axios";
import { AUTH_TYPE } from "./auth.types";
import { openErrorsPopup } from "./errorActions";

const BASE_URL = "https://hiring.getbasis.co/candidate";

export const setResultsData = (data) => ({
    type: AUTH_TYPE.SET_RESULTS_DATA,
    payload: data,
});

export const setVerificationCode = (code) => ({
    type: AUTH_TYPE.SET_VERIFICATION_CODE,
    payload: code,
});

export const setUserData = (data) => ({
    type: AUTH_TYPE.SET_USER_DATA,
    payload: data,
});

export const setReferralCode = (data) => ({
    type: AUTH_TYPE.SET_REFERRAL_CODE,
    payload: data,
});

export const clearAuthState = () => ({
    type: AUTH_TYPE.CLEAR_AUTH_STATE,
    payload: null,
});

// Email Login to acquire Token.
export const verifyEmailLogin = (data) => (dispatch) => {

    const URL = BASE_URL + String("/users/email");

    axios.post(URL, data)
    .then(res => {
        if (res.data.success) {
            const { results } = res.data;
            dispatch(openErrorsPopup(res.data));
            dispatch(setResultsData({...results}));
        }
    })
    .catch(() => {
        const data = {
            message: 'Please enter valid email or try again later.',
            success: false, 
        };
        dispatch(openErrorsPopup(data));
    });
};

// Email + Token + OTP Login.
export const verifySignIn = (data) => (dispatch) => {

    const URL = BASE_URL + String("/users/email/verify");

    axios.put(URL, data)
    .then(res => {
        if (res.data.success) {
            const { results } = res.data;
            // Using Try-Catch Loop For Succesful Login or Redirection to Sign-Up Page. 
            try {
                const data = {
                    _id: results.user._id,
                    token: results.user.token,
                }
                const userData = {
                    email: results.user.email,
                    firstName: results.user.firstName,
                    lastName: results.user.lastName,
                    phoneNumber: results.user.phoneNumber,
                };
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('_id', results.user._id);
                localStorage.setItem('token', results.user.token);
                dispatch(openErrorsPopup(res.data));
                dispatch(setResultsData(data));
                dispatch(setUserData(userData));
            } catch {
                const data = {
                    _id: -1,
                    wrongEmailTokenCount: results.wrongEmailTokenCount,
                    resendEmailTokenCount: results.resendEmailTokenCount,
                    isLogin: false,
                }
                dispatch(openErrorsPopup(res.data));
                dispatch(setResultsData(data));
            }
        } else {
            // On Failed Verification, checking for wrongEmailTokenCount.
            //  Clearing Auth state and redirecting to /login route on 3 failed OTP attempts.
            const { messageObj } = res.data;
            if (messageObj.wrongEmailTokenCount <3) {
                dispatch(openErrorsPopup(res.data));
                dispatch(setResultsData({ ...messageObj }));
            } else {
                dispatch(openErrorsPopup(res.data));
                dispatch(clearAuthState());
            }
        }
    })
    .catch(err => {
      console.log(err);
    });

};

// Resend OTP Verification Code to Email.
// Checking for resendEmailTokenCount.
// Clearing Auth state and redirecting to /login route after 3 OTP requests.
export const resendVerificationCode = (data) => (dispatch) => {

    const URL = BASE_URL + String("/users/token/resendtoken");
    console.log(URL, data);

    axios.put(URL, data)
    .then(res => {
        console.log(res.data);
        if (res.data.success) {
            const { results } = res.data;
            dispatch(openErrorsPopup(res.data));
            dispatch(setResultsData({ ...results }));
        } else {
            dispatch(openErrorsPopup(res.data));
            dispatch(clearAuthState());
        }
    })
    .catch(err => {
        console.log(err);
    })
};

// Signup Route.
// Signing Up New User and Logging In with New User Data set in Auth State.
export const verifySignUp = (data) => (dispatch) => {

    const URL = BASE_URL + String("/users");
    axios.post(URL, data)
    .then(res => {
        if (res.data.success) {
            const { results } = res.data;
            try {
                const data = {
                    _id: results.user._id,
                    token: results.user.token,
                };
                const userData = {
                    email: results.user.email,
                    firstName: results.user.firstName,
                    lastName: results.user.lastName,
                    phoneNumber: results.user.phoneNumber,
                };
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('_id', results.user._id);
                localStorage.setItem('token', results.user.token);
                dispatch(openErrorsPopup(res.data));
                dispatch(setResultsData(data));
                dispatch(setUserData(userData));
            } catch {
                const data = { message: res.data.message, success: false };
                dispatch(openErrorsPopup(data));
                dispatch(clearAuthState());
            }
        }
    })

};

// Verifying Referral Code.
// On Verification, setting Auth State with received referralToken code.
export const verifyReferralCode = (code) => (dispatch) => {

    const referralCode = code.toUpperCase();
    const URL = BASE_URL + String(`/users/referral/${referralCode}`);

    axios.get(URL)
    .then(res => {
        if (res.data.success) {
            const { results } = res.data;
            dispatch(openErrorsPopup(res.data));
            const referralData = {
                referralToken: results.referralToken,
                referralVerified: true,
            };
            dispatch(setReferralCode(referralData));
        } else {
            dispatch(openErrorsPopup(res.data));
            const referralData = {
                referralToken: '',
            };
            dispatch(setReferralCode(referralData));
        }
    })
};

// Logging out User.
export const logoutUser = () => (dispatch) => {

    const _id = localStorage._id;
    const token = localStorage.token;
    const URL = BASE_URL + String(`/users/logout/${_id}`);
    const headers = {
        'Authorization': `Bearer ${_id},${token}`,
    };

    axios.delete(URL, { headers })
    .then(res => {
        if (res.data.success) {
            dispatch(openErrorsPopup(res.data));
            dispatch(clearAuthState());
            localStorage.clear();
        }
    })

};