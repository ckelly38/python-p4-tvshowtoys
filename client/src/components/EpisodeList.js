import React, { useEffect, useState } from "react";
import { Switch, Route, Link, useParams } from "react-router-dom";
import Episode from "./Episode";

function EpisodeList() {
   const params = useParams();
   console.log(params);
   
   let [loaded, setLoaded] = useState(false);
   let [episodes, setEpisodes] = useState([]);
   let [description, setDescription] = useState("description");
   let [err, setError] = useState(false);
   
   useEffect(() => {
    fetch("/shows/" + params.showid + "/episodes").
    then((res) => {
        console.log(res);
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
                let errmsg = "a " + res.status + " error occured check the console for more details!" +
                    "<br /><br />URL: " + res.url + " NOT FOUND!<br /><br />Probably did " +
                    "not provide an <b><u>integer id</u></b> when requested!";
                setDescription(errmsg);
                setError(true);
            }
            return res;
        }
    }).
    then((data) => {
        console.log(data);
        if (data === undefined || data === null) setEpisodes([]);
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
            setEpisodes(data);
        }
        setLoaded(true);
    }).catch((err) => {
        console.error("there was an error loading the episode data!");
        console.error(err);
        //setDescription("an error occured check the console for more details: " + err);
    });
   }, []);
   console.log("episodes = ", episodes);
   
   function createMarkUp()
   {
    return {__html: "" + description};
   }

   let myeps = null;
   if (err)
   {
    myeps = [<tr key={"swid" + params.showid +"errorep"} className="border">
        <td className="namecol">loading...</td>
        <td className="seasnumalign">-1</td>
        <td className="epnumalign">-1</td>
        <td className="border">Watch Link</td>
        <td className="border" dangerouslySetInnerHTML={createMarkUp()}></td></tr>];
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
