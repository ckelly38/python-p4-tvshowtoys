import React, { useEffect, useState } from "react";
import { Switch, Route, Link, useParams, useHistory, Redirect } from "react-router-dom";
import CommonClass from "./commonclass";

function Home({simpusrobj}) {
    let cc = new CommonClass();
    cc.letMustBeDefinedAndNotNull(simpusrobj);
    
    const logoutcautionmsg = "reloading the page, navigating to /login, or sometimes " +
        "modifying urls can log you out.";
    const vwfpartmsg = "You can view the ";
    const lgiactionsmsg = "If you are logged in:";
    const lvtwomsg = "If you have the appropriate access level (2) and if you own the " +
        "show: then ";
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
    const ownshowmsg = "NOTE: To own a show, you can create it or have the current owner " +
        "set you as the new owner.";
    const errmsgwarning = "NOTE: If you see a red background and it is not the normal " +
        "background color, then an error occured and you should probably look at the " +
        "browser console to figure out what the error is. To do that right-click on " +
        "the page and click inspect, then click console.";
    const dispmsg = "displayed to other users!";

    return (<div><h1>Home</h1><h2>{welcomemsg}</h2>
        <p>Dear User, simply <b>{logoutcautionmsg}</b> So be careful.</p>
        <p>{vwfpartmsg}<Link to="/shows">shows</Link> and <Link to="/shows">toys</Link>
            {" we have and sell on the site."}</p>
        <p>{lgiactionsmsg}</p>
        <ul><li>you can view your {(simpusrobj.instatus) ? <>
            <Link to="/my-episodes">watch history</Link>{" and your "}
            <Link to="/my-toys">purchased toys.</Link></>:
            "watch history and your purchased toys."}</li>
        <p>{lvtwomsg}<b>you can:</b></p>
        <ul>
            <li><b>create/add new</b> {(simpusrobj.access_level === 2) ?
                    <div style={{display: "inline-block"}}>
                        <Link exact="true" to="/shows/new">shows</Link>{", "}
                        <Link exact="true" to="/toys/new">toys</Link>{", and "}
                        <Link to="/shows/:showid/episodes/new">episodes</Link>.</div> :
                "shows, toys, and episodes."}</li><br />
            <li><b>change/edit</b> the episodes, toys, shows {dispmsg}</li><br />
            <li><b>remove</b> episodes, toys, and shows.</li>
        </ul></ul>
        <p>{ownshowmsg}</p>
        <p>{errmsgwarning}</p>
        <p><b>DISCLAIMER: No money is exchanged. This is a demo only site.</b></p>
        <p><b>{warnfpart}</b>{warnmsgmidpart}<b>{warnmsglpart}</b></p></div>);
}

export default Home;
