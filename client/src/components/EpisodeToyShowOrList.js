import React, { useEffect, useState, useRef } from "react";
import { Switch, Route, Link, useParams, useHistory, Redirect } from "react-router-dom";
import SellToForm from "./SellToForm";
import CommonClass from "./commonclass";

function EpisodeToyShowOrList(props){
    const params = useParams();
    let history = useHistory();

    let [cloc, setCLoc] = useState(null);
    const cc = new CommonClass();

    console.log("BEGIN COMPONENT WORK HERE:");
    console.log("URL params = ", params);
    //console.log("history = ", history);
    console.log("props.epobj = ", props.epobj);
    console.log("props.location = ", props.location);
    console.log("cloc = ", cloc);

    cc.letMustBeDefinedAndNotNull(props.typenm, "props.typenm");

    const invalidTypeErrMsg = "typenm must be Episode, Toy, or Show, but it was not!";
    if (props.typenm === "Episode" || props.typenm === "Toy" || props.typenm === "Show");
    else throw new Error(invalidTypeErrMsg);

    let [loaded, setLoaded] = useState(false);
    let [showselltoy, setShowSellToyForm] = useState(false);
    let [err, setError] = useState(false);
    let [cusrisshowowner, setCurrentUserIsShowOwner] = useState(false);
    let [episodes, setEpisodes] = useState([]);
    let [shows, setShows] = useState([]);
    let [toys, setToys] = useState([]);
    let [usertoys, setAllUserToyData] = useState([]);
    let [showname, setShowName] = useState("Show Name");
    let myinitdataepobj = cc.getAndGenInitDataObjectForType("Episode");
    let myinitdatatoyobj = cc.getAndGenInitDataObjectForType("Toy");
    let myinitdatashowobj = cc.getAndGenInitDataObjectForType("Show");
    let [myshowdataobj, setMyShowDataObj] = useState(myinitdatashowobj);
    let [mytoydataobj, setMyToyDataObj] = useState(myinitdatatoyobj);
    let [myepdataobj, setMyEpDataObj] = useState(myinitdataepobj);
    let mres = useRef(null);
    
    console.log("BEFORE USE EFFECT:");
    console.log("props.uselist = " + props.uselist);
    console.log("props.useinlist = " + props.useinlist);
    console.log("props.usemy = " + props.usemy);

    cc.letMustBeBoolean(props.useinlist, "props.useinlist");
    cc.letMustBeBoolean(props.uselist, "props.uselist");
    cc.letMustBeBoolean(props.usemy, "props.usemy");

    if (props.useinlist)
    {
        if (props.epobj === undefined || props.epobj === null)
        {
            throw new Error("epobj must be a defined episode object, not null!");
        }
    }
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
        else throw new Error(invalidTypeErrMsg);
    }

    function genAndSetNewDataStateObject(olddataobj, seasoninfoobj = null)
    {
        let oldsnm = null;
        let oldsid = -1;
        if (props.typenm === "Episode" || props.typenm === "Toy")
        {
            console.log("props.usemy = " + props.usemy);
            console.log("olddataobj = ", olddataobj);
            oldsnm = olddataobj.show.name;
            oldsid = olddataobj.show.id;

            if (props.typenm === "Episode")
            {
                let mynwepobj = {"name": olddataobj.name,
                    "season_number": olddataobj.season_number,
                    "episode_number": olddataobj.episode_number,
                    "description": olddataobj.description,
                    "watched": olddataobj.watched,
                    "showname": oldsnm,
                    "showid": oldsid,
                    "id": olddataobj.id
                };
                setMyEpDataObj(mynwepobj);
            }
            else if (props.typenm === "Toy")
            {
                let mynwtoyobj = {"description": olddataobj.description,
                    "name": olddataobj.name,
                    "price": olddataobj.price,
                    "showname": oldsnm,
                    "showid": oldsid,
                    "id": olddataobj.id
                };
                setMyToyDataObj(mynwtoyobj);
            }
            else throw new Error("typenm must be Episode or Toy, but it was not!");
            console.log("SETTING NEW VALUE FOR SHOWNAME TO: " + oldsnm);
            setShowName(oldsnm);
        }
        else if (props.typenm === "Show")
        {
            let msnobj = null;
            if (seasoninfoobj === undefined || seasoninfoobj === null)
            {
                msnobj = cc.getAndGenSeasonsInfoObject(olddataobj);
            }
            else msnobj = seasoninfoobj;

            let mynwshowobj = {"description": olddataobj.description,
                "name": olddataobj.name,
                "numseasons": msnobj.numseasons,
                "numepisodesperseason": msnobj.numepisodesperseason,
                "totalepisodes": msnobj.totalepisodes,
                "showid": olddataobj.id,
                "id": olddataobj.id
            };
            setMyShowDataObj(mynwshowobj);
            //console.log(olddataobj);
            //console.log("SETTING NEW VALUE FOR SHOWNAME TO: " + olddataobj.name);
            //setShowName(olddataobj.name);
        }
        else throw new Error(invalidTypeErrMsg);
        setLoaded(true);
    }

    function genAndSetErrorMessage(resobj, num)
    {
        console.log("" + num + "did not get the json successfully!");
        console.log(resobj);

        let fivehundredrangemsg = "the server crashed and is not started OR it encountered " +
            "an error and needs to be restarted!";
        
        let fourhundredrangemsg = "did not provide an <b><u>integer id</u></b> " +
            "when requested!";

        let errmsg = "a " + resobj.status + " error occured check the console " +
        "for more details!<br /><br />URL: " + resobj.url + " NOT FOUND!" +
        "<br /><br />Probably ";

        if (500 <= resobj.status) errmsg += fivehundredrangemsg;
        else errmsg += fourhundredrangemsg;

        setErrorMessageState(errmsg);
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
                if (cc.isInteger(params.showid)) baseurl += "/toys";//, "params.showid"
                else if (cc.isItemNullOrUndefined(params.showid)) baseurl = "" + onlytoysurl;
                else baseurl += "/toys";
            }
            else if (props.typenm === "Show") baseurl = "" + onlyshowsurl;
            else throw new Error(invalidTypeErrMsg);
            console.log("baseurl = " + baseurl);
            console.log("props.usemy = " + props.usemy);

            let murl = "";
            if (props.uselist)
            {
                if (props.usemy)
                {
                    if (props.typenm === "Episode") murl = "/my-episodes";
                    else if (props.typenm === "Toy") murl = "/my-toys";
                    else throw new Error("no page found for My-Type (" + props.typenm + ")!");
                }
                else murl = "" + baseurl;
            }
            else
            {
                if (props.typenm === "Show") murl = baseurl + "/" + params.showid;
                else murl = baseurl + "/" + params.id;
            }
            console.log("murl = " + murl);

            if (props.usemy && props.typenm === "Toy")
            {
                console.log("");
                console.log("GETTING ALL USER TOY DATA FIRST BEFORE THE OTHER URL!");
                console.log("murl = /all-user-toy-data");
                fetch("/all-user-toy-data").then((res) => {
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
                            genAndSetErrorMessage(res, 3);
                            setError(true);
                        }
                        return res;
                    }
                }).then((data) => {
                    console.log(data);
                    if (data === undefined || data === null)
                    {
                        if (props.typenm === "Episode") setEpisodes([]);
                        else if (props.typenm === "Toy")
                        {
                            if (props.usemy) setAllUserToyData([]);
                            else setToys([]);
                        }
                        else if (props.typenm === "Show") setShows([]);
                        else throw new Error(invalidTypeErrMsg);
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

                        console.log("successfully got all of the UserToy data!");
                        setAllUserToyData(data);
                    }
                }).catch((merr) => {
                    console.error("there was an error loading the episode data!");
                    console.error(merr);
                    console.log(err);
                    if (err);
                    else
                    {
                        genAndSetErrorMessage(mres.current, 4);
                        setError(true);
                    }
                });

                fetch("/shows").then((res) => {
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
                            genAndSetErrorMessage(res, 3);
                            setError(true);
                        }
                        return res;
                    }
                }).then((data) => {
                    console.log(data);
                    if (data === undefined || data === null)
                    {
                        if (props.typenm === "Episode") setEpisodes([]);
                        else if (props.typenm === "Toy")
                        {
                            if (props.usemy) setAllUserToyData([]);
                            else setToys([]);
                        }
                        else if (props.typenm === "Show") setShows([]);
                        else throw new Error(invalidTypeErrMsg);
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

                        console.log("successfully got all of the Shows data!");
                        setShows(data);

                        //go through the shows data and see if our current user
                        //is a show owner
                        let isswownr = false;
                        for (let n = 0; n < data.length; n++)
                        {
                            if (data[n].owner_id === props.simpusrobj.id)
                            {
                                isswownr = true;
                                break;
                            }
                        }
                        console.log("isswownr = " + isswownr);
                        
                        setCurrentUserIsShowOwner(isswownr);
                    }
                }).catch((merr) => {
                    console.error("there was an error loading the episode data!");
                    console.error(merr);
                    console.log(err);
                    if (err);
                    else
                    {
                        genAndSetErrorMessage(mres.current, 4);
                        setError(true);
                    }
                });
            }
            //else;//do nothing

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
                    else throw new Error(invalidTypeErrMsg);
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

                    console.log("SETTING DATA FROM DATAOBJ!");
                    if (props.uselist)
                    {
                        if (props.typenm === "Episode" || props.typenm === "Toy")
                        {
                            if (props.usemy);
                            else setShowName(data[0].show.name);
                            
                            if (props.typenm === "Episode")
                            {
                                if (props.usemy)
                                {
                                    console.warn("INIT DATA = ", data);
                                    let myinitepslist = data.map((item) => {
                                        let mynwitem = {...item};
                                        mynwitem["watched"] = true;
                                        return mynwitem;
                                    });
                                    console.warn("SET EPISODES WITH: ", myinitepslist);
                                    setEpisodes(myinitepslist);

                                    if (cc.isStringEmptyNullOrUndefined(myinitepslist))
                                    {
                                        setErrorMessageState("No Episodes on the " +
                                            "watched list!");
                                        setError(true);
                                    }
                                    //else;//do nothing
                                }
                                else setEpisodes(data);
                            }
                            else if (props.typenm === "Toy") setToys(data);
                            else
                            {
                                throw new Error("typenm must be Episode or Toy, " +
                                    "but it was not!");
                            }
                        }
                        else if (props.typenm === "Show")
                        {
                            let isswownr = false;
                            for (let n = 0; n < data.length; n++)
                            {
                                if (data[n].owner_id === props.simpusrobj.id)
                                {
                                    isswownr = true;
                                    break;
                                }
                            }
                            console.log("isswownr = " + isswownr);
                            
                            setShows(data);
                            setCurrentUserIsShowOwner(isswownr);
                        }
                        else throw new Error(invalidTypeErrMsg);
                    }
                    else
                    {
                        if (props.typenm === "Show")
                        {
                            console.log("DATA TYPE IS SHOW!");
                            genAndSetNewDataStateObject(data,
                                cc.getAndGenSeasonsInfoObject(data));
                            setCurrentUserIsShowOwner((data.owner_id === props.simpusrobj.id));
                        }
                        else
                        {
                            console.log("props.usemy = " + props.usemy);
                            if (props.usemy)
                            {
                                if (props.typenm === "Episode")
                                {
                                    genAndSetNewDataStateObject(data.episode, null);
                                }
                                else if (props.typenm === "Toy")
                                {
                                    genAndSetNewDataStateObject(data.toy, null);
                                }
                                else throw new Error("invalid typenm found and used here!");
                            }
                            else
                            {
                                genAndSetNewDataStateObject(data, null);
                                if (props.simpusrobj["instatus"] && props.typenm === "Episode")
                                {
                                    console.log("getting watched data now!");
                                    console.log("props.uselist = " + props.uselist);
                                    console.log("props.useinlist = " + props.useinlist);

                                    let myconfigobj = {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Accept": "application/json"
                                        },
                                        body: JSON.stringify({
                                            "episode_id": data.id,
                                            "user_id": props.simpusrobj.id
                                        })
                                    };
                                    fetch("/my-episodes", myconfigobj).
                                    then((res) => res.json())
                                    .then((odata) => {
                                        console.log(odata);
                                    }).catch((merr) => {
                                        console.error("there was an error adding watched " +
                                            "data to the server!");
                                        console.error(merr);
                                    });
                                }
                                //else;//do nothing
                            }
                        }
                    }
                }
                setLoaded(true);
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
            console.log("SETTING DATA FROM EPOBJ!");
            if (props.typenm === "Show")
            {
                console.log("DATA TYPE IS SHOW!");
                genAndSetNewDataStateObject(props.epobj,
                    cc.getAndGenSeasonsInfoObject(props.epobj));
            }
            else
            {
                console.log("props.usemy = " + props.usemy);
                if (props.usemy)
                {
                    if (props.typenm === "Episode")
                    {
                        genAndSetNewDataStateObject(props.epobj.episode, null);
                    }
                    else if (props.typenm === "Toy")
                    {
                        genAndSetNewDataStateObject(props.epobj.toy, null);
                    }
                    else throw new Error("invalid typenm found and used here!");
                }
                else genAndSetNewDataStateObject(props.epobj, null);
            }
            setLoaded(true);
        }
    }, [params, cloc, loaded, showname, err, props.epobj, props.useinlist, props.uselist,
    props.typenm]);
    console.log("AFTER USE EFFECT:");
    console.log("toys = ", toys);
    console.log("shows = ", shows);
    console.log("episodes = ", episodes);
    console.log("usertoys = ", usertoys);
    console.log("cusrisshowowner = " + cusrisshowowner);
    console.log("loaded = " + loaded);
    console.log("props.uselist = " + props.uselist);
    console.log("props.useinlist = " + props.useinlist);
    console.log("err = " + err);
    console.log("mytoydataobj = ", mytoydataobj);
    console.log("myshowdataobj = ", myshowdataobj);
    console.log("myepdataobj = ", myepdataobj);
    console.log("props.location = ", props.location);
    console.log("cloc = ", cloc);
    
    let resetCompState = false;
    if (cloc === undefined || cloc === null)
    {
        if (props.location === undefined || props.location === null);
        else resetCompState = true;
    }
    else
    {
        if (props.location === undefined || props.location === null) resetCompState = true;
        else
        {
            if (props.location.pathname === cloc.pathname);
            else resetCompState = true;
        }
    }
    console.log("resetCompState = " + resetCompState);

    if (resetCompState) resetState();
    //else;//do nothing
    console.log("AFTER LOCATION SET!");

    function resetState()
    {
        console.log("BEGINNNING RESETTING STATE:");
        setLoaded(false);
        setError(false);
        setCurrentUserIsShowOwner(false);
        setEpisodes([]);
        setShows([]);
        setToys([]);
        setAllUserToyData([]);
        setMyShowDataObj(myinitdatashowobj);
        setMyToyDataObj(myinitdatatoyobj);
        setMyEpDataObj(myinitdataepobj);
        console.log("RESETTING SHOWNAME HERE!");
        setShowName("Show Name");
        mres = null;
        setCLoc(props.location);
        console.log("DONE RESETTING STATE!");
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

    function createMarkUp()
    {
        let mdataobj = getDataObjectFromType();
        return {__html: "" + mdataobj.description};
    }

    function genErrorItemOnList(usenormalbgcolor=false)
    {
        cc.letMustBeBoolean(usenormalbgcolor, "usenormalbgcolor");

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
            if (cc.isInteger(params.showid))//, "params.showid"
            {
                kynm = "swid" + params.showid + "errorsw";
            }
            else kynm = "swiderrorsw";
        }
        else if (props.typenm === "Toy")
        {
            itemname = myinitdatatoyobj.name;
            if (cc.isInteger(params.showid))//, "params.showid"
            {
                kynm = "swid" + params.showid + "errorty";
            }
            else kynm = "swiderrorty";
        }
        else throw new Error(invalidTypeErrMsg);
        console.log("props.usemy = " + props.usemy);

        //figure out the options for normal border, but no information
        //"redbgclrborder" or "border"
        //"redbgclrtxtcntrborder" or "seasnumalign"
        const mynocntrclsnm = (usenormalbgcolor ? "border": "redbgclrborder");
        const mycntrclsnm = (usenormalbgcolor ? "seasnumalign": "redbgclrtxtcntrborder");
        

        return (<tr key={kynm} className="border">
            {(props.usemy) ? <td className={mynocntrclsnm}>Cannot Remove It!</td>:
            <td className={mynocntrclsnm}>{itemname}</td>}
            {(props.typenm === "Toy" || props.usemy) ?
            <td className={mynocntrclsnm}>{myinitdatatoyobj.showname}</td>: null}
            {(props.usemy) ? <td className={mynocntrclsnm}>{itemname}</td>: null}
            {(props.typenm === "Toy") ? null :
                <>
                    <td className={mycntrclsnm}>{cntrnuma}</td>
                    <td className={mycntrclsnm}>{cntrnumb}</td>
                </>
            }
            {(props.typenm === "Show") ? <><td className={mycntrclsnm}>
                {myinitdatashowobj.numepisodesperseason}</td>
            <td className={mynocntrclsnm}>Watch Link</td></>: null}
            {(props.typenm === "Toy") ?
            <td className={mycntrclsnm}>{myinitdatatoyobj.price}</td> : null}
            {(props.typenm === "Show") ?
            <td className={mynocntrclsnm}>Toys Link</td>: null}
            {(props.typenm === "Episode") ?
                <td className={mynocntrclsnm}>Watch Link</td>: null}
            {(props.usemy && props.typenm === "Toy") ?
            <td className={mycntrclsnm}>0</td> : null}
            <td className={mynocntrclsnm} dangerouslySetInnerHTML={createMarkUp()}></td></tr>
        );
    }//END OF GEN ERROR ITEM ON LIST()

    function genHeaderRowForList()
    {
        //if headername has Name in it, then use namecol classname
        //if headername is Season #, then use seasnum classname
        //if headername is Episode #, then use epnum classname
        //if headername has Description in it, then use border classname
        //if headername has Link in it, then use border classname
        //default classname is border
        console.log("props.usemy = " + props.usemy);

        let myhlist = cc.getHeadersForType(props.typenm, props.usemy);

        let usemytd = null;
        if (props.usemy) usemytd = (<td key={"remeps"}>Remove {props.typenm}</td>);

        let myotds = myhlist.map((mstr) =>
            <td key={mstr} className={cc.getCSSClassNameForHeader(mstr, false)}>{mstr}</td>);
        
        let mytds = cc.addItemToBeginningOfList(myotds, usemytd, props.usemy);
        console.log("mytds = ", mytds);

        return (<tr className="border">{mytds}</tr>);
    }

    function delItem(event)
    {
        console.log(event);
        console.log("props.epobj = ", props.epobj);
        let myconfigobj = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };
        let myurl = "";
        if (props.typenm === "Episode" || props.typenm === "Toy")
        {
            myurl = "" + props.location.pathname + "/" +
                props.epobj[props.typenm.toLowerCase()].id;
        }
        else throw new Error("typenm must be Episode, or Toy, but it was not!");
        console.log("myurl = " + myurl);
        fetch(myurl, myconfigobj)
        .then((res) => res.json()).then((data) => {
            console.log(data);
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
            //resetState();//did not work
            //return (<Redirect to="/redirectme" />);//did not work
            history.push("/redirectme");//works due to history.goBack() on route.
        }).catch((merr) => {
            console.error("there was an error unwatching an episode!");
            console.error(merr);
        });
    }

    function displayItemInAList()
    {
        //need to know the headers
        //needs to know if it is using the align class or not
        console.log("props.usemy = " + props.usemy);

        let myhlist = cc.getHeadersForType(props.typenm, props.usemy);
        console.log("myhlist = ", myhlist);

        //get the dataobj from state
        let mydataobj = getDataObjectFromType();
        console.log("mydataobj = ", mydataobj);
        console.log(props.location);
        console.log(cloc);

        const epspersnnameslist = cc.getAcceptedNamesForNumEpisodesPerSeason();
        console.log("epspersnnameslist = ", epspersnnameslist);

        //console.warn("mydataobj = ", mydataobj);
        //console.warn("typenm = " + props.typenm);

        let usemytd = null;
        if (props.usemy)
        {
            //need to know who to sell it to and how much
            //if selling all, sell all to whomever and then DELETE it
            console.log("usertoys = ", usertoys);
                            
            let mybtnnm = "";
            if (props.typenm === "Episode") mybtnnm = "Unwatch " + props.typenm;
            else if (props.typenm === "Toy") mybtnnm = "Throw Out All Of " + props.typenm;
            else throw new Error("typenm must be Episode, or Toy, but it was not!");
            
            usemytd = (<td key={"ckbox" + props.epobj.id}>
                <button onClick={delItem}>{mybtnnm}</button>
                {(props.typenm === "Toy") ?
                    <button onClick={(event) => setShowSellToyForm(!showselltoy)}>
                        {(showselltoy) ? "Hide Form":
                            "Show Transfer Toy Form"}</button> : null}
                {(props.typenm === "Toy" && showselltoy) ?
                    <SellToForm sellerID={props.simpusrobj.id} usertoyobj={props.epobj}
                        atmost={props.epobj.quantity} delitemfunc={delItem}
                        resetstate={resetState} /> : null}</td>);
        }

        let myotds = myhlist.map((mstr) =>
        {
            console.log("mstr = " + mstr);
            
            if (mstr === "Description")
            {
                let basekynm = "desc" + props.epobj.id;
                if (err)
                {
                    //console.warn("*mydescky = err" + basekynm);
                    return (<td key={"err" + basekynm}
                        dangerouslySetInnerHTML={createMarkUp()}></td>);
                }
                else
                {
                    //console.warn("*mydescky = normal" + basekynm);
                    return (<td key={"normal" + basekynm} className="border">
                        {mydataobj.description}</td>);
                }
            }

            let clsnm = cc.getCSSClassNameForHeader(mstr, true);
            console.log("classname = " + clsnm);
            
            let mky = cc.getTheDataKeyNameFromString(mstr, epspersnnameslist);
            let mykynm = "";
            if (mstr === "Watch Link") mykynm = "watchlink";
            else if (mstr === "Episodes Link") mykynm = "episodeslink";
            else if (mstr === "Toys Link") mykynm = "toyslink";
            else mykynm = "" + mky;
            console.log("mky = " + mky);
            console.log("mykynm = " + mykynm);
            console.log("props.epobj = ", props.epobj);
            console.log("props.usemy = " + props.usemy);

            let itemval = null;
            if (mky === undefined || mky === null || mky.length < 1)
            {
                if (mstr === "Watch Link")
                {
                    let mysid = -1;
                    let myepnum = -1;
                    if (props.usemy)
                    {
                        mysid = props.epobj.episode.show.id;
                        myepnum = props.epobj.episode.episode_number;
                    }
                    else
                    {
                        mysid = params.showid;
                        myepnum = props.epobj.episode_number;
                    }
                    let mlval = "/shows/" + mysid + "/episodes/" + myepnum;
                    //console.warn("*mylnkky = " + (mykynm + props.epobj.id));
                    itemval = (<Link key={mykynm + props.epobj.id}
                                    to={mlval}>Watch It Now</Link>);
                }
                else if (mstr === "Episodes Link")
                {
                    let mlval = "/shows/" + props.epobj.id + "/episodes";
                    //console.warn("*mylnkky = " + (mykynm + props.epobj.id));
                    itemval = (<Link key={mykynm + props.epobj.id} to={mlval}>Episodes</Link>);
                }
                else if (mstr === "Toys Link")
                {
                    let mlval = "/shows/" + props.epobj.id + "/toys";
                    //console.warn("*mylnkky = " + (mykynm + props.epobj.id));
                    itemval = (<Link key={mykynm + props.epobj.id} to={mlval}>Toys</Link>);
                }
                else console.error("NEED TO DO SOMETHING HERE FOR THIS ITEM (" + mstr + ")!");
            }
            else
            {
                if (mstr === "Name")
                {
                    //if type is show, then /shows/ the id
                    //if type is toy, then /toys/ the id
                    console.log("props.location.pathname = " + props.location.pathname);
                    
                    let epobky = "";
                    let mylnksopts = ["/toys", "/episodes"];
                    let mylnkoptsindxs = mylnksopts.map((opt) =>
                        props.location.pathname.indexOf(opt));
                    let si = props.location.pathname.indexOf("/shows/");
                    let vkyfnd = false;
                    let siisvalid = (0 <= si && si < props.location.pathname.length);
                    console.log("si = " + si);
                    console.log("siisvalid = " + siisvalid);

                    for (let n = 0; n < mylnksopts.length && siisvalid; n++)
                    {
                        if (0 <= mylnkoptsindxs[n] &&
                            mylnkoptsindxs[n] < props.location.pathname.length)
                        {
                            //index is valid
                            vkyfnd = true;
                            if (props.typenm === "Show") epobky = "id";
                            else if (props.typenm === "Episode") epobky = "episode_number";
                            else if (props.typenm === "Toy") epobky = "toy_number";
                            else throw new Error(invalidTypeErrMsg);
                            break;
                        }
                        //else;//do nothing
                    }
                    console.log("vkyfnd = " + vkyfnd);

                    if (vkyfnd);
                    else epobky = "id";
                    console.log("epobky = " + epobky);

                    let mlval = "";
                    let mylnkky = "";
                    if (props.usemy)
                    {
                        if (props.typenm === "Episode") epobky = "episode";
                        else if (props.typenm === "Toy") epobky = "toy";
                        else throw new Error("typenm must be Episode or Toy, but it was not!");
                        console.log("NEW epobky = " + epobky);
                        
                        let olnkvalky = "" + epobky + "_number";
                        console.log("olnkvalky = " + olnkvalky);

                        mylnkky = "" + props.typenm.toLowerCase() + "namelink" +
                            props.epobj[epobky].id;
                        mlval = "/shows/" + props.epobj[epobky].show.id + "/" + epobky + "s/" +
                            props.epobj[epobky][olnkvalky];
                    }
                    else
                    {
                        mlval = "" + props.location.pathname + "/" + props.epobj[epobky];
                        mylnkky = "" + props.typenm.toLowerCase() + "namelink" +
                            props.epobj.id;
                    }
                    //console.warn("*mylnkky = " + mylnkky);
                    itemval = (<Link key={mylnkky} to={mlval}>{mydataobj[mky]}</Link>);
                }
                else if (mstr === "Show Name")
                {
                    let mlval = "/shows/" + mydataobj.showid;
                    let mylnkky = "shownamelink" + mydataobj.showid + "foritemid" +
                        props.epobj.id;
                    //console.warn("*mylnkky = " + mylnkky);
                    itemval = (<Link key={mylnkky} to={mlval}>{mydataobj[mky]}</Link>);
                }
                else if (mstr === "Quantity")
                {
                    console.log("props.epobj = ", props.epobj);
                    console.log("props.epobj[" + mky + "] = ", props.epobj[mky]);
                    itemval = props.epobj[mky];
                }
                else
                {
                    console.log("mydataobj = ", mydataobj);
                    console.log("mydataobj[" + mky + "] = ", mydataobj[mky]);
                    itemval = mydataobj[mky];
                }
            }
            console.log("itemval = ", itemval);
            
            let fcolkynm = "";
            if (props.typenm === "Show") fcolkynm = "colfor" + mykynm + mydataobj.showid;
            else fcolkynm = "colfor" + mykynm + mydataobj.id;
            //console.warn("*fcolkynm = " + fcolkynm);

            return (<td key={fcolkynm} className={clsnm}>{itemval}</td>);
        });

        let mytds = cc.addItemToBeginningOfList(myotds, usemytd, props.usemy);
        console.log("mytds = ", mytds);

        let kynmidnm = "";
        if (params.showid === undefined || params.showid === null)
        {
            kynmidnm = "rowforswidepid" + props.epobj.id;
        }
        else kynmidnm = "rowforswid" + params.showid + "epid" + props.epobj.id;
        //console.warn("*kynmidnm = " + kynmidnm);
        return (<tr key={kynmidnm} id={kynmidnm} className="border" 
            style={{backgroundColor: mybgcolor}}>{mytds}</tr>);
    }//END OF DISPLAY ITEM IN A LIST()

    function displayItemItself()
    {
        let myhlist = cc.getHeadersForType(props.typenm, true);
        console.log("myhlist = ", myhlist);

        //get the dataobj from state
        let mydataobj = getDataObjectFromType();
        console.log("mydataobj = ", mydataobj);
        console.log(props.location);
        console.log(cloc);

        const epspersnnameslist = cc.getAcceptedNamesForNumEpisodesPerSeason();
        console.log("epspersnnameslist = ", epspersnnameslist);

        let mytds = myhlist.map((mstr) =>
        {
            console.log("mstr = " + mstr);

            let mky = cc.getTheDataKeyNameFromString(mstr, epspersnnameslist);
            let mykynm = "";
            if (mstr === "Watch Link") mykynm = "watchlink";
            else if (mstr === "Episodes Link") mykynm = "episodeslink";
            else if (mstr === "Toys Link") mykynm = "toyslink";
            else mykynm = "" + mky;
            console.log("mky = " + mky);
            console.log("mykynm = " + mykynm);
            
            if (mstr === "Description")
            {
                let basekynm = "desc" + mydataobj.id;
                if (err)
                {
                    //console.warn("*mydescky = err" + basekynm);
                    //console.warn("*myhkynm = errcontainer" + basekynm);
                    return (<div key={"containerforerrcontainer" + basekynm}>
                        <h4 key={"errcontainer" + basekynm}>Description: </h4>
                        <p key={"err" + basekynm} style={{backgroundColor: "red"}}
                    dangerouslySetInnerHTML={createMarkUp()}></p></div>);
                }
                else
                {
                    //console.warn("*mydescky = normal" + basekynm);
                    //console.warn("*myhkynm = normalcontainer" + basekynm);
                    return (<div key={"containerfornormalcontainer" + basekynm}>
                        <h4 key={"normalcontainer" + basekynm}>Description: </h4>
                        <p key={"normal" + basekynm}>{mydataobj.description}</p></div>);
                }
            }
            else if (mstr === "Show Name")
            {
                //console.warn("*myhkynm = shownametitle" + mydataobj.showname);
                let swnmlnkky = "showkylnk" + mydataobj.showid;
                let swlnkaddr = "/shows/" + mydataobj.showid;
                //console.warn("*swnmlnkky = " + swnmlnkky);
                let mynmstr = "" + props.typenm + " For Show: ";
                let myitemval = null;
                if (err) myitemval = "" + mydataobj.showname;
                else
                {
                    myitemval = (<Link key={swnmlnkky} to={swlnkaddr}>
                        {mydataobj.showname}</Link>);
                }
                return (<h1 key={"shownametitle" + mydataobj.showname}>
                    {mynmstr}{myitemval}</h1>);
            }
            else if (mstr === "Name")
            {
                let mynmstr = "" + props.typenm + " Name: " + mydataobj.name;
                if (props.typenm === "Show")
                {
                    //console.warn("*myhkynm = shownametitle" + mydataobj.name);
                    return (<h1 key={"shownametitle" + mydataobj.name}>{mynmstr}</h1>);
                }
                else
                {
                    //console.warn("*myhkynm = eportoyname" + mynmstr);
                    return (<h3 key={"eportoyname" + mynmstr}>{mynmstr}</h3>);
                }
            }
            else if (mstr === "Episode #" || mstr === "Season #" || mstr === "# Of Seasons" ||
                mstr === "# Of Episodes" || mstr === "Price" || mky === "numepisodesperseason")
            {
                //console.warn("*mydivkynm = " + (mky + mydataobj.id));
                return (<div key={mky + mydataobj.id}>{mstr}: {mydataobj[mky]}</div>);
            }
            else if (mstr === "Watch Link")
            {
                if (props.typenm === "Episode") return null;
                else
                {
                    let mlval = "/shows/" + params.showid + "/episodes/" +
                        mydataobj.episode_number;
                    //console.warn("*mylnkky = " + (mykynm + mydataobj.id));
                    //console.warn("*mydivky = watchlinkforepisode" + mydataobj.id);
                    if (props.typenm === "Show")
                    {
                        return (<div key={"watchlinkforepisodecontainer" + mydataobj.id}>
                            <div key={"watchlinkforepisode" + mydataobj.id}>
                            {mstr}: <Link key={mykynm + mydataobj.id} to={mlval}>
                                Watch It Now</Link>
                        </div></div>);
                    }
                    else
                    {
                        return (<div key={"watchlinkforepisodecontainer" + mydataobj.id}>
                            <div key={"watchlinkforepisode" + mydataobj.id}>
                                {mstr}: <Link key={mykynm + mydataobj.id} to={mlval}>
                                    Watch It Now</Link>
                            </div></div>);
                    }
                }
            }
            else if (mstr === "Episodes Link")
            {
                let mlval = "/shows/" + mydataobj.id + "/episodes";
                //console.warn("*mylnkky = " + (mykynm + mydataobj.id));
                //console.warn("*mydivky = watchlinkforepisodes" + mydataobj.id);
                return (<div key={"watchlinkforepisodescontainer" + mydataobj.id}>
                    <p key="blankp"></p>
                    <p key="oblankp"></p>        
                    <div key={"watchlinkforepisodes" + mydataobj.id}>
                    {mstr}: <Link key={mykynm + mydataobj.id} to={mlval}>Episodes</Link>
                </div></div>);
            }
            else if (mstr === "Toys Link")
            {
                let mlval = "/shows/" + mydataobj.id + "/toys";
                //console.warn("*mylnkky = " + (mykynm + mydataobj.id));
                //console.warn("*mydivky = linkfortoys" + mydataobj.id);
                return (<div key={"linkfortoyscontainer" + mydataobj.id}>
                    <div key={"linkfortoys" + mydataobj.id}>
                {mstr}: <Link key={mykynm + mydataobj.id} to={mlval}>Toys</Link></div></div>);
            }
            else
            {
                console.error("NEED TO DO SOMETHING HERE FOR THIS ITEM (" + mstr + ")!");
                return null;
            }
        });
        console.log("mytds = ", mytds);

        //<h1>{props.typenm} For Show: {myepdataobj.showname}</h1>
        let myidstr = "";
        if (props.typenm === "Show") myidstr = "swid" + params.showid;
        else myidstr = "swid" + params.showid + "epid" + params.id;
        //console.warn("*mylnkky = containerfor" + myidstr);
        return (<div key={"containerfor" + myidstr} id={myidstr}
            style={{backgroundColor: mybgcolor}}>{mytds}</div>);
    }//END OF DISPLAY ITEM ITSELF()


    function getMyProfitTDsAndProfit()
    {
        //if it is on the mytoys page for a show owner,
        //we want to know how much total revenue they have made?
        //and how much of each toy sold?
        //and at what price for each sold toy?
        //TOY ID, HOW MANY SOLD, PRICE SOLD AT, TOTAL PROFIT MADE
        //Both below and above print the computed total revenue
        //We should also let the user have the option to see the calculation
        let tprofit = 0;
        let myprofittds = null;
        if (err)
        {
            myprofittds = [<tr className="border">
                <td className="border">0</td>
                <td className="redbgclrtxtcntrborder">0</td>
                <td className="redbgclrtxtcntrborder">0</td>
                <td className="redbgclrtxtcntrborder">0</td>
                <td className="redbgclrtxtcntrborder">0</td>
            </tr>];
        }
        else
        {
            if (props.usemy && props.typenm === "Toy")
            {
                console.log("BEGIN GETTING THE PROFIT TDS HERE:");
                console.log("usertoys = ", usertoys);
                console.log("toys = ", toys);
                console.log("current user ID = " + props.simpusrobj.id);
                //how do I get the show owners of all of the toys?
                //toy.show.owner_id

                //from the usertoy data we need:
                //if we are the show owner and if we own the toy
                //we want to know how many got sold and at what price
                //if many users bought the same toy:
                //-what happens if the prices are different? What price do we display then?
                //-we do add the items up (combine the quantities) (combine the profit)
                //-we use the average price (total profit / total bought) regular not integer.
                //if the current user owns the toy, the quantity increases, but the price is 0.
                //ID Q P T O
                //1  1 1 1 1
                //2  1 5 5 1
                //3  1 3 3 1
                //4  1 7 7 1
                //1  3 2 6 0

                //combine the data first
                //ID Q P T
                //1  4 1/4 1

                myprofittds = [];
                let itemsused = [];
                usertoys.forEach((mitem) => {
                    console.log("mitem = ", mitem);

                    let addit = true;
                    let usedindx = -1;
                    for (let n = 0; n < itemsused.length; n++)
                    {
                        if (itemsused[n].toy_id === mitem.toy.id)
                        {
                            usedindx = n;
                            addit = false;
                            break;
                        }
                    }
                    console.log("addit = " + addit);
                    console.log("usedindx = " + usedindx);

                    let cusrisswownr = (mitem.toy.show.owner_id === props.simpusrobj.id);
                    if (cusrisswownr)
                    {
                        console.log("the current user owns the show!");
                    }
                    else
                    {
                        console.log("the current user does not own the show!");
                    }
                    let busridisswownr = (mitem.toy.show.owner_id === mitem.user.id);
                    if (busridisswownr)
                    {
                        console.log("the buyer that bought the toy owns the show!");
                    }
                    else
                    {
                        console.log("the buyer that bought the toy does not own the show!");
                    }

                    if (addit)
                    {
                        console.log("ADDED MITEM TO THE LIST!");
                        //we only need: quantity, toy_id, show_id, show_owner_id, price
                        let nwprice = 0;
                        if (busridisswownr);
                        else nwprice = mitem.toy.price;
                        console.log("nwprice = " + nwprice);

                        let mynwobj = {
                            "quantity": mitem.quantity,
                            "buyer_id": mitem.user.id,
                            "toy_id": mitem.toy.id,
                            "price": nwprice,
                            "actual_price": mitem.toy.price,
                            "show_id": mitem.toy.show.id,
                            "show_owner_id": mitem.toy.show.owner_id
                        };
                        console.log("mynwobj = ", mynwobj);

                        itemsused.push(mynwobj);
                    }
                    else
                    {
                        console.log("NEED TO COMBINE THE ITEMS!");
                        console.log("CURRENT mitem = ", mitem);
                        console.log("OLD ITEM ON LIST = itemsused[" + usedindx + "] = ",
                            itemsused[usedindx]);
                        
                        //combine the quantities
                        let oldquantity = itemsused[usedindx].quantity;
                        itemsused[usedindx].quantity = oldquantity + mitem.quantity;
                        console.log("oldquantity = " + oldquantity);
                        console.log("NEW quantity = itemsused[" + usedindx + "].quantity = " +
                            itemsused[usedindx].quantity);
                        
                        //if the current user owns the toy, for both,
                        //then price and profit: 0
                        //compute the normal profit: price * quantity
                        //computed price: profit / quantity
                        
                        let onwprice = 0;
                        if (busridisswownr);
                        else onwprice = mitem.toy.price;
                        console.log("onwprice = " + onwprice);
                        
                        let cprofit = (oldquantity * itemsused[usedindx].price) +
                            (mitem.quantity * onwprice);
                        console.log("cprofit = " + cprofit);

                        itemsused[usedindx].price = cprofit / itemsused[usedindx].quantity;
                        console.log("NEW ITEM ON LIST = itemsused[" + usedindx + "] = ",
                            itemsused[usedindx]);
                    }
                });
                console.log("FINAL itemsused = ", itemsused);
                
                myprofittds = itemsused.map((mitem) => {
                    console.log("mitem = ", mitem);

                    let mitemcost = mitem.quantity * mitem.price;
                    tprofit += mitemcost;

                    return (<tr className="border">
                        <td className="border">{mitem.toy_id}</td>
                        <td className="border">{mitem.quantity}</td>
                        <td className="border">{mitem.actual_price}</td>
                        <td className="border">{mitem.price}</td>
                        <td className="border">{mitemcost}</td>
                    </tr>);
                });
            }
            //else;//do nothing
        }
        console.log("myprofittds = ", myprofittds);
        console.log("tprofit = " + tprofit);

        return [myprofittds, tprofit];
    }


    console.log("NEW loaded = " + loaded);

    if (loaded);
    else
    {
        if (err) setLoaded(true);
        else 
        {
            if (props.useinlist)
            {
                if (props.epobj === undefined || props.epobj === null)
                {
                    //console.warn("NO EPOBJ!");
                    //console.warn("*kynmidnm = loadingrow0");
                    //console.warn("*kynmidnm = loadingcol0");
                    return (<tr key={"loadingrow0"}>
                    <td key={"loadingcol0"}>loading...</td></tr>);
                }
                else
                {
                    //console.warn("THERE IS AN EPOBJ!");
                    //console.warn("*kynmidnm = loadingrow" + props.epobj.id);
                    //console.warn("*kynmidnm = loadingcol" + props.epobj.id);
                    return (<tr key={"loadingrow" + props.epobj.id}>
                        <td key={"loadingcol" + props.epobj.id}>loading...</td></tr>);
                }
            }
            else return <div>loading...</div>;
        }
    }
    console.log("FINAL loaded = " + loaded);
    console.log("FINAL mytoydataobj = ", mytoydataobj);
    console.log("FINAL myshowdataobj = ", myshowdataobj);
    console.log("FINAL myepdataobj = ", myepdataobj);
    console.log("FINAL showname = " + showname);
    console.log("FINAL cusrisshowowner = " + cusrisshowowner);

    let myeps = null;
    let mybgcolor = cc.getBGColorToBeUsed(err, props.typenm);
    if (props.uselist)
    {
        console.log("USING A LIST!");
        
        if (err)
        {
            console.log("DISPLAYING ERROR MSG!");

            myeps = [genErrorItemOnList()];
        }
        else
        {
            console.log("NO ERROR ENCOUNTERED WHILE USING A LIST!");

            let mylist = null;
            if (props.typenm === "Episode") mylist = episodes;
            else if (props.typenm === "Toy") mylist = toys;
            else if (props.typenm === "Show") mylist = shows;
            else throw new Error(invalidTypeErrMsg);
            
            myeps = mylist.map((ep) => {
                let kynm = "";
                let myepid = -1;
                if (props.usemy)
                {
                    if (props.typenm === "Toy") myepid = ep.toy.id;
                    else if (props.typenm === "Episode") myepid = ep.episode.id;
                    else throw new Error("typenm must be Episode or Toy, but it was not!");
                }
                else myepid = ep.id;
                //console.warn("IN MYEPS NO ERR!");
                //console.warn("myepid = " + myepid);

                if (cc.isInteger(params.showid))//, "params.showid"
                {
                    kynm = "swid" + params.showid + "epid" + myepid;
                }
                else
                {
                    if (props.typenm === "Episode") kynm = "swidepid" + myepid;
                    else if (props.typenm === "Toy") kynm = "swidtyid" + myepid;
                    else if (props.typenm === "Show") kynm = "swidswid" + myepid;
                    else throw new Error(invalidTypeErrMsg);
                }
                kynm = "kidcontainerfor" + kynm;
                //console.warn("ep = ", ep);
                //console.warn("*kynm = " + kynm);

                return (<EpisodeToyShowOrList key={kynm} typenm={props.typenm}
                    uselist={false} useinlist={true} epobj={ep} usemy={props.usemy}
                    location={props.location} 
                    watchall={props.watchall} setWatchAll={props.setWatchAll}
                    watcheditems={props.watcheditems}
                    setWatchedItems={props.setWatchedItems}
                    simpusrobj={props.simpusrobj} />);
            });
        }
        console.log("myeps = ", myeps);

        if (cc.isStringEmptyNullOrUndefined(myeps))
        {
            myeps = [genErrorItemOnList(true)];
        }
        //else;//do nothing
        
        //let mdataobj = getDataObjectFromType();
        console.log("SHOWNAME = " + showname);

        let mybgcolor = cc.getBGColorToBeUsed(err, props.typenm);
        let mytds = genHeaderRowForList();
        let myhitemstr = "";
        let usenoshowname = false;
        if (props.typenm === "Show") usenoshowname = true;
        else if (props.typenm === "Toy")
        {
            //if using all toys, then not using just one showname
            //if using only toys for a show, then using a showname
            if (cc.isInteger(params.showid));
            else if (cc.isItemNullOrUndefined(params.showid)) usenoshowname = true;
        }
        //else;//do nothing will be using a showname by default
        console.log("usenoshowname = " + usenoshowname);

        if (props.typenm === "Episode")
        {
            //console.log("FINAL myepdataobj = ", myepdataobj);
            console.log("props.usemy = " + props.usemy);
            if (props.usemy) myhitemstr = "My " + props.typenm + "s";
            else myhitemstr = "" + props.typenm + "s For Show: ";
        }
        else if (props.typenm === "Toy")
        {
            //console.log("FINAL mytoydataobj = ", mytoydataobj);
            if (usenoshowname)
            {
                let myprefstr = ((props.usemy) ? "My " : "");
                myhitemstr = "" + myprefstr + props.typenm + "s";
            }
            else myhitemstr = "" + props.typenm + "s For Show: ";
        }
        else if (props.typenm === "Show") myhitemstr = "" + props.typenm + "s";
        else throw new Error("typenm must be Episode, Toy, or Show, but it was not!");
        console.log("FINAL myhitemstr = " + myhitemstr);

        let mysnmitemval = null;
        if (usenoshowname);
        else
        {
            if (err) mysnmitemval = (<span id="snm">{showname}</span>);
            else
            {
                mysnmitemval = (<span id="snm">
                    <Link to={"/shows/" + params.showid}>{showname}</Link></span>);
            }
        }
        console.log("mytds = ", mytds);
        console.log("cusrisshowowner = " + cusrisshowowner);
        console.log("err = " + err);
        console.log("");

        let profitresarr = null;
        let myprofittds = null;
        let tprofit = 0;
        if (err || cusrisshowowner)
        {
            //get the data
            profitresarr = getMyProfitTDsAndProfit();
            myprofittds = profitresarr[0];
            tprofit = profitresarr[1];
        }
        //else;//do nothing
        console.log("JUST BEFORE RENDER:");
        console.log("myprofittds = ", myprofittds);
        console.log("tprofit = " + tprofit);
        console.log("cusrisshowowner = " + cusrisshowowner);
        

        //toys (for all shows, so no show name) vs
        //toys for show: show name
        //episodes for show: show name
        //shows
        return (<div style={{backgroundColor: mybgcolor}}>
            <h1>{myhitemstr}{props.usemy ? null: mysnmitemval}</h1>
            {(props.usemy && props.typenm === "Toy" && cusrisshowowner) ?
            <div><h2>Total Profit: ${tprofit}</h2>
            <table className="border">
                <thead>
                    <tr className="border">
                        <td className="border">Toy ID#</td>
                        <td className="border">Total Items Sold</td>
                        <td className="border">Actual Price $</td>
                        <td className="border">Price $</td>
                        <td className="border">Total Profit $</td>
                    </tr>
                </thead>
                <tbody>{myprofittds}</tbody>
            </table><h2>Total Profit: ${tprofit}</h2></div> : null}
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

            return displayItemItself();
        }
    }
}

export default EpisodeToyShowOrList;
