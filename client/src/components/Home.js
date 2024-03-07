import React, { useEffect, useState } from "react";
import { Switch, Route, Link, useParams, useHistory, Redirect } from "react-router-dom";
import CommonClass from "./commonclass";

function Home({simpusrobj}) {
    let cc = new CommonClass();
    cc.letMustBeDefinedAndNotNull(simpusrobj);
    
    const mymsg = "If you have the appropriate access level, you can create new ";
    const logoutcautionmsg = "reloading the page, navigating to /login, or sometimes " +
        "modifying urls can log you out.";
    const vwfpartmsg = "You can view the ";
    const lgiactionsmsg = "If you are logged in, you can view your ";
    const lvtwomsg = "If you have the appropriate access level (2): then you can add or " +
        "remove episodes, toys, and shows.";
    let welcomemsg = "";
    if (simpusrobj.instatus)
    {
        welcomemsg = "Welcome " + simpusrobj.username + ". Your ID# is " +
            simpusrobj.id + ".";
    }
    else welcomemsg = "You are not logged in!";

    return (<div><h1>Home</h1><h2>{welcomemsg}</h2>
        <p>Dear User, simply <b>{logoutcautionmsg}</b> So be careful.</p>
        <p>{vwfpartmsg}<Link to="/shows">shows</Link> and <Link to="/shows">toys</Link>
            {" we have and sell on the site."}</p>
        <p>{lgiactionsmsg}{(simpusrobj.instatus) ? <>
            <Link to="/my-episodes">watch history</Link>{" and your "}
            <Link to="/my-toys">purchased toys.</Link></>:
            "watch history and your purchased toys."}</p>
        <p>{lvtwomsg}</p>
        <p>You can also change the episodes, toys, shows displayed to other users!</p>
        <p>{mymsg}{(simpusrobj.access_level === 2) ?
        <><Link exact="true" to="/shows/new">shows</Link>{", "}
        <Link exact="true" to="/toys/new">toys</Link>{", and "}
        <Link to="/shows/:showid/episodes/new">episodes</Link></> :
            "shows, toys, and episodes"}.</p></div>);
}

export default Home;
