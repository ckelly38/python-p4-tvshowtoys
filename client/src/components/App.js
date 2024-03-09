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
  let [iseditmode, setEditMode] = useState(false);
  let [checkitems, setCheckItems] = useState([]);
  let [watchall, setWatchAll] = useState(true);

  const cc = new CommonClass();
  const epshowtoytypenmerrmsg = cc.getTypeErrorMsgFromList(["Episode", "Toy", "Show"]);
  const loginprefsetctypenmerrmsg = cc.getTypeErrorMsgFromList(
    ["SignUp", "Login", "Logout", "Preferences"]);
  
  if ((user === undefined || user === null) && iseditmode) setEditMode(false);

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

  function genEpsShowsToysComponent(props, mky, mtype, uselist, useinlist, incnvbar, usemy=false)
  {
    cc.letMustBeDefinedAndNotNull(props, "props");
    cc.letMustBeDefinedAndNotNull(mky, "mky");
    cc.letMustBeDefinedAndNotNull(mtype, "mtype");
    cc.letMustBeBoolean(uselist, "uselist");
    cc.letMustBeBoolean(useinlist, "useinlist");
    cc.letMustBeBoolean(incnvbar, "incnvbar");
    cc.letMustBeBoolean(usemy, "usemy");

    if (mtype === "Episode" || mtype === "Show" || mtype === "Toy");
    else throw new Error(epshowtoytypenmerrmsg);

    let simpusrobj = getSimplifiedUserObj();
    console.log("usemy = " + usemy);

    if (usemy && !simpusrobj.instatus) return (<Redirect to="/login" />);

    let myloc = props.location;
    console.log("myloc = ", myloc);

    return (<>{(incnvbar) ? <Navbar simpusrobj={simpusrobj} /> : null}
      <EpisodeToyShowOrList key={mky} typenm={mtype} uselist={uselist} useinlist={useinlist}
        epobj={null} location={myloc} usemy={usemy} simpusrobj={simpusrobj} watchall={watchall}
        checkitems={checkitems} setCheckItems={setCheckItems} setWatchAll={setWatchAll}
        editmode={iseditmode} seteditmode={setEditMode} />
    </>);
  }

  function makeNewItem(typenm)
  {
    cc.letMustBeDefinedAndNotNull(typenm, "typenm");
    if (typenm === "Episode" || typenm === "Show" || typenm === "Toy");
    else throw new Error(epshowtoytypenmerrmsg);

    const mysimpusrobj = getSimplifiedUserObj();
    if (mysimpusrobj.access_level === 2)
    {
      return (<><Navbar simpusrobj={mysimpusrobj} />
        <NewShowToyEpisode typenm={typenm} simpusrobj={mysimpusrobj} /></>);
    }
    else return (<Redirect to="/login" />);
  }

  function makeLoginPrefsItem(redonin, useloginredulr, typenm)
  {
    cc.letMustBeBoolean(redonin, "redonin");
    cc.letMustBeBoolean(useloginredulr, "useloginredulr");

    if (typenm === "SignUp" || typenm === "Login" || typenm === "Logout" ||
      typenm === "Preferences")
    {
      //do nothing
    }
    else throw new Error(loginprefsetctypenmerrmsg);

    const mysimpusrobj = getSimplifiedUserObj();
    const nvbar = (<Navbar simpusrobj={mysimpusrobj} />);
    const reditem = (<Redirect to={(useloginredulr ? "/login": "/")} />);
    const sprefsitem = (<SignUpLoginPreferences typenm={typenm} setuser={setUser}
        simpusrobj={mysimpusrobj} />);
    const lgoutitem = (<Logout setuser={setUser} />);
    
    if (redonin === mysimpusrobj.instatus) return reditem;
    else return (<>{nvbar}{(typenm === "Logout") ? lgoutitem: sprefsitem}</>);
  }

  
  return (<div>
      <Switch>
      <Route exact path="/">
        <Navbar simpusrobj={getSimplifiedUserObj()} />
        <Home simpusrobj={getSimplifiedUserObj()} />
      </Route>
      <Route exact path="/shows/new" render={(props) => makeNewItem("Show")} />
      <Route exact path="/toys/new" render={(props) => makeNewItem("Toy")} />
      <Route path="/shows/:showid/toys/new" render={(props) => makeNewItem("Toy")} />
      <Route path="/shows/:showid/episodes/new" render={(props) => makeNewItem("Episode")} />
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
      <Route exact path="/preferences" render={(props) => 
        makeLoginPrefsItem(false, true, "Preferences")} />
      <Route exact path="/login" render={(props) => makeLoginPrefsItem(true, false, "Login")} />
      <Route exact path="/logout" render={(props) =>
        makeLoginPrefsItem(false, false, "Logout")} />
      <Route exact path="/signup" render={(props) =>
        makeLoginPrefsItem(true, false, "SignUp")} />
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
