import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Signup, Login } from "./auth/Auth.jsx";
import { logout } from "./auth/auth.js";
import { AuthContext } from "../contextes/AuthContext.jsx";
import Home from "./Home/Home.jsx";
import Navbar from "./Navbar/Navbar.jsx";
import Profile, { MiniProfile } from "./Profile/Profile.jsx";
import Settings from "./Settings/Settings.jsx";
import { getUser } from "./Profile/Profile.jsx";
import Bookmarks from "./Bookmarks/Bookmarks.jsx";
import Explore from "./Explore/Explore.jsx";

function App() {
  const Auth = useContext(AuthContext);

  useEffect(() => {
    getUser(Auth?.user?.token, Auth?.user?.userId).catch(() => {
      logout(Auth);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <Router>
      {Auth.user && <Navbar username={Auth.user.username} />}

      {Auth.user && (
        <Switch>
          <Route exact path="/home" children={<Home />} />
          <Route exact path="/settings" children={<Settings />} />
          <Route exact path="/profile/:id" children={<Profile />} />
          <Route exact path="/profile" children={<Profile self={true} />} />
          <Route exact path="/bookmarks" children={<Bookmarks />} />
          <Route exact path="/explore" children={<Explore />} />
          <Route
            exact
            path="/test"
            children={
              <MiniProfile
                name="rjab"
                count="120k followers"
                isFollowed={false}
                followUserHandler={() => {}}
                profilePicture="/images/pp.png"
                bio={"yea boiiiiiii"}
                id={1}
              />
            }
          />
          <Route path="*" children={<Redirect to="/home" />} />
        </Switch>
      )}
      {!Auth.user && (
        <Switch>
          <Route exact path="/login" children={<Login />} />
          <Route exact path="/signup" children={<Signup />} />
          <Route exact path="/test" children={<MiniProfile />} />
          <Route path="*" children={<Redirect to="/login" />} />
        </Switch>
      )}

      <Route exact path="/test" children={<div />} />
    </Router>
  );
}

export default App;
