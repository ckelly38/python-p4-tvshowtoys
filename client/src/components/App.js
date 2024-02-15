import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Navbar from "./Navbar";
import EpisodeOrList from "./EpisodeOrList";

function App() {
  return <div>
      <Navbar />
      <Switch>
      <Route exact path="/">
        <h1>Project Client</h1>
      </Route>
      <Route exact path="/shows">
        <h1>Shows</h1>
      </Route>
      <Route path="/shows/:showid/toys/:id">
        <h1>Toy For Show</h1>
      </Route>
      <Route path="/shows/:showid/toys">
        <h1>Toys For Show</h1>
      </Route>
      <Route path="/shows/:showid/episodes/:id">
        <EpisodeOrList uselist={false} useinlist={false} epobj={null} />
      </Route>
      <Route path="/shows/:showid/episodes">
        <EpisodeOrList uselist={true} useinlist={false} epobj={null} />
      </Route>
      <Route path="/shows/:showid">
        <h1>Show</h1>
      </Route>
      <Route exact path="/toys">
        <h1>Toys</h1>
      </Route>
      <Route exact path="/my-episodes">
        <h1>My Episodes</h1>
      </Route>
      <Route exact path="/my-toys">
        <h1>My Toys</h1>
      </Route>
      <Route exact path="/preferences">
        <h1>Preferences</h1>
      </Route>
      <Route exact path="/login">
        <h1>Login</h1>
      </Route>
      <Route exact path="/logout">
        <h1>Logout</h1>
      </Route>
      <Route exact path="/signup">
        <h1>Signup</h1>
      </Route>
    </Switch>
  </div>;
}

export default App;
