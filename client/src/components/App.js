import React, { useEffect, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import EpisodeToyShowOrList from "./EpisodeToyShowOrList";
import CommonClass from "./commonclass";

function App() {
  //let history = useHistory();

  function genEpsShowsToysComponent(props, mky, mtype, uselist, useinlist, incnvbar)
  {
    const cc = new CommonClass();
    cc.letMustBeDefinedAndNotNull(props, "props");
    cc.letMustBeDefinedAndNotNull(mky, "mky");
    cc.letMustBeDefinedAndNotNull(mtype, "mtype");
    cc.letMustBeBoolean(uselist, "uselist");
    cc.letMustBeBoolean(useinlist, "useinlist");
    cc.letMustBeBoolean(incnvbar, "incnvbar");

    let myloc = props.location;
    console.log("myloc = ", myloc);

    return (<>
      {(incnvbar) ? <Navbar /> : null}
      <EpisodeToyShowOrList key={mky} typenm={mtype} uselist={uselist} useinlist={useinlist}
        epobj={null} location={myloc} />
    </>);
  }

  
  return (<div>
      <Switch>
      <Route exact path="/">
        <Navbar />
        <h1>Project Client</h1>
      </Route>
      <Route exact path="/shows" render={(props) =>
        genEpsShowsToysComponent(props, "swfromapp", "Show", true, false, true)} />
      <Route path="/shows/:showid/toys/:id" render={(props) =>
        genEpsShowsToysComponent(props, "tyfromapp", "Toy", false, false, true)} />
      <Route path="/shows/:showid/toys" render={(props) =>
        genEpsShowsToysComponent(props, "tyfromapp", "Toy", true, false, true)} />
      <Route path="/shows/:showid/episodes/:id" render={(props) =>
        genEpsShowsToysComponent(props, "epfromapp", "Episode", false, false, true)} />
      <Route path="/shows/:showid/episodes" render={(props) =>
        genEpsShowsToysComponent(props, "epfromapp", "Episode", true, false, true)} />
      <Route path="/shows/:showid" render={(props) =>
        genEpsShowsToysComponent(props, "swfromapp", "Show", false, false, true)} />
      <Route exact path="/toys" render={(props) =>
        genEpsShowsToysComponent(props, "tyfromapp", "Toy", true, false, true)} />
      <Route path="/toys/:id" render={(props) =>
        genEpsShowsToysComponent(props, "tyfromapp", "Toy", false, false, true)} />
      <Route exact path="/my-episodes">
        <Navbar />
        <h1>My Episodes</h1>
      </Route>
      <Route exact path="/my-toys">
        <Navbar />
        <h1>My Toys</h1>
      </Route>
      <Route exact path="/preferences">
        <Navbar />
        <h1>Preferences</h1>
      </Route>
      <Route exact path="/login">
        <Navbar />
        <h1>Login</h1>
      </Route>
      <Route exact path="/logout">
        <Navbar />
        <h1>Logout</h1>
      </Route>
      <Route exact path="/signup">
        <Navbar />
        <h1>Signup</h1>
      </Route>
    </Switch>
  </div>);
}

export default App;
