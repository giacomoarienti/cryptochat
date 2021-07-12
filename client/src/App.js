import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  Navigation,
  Footer,
  Home,
  Dashboard,
  Register,
  Logout,
} from "./components";

import { getUsername } from "./api/userService";

import "./App.css";

class App extends React.Component {
  state = {
    username: null,
  };

  updateUsername = async () => {
    const resp = await getUsername();
    this.setState({ username: resp });
  };

  async componentDidMount() {
    await this.updateUsername();
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Navigation authed={this.state.username}/>
          <main>
            <Switch>
              <Route exact path={["/", "/home"]} component={Home} />
              <Route
                exact
                path="/dashboard"
                render={(props) => (
                  <Dashboard {...props} username={this.state.username} />
                )}
              />
              <Route exact path="/register" component={Register} />
              <Route exact path="/logout" component={Logout} />
            </Switch>
          </main>
          <Footer />
        </Router>
      </div>
    );
  }
}

export default App;
