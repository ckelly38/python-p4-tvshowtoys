import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import EpisodeToyShowOrList from "./EpisodeToyShowOrList";
import Logout from "./Logout";
import CommonClass from "./commonclass";
import SignUpLoginPreferences from "./SignUpLoginPreferences";

function App() {
  let history = useHistory();
  let [user, setUser] = useState(null);
  let [checkitems, setCheckItems] = useState([]);
  let [watchall, setWatchAll] = useState(true);

  function getSimplifiedUserObj()
  {
    let musrnm = "";
    let lgi = false;
    let alv = 0;
    let pswd = "";
    let usrid = -1;
    if (user === undefined || user === null) musrnm = "not logged in";
    else
    {
      musrnm = user.name;
      alv = user.access_level;
      lgi = true;
      usrid = user.id;
      pswd = user.password;
    }

    return {"id": usrid, "username": musrnm, "access_level": alv, "instatus": lgi,
      "password": pswd};
  }
  function getUserName()
  {
    return getSimplifiedUserObj()["username"];
  }
  function getLoggedInStatus()
  {
    return getSimplifiedUserObj()["instatus"];
  }
  function getAccessLevel()
  {
    return getSimplifiedUserObj()["access_level"];
  }

  function genEpsShowsToysComponent(props, mky, mtype, uselist, useinlist, incnvbar, usemy=false)
  {
    const cc = new CommonClass();
    cc.letMustBeDefinedAndNotNull(props, "props");
    cc.letMustBeDefinedAndNotNull(mky, "mky");
    cc.letMustBeDefinedAndNotNull(mtype, "mtype");
    cc.letMustBeBoolean(uselist, "uselist");
    cc.letMustBeBoolean(useinlist, "useinlist");
    cc.letMustBeBoolean(incnvbar, "incnvbar");
    cc.letMustBeBoolean(usemy, "usemy");

    let simpusrobj = getSimplifiedUserObj();
    console.log("usemy = " + usemy);

    if (usemy)
    {
      if (simpusrobj["instatus"]);
      else return (<Redirect to="/login" />);
    }

    let myloc = props.location;
    console.log("myloc = ", myloc);

    return (<>
      {(incnvbar) ? <Navbar simpusrobj={simpusrobj} /> : null}
      <EpisodeToyShowOrList key={mky} typenm={mtype} uselist={uselist} useinlist={useinlist}
        epobj={null} location={myloc} usemy={usemy} simpusrobj={simpusrobj} watchall={watchall}
        checkitems={checkitems} setCheckItems={setCheckItems} setWatchAll={setWatchAll} />
    </>);
  }

  
  return (<div>
      <Switch>
      <Route exact path="/">
        <Navbar simpusrobj={getSimplifiedUserObj()} />
        <h1>Home</h1>
        {getLoggedInStatus() ? <h2>Welcome {getUserName()}</h2>: <h2>You are not logged in!</h2>}
        <p>Dear User, simply <b>reloading the page will log you out.</b> Be careful.</p>
        <p>You can view the shows and toys we have and sell on the site.</p>
        <p>If you are logged in, you can view your watch history and your purchased toys.</p>
      <p>If you have the appropriate access level, you can create new shows, episodes, and toys.</p>
      </Route>
      <Route exact path="/shows" render={(props) =>
        genEpsShowsToysComponent(props, "swfromapp", "Show", true, false, true, false)} />
      <Route path="/shows/:showid/toys/:id" render={(props) =>
        genEpsShowsToysComponent(props, "tyfromapp", "Toy", false, false, true, false)} />
      <Route path="/shows/:showid/toys" render={(props) =>
        genEpsShowsToysComponent(props, "tyfromapp", "Toy", true, false, true, false)} />
      <Route path="/shows/:showid/episodes/:id" render={(props) =>
        genEpsShowsToysComponent(props, "epfromapp", "Episode", false, false, true, false)} />
      <Route path="/shows/:showid/episodes" render={(props) =>
        genEpsShowsToysComponent(props, "epfromapp", "Episode", true, false, true, false)} />
      <Route path="/shows/:showid" render={(props) =>
        genEpsShowsToysComponent(props, "swfromapp", "Show", false, false, true, false)} />
      <Route exact path="/toys" render={(props) =>
        genEpsShowsToysComponent(props, "tyfromapp", "Toy", true, false, true, false)} />
      <Route path="/toys/:id" render={(props) =>
        genEpsShowsToysComponent(props, "tyfromapp", "Toy", false, false, true, false)} />
      <Route exact path="/my-episodes" render={(props) =>
        genEpsShowsToysComponent(props, "epfromapp", "Episode", true, false, true, true)} />
      <Route exact path="/my-toys">
        <Navbar simpusrobj={getSimplifiedUserObj()} />
        <h1>My Toys</h1>
      </Route>
      <Route exact path="/preferences">
        {getLoggedInStatus() ? <><Navbar simpusrobj={getSimplifiedUserObj()} />
          <SignUpLoginPreferences typenm="Preferences"  setuser={setUser}
            simpusrobj={getSimplifiedUserObj()} />
        </> : <Redirect to="/login" />}
      </Route>
      <Route exact path="/login">
        {getLoggedInStatus() ? <Redirect to="/" /> : <>
          <Navbar simpusrobj={getSimplifiedUserObj()} />
          <SignUpLoginPreferences typenm="Login" setuser={setUser}
            simpusrobj={getSimplifiedUserObj()} /></>}
      </Route>
      <Route exact path="/logout">
        {getLoggedInStatus() ? <><Navbar simpusrobj={getSimplifiedUserObj()} />
        <Logout setuser={setUser} /></> : <Redirect to="/" />}
      </Route>
      <Route exact path="/signup">
        {getLoggedInStatus() ? <Redirect to="/" /> : <>
            <Navbar simpusrobj={getSimplifiedUserObj()} />
            <SignUpLoginPreferences typenm="SignUp"  setuser={setUser}
              simpusrobj={getSimplifiedUserObj()} /></>}
      </Route>
      <Route exact path="/redirectme" render={(props) => {
        console.log("history = ", history);
        return history.goBack();
        //THIS HELPS TRIGGER A RERENDER WITHOUT SETTING UNNECESSARY STATE OUTSIDE OF THE COMPONENT
      }} />
      <Route path="*"><Redirect to="/" /></Route>
    </Switch>
  </div>);
}

export default App;
