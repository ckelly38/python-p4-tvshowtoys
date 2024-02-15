import React, { useEffect, useState, useRef } from "react";
import { Switch, Route, Link, useParams } from "react-router-dom";

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
    let [err, setError] = useState(false);
    let [episodes, setEpisodes] = useState([]);
    let myinitdataepobj = {"description": "description",
        "name": "loading...",
        "season_number": -1,
        "episode_number": -1,
        "showname": "Show Name"
    };
    let [myepdataobj, setMyEpDataObj] = useState(myinitdataepobj);
    let mres = useRef(null);

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
            let baseurlnoeps = "/shows/" + params.showid;
            let baseurl = baseurlnoeps + "/episodes";
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
                        let mynwepobj = {...myepdataobj};
                        mynwepobj["description"] = errmsg;
                        setMyEpDataObj(mynwepobj);
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
                            let mynwepobj = {...myepdataobj};
                            mynwepobj["description"] = data["error"];
                            setMyEpDataObj(mynwepobj);
                            setError(true);
                            return;
                        }
                    }
                    if (uselist) setEpisodes(data);
                    else
                    {
                        let mynwepobj = {"name": data.name,
                            "season_number": data.season_number,
                            "episode_number": data.episode_number,
                            "description": data.description,
                            "showname": data.show.name
                        };
                        setMyEpDataObj(mynwepobj);
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
                    let mynwepobj = {...myepdataobj};
                    mynwepobj["description"] = errmsg;
                    setMyEpDataObj(mynwepobj);
                    setError(true);
                }
            });
        }
        else
        {
            let mynwepobj = {"name": epobj.name,
                "season_number": epobj.season_number,
                "episode_number": epobj.episode_number,
                "description": epobj.description,
                "showname": epobj.show.name
            };
            setMyEpDataObj(mynwepobj);
            setLoaded(true);
        }
    }, []);
    console.log("episodes = ", episodes);
    console.log("loaded = " + loaded);
    console.log("uselist = " + uselist);
    console.log("useinlist = " + useinlist);
    console.log("err = " + err);
    console.log("myepdataobj = ", myepdataobj);

    function createMarkUp()
    {
        return {__html: "" + myepdataobj.description};
    }

    let myeps = null;
    if (uselist)
    {
        if (err)
        {
            myeps = [<tr key={"swid" + params.showid +"errorep"} className="border">
            <td className="redbgclrborder">{myinitdataepobj.name}</td>
            <td className="redbgclrtxtcntrborder">{myinitdataepobj.season_number}</td>
            <td className="redbgclrtxtcntrborder">{myinitdataepobj.episode_number}</td>
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

        let mybgcolor = (err ? "red" : "cyan");
        return (<div style={{backgroundColor: mybgcolor}}>
            <h1>Episodes For Show: {myepdataobj.showname}</h1>
            <table className="border">
                <thead><tr className="border">
                    <td className="namecol">Name</td>
                    <td className="seasnum">Season #</td>
                    <td className="epnum">Episode #</td>
                    <td className="border">Watch Link</td>
                    <td className="border">Description</td>
                </tr></thead>
                <tbody>{myeps}</tbody>
            </table>
        </div>);
    }
    else
    {
        let mybgcolor = (err ? "red" : "cyan");
        if (useinlist)
        {
            return (<tr id={"swid" + params.showid + "epid" + epobj.id} className="border" 
                style={{backgroundColor: mybgcolor}}>
                <td className="namecol">{myepdataobj.name}</td>
                <td className="seasnumalign">{myepdataobj.season_number}</td>
                <td className="epnumalign">{myepdataobj.episode_number}</td>
                <td className="border">
                <Link to={"/shows/" + params.showid + "/episodes/" + epobj.id}>Watch It Now</Link>
                </td>
                {err ? (<td
                dangerouslySetInnerHTML={createMarkUp()}></td>) :
                <td className="border">{myepdataobj.description}</td>}
            </tr>);// className="redbgclrborder"
        }
        else
        {
            return (<div id={"swid" + params.showid + "epid" + params.id}
                style={{backgroundColor: mybgcolor}}>
                <h1>Episode For Show: {myepdataobj.showname}</h1>
                <h3>Episode Name: {myepdataobj.name}</h3>
                <div>Season #: {myepdataobj.season_number}</div>
                <div>Episode #: {myepdataobj.episode_number}</div>
                <h4>Description: </h4>
                {err ? (<p style={{backgroundColor: "red"}}
                dangerouslySetInnerHTML={createMarkUp()}></p>) :
                <p>{myepdataobj.description}</p>}
            </div>);
        }
    }
}

export default EpisodeOrList;
