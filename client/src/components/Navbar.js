import React, { useEffect, useState } from "react";
import { Switch, Route, Link } from "react-router-dom";

function Navbar({username="not logged in"}) {
  return (<div className="navbarcls">
    <div className="homelinkcls"><Link to="/">Home</Link></div>
    <div className="showslinkcls"><Link to="/shows">Shows</Link></div>
    <button onClick={null}>New Show</button>
    <div className="epslinkcls"><Link to="/shows/:showid/episodes">Episodes</Link></div>
    <button onClick={null}>New Episode</button>
    <div className="toyslinkcls"><Link to="/toys">Toys</Link></div>
    <button onClick={null}>New Toy</button>
    <div className="toysforshowlinkcls"><Link to="/shows/:showid/toys">Toys For Show</Link></div>
    <div className="mytoyslinkcls"><Link to="/my-toys">My Toys</Link></div>
    <div className="myepslinkcls"><Link to="/my-episodes">My Episodes</Link></div>
    <div className="loginlinkcls"><Link to="/login">Login</Link></div>
    <div className="logoutlinkcls"><Link to="/logout">Logout</Link></div>
    <div className="signuplinkcls"><Link to="/signup">Signup</Link></div>
    <div className="prefslinkcls"><Link to="/preferences">
        <div id="username">Preferences: {username}</div>
    </Link></div>
  </div>);
}

export default Navbar;