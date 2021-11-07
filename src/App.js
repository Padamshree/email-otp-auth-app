import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import PrivateRoute from './utils/privateRoutes';

import Login from './components/Login';
import Home from './components/Home';
import Signup from './components/Signup';
import Popup from './components/Popup';
import { setResultsData, setUserData } from './actions/authActions';

import store from './store';

import './styles/App.css';


// Checking for _id in localStorage to keep user logged in
if (localStorage._id) {
  const data = { _id: localStorage._id, token: localStorage.token };
  const userData = JSON.parse(localStorage.getItem('userData'));
  store.dispatch(setResultsData(data));
  store.dispatch(setUserData(userData));
}

function App() {

  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <h2 className="site-header">Zero Dawn</h2>
          <Switch>
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Signup} />
            <PrivateRoute exact path='/' component={Home} />
          </Switch>
          <Popup />
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
