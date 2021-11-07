import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

//PrivateRoute Component to keep authenticated route(s) hidden. 
const PrivateRoute = ({ component: Component, auth, ...rest }) => (
    <Route
        {...rest}
        render={(props) => (
        auth.results._id && auth.results._id !== -1 ? 
        (
        <div>
            <Component {...props} />
        </div>
        ) : (
            <Redirect to="/login" />
        ))}
    />
);

const mapStateToProps = (state) => ({
    auth: state.auth,
});
  
export default connect(mapStateToProps)(PrivateRoute);