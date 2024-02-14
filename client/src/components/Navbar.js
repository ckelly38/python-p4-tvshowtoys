import React, { useEffect, useState } from "react";
import { Switch, Route, Link } from "react-router-dom";

function Navbar({username}) {
  return <div>
    <Link to="/">Home</Link>
    <Link to="/shows">Shows</Link>
    <button onClick={null}>New Show</button>
    <Link to="/shows/:showid/episodes">Episodes</Link>
    <button onClick={null}>New Episode</button>
    <Link to="/toys">Toys</Link>
    <button onClick={null}>New Toy</button>
    <Link to="/shows/:showid/toys">Toys For Show</Link>
    <Link to="/my-toys">My Toys</Link>
    <Link to="/my-episodes">My Episodes</Link>
    <Link to="/login">Login</Link>
    <Link to="/logout">Logout</Link>
    <Link to="/signup">Signup</Link>
    <Link to="/preferences">
        <div id="username">Preferences {username}</div>
    </Link>
  </div>;
}

export default Navbar;