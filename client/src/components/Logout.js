import React, { useEffect, useState } from "react";

function Logout({setuser=null})
{
    let [errmsg, setErrMsg] = useState("");

    useEffect(() => {
        fetch("/logout").then((res) => res.json()).then((data) => {
            console.log(data);
            //but on failure do that too
            //success
            console.log("logging out successful!");
            setuser(null);
        }).catch((err) => {
            console.error("there was an error attempting to logout!");
            console.error(err);
            setErrMsg(err.message);
        });
    });

    let bgcolor = "";
    if (errmsg === undefined || errmsg === null || errmsg.length < 1) bgcolor = "lime";
    else bgcolor = "red";

    return (<div style={{bacgroundColor: bgcolor}}><h1>Logout</h1><p>{errmsg}</p></div>);
}

export default Logout;
