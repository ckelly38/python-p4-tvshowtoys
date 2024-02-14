import React, { useEffect, useState, useRef } from "react";
import { Switch, Route, Link, useParams } from "react-router-dom";

function Episode({useinlist=false, epobj=null}) {
   const params = useParams();
   console.log(params);
   
   let [loaded, setLoaded] = useState(false);
   let [description, setDescription] = useState("description");
   let [name, setEpisodeName] = useState("loading...");
   let [season_number, setSeasonNum] = useState(-1);
   let [episode_number, setEpisodeNum] = useState(-1);
   let [err, setError] = useState(false);
   let mres = useRef(null);

   if (useinlist === undefined || useinlist === null)
   {
    throw new Error("useinlist must be a defined boolean variable!");
   }
   else
   {
    if (useinlist === true || useinlist === false);
    else throw new Error("useinlist must be a defined boolean variable!");
   }
   
   if (useinlist)
   {
    if (epobj === undefined || epobj === null)
    {
        throw new Error("epobj must be a defined episode object, not null!");
    }
   }
   
   useEffect(() => {
    if (useinlist)
    {
        setEpisodeName(epobj.name);
        setSeasonNum(epobj.season_number);
        setEpisodeNum(epobj.episode_number);
        setDescription(epobj.description);
        setLoaded(true);
    }
    else
    {
        fetch("/shows/" + params.showid + "/episodes/" + params.id).then((res) => {
            console.log(res);
            let myobj = {};
            myobj["url"] = "" + res.url;
            myobj["status"] = res.status;
            console.log(myobj);
            mres.current = {...myobj};
            if (res.status === 200 || res.status < 300) return res.json();
            else
            {
                try
                {
                    let mjsn = res.json();
                    return mjsn;
                }
                catch (ex)
                {
                    let errmsg = "a 404 error occured check the console for more details!" +
                        "<br /><br />URL: " + res.url + " NOT FOUND!<br /><br />Probably did " +
                        "not provide an <b><u>integer id</u></b> when requested!";
                    setDescription(errmsg);
                    setError(true);
                }
            }
            return res;
        }).then((data) => {
            console.log(data);
            if (data === undefined || data === null);
            else
            {
                let dkys = Object.keys(data);
                for(let n = 0; n < dkys.length; n++)
                {
                    if (dkys[n] === "error")
                    {
                        setDescription(data["error"]);
                        setError(true);
                        return;
                    }
                }
            }
            setEpisodeName(data.name);
            setSeasonNum(data.season_number);
            setEpisodeNum(data.episode_number);
            setDescription(data.description);
            setLoaded(true);
        }).catch((ex) => {
            console.error("there was an error loading the episode data!");
            console.error(ex);
            //setDescription("an error occured check the console for more details: " + ex);
            console.log(err);
            if (err);
            else
            {
                console.log("2did not get the json successfully!");
                console.log(mres.current);
                let errmsg = "a " + mres.current.status + " error occured check the console for more details!" +
                    "<br /><br />URL: " + mres.current.url + " NOT FOUND!<br /><br />Probably did " +
                    "not provide an <b><u>integer id</u></b> when requested!";
                setDescription(errmsg);
                setError(true);
            }
        });
    }
   }, []);
   
   function createMarkUp()
   {
    return {__html: "" + description};
   }

   if (useinlist)
   {
    return (<tr id={"swid" + params.showid + "epid" + epobj.id} className="border">
        <td className="namecol">{name}</td>
        <td className="seasnumalign">{season_number}</td>
        <td className="epnumalign">{episode_number}</td>
        <td className="border">
            <Link to={"/shows/" + params.showid + "/episodes/" + epobj.id}>Watch It Now</Link>
        </td>
        {err ? (<td className="redbgclrborder" dangerouslySetInnerHTML={createMarkUp()}></td>) :
        <td className="border">{description}</td>}
    </tr>);
   }
   else
   {
    return (<div id={"swid" + params.showid + "epid" + params.id}>
        <h3>Episode Name: {name}</h3>
        <div>Season #: {season_number}</div>
        <div>Episode #: {episode_number}</div>
        <h4>Description: </h4>
        {err ? (<p classname="redbgclrborder" dangerouslySetInnerHTML={createMarkUp()}></p>) :
        <p>{description}</p>}
    </div>);
   }
}

export default Episode;
