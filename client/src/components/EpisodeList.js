import React, { useEffect, useState, useRef } from "react";
import { Switch, Route, Link, useParams } from "react-router-dom";
import Episode from "./Episode";

function EpisodeList() {
   const params = useParams();
   console.log(params);
   
   let [loaded, setLoaded] = useState(false);
   let [episodes, setEpisodes] = useState([]);
   let [description, setDescription] = useState("description");
   let [err, setError] = useState(false);
   let mres = useRef(null);
   
   useEffect(() => {
    fetch("/shows/" + params.showid + "/episodes").
    then((res) => {
        console.log(res);
        let myobj = {};
        myobj["url"] = "" + res.url;
        myobj["status"] = res.status;
        console.log(myobj);
        mres.current = {...myobj};
        console.log("AFTER SET STATE CALLED!");
        if (res.status === 200 || (200 < res.status && res.status < 400)) return res.json();
        else
        {
            console.log("BEFORE TRY!");
            try
            {
                let mjsn = res.json();
                return mjsn;
            }
            catch(ex)
            {
                console.log("1did not get the json successfully!");
                let errmsg = "a " + res.status + " error occured check the console for more details!" +
                    "<br /><br />URL: " + res.url + " NOT FOUND!<br /><br />Probably did " +
                    "not provide an <b><u>integer id</u></b> when requested!";
                setDescription(errmsg);
                setError(true);
            }
            return res;
        }
    })
    .then((data) => {
        console.log(data);
        if (data === undefined || data === null) setEpisodes([]);
        else
        {
            let dkys = Object.keys(data);
            console.log(dkys);
            for(let n = 0; n < dkys.length; n++)
            {
                if (dkys[n] === "error")
                {
                    setDescription(data["error"]);
                    setError(true);
                    return;
                }
            }
            setEpisodes(data);
        }
        setLoaded(true);
        //return data;
    }).catch((ex) => {
        console.error("there was an error loading the episode data!");
        console.error(ex);
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
   }, []);
   console.log("episodes = ", episodes);
   console.log("loaded = " + loaded);
   
   function createMarkUp()
   {
    return {__html: "" + description};
   }

   let myeps = null;
   if (err)
   {
    myeps = [<tr key={"swid" + params.showid +"errorep"} className="border">
        <td className="redbgclrborder">loading...</td>
        <td className="redbgclrtxtcntrborder">-1</td>
        <td className="redbgclrtxtcntrborder">-1</td>
        <td className="redbgclrborder">Watch Link</td>
        <td className="redbgclrborder" dangerouslySetInnerHTML={createMarkUp()}></td></tr>];
   }
   else
   {
    myeps = episodes.map((ep) => {
        return (<Episode key={"swid" + params.showid + "epid" + ep.id}
        useinlist={true} epobj={ep} />);
       });
   }

   return (<table className="border">
    <thead><tr className="border">
        <td className="namecol">Name</td>
        <td className="seasnum">Season #</td>
        <td className="epnum">Episode #</td>
        <td className="border">Watch Link</td>
        <td className="border">Description</td>
    </tr></thead>
    <tbody>{myeps}</tbody>
   </table>);
}

export default EpisodeList;
