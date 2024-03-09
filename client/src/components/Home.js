import React, { useEffect, useState } from "react";
import { Switch, Route, Link, useParams, useHistory, Redirect } from "react-router-dom";
import CommonClass from "./commonclass";

function Home({simpusrobj}) {
    let cc = new CommonClass();
    cc.letMustBeDefinedAndNotNull(simpusrobj);
    
    const mymsg = "If you have the appropriate access level, you can ";
    const logoutcautionmsg = "reloading the page, navigating to /login, or sometimes " +
        "modifying urls can log you out.";
    const vwfpartmsg = "You can view the ";
    const lgiactionsmsg = "If you are logged in, you can view your ";
    const lvtwomsg = "If you have the appropriate access level (2): then ";
    let welcomemsg = "";
    if (simpusrobj.instatus)
    {
        welcomemsg = "Welcome " + simpusrobj.username + ". Your ID# is " +
            simpusrobj.id + ".";
    }
    else welcomemsg = "You are not logged in!";
    const warnfpart = "Beware User, it is possible ";
    const warnmsgmidpart = "(when switching between tabs faster and faster) ";
    const warnmsglpart = "to get the website to crash! That is on you!";

    return (<div><h1>Home</h1><h2>{welcomemsg}</h2>
        <p>Dear User, simply <b>{logoutcautionmsg}</b> So be careful.</p>
        <p>{vwfpartmsg}<Link to="/shows">shows</Link> and <Link to="/shows">toys</Link>
            {" we have and sell on the site."}</p>
        <p>{lgiactionsmsg}{(simpusrobj.instatus) ? <>
            <Link to="/my-episodes">watch history</Link>{" and your "}
            <Link to="/my-toys">purchased toys.</Link></>:
            "watch history and your purchased toys."}</p>
        <p>{lvtwomsg}<b>you can add or remove</b> episodes, toys, and shows.</p>
        <p>You can also <b>change/edit</b> the episodes, toys, shows displayed to other users!</p>
        <p>{mymsg}<b>create new</b> {(simpusrobj.access_level === 2) ?
        <><Link exact="true" to="/shows/new">shows</Link>{", "}
        <Link exact="true" to="/toys/new">toys</Link>{", and "}
        <Link to="/shows/:showid/episodes/new">episodes</Link></> :
            "shows, toys, and episodes"}.</p>
        <p><b>{warnfpart}</b>{warnmsgmidpart}<b>{warnmsglpart}</b></p></div>);
}

export default Home;
