import { ERROR_TYPES } from './error.types';

export const openErrorsPopup = (data) => (dispatch) => {
    dispatch({
        type: ERROR_TYPES.OPEN_POPUP,
        payload: data.message,
        success: data.success,
    });
};

export const closeErrorsPopup = () => (dispatch) => {
    dispatch({
        type: ERROR_TYPES.CLOSE_POPUP,
        payload: null,
    });
};