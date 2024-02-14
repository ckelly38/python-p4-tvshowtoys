import React, { useEffect, useState } from "react";
import { Switch, Route, Link, useParams } from "react-router-dom";

function Episode() {
   const params = useParams();
   console.log(params);
   
   let [loaded, setLoaded] = useState(false);
   let [description, setDescription] = useState("description");
   let [name, setEpisodeName] = useState("loading...");
   let [season_number, setSeasonNum] = useState(-1);
   let [episode_number, setEpisodeNum] = useState(-1);
   let [err, setError] = useState(false);
   
   useEffect(() => {
    fetch("/shows/" + params.showid + "/episodes/" + params.id).
    then((res) => {
        console.log(res);
        if (res.status == 404)
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
    }).
    then((data) => {
        console.log(data);
        if (data == undefined || data == null);
        else
        {
            let dkys = Object.keys(data);
            for(let n = 0; n < dkys.length; n++)
            {
                if (dkys[n] == "error")
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
    }).catch((err) => {
        console.error("there was an error loading the episode data!");
        console.error(err);
        //setDescription("an error occured check the console for more details: " + err);
    });
   }, []);
   
   function createMarkUp()
   {
    return {__html: "" + description};
   }

   return (<div id={"swid" + params.showid + "epid" + params.id}>
    <h3>Episode Name: {name}</h3>
    <div>Season #: {season_number}</div>
    <div>Episode #: {episode_number}</div>
    <h4>Description: </h4>
    {err ? (<p dangerouslySetInnerHTML={createMarkUp()}></p>) : <p>{description}</p>}
   </div>);
}

export default Episode;
