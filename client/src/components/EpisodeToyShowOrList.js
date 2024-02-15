import React, { useEffect, useState, useRef } from "react";
import { Switch, Route, Link, useParams } from "react-router-dom";

function letMustBeDefinedAndNotNull(val, vnm="varnm")
{
    let varnm = "";
    if (vnm === undefined || vnm === null || vnm.length < 1) varnm = "varnm";
    else varnm = "" + vnm;
    if (val === undefined || val === null)
    {
        throw new Error("" + varnm + " must be a defined variable!");
    }
}

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

function isNumberOrInteger(val, useint=false, vnm="numvarnm")
{
    letMustBeBoolean(useint, "useint");
    let varnm = "";
    if (vnm === undefined || vnm === null || vnm.length < 1) varnm = "numvarnm";
    else varnm = "" + vnm;
    if (val === undefined || val === null) return false;
    else
    {
        if (isNaN(val)) return false;
        else
        {
            try
            {
                let num = Number(val);
                if (useint)
                {
                    let pinum = parseInt(val);
                    if (num == pinum) return true;
                    else return false;
                }
                else return true;
            }
            catch(ex)
            {
                return false;
            }
        }
    }
}
function isInteger(val, vnm="numvarnm")
{
    return isNumberOrInteger(val, true, vnm);
}
function isNumber(val, vnm)
{
    return isNumberOrInteger(val, false, vnm);
}

function EpisodeToyShowOrList({uselist, typenm="", useinlist=false, epobj=null}) {
    const params = useParams();
    console.log(params);

    letMustBeDefinedAndNotNull(typenm, "typenm");

    if (typenm === "Episode" || typenm === "Toy" || typenm === "Show");
    else throw new Error("typenm must be Episode, Toy, or Show, but it was not!");

    let [loaded, setLoaded] = useState(false);
    let [err, setError] = useState(false);
    let [episodes, setEpisodes] = useState([]);
    let [shows, setShows] = useState([]);
    let [toys, setToys] = useState([]);
    let myinitdataepobj = {"description": "description",
        "name": "loading...",
        "season_number": -1,
        "episode_number": -1,
        "showname": "Show Name"
    };
    let myinitdatatoyobj = {"description": "description",
        "name": "loading...",
        "showname": "Show Name",
        "price": -1
    };
    let myinitdatashowobj = {"description": "description",
        "name": "loading...",
        "numseasons": -1,
        "numepsperseason": -1
    };
    let [myshowdataobj, setMyShowDataObj] = useState(myinitdatashowobj);
    let [mytoydataobj, setMyToyDataObj] = useState(myinitdatatoyobj);
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
    console.log("BEFORE USE EFFECT:");
    console.log("uselist = " + uselist);
    console.log("useinlist = " + useinlist);

    function setErrorMessageState(errmsg)
    {
        if (typenm === "Episode")
        {
            let mynwepobj = {...myepdataobj};
            mynwepobj["description"] = errmsg;
            setMyEpDataObj(mynwepobj);
        }
        else if (typenm === "Toy")
        {
            let mynwepobj = {...mytoydataobj};
            mynwepobj["description"] = errmsg;
            setMyToyDataObj(mynwepobj);
        }
        else if (typenm === "Show")
        {
            let mynwepobj = {...myshowdataobj};
            mynwepobj["description"] = errmsg;
            setMyShowDataObj(mynwepobj);
        }
        else
        {
            throw new Error("typenm must be Episode, Toy, or Show, " +
                "but it was not!");
        }
    }

    function genAndSetNewDataStateObject(olddataobj)
    {
        if (typenm === "Episode")
        {
            let mynwepobj = {"name": olddataobj.name,
                "season_number": olddataobj.season_number,
                "episode_number": olddataobj.episode_number,
                "description": olddataobj.description,
                "showname": olddataobj.show.name
            };
            setMyEpDataObj(mynwepobj);
        }
        else if (typenm === "Toy")
        {
            let mynwtoyobj = {"description": olddataobj.description,
                "name": olddataobj.name,
                "showname": olddataobj.show.name,
                "price": olddataobj.price
            };
            setMyToyDataObj(mynwtoyobj);
        }
        else if (typenm === "Show")
        {
            let mynwshowobj = {"description": olddataobj.description,
                "name": olddataobj.name
            };
            setMyShowDataObj(mynwshowobj);
        }
        else throw new Error("typenm must be Episode, Toy, or Show, but it was not!");
    }

    function genAndSetErrorMessage(resobj, num)
    {
        console.log("" + num + "did not get the json successfully!");
        console.log(resobj);

        let errmsg = "a " + resobj.status + " error occured check the console " +
        "for more details!<br /><br />URL: " + resobj.url + " NOT FOUND!" +
        "<br /><br />Probably did not provide an <b><u>integer id</u>" +
        "</b> when requested!";
        setErrorMessageState(errmsg);
    }

    function getBGColorToBeUsed()
    {
        let mybgcolor = "";
        if (err) mybgcolor = "red";
        else
        {
            if (typenm === "Episode") mybgcolor = "cyan";
            else if (typenm === "Toy") mybgcolor = "orange";
            else if (typenm === "Show") mybgcolor = "yellow";
            else throw new Error("typenm must be Episode, Toy, or Show, but it was not!");
        }
        return mybgcolor;
    }

    useEffect(() => {
        //uselist is true: fetch the data
        //uselist is false:
            //useinlist is true: pull and set state data from included ep object
            //useinlist is false: fetch the data

        let getdata = (uselist || !useinlist);
        console.log("INSIDE USE EFFECT:");
        console.log("typenm = " + typenm);
        console.log("getdata = " + getdata);

        if (getdata)
        {
            let onlyshowsurl = "/shows";
            let onlytoysurl = "/toys";
            let baseurlnoeps = "/shows/" + params.showid;
            let baseurl = "" + baseurlnoeps;
            if (typenm === "Episode") baseurl += "/episodes";
            else if (typenm === "Toy")
            {
                if (isInteger(params.showid, "params.showid")) baseurl += "/toys";
                else baseurl = "" + onlytoysurl;
            }
            else if (typenm === "Show") baseurl = "" + onlyshowsurl;
            else throw new Error("typenm must be Episode, Toy, or Show, but it was not!");
            console.log("baseurl = " + baseurl);

            let murl = "";
            if (uselist) murl = "" + baseurl;
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
                        genAndSetErrorMessage(res, 1);
                        setError(true);
                    }
                    return res;
                }
            }).then((data) => {
                console.log(data);
                if (data === undefined || data === null)
                {
                    if (typenm === "Episode") setEpisodes([]);
                    else if (typenm === "Toy") setToys([]);
                    else if (typenm === "Show") setShows([]);
                    else throw new Error("typenm must be Episode, Toy, or Show, but it was not!");
                }
                else
                {
                    let dkys = Object.keys(data);
                    console.log(dkys);
                    for(let n = 0; n < dkys.length; n++)
                    {
                        if (dkys[n] === "error")
                        {
                            setErrorMessageState(data["error"]);
                            setError(true);
                            return;
                        }
                    }
                    if (uselist)
                    {
                        if (typenm === "Episode") setEpisodes(data);
                        else if (typenm === "Toy") setToys(data);
                        else if (typenm === "Show") setShows(data);
                        else
                        {
                            throw new Error("typenm must be Episode, Toy, or Show, " +
                                "but it was not!");
                        }
                    }
                    else genAndSetNewDataStateObject(data);
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
                    genAndSetErrorMessage(mres.current, 2);
                    setError(true);
                }
            });
        }
        else
        {
            genAndSetNewDataStateObject(epobj);
            setLoaded(true);
        }
    }, []);
    console.log("AFTER USE EFFECT:");
    console.log("toys = ", toys);
    console.log("shows = ", shows);
    console.log("episodes = ", episodes);
    console.log("loaded = " + loaded);
    console.log("uselist = " + uselist);
    console.log("useinlist = " + useinlist);
    console.log("err = " + err);
    console.log("mytoydataobj = ", mytoydataobj);
    console.log("myshowdataobj = ", myshowdataobj);
    console.log("myepdataobj = ", myepdataobj);
    

    function createMarkUp()
    {
        return {__html: "" + myepdataobj.description};
    }

    let myeps = null;
    let mybgcolor = getBGColorToBeUsed();
    if (uselist)
    {
        if (err)
        {
            myeps = [<tr key={"swid" + params.showid + "errorep"} className="border">
            <td className="redbgclrborder">{myinitdataepobj.name}</td>
            <td className="redbgclrtxtcntrborder">{myinitdataepobj.season_number}</td>
            <td className="redbgclrtxtcntrborder">{myinitdataepobj.episode_number}</td>
            <td className="redbgclrborder">Watch Link</td>
            <td className="redbgclrborder" dangerouslySetInnerHTML={createMarkUp()}></td></tr>];
        }
        else
        {
            let mylist = null;
            if (typenm === "Episode") mylist = episodes;
            else if (typenm === "Toy") mylist = toys;
            else if (typenm === "Show") mylist = shows;
            else throw new Error("typenm must be Episode, Toy, or Show, but it was not!");
            
            myeps = mylist.map((ep) => {
                return (<EpisodeToyShowOrList key={"swid" + params.showid + "epid" + ep.id}
                typenm={typenm} uselist={false} useinlist={true} epobj={ep} />);
            });
        }

        return (<div style={{backgroundColor: mybgcolor}}>
            <h1>{typenm}s For Show: {myepdataobj.showname}</h1>
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
                {err ? (<td dangerouslySetInnerHTML={createMarkUp()}></td>) :
                <td className="border">{myepdataobj.description}</td>}
            </tr>);// className="redbgclrborder"
        }
        else
        {
            return (<div id={"swid" + params.showid + "epid" + params.id}
                style={{backgroundColor: mybgcolor}}>
                <h1>{typenm} For Show: {myepdataobj.showname}</h1>
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

export default EpisodeToyShowOrList;
