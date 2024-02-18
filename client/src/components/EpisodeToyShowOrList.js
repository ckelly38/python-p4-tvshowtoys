import React, { useEffect, useState, useRef } from "react";
import { Switch, Route, Link, useParams, useHistory } from "react-router-dom";

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

function isNumberOrInteger(val, useint=false)//, vnm="numvarnm"
{
    letMustBeBoolean(useint, "useint");
    
    //let varnm = "";
    //if (vnm === undefined || vnm === null || vnm.length < 1) varnm = "numvarnm";
    //else varnm = "" + vnm;
    if (val === undefined || val === null) return false;
    else
    {
        if (isNaN(val)) return false;
        else
        {
            try
            {
                let num = Number(val);
                if (useint) return (num == parseInt(val));
                else return true;
            }
            catch(ex)
            {
                return false;
            }
        }
    }
}
function isInteger(val)//, vnm="numvarnm"
{
    return isNumberOrInteger(val, true);//, vnm
}
function isNumber(val)//, vnm="numvarnm"
{
    return isNumberOrInteger(val, false);//, vnm
}



function EpisodeToyShowOrList(props){
    const params = useParams();
    //let history = useHistory();

    let [cloc, setCLoc] = useState(null);

    console.log("BEGIN COMPONENT WORK HERE:");
    console.log("URL params = ", params);
    //console.log("history = ", history);
    console.log("props.epobj = ", props.epobj);
    console.log("props.location = ", props.location);
    console.log("cloc = ", cloc);

    letMustBeDefinedAndNotNull(props.typenm, "props.typenm");

    if (props.typenm === "Episode" || props.typenm === "Toy" || props.typenm === "Show");
    else throw new Error("typenm must be Episode, Toy, or Show, but it was not!");

    let [loaded, setLoaded] = useState(false);
    let [err, setError] = useState(false);
    let [episodes, setEpisodes] = useState([]);
    let [shows, setShows] = useState([]);
    let [toys, setToys] = useState([]);
    let [showname, setShowName] = useState("Show Name");
    //let [currentURL, setMyCurrentURL] = useState(mcurl);
    let myinitdataepobj = {"description": "description",
        "name": "loading...",
        "season_number": -1,
        "episode_number": -1,
        "showname": "Show Name",
        "showid": -1
    };
    let myinitdatatoyobj = {"description": "description",
        "name": "loading...",
        "showname": "Show Name",
        "price": -1,
        "showid": -1
    };
    let myinitdatashowobj = {"description": "description",
        "name": "loading...",
        "numseasons": -1,
        "numepisodesperseason": -1,
        "totalepisodes": -1,
        "showid": -1
    };
    let [myshowdataobj, setMyShowDataObj] = useState(myinitdatashowobj);
    let [mytoydataobj, setMyToyDataObj] = useState(myinitdatatoyobj);
    let [myepdataobj, setMyEpDataObj] = useState(myinitdataepobj);
    let mres = useRef(null);
    //let snmref = useRef(null);

    letMustBeBoolean(props.useinlist, "props.useinlist");
    letMustBeBoolean(props.uselist, "props.uselist");

    if (props.useinlist)
    {
        if (props.epobj === undefined || props.epobj === null)
        {
            throw new Error("epobj must be a defined episode object, not null!");
        }
    }
    console.log("BEFORE USE EFFECT:");
    console.log("props.uselist = " + props.uselist);
    console.log("props.useinlist = " + props.useinlist);
    //console.log("mcurl = ", mcurl);
    
    function setErrorMessageState(errmsg)
    {
        if (props.typenm === "Episode")
        {
            let mynwepobj = {...myepdataobj};
            mynwepobj["description"] = errmsg;
            setMyEpDataObj(mynwepobj);
        }
        else if (props.typenm === "Toy")
        {
            let mynwepobj = {...mytoydataobj};
            mynwepobj["description"] = errmsg;
            setMyToyDataObj(mynwepobj);
        }
        else if (props.typenm === "Show")
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

    //if dataobj is null or undefined it returns a default object
    //instead of null or throwing an error
    function getAndGenSeasonsInfoObject(dataobj)
    {
        console.log("dataobj = ", dataobj);
        if (dataobj === undefined || dataobj === null)
        {
            return {"numseasons": -1,
                "totalepisodes": -1,
                "numepisodesperseason": -1
            };
        }
        //else;//do nothing
        
        let teps = -1;
        if (dataobj.episodes === undefined || dataobj.episodes === null) teps = 0;
        else teps = dataobj.episodes.length;
        console.log("teps = " + teps);
        
        let numseasons = -1;
        if (teps === 0) numseasons = 0;
        else if (teps > 0)
        {
            if (dataobj.episodes === undefined || dataobj.episodes === null)
            {
                throw new Error("the teps was more than zero, but there are no " +
                    "episodes in the object, so it should have been zero!");
            }
            //else;//do nothing

            let mymaxsnum = 0;
            let mymaxsnumi = -1;
            for (let n = 0; n < dataobj.episodes.length; n++)
            {
                let cepsnnum = dataobj.episodes[n].season_number;
                if (mymaxsnumi < 0)
                {
                    mymaxsnum = cepsnnum;
                    mymaxsnumi = n;
                }
                else
                {
                    if (mymaxsnum < cepsnnum)
                    {
                        mymaxsnum = cepsnnum;
                        mymaxsnumi = n;
                    }
                    //else;//do nothing
                }
            }//end of n for loop
            console.log("mymaxsnum = " + mymaxsnum);
            console.log("mymaxsnumi = " + mymaxsnumi);

            if (mymaxsnumi < 0 || mymaxsnum < 1)
            {
                throw new Error("the teps was more than zero, but there were either " +
                    "no eps in the object OR there was no valid season number on any " +
                    "of the episodes. The season number must be greater than zero!");
            }
            else numseasons = mymaxsnum;
        }
        else throw new Error("teps must be a positive or zero integer!");
        console.log("numseasons = " + numseasons);

        let rmndr = (teps % numseasons);
        let numepsperseason = (teps / numseasons);
        console.log("numepsperseason = " + numepsperseason);
        console.log("rmndr = " + rmndr);

        let fnumepsperseason = -1;
        if (rmndr === 0) fnumepsperseason = numepsperseason;
        else fnumepsperseason = Math.round(numepsperseason);
        //round up if it is bigger, round down if smaller
        console.log("fnumepsperseason = " + fnumepsperseason);
        
        let mysnsobj = {"numseasons": numseasons,
            "totalepisodes": teps,
            "numepisodesperseason": fnumepsperseason
        };
        console.log("mysnsobj = ", mysnsobj);
        
        return mysnsobj;
    }

    function genAndSetNewDataStateObject(olddataobj, seasoninfoobj = null)
    {
        if (props.typenm === "Episode")
        {
            let mynwepobj = {"name": olddataobj.name,
                "season_number": olddataobj.season_number,
                "episode_number": olddataobj.episode_number,
                "description": olddataobj.description,
                "showname": olddataobj.show.name,
                "showid": olddataobj.show.id
            };
            setMyEpDataObj(mynwepobj);
            console.log("SETTING NEW VALUE FOR SHOWNAME TO: " + olddataobj.show.name);
            setShowName(olddataobj.show.name);
        }
        else if (props.typenm === "Toy")
        {
            let mynwtoyobj = {"description": olddataobj.description,
                "name": olddataobj.name,
                "showname": olddataobj.show.name,
                "price": olddataobj.price,
                "showid": olddataobj.show.id
            };
            setMyToyDataObj(mynwtoyobj);
            console.log("SETTING NEW VALUE FOR SHOWNAME TO: " + olddataobj.show.name);
            setShowName(olddataobj.show.name);
        }
        else if (props.typenm === "Show")
        {
            let msnobj = null;
            if (seasoninfoobj === undefined || seasoninfoobj === null)
            {
                msnobj = getAndGenSeasonsInfoObject(olddataobj);
            }
            else msnobj = seasoninfoobj;

            let mynwshowobj = {"description": olddataobj.description,
                "name": olddataobj.name,
                "numseasons": msnobj.numseasons,
                "numepisodesperseason": msnobj.numepisodesperseason,
                "totalepisodes": msnobj.totalepisodes,
                "showid": olddataobj.id
            };
            setMyShowDataObj(mynwshowobj);
            //console.log(olddataobj);
            //console.log("SETTING NEW VALUE FOR SHOWNAME TO: " + olddataobj.name);
            //setShowName(olddataobj.name);
        }
        else throw new Error("typenm must be Episode, Toy, or Show, but it was not!");
        setLoaded(true);
    }

    function genAndSetErrorMessage(resobj, num)
    {
        console.log("" + num + "did not get the json successfully!");
        console.log(resobj);

        let fivehundredrangemsg = "the server crashed and is not started OR it encountered " +
            "an error and needs to be restarted!";
        
            let fourhundredrangemsg = "did not provide an <b><u>integer id</u></b> when requested!";

        let errmsg = "a " + resobj.status + " error occured check the console " +
        "for more details!<br /><br />URL: " + resobj.url + " NOT FOUND!" +
        "<br /><br />Probably ";

        if (500 <= resobj.status) errmsg += fivehundredrangemsg;
        else errmsg += fourhundredrangemsg;

        setErrorMessageState(errmsg);
    }

    function getBGColorToBeUsed()
    {
        let mybgcolor = "";
        if (err) mybgcolor = "red";
        else
        {
            if (props.typenm === "Episode") mybgcolor = "cyan";
            else if (props.typenm === "Toy") mybgcolor = "orange";
            else if (props.typenm === "Show") mybgcolor = "yellow";
            else throw new Error("typenm must be Episode, Toy, or Show, but it was not!");
        }
        return mybgcolor;
    }

    useEffect(() => {
        //uselist is true: fetch the data
        //uselist is false:
            //useinlist is true: pull and set state data from included ep object
            //useinlist is false: fetch the data

        let getdata = (props.uselist || !props.useinlist);
        console.log("INSIDE USE EFFECT:");
        console.log("props.typenm = " + props.typenm);
        console.log("getdata = " + getdata);

        if (getdata)
        {
            let onlyshowsurl = "/shows";
            let onlytoysurl = "/toys";
            let baseurlnoeps = "/shows/" + params.showid;
            let baseurl = "" + baseurlnoeps;
            if (props.typenm === "Episode") baseurl += "/episodes";
            else if (props.typenm === "Toy")
            {
                if (isInteger(params.showid)) baseurl += "/toys";//, "params.showid"
                else if (params.showid === undefined || params.showid === null)
                {
                    baseurl = "" + onlytoysurl;
                }
                else  baseurl += "/toys";
            }
            else if (props.typenm === "Show") baseurl = "" + onlyshowsurl;
            else throw new Error("typenm must be Episode, Toy, or Show, but it was not!");
            console.log("baseurl = " + baseurl);

            let murl = "";
            if (props.uselist) murl = "" + baseurl;
            else
            {
                if (props.typenm === "Show") murl = baseurl + "/" + params.showid;
                else murl = baseurl + "/" + params.id;
            }
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
                    if (props.typenm === "Episode") setEpisodes([]);
                    else if (props.typenm === "Toy") setToys([]);
                    else if (props.typenm === "Show") setShows([]);
                    else throw new Error("typenm must be Episode, Toy, or Show, but it was not!");
                }
                else
                {
                    let dkys = Object.keys(data);
                    console.log(dkys);
                    for (let n = 0; n < dkys.length; n++)
                    {
                        if (dkys[n] === "error")
                        {
                            setErrorMessageState(data["error"]);
                            setError(true);
                            return;
                        }
                    }
                    if (props.uselist)
                    {
                        if (props.typenm === "Episode")
                        {
                            setShowName(data[0].show.name);
                            setEpisodes(data);
                        }
                        else if (props.typenm === "Toy")
                        {
                            setShowName(data[0].show.name);
                            setToys(data);
                        }
                        else if (props.typenm === "Show") setShows(data);
                        else
                        {
                            throw new Error("typenm must be Episode, Toy, or Show, " +
                                "but it was not!");
                        }
                    }
                    else
                    {
                        if (props.typenm === "Show")
                        {
                            console.log("DATA TYPE IS SHOW!");
                            genAndSetNewDataStateObject(data, getAndGenSeasonsInfoObject(data));
                        }
                        else genAndSetNewDataStateObject(data, null);
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
                    genAndSetErrorMessage(mres.current, 2);
                    setError(true);
                }
            });
        }
        else
        {
            if (props.typenm === "Show")
            {
                console.log("DATA TYPE IS SHOW!");
                genAndSetNewDataStateObject(props.epobj, getAndGenSeasonsInfoObject(props.epobj));
            }
            else genAndSetNewDataStateObject(props.epobj, null);
            setLoaded(true);
        }
    }, [params, cloc, loaded, showname, err, props.epobj, props.useinlist, props.uselist,
    props.typenm]);
    console.log("AFTER USE EFFECT:");
    console.log("toys = ", toys);
    console.log("shows = ", shows);
    console.log("episodes = ", episodes);
    console.log("loaded = " + loaded);
    console.log("props.uselist = " + props.uselist);
    console.log("props.useinlist = " + props.useinlist);
    console.log("err = " + err);
    console.log("mytoydataobj = ", mytoydataobj);
    console.log("myshowdataobj = ", myshowdataobj);
    console.log("myepdataobj = ", myepdataobj);
    console.log("props.location = ", props.location);
    console.log("cloc = ", cloc);
    //console.log("props.smnref = " + props.smnref);
    
    let resetState = false;
    if (cloc === undefined || cloc === null)
    {
        if (props.location === undefined || props.location === null);
        else resetState = true;
    }
    else
    {
        if (props.location === undefined || props.location === null) resetState = true;
        else
        {
            if (props.location.pathname === cloc.pathname);
            else resetState = true;
        }
    }
    console.log("resetState = " + resetState);

    if (resetState)
    {
        console.log("BEGINNNING RESETTING STATE:");
        setLoaded(false);
        setError(false);
        setEpisodes([]);
        setShows([]);
        setToys([]);
        setMyShowDataObj(myinitdatashowobj);
        setMyToyDataObj(myinitdatatoyobj);
        setMyEpDataObj(myinitdataepobj);
        console.log("RESETTING SHOWNAME HERE!");
        setShowName("Show Name");
        mres = null;
        setCLoc(props.location);
        console.log("DONE RESETTING STATE!");
    }
    //else;//do nothing
    console.log("AFTER LOCATION SET!");


    function createMarkUp()
    {
        let mdataobj = null;
        if (props.typenm === "Episode") mdataobj = myepdataobj;
        else if (props.typenm === "Toy") mdataobj = mytoydataobj;
        else if (props.typenm === "Show") mdataobj = myshowdataobj;
        else throw new Error("typenm must be Episode, Toy, or Show, but it was not!");
        
        return {__html: "" + mdataobj.description};
    }

    function getHeadersForType()
    {
        let hlist = null;
        if (props.typenm === "Episode")
        {
            hlist = ["Name", "Season #", "Episode #", "Watch Link", "Description"];
        }
        else if (props.typenm === "Toy") hlist = ["Name", "Show Name", "Price", "Description"];
        else if (props.typenm === "Show")
        {
            hlist = ["Name", "# Of Seasons", "# Of Episodes", "~ Total Episodes/Season",
                "Episodes Link", "Toys Link", "Description"];
        }
        else throw new Error("typenm must be Episode, Toy, or Show, but it was not!");
        return hlist;
    }
    function isHeaderCentered(hstr)
    {
        let centeredheaders = ["Season #", "Episode #", "Price", "# Of Episodes", "# Of Seasons",
            "# Of Episodes", "~ Total Episodes/Season"];
        letMustBeDefinedAndNotNull(hstr, "hstr");
        for (let n = 0; n < centeredheaders.length; n++)
        {
            if (hstr === centeredheaders[n]) return true;
        }
        return false;
    }
    function getAreHeadersForTypeCentered(myhlist = getHeadersForType())
    {
        if (myhlist === undefined || myhlist === null) return null;
        else return myhlist.map((item) => isHeaderCentered(item));
    }

    function genErrorItemOnList()
    {
        let cntrnuma = -1;
        let cntrnumb = -1;
        let itemname = "";
        let kynm = "";
        if (props.typenm === "Episode")
        {
            cntrnuma = myinitdataepobj.season_number;
            cntrnumb = myinitdataepobj.episode_number;
            itemname = myinitdataepobj.name;
            kynm = "swid" + params.showid + "errorep";
        }
        else if (props.typenm === "Show")
        {
            cntrnuma = myinitdatashowobj.numseasons;
            cntrnumb = myinitdatashowobj.totalepisodes;
            itemname = myinitdatashowobj.name;
            if (isInteger(params.showid))//, "params.showid"
            {
                kynm = "swid" + params.showid + "errorsw";
            }
            else kynm = "swiderrorsw";
        }
        else if (props.typenm === "Toy")
        {
            itemname = myinitdatatoyobj.name;
            if (isInteger(params.showid))//, "params.showid"
            {
                kynm = "swid" + params.showid + "errorty";
            }
            else kynm = "swiderrorty";
        }
        else throw new Error("typenm must be Episode, Toy, or Show, but it was not!");

        return (
            <tr key={kynm} className="border">
            <td className="redbgclrborder">{itemname}</td>
            {(props.typenm === "Toy") ?
            <td className="redbgclrborder">{myinitdatatoyobj.showname}</td>: null}
            {(props.typenm === "Toy") ? null :
                <>
                    <td className="redbgclrtxtcntrborder">{cntrnuma}</td>
                    <td className="redbgclrtxtcntrborder">{cntrnumb}</td>
                </>
            }
            {(props.typenm === "Show") ?
            <td className="redbgclrtxtcntrborder">{myinitdatashowobj.numepisodesperseason}</td>:
            null}
            {(props.typenm === "Toy") ?
            <td className="redbgclrtxtcntrborder">{myinitdatatoyobj.price}</td> :
            <td className="redbgclrborder">Watch Link</td>}
            <td className="redbgclrborder" dangerouslySetInnerHTML={createMarkUp()}></td></tr>
        );
    }

    function isStringAOnStringBList(stra, mstrs)
    {
        if (mstrs === undefined || mstrs === null || mstrs.length < 1) return false;
        else
        {
            for (let n = 0; n < mstrs.length; n++)
            {
                if (mstrs[n] === undefined || mstrs[n] === null)
                {
                    if (stra === undefined || stra === null) return true;
                }
            }

            return false;
        }
    }

    function getAcceptedNamesForNumEpisodesPerSeason()
    {
        return ["~ Total Episodes/Season", "Approximate Total Episodes/Season",
            "Approximate Total Episodes Per Season", "Rough Total Episodes Per Season",
            "Rough Total Episodes/Season", "Rough Total Episodes /Season",
            "Rough Total Episodes/ Season", "Rough Total Episodes / Season",
            "Approximate Total Episodes /Season", "Approximate Total Episodes/ Season",
            "Approximate Total Episodes / Season", "~ Total Episodes /Season",
            "~ Total Episodes/ Season", "~ Total Episodes / Season"];
    }

    function getCSSClassNameForHeader(hstr, usecntr=false)
    {
        letMustBeDefinedAndNotNull(hstr, "hstr");
        letMustBeBoolean(usecntr, "usecntr");
        
        let mycntrtxtnm = "";
        if (usecntr) mycntrtxtnm = "align";

        if (hstr === "Season #") return "seasnum" + mycntrtxtnm;
        else if (hstr === "Episode #") return "epnum" + mycntrtxtnm;
        else if (hstr === "Price") return "epnum" + mycntrtxtnm;
        else if (hstr === "# Of Episodes") return "seasnum" + mycntrtxtnm;
        else if (hstr === "# Of Seasons") return "seasnum" + mycntrtxtnm;
        else if (isStringAOnStringBList(hstr, getAcceptedNamesForNumEpisodesPerSeason()))
        {
            return "seasnum" + mycntrtxtnm;
        }
        else if (0 <= hstr.indexOf("Name") && hstr.indexOf("Name") < hstr.length) return "namecol";
        //else if (0 <= hstr.indexOf("Link") && hstr.indexOf("Link") < hstr.length) return "border";
        //else if (0 <= hstr.indexOf("Description") && hstr.indexOf("Description") < hstr.length)
        //{
        //    return "border";
        //}
        else return "border";
    }

    function genHeaderRowForList()
    {
        //if headername has Name in it, then use namecol classname
        //if headername is Season #, then use seasnum classname
        //if headername is Episode #, then use epnum classname
        //if headername has Description in it, then use border classname
        //if headername has Link in it, then use border classname
        //default classname is border

        let myhlist = getHeadersForType();

        let mytds = myhlist.map((mstr) =>
            <td key={mstr} className={getCSSClassNameForHeader(mstr, false)}>{mstr}</td>);

        return (<tr className="border">{mytds}</tr>);
    }

    function getDataObjectFromType()
    {
        let mdataobj = null;
        if (props.typenm === "Episode") mdataobj = myepdataobj;
        else if (props.typenm === "Toy") mdataobj = mytoydataobj;
        else if (props.typenm === "Show") mdataobj = myshowdataobj;
        else throw new Error("typenm must be Episode, Toy, or Show, but it was not!");
        console.log("MDATAOBJ FOR LIST: ", mdataobj);
        
        return mdataobj;
    }

    function displayItemInAList()
    {
        //need to know the headers
        //needs to know if it is using the align class or not

        let myhlist = getHeadersForType();
        console.log("myhlist = ", myhlist);

        //get the dataobj from state
        let mydataobj = getDataObjectFromType();
        console.log("mydataobj = ", mydataobj);
        console.log(props.location);
        console.log(cloc);

        let mytds = myhlist.map((mstr) =>
        {
            console.log("mstr = " + mstr);
            
            if (mstr === "Description")
            {
                if (err) return (<td dangerouslySetInnerHTML={createMarkUp()}></td>);
                else return (<td className="border">{mydataobj.description}</td>);
            }

            let clsnm = getCSSClassNameForHeader(mstr, true);
            console.log("classname = " + clsnm);
            
            let mky = "";
            let mykynm = "";
            if (mstr === "Show Name") mky = "showname";
            else if (mstr === "Season #") mky = "season_number";
            else if (mstr === "Episode #") mky = "episode_number";
            else if (mstr === "# Of Episodes") mky = "totalepisodes";
            else if (mstr === "# Of Seasons") mky = "numseasons";
            else if (isStringAOnStringBList(mstr, getAcceptedNamesForNumEpisodesPerSeason()))
            {
                mky = "numepisodesperseason";
            }
            else if (mstr === "Watch Link" || mstr === "Episodes Link" || mstr === "Toys Link");
            else mky = "" + mstr.toLowerCase();
            if (mstr === "Watch Link") mykynm = "watchlink";
            else mykynm = "" + mky;
            console.log("mky = " + mky);
            console.log("mykynm = " + mykynm);

            let itemval = null;
            if (mky === undefined || mky === null || mky.length < 1)
            {
                if (mstr === "Watch Link")
                {
                    let mlval = "/shows/" + params.showid + "/episodes/" + props.epobj.id;
                    itemval = (<Link to={mlval}>Watch It Now</Link>);
                }
                else if (mstr === "Episodes Link")
                {
                    let mlval = "/shows/" + props.epobj.id + "/episodes";
                    itemval = (<Link to={mlval}>Episodes</Link>);
                }
                else if (mstr === "Toys Link")
                {
                    let mlval = "/shows/" + props.epobj.id + "/toys";
                    itemval = (<Link to={mlval}>Toys</Link>);
                }
                else console.error("NEED TO DO SOMETHING HERE FOR THIS ITEM (" + mstr + ")!");
            }
            else
            {
                if (mstr === "Name")
                {
                    //if type is show, then /shows/ the id
                    //if type is toy, then /toys/ the id
                    let mlval = "" + props.location.pathname + "/" + props.epobj.id;
                    itemval = (<Link to={mlval}>{mydataobj[mky]}</Link>);
                }
                else if (mstr === "Show Name")
                {
                    let mlval = "/shows/" + mydataobj.showid;
                    itemval = (<Link to={mlval}>{mydataobj[mky]}</Link>);
                }
                else itemval = mydataobj[mky];
            }
            console.log("itemval = ", itemval);

            return (<td key={mykynm + mydataobj.id} className={clsnm}>{itemval}</td>);
        });

        return (<tr id={"swid" + params.showid + "epid" + props.epobj.id} className="border" 
            style={{backgroundColor: mybgcolor}}>{mytds}</tr>);
    }

    console.log("NEW loaded = " + loaded);

    if (loaded);
    else
    {
        if (err) setLoaded(true);
        else return <div>loading...</div>;
    }
    console.log("FINAL loaded = " + loaded);
    console.log("FINAL mytoydataobj = ", mytoydataobj);
    console.log("FINAL myshowdataobj = ", myshowdataobj);
    console.log("FINAL myepdataobj = ", myepdataobj);
    console.log("FINAL showname = " + showname);

    let myeps = null;
    let mybgcolor = getBGColorToBeUsed();
    if (props.uselist)
    {
        console.log("USING A LIST!");
        
        if (err)
        {
            console.log("DISPLAYING ERROR MSG!");

            //for episodes the headers are:
            //episode name
            //season number (center)
            //episode number (center)
            //watch link
            //description

            //for shows the headers are:
            //name
            //total seasons (center)
            //total episodes (center)
            //~ total episodes/season (center)
            //episodes link
            //description

            //for toys the headers are:
            //name
            //showname
            //price (center)
            //description
            
            myeps = [genErrorItemOnList()];
        }
        else
        {
            console.log("NO ERROR ENCOUNTERED WHILE USING A LIST!");
            //console.log("snmref = ", snmref);

            let mylist = null;
            if (props.typenm === "Episode") mylist = episodes;
            else if (props.typenm === "Toy") mylist = toys;
            else if (props.typenm === "Show") mylist = shows;
            else throw new Error("typenm must be Episode, Toy, or Show, but it was not!");
            
            myeps = mylist.map((ep) => {
                let kynm = "";
                if (isInteger(params.showid))//, "params.showid"
                {
                    kynm = "swid" + params.showid + "epid" + ep.id;
                }
                else
                {
                    if (props.typenm === "Episode") kynm = "swidepid" + ep.id;
                    else if (props.typenm === "Toy") kynm = "swidtyid" + ep.id;
                    else if (props.typenm === "Show") kynm = "swidswid" + ep.id;
                    else throw new Error("typenm must be Episode, Toy, or Show, but it was not!");
                }
                return (<EpisodeToyShowOrList key={kynm} typenm={props.typenm} uselist={false}
                    useinlist={true} epobj={ep} location={props.location} />);
            });
        }
        
        //let mdataobj = getDataObjectFromType();
        console.log("SHOWNAME = " + showname);

        let mybgcolor = getBGColorToBeUsed();
        let mytds = genHeaderRowForList();
        let myhitemstr = "";

        if (props.typenm === "Episode")
        {
            //console.log("FINAL myepdataobj = ", myepdataobj);
            myhitemstr = "" + props.typenm + "s For Show: ";
        }
        else if (props.typenm === "Toy")
        {
            //console.log("FINAL mytoydataobj = ", mytoydataobj);
            myhitemstr = "" + props.typenm + "s For Show: ";
        }
        else if (props.typenm === "Show") myhitemstr = "" + props.typenm + "s";
        else throw new Error("typenm must be Episode, Toy, or Show, but it was not!");
        console.log("FINAL myhitemstr = " + myhitemstr);

        // ref={snmref}
        return (<div style={{backgroundColor: mybgcolor}}>
            <h1>{myhitemstr}
                <span id="snm">
                    {(props.typenm === "Show") ? "": showname}
                </span>
            </h1>
            <table className="border">
                <thead>{mytds}</thead>
                <tbody>{myeps}</tbody>
            </table>
        </div>);
    }
    else
    {
        console.log("NOT USING A LIST!");

        if (props.useinlist)
        {
            console.log("THE ITEM IS TO BE DISPLAYED IN A LIST!");
            console.log(props.location);
            console.log(cloc);

            return displayItemInAList();
        }
        else
        {
            console.log("THE ITEM IS TO BE DISPLAYED BY ITSELF!");

            return (<div id={"swid" + params.showid + "epid" + params.id}
                style={{backgroundColor: mybgcolor}}>
                <h1>{props.typenm} For Show: {myepdataobj.showname}</h1>
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
