import { useSelector, useDispatch } from "react-redux";

import { Button } from '@material-ui/core';
import { logoutUser } from '../actions/authActions';

import '../styles/Home.css';

export default function Home() {

    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    const { userData: { email, firstName, lastName, phoneNumber } } = auth;

    return (
        <div className="home-container">
            <p className="home-text-main">You are in the Matrix now...</p>
            <p className="home-details">{`Welkommen ${firstName + ' ' + lastName}.`}</p>
            <p className="home-details">{`Email - ${email}`}</p>
            <p className="home-details">{`Phone Number - ${phoneNumber}`}</p>
            <Button
                style={{ margin: '7px' }}
                variant="contained"
                color="primary"
                onClick={() => {
                    dispatch(logoutUser());
                }}
            >
                Logout
            </Button>
        </div>
    )
};
