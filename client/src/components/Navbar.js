import React, { useEffect, useState } from "react";
import { Switch, Route, Link, useParams } from "react-router-dom";
import CommonClass from "./commonclass";

function Navbar({simpusrobj}) {
    let params = useParams();
    console.log("NAVBAR params = ", params);
    console.log("NAVBAR simpusrobj = ", simpusrobj);

    let cc = new CommonClass();
    let mysid = "";
    if (cc.isInteger(params.showid)) mysid = "" + params.showid;
    else mysid = ":showid";

    let notloggedin = !simpusrobj["instatus"];
    let alv = simpusrobj["access_level"];
    let nocreateaccess = (alv !== 2);
    let username = simpusrobj["username"];

    return (<div className="navbarcls">
        <div className="homelinkcls"><Link to="/">Home</Link></div>
        <div className="showslinkcls"><Link to="/shows">Shows</Link></div>
        {(notloggedin || nocreateaccess) ? null : <button onClick={null}>New Show</button>}
        <div className="epslinkcls">
          <Link to={"/shows/" + mysid + "/episodes"}>Episodes</Link>
        </div>
        {(notloggedin || nocreateaccess) ? null : <button onClick={null}>New Episode</button>}
        <div className="toyslinkcls"><Link to="/toys">Toys</Link></div>
        {(notloggedin || nocreateaccess) ? null : <button onClick={null}>New Toy</button>}
        <div className="toysforshowlinkcls">
          <Link to={"/shows/" + mysid + "/toys"}>Toys For Show</Link>
        </div>
        {(notloggedin) ? null : <><div className="mytoyslinkcls">
          <Link to="/my-toys">My Toys</Link></div>
          <div className="myepslinkcls"><Link to="/my-episodes">My Episodes</Link></div></>}
        {(notloggedin) ? <><div className="loginlinkcls"><Link to="/login">Login</Link></div>
        <div className="signuplinkcls"><Link to="/signup">Signup</Link></div></> :
        <div className="logoutlinkcls"><Link to="/logout">Logout</Link></div>}
        <div className="prefslinkcls"><Link to="/preferences">
            <div id="username">Preferences: {username}</div>
        </Link></div>
    </div>);
}

export default Navbar;
