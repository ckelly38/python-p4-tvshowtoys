import React, { useEffect, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import EpisodeToyShowOrList from "./EpisodeToyShowOrList";

function App() {
  //let history = useHistory();
  return <div>
      <Navbar />
      <Switch>
      <Route exact path="/">
        <h1>Project Client</h1>
      </Route>
      <Route exact path="/shows" render={(props) => {
        let myloc = props.location;
        console.log("myloc = ", myloc);
        return (<>
          <h1>Shows</h1>
          <EpisodeToyShowOrList typenm="Show" uselist={true} useinlist={false} epobj={null}
            location={props.location} />
        </>);
      }} />
      <Route path="/shows/:showid/toys/:id" render={(props) => {
        let myloc = props.location;
        console.log("myloc = ", myloc);
        return (<>
        <h1>Toy For Show</h1>
        <EpisodeToyShowOrList typenm="Toy" uselist={false} useinlist={false}  epobj={null}
            location={props.location} />
        </>);
      }} />
      <Route path="/shows/:showid/toys" render={(props) => {
        let myloc = props.location;
        console.log("myloc = ", myloc);
        return (<>
        <h1>Toys For Show</h1>
        <EpisodeToyShowOrList typenm="Toy" uselist={true} useinlist={false}  epobj={null}
            location={props.location} />
        </>);
      }} />
      <Route path="/shows/:showid/episodes/:id" render={(props) => {
        let myloc = props.location;
        console.log("myloc = ", myloc);
        return (<>
        <EpisodeToyShowOrList typenm="Episode" uselist={false} useinlist={false}  epobj={null}
            location={props.location} />
        </>);
      }} />
      <Route path="/shows/:showid/episodes" render={(props) => {
        let myloc = props.location;
        console.log("myloc = ", myloc);
        return (<>
        <EpisodeToyShowOrList typenm="Episode" uselist={true} useinlist={false}  epobj={null}
            location={props.location} />
        </>);
      }} />
      <Route path="/shows/:showid" render={(props) => {
        let myloc = props.location;
        console.log("myloc = ", myloc);
        return (<>
        <h1>Show</h1>
        <EpisodeToyShowOrList typenm="Show" uselist={false} useinlist={false}  epobj={null}
            location={props.location} />
        </>);
      }} />
      <Route exact path="/toys" render={(props) => {
        let myloc = props.location;
        console.log("myloc = ", myloc);
        return (<>
        <h1>Toys</h1>
        <EpisodeToyShowOrList typenm="Toy" uselist={true} useinlist={false}  epobj={null}
            location={props.location} />
        </>);
      }} />
      <Route path="/toys/:id" render={(props) => {
        let myloc = props.location;
        console.log("myloc = ", myloc);
        return (<>
        <h1>Toy</h1>
        <EpisodeToyShowOrList typenm="Toy" uselist={false} useinlist={false}  epobj={null}
            location={props.location} />
        </>);
      }} />
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
