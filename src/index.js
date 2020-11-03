import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { rootReducer } from './state/reducers/rootReducer';
import {
  BrowserRouter as Router,
  Route,
  useHistory,
  Switch,
} from 'react-router-dom';
import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';
import 'antd/dist/antd.less';
import { NotFoundPage } from './components/pages/NotFound';
import { ExampleListPage } from './components/pages/ExampleList';
import { HomePage } from './components/pages/Home';
import { ProfileListPage } from './components/pages/ProfileList';
import { LoginPage } from './components/pages/Login';
import { config } from './utils/oktaConfig';
import { LoadingComponent } from './components/common';
import { CustomerDashboard } from './components/pages/CustomerDashboard';
import { GroomerDashboard } from './components/pages/GroomerDashboard';
import { SearchForm } from './components/pages/search';

const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Router>
  </Provider>,
  document.getElementById('root')
);

function App() {
  // The reason to declare App this way is so that we can use any helper functions we'd need for business logic, in our case auth.
  // React Router has a nifty useHistory hook we can use at this level to ensure we have security around our routes.
  const history = useHistory();
  const authHandler = () => {
    // We pass this to our <Security /> component that wraps our routes.
    // It'll automatically check if userToken is available and push back to login if not :)
    history.push('/login');
  };
  return (
    <Security {...config} onAuthRequired={authHandler}>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/SearchForm" component={SearchForm} />
        <Route path="/implicit/callback" component={LoginCallback} />

        <SecureRoute
          exact
          path="/"
          component={() => <HomePage LoadingComponent={LoadingComponent} />}
        />
        <SecureRoute path="/example-list" component={ExampleListPage} />

        <SecureRoute path="/profile-list" component={ProfileListPage} />

        <SecureRoute path="/customer-dashboard" component={CustomerDashboard} />
        <SecureRoute path="/groomer-dashboard" component={GroomerDashboard} />

        <Route component={NotFoundPage} />
      </Switch>
    </Security>
  );
}
