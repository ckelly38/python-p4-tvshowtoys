import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import EpisodeToyShowOrList from "./EpisodeToyShowOrList";
import Logout from "./Logout";
import SignUpLoginPreferences from "./SignUpLoginPreferences";
import NewShowToyEpisode from "./NewShowToyEpisode";
import Home from "./Home";
import CommonClass from "./commonclass";

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
      else return (<Redirect exact to="/login" />);
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
        <Home simpusrobj={getSimplifiedUserObj()} />
      </Route>
      <Route exact path="/shows/new">
        {(getAccessLevel() === 2) ? <><Navbar simpusrobj={getSimplifiedUserObj()} />
        <NewShowToyEpisode typenm="Show" simpusrobj={getSimplifiedUserObj()} /></> :
        <Redirect to="/login" />}
      </Route>
      <Route exact path="/toys/new">
        {(getAccessLevel() === 2) ? <><Navbar simpusrobj={getSimplifiedUserObj()} />
        <NewShowToyEpisode typenm="Toy" simpusrobj={getSimplifiedUserObj()} /></> :
        <Redirect to="/login" />}
      </Route>
      <Route path="/shows/:showid/toys/new">
        {(getAccessLevel() === 2) ? <><Navbar simpusrobj={getSimplifiedUserObj()} />
        <NewShowToyEpisode typenm="Toy" simpusrobj={getSimplifiedUserObj()} /></> :
        <Redirect to="/login" />}
      </Route>
      <Route path="/shows/:showid/episodes/new">
        {(getAccessLevel() === 2) ? <><Navbar simpusrobj={getSimplifiedUserObj()} />
        <NewShowToyEpisode typenm="Episode" simpusrobj={getSimplifiedUserObj()} /></> :
        <Redirect to="/login" />}
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
      <Route exact path="/my-toys" render={(props) =>
        genEpsShowsToysComponent(props, "tyfromapp", "Toy", true, false, true, true)} />
      <Route exact path="/preferences">
        {getLoggedInStatus() ? <><Navbar simpusrobj={getSimplifiedUserObj()} />
          <SignUpLoginPreferences typenm="Preferences" setuser={setUser}
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
            <SignUpLoginPreferences typenm="SignUp" setuser={setUser}
              simpusrobj={getSimplifiedUserObj()} /></>}
      </Route>
      <Route exact path="/redirectme" render={(props) => {
        console.log("history = ", history);
        return history.goBack();
        //THIS HELPS TRIGGER A RERENDER WITHOUT SETTING UNNECESSARY STATE
        //OUTSIDE OF THE COMPONENT
      }} />
      <Route path="*"><Redirect to="/" /></Route>
    </Switch>
  </div>);
}

export default App;
