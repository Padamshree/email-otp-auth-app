import { ERROR_TYPES } from '../actions/error.types';

const initialState = {
    showPopup: false,
    success: false,
    errorMessage: '',
};

export default function errorReducer(state = initialState, action) {
    switch (action.type) {
    case ERROR_TYPES.OPEN_POPUP:
        return {
            ...state,
            showPopup: true,
            errorMessage: action.payload,
            success: action.success,
        };
    case ERROR_TYPES.CLOSE_POPUP:
        return {
            ...state,
            showPopup: false,
            errorMessage: '',
            success: false,
        };
    default:
        return state;
    }
}