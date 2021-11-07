import { AUTH_TYPE } from "../actions/auth.types";

const initialResultsData = {
    _id: '',
    token: '',
    isLogin: false,
    wrongEmailTokenCount: 0,
    resendEmailTokenCount: 0,
};

const initialUserData = {
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
};

const initialReferralCode = {
    referralToken: '',
    referralVerified: false,
};

const initialState = {
    results: {
        ...initialResultsData,
    },
    userData: {
        ...initialUserData,
    },
    referralCode: {
        ...initialReferralCode,
    },
    verificationCode: '',
};

//AuthReducer - Updating Authentication Details in Redux Store
export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case AUTH_TYPE.SET_RESULTS_DATA:
            return {
                ...state,
                results: {
                    ...state.results,
                    ...action.payload,
                },
            }
        case AUTH_TYPE.SET_USER_DATA:
            return {
                ...state,
                userData: {
                    ...state.userData,
                    ...action.payload,
                },
            }
        case AUTH_TYPE.SET_REFERRAL_CODE:
            return {
                ...state,
                referralCode: {
                    ...state.referralCode,
                    ...action.payload,
                },
            }
        case AUTH_TYPE.SET_VERIFICATION_CODE:
            return {
                ...state,
                verificationCode: action.payload,
            }
        case AUTH_TYPE.CLEAR_AUTH_STATE:
            return initialState;
        default:
            return state;
    }
};

