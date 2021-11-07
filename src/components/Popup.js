import { Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { closeErrorsPopup } from '../actions/errorActions';

const useStyles = makeStyles({
    red: {
        background: 'red',
    },
    green: {
        backgroundColor: 'green',   
    },
});

//Popup component for showing success and error messages.
export default function Popup() {
    const errors = useSelector((state) => state.errors);
    const dispatch = useDispatch();
    const { errorMessage, showPopup, success } = errors;
    const classes = useStyles();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        dispatch(closeErrorsPopup());
    };

    return (
        <div>
            {showPopup && (
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    ContentProps={{
                        classes: {
                        root: success === true ? classes.green : classes.red,
                        },
                    }}
                    open={showPopup}
                    autoHideDuration={2000}
                    onClose={handleClose}
                    message={errorMessage}
                    action={(
                        <div>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </div>
                    )}
                />
            )}
        </div>
    );
}