import React, { useEffect, useState, useRef } from "react";
import { Switch, Route, Link, useParams } from "react-router-dom";
import Episode from "./Episode";

function letMustBeBoolean(val, vnm="boolvarnm")
{
    let varnm = "";
    if (vnm === undefined || vnm === null || vnm.length < 1) varnm = "boolvarnm";
    else varnm = "" + vnm;
    if (val === undefined || val === null)
    {
        throw new Error("" + varnm + " must be a defined boolean variable!");
    }
    else
    {
        if (val === true || val === false);
        else throw new Error("" + varnm + " must be a defined boolean variable!");
    }
}

function EpisodeOrList({uselist, useinlist=false, epobj=null}) {
    const params = useParams();
    console.log(params);

    let [loaded, setLoaded] = useState(false);
    let [episodes, setEpisodes] = useState([]);
    let [description, setDescription] = useState("description");
    let [err, setError] = useState(false);
    let mres = useRef(null);
    let [name, setEpisodeName] = useState("loading...");
    let [season_number, setSeasonNum] = useState(-1);
    let [episode_number, setEpisodeNum] = useState(-1);

    letMustBeBoolean(useinlist, "useinlist");
    letMustBeBoolean(uselist, "uselist");

    if (useinlist)
    {
        if (epobj === undefined || epobj === null)
        {
            throw new Error("epobj must be a defined episode object, not null!");
        }
    }

    useEffect(() => {
        //uselist is true: fetch the data
        //uselist is false:
            //useinlist is true: pull and set state data from included ep object
            //useinlist is false: fetch the data

        let getdata = (uselist || !useinlist);
        console.log("getdata = " + getdata);

        if (getdata)
        {
            let baseurl = "/shows/" + params.showid + "/episodes";
            let murl = "";
            if (uselist) murl += baseurl;
            else murl = baseurl + "/" + params.id;
            console.log("murl = " + murl);

            fetch(murl).then((res) => {
                console.log(res);
                let myobj = {};
                myobj["url"] = "" + res.url;
                myobj["status"] = res.status;
                console.log(myobj);
                mres.current = {...myobj};
                console.log("AFTER SET STATE CALLED!");
                if (res.status === 200 || (200 < res.status && res.status < 400))
                {
                    return res.json();
                }
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
                        let errmsg = "a " + res.status + " error occured check the console " +
                        "for more details!<br /><br />URL: " + res.url + " NOT FOUND!" +
                        "<br /><br />Probably did not provide an <b><u>integer id</u>" +
                        "</b> when requested!";
                        setDescription(errmsg);
                        setError(true);
                    }
                    return res;
                }
            }).then((data) => {
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
                    if (uselist) setEpisodes(data);
                    else
                    {
                        setEpisodeName(data.name);
                        setSeasonNum(data.season_number);
                        setEpisodeNum(data.episode_number);
                        setDescription(data.description);
                    }
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
                    let errmsg = "a " + mres.current.status + " error occured check the " +
                    "console for more details!<br /><br />URL: " + mres.current.url +
                    " NOT FOUND!<br /><br />Probably did not provide an <b><u>integer " +
                    "id</u></b> when requested!";
                    setDescription(errmsg);
                    setError(true);
                }
            });
        }
        else
        {
            setEpisodeName(epobj.name);
            setSeasonNum(epobj.season_number);
            setEpisodeNum(epobj.episode_number);
            setDescription(epobj.description);
            setLoaded(true);
        }
    }, []);
    console.log("episodes = ", episodes);
    console.log("loaded = " + loaded);
    console.log("uselist = " + uselist);
    console.log("useinlist = " + useinlist);
    console.log("err = " + err);

    function createMarkUp()
    {
        return {__html: "" + description};
    }

    let myeps = null;
    if (uselist)
    {
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
                return (<EpisodeOrList key={"swid" + params.showid + "epid" + ep.id}
                uselist={false} useinlist={true} epobj={ep} />);
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
    else
    {
        if (useinlist)
        {
            return (<tr id={"swid" + params.showid + "epid" + epobj.id} className="border">
            <td className="namecol">{name}</td>
            <td className="seasnumalign">{season_number}</td>
            <td className="epnumalign">{episode_number}</td>
            <td className="border">
            <Link to={"/shows/" + params.showid + "/episodes/" + epobj.id}>Watch It Now</Link>
            </td>
            {err ? (<td className="redbgclrborder"
            dangerouslySetInnerHTML={createMarkUp()}></td>) :
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
            {err ? (<p classname="redbgclrborder"
            dangerouslySetInnerHTML={createMarkUp()}></p>) :
            <p>{description}</p>}
            </div>);
        }
    }
}

export default EpisodeOrList;
