import React, { useEffect, useState } from "react";
import { Switch, Route, Link, useParams, useHistory, Redirect } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import CommonClass from "./commonclass";

function NewShowToyEpisode({typenm, simpusrobj}) {
    const params = useParams();
    const history = useHistory();

    let cc = new CommonClass();
    cc.letMustBeDefinedAndNotNull(typenm, "typenm");
    cc.letMustBeDefinedAndNotNull(simpusrobj, "simpusrobj");

    console.log("BEGIN COMPONENT WORK FOR NEW-SHOW-EPISODE-TOY COMPONENT HERE:");
    console.log("SET INITIAL VALUES OBJ HERE (NO FETCH):");

    let [errmsg, setErrMsg] = useState("");
    let [sucsmsg, setSuccessMsg] = useState("");
    let [snm, setShowName] = useState("Show Name");
    let [sownerid, setShowOwnerID] = useState(-1);
    let [useinitvals, setUseInitValues] = useState(true);
    let [myeps, setMyItems] = useState([]);

    console.log("useinitvals = " + useinitvals);
    console.log("myeps = ", myeps);
    console.log("params = ", params);

    let [myinitvals, setMyInitValuesObj] = useState(
        getInitialValuesObjForType(useinitvals, myeps));

    console.log("AFTER INITIAL CALL TO SET INITIAL VALUES OBJ!");

    const iserr = (simpusrobj.access_level !== 2);

    const typenmerrmsg = "typenm is invalid! It must be Episode, Toy, or Show, " +
        "but it was not!";
    if (typenm === "Episode" || typenm === "Show" || typenm === "Toy");
    else throw new Error(typenmerrmsg);

    const episodeSchema = yup.object().shape({
        name: yup.string().required("You must enter an episode name!").min(1),
        description: yup.string().required("You must enter a description!").min(1),
        episode_number: yup.number().positive().integer().min(1)
        .required("You must enter the episode number!")
        .typeError("You must enter a positive integer!"),
        season_number: yup.number().positive().integer().min(1)
        .required("You must enter the season number!")
        .typeError("You must enter a positive integer!"),
        show_id: yup.number().positive().integer().min(1)
        .required("You must enter the show id number!")
        .typeError("You must enter a positive integer!"),
    });
    const showSchema = yup.object().shape({
        name: yup.string().required("You must enter an episode name!").min(1),
        description: yup.string().required("You must enter a description!").min(1),
        user_id: yup.number().positive().integer().min(1)
        .required("You must enter the show id number!")
        .typeError("You must enter a positive integer!"),
    });
    const toySchema = yup.object().shape({
        name: yup.string().required("You must enter an episode name!").min(1),
        description: yup.string().required("You must enter a description!").min(1),
        price: yup.number().min(0)
        .required("You must enter the price!")
        .typeError("You must enter a positive number or decimal!"),
        show_id: yup.number().positive().integer().min(1)
        .required("You must enter the show id number!")
        .typeError("You must enter a positive integer!"),
    });
    
    const formSchema = ((typenm === "Episode") ? episodeSchema :
        ((typenm === "Show") ? showSchema : toySchema));
    
    let useparamshowid = false;
    let mysid = ":showid";
    if (cc.isItemNullOrUndefined(params.showid));
    else if (cc.isInteger(params.showid))
    {
        mysid = "" + params.showid;
        useparamshowid = true;
    }
    //else;//do nothing
    console.log("useparamshowid = " + useparamshowid);
    console.log("mysid = " + mysid);


    useEffect(() => {
        if (!iserr && useparamshowid)
        {
            fetch("/shows/" + mysid).then((res) => res.json()).then((data) => {
                console.log(data);
    
                if (data === undefined || data === null) setShowName("Show Name");
                else
                {
                    let dkys = Object.keys(data);
                    console.log(dkys);
                    for (let n = 0; n < dkys.length; n++)
                    {
                        if (dkys[n] === "error")
                        {
                            setShowName("Show Name");
                            return;
                        }
                    }
                    
                    console.log("successfully set the showname and the owner ID!");
                    setShowName(data.name);
                    setShowOwnerID(data.owner_id);
                }

                let murl = "";
                if (typenm === "Episode") murl = "/shows/" + mysid + "/episodes";
                else if (typenm === "Toy") murl = "/shows/" + mysid + "/toys";
                else
                {
                    throw new Error("typenm is invalid! It must be Episode or Toy, " +
                        "but it was not!");
                }
                console.log("murl = " + murl);

                fetch(murl).then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    
                    if (data === undefined || data === null) setUseInitValues(true);
                    else
                    {
                        let dkys = Object.keys(data);
                        console.log(dkys);
                        for (let n = 0; n < dkys.length; n++)
                        {
                            if (dkys[n] === "error")
                            {
                                setUseInitValues(true);
                                return;
                            }
                        }

                        console.log("successfully set myeps!");
                        setMyItems(data);
                        setUseInitValues(false);
                        console.log("SET INITIAL VALUES OBJ HERE (WITH FETCH):");
                        console.log("useinitvals = false");
                        console.log("data = ", data);
                        setMyInitValuesObj(getInitialValuesObjForType(false, data));
                    }
                }).catch((merr) => {
                    console.error("there was a problem getting how many episodes there are!");
                    console.error(merr);
                    setUseInitValues(true);
                });
            }).catch((merr) => {
                console.error("there was an error getting the show name!");
                console.error(merr);
                setShowName("Show Name");
            });
        }
        else
        {
            if (iserr || typenm !== "Toy")
            {
                console.log("SET INITIAL VALUES OBJ HERE (NO FETCH):");
                console.log("useinitvals = " + useinitvals);
                console.log("myeps = " + myeps);
                setMyInitValuesObj(getInitialValuesObjForType(useinitvals, myeps));
            }
            else
            {
                fetch("/toys").then((res) => res.json()).then((data) => {
                    console.log(data);
                    
                    if (data === undefined || data === null) setUseInitValues(true);
                    else
                    {
                        let dkys = Object.keys(data);
                        console.log(dkys);
                        for (let n = 0; n < dkys.length; n++)
                        {
                            if (dkys[n] === "error")
                            {
                                setUseInitValues(true);
                                return;
                            }
                        }

                        console.log("successfully set myeps!");
                        setMyItems(data);
                        setUseInitValues(true);
                        console.log("SET INITIAL VALUES OBJ HERE (WITH FETCH):");
                        console.log("useinitvals = true");
                        console.log("data = ", data);
                        setMyInitValuesObj(getInitialValuesObjForType(true, data));
                    }
                }).catch((merr) => {
                    console.error("there was a problem getting how many episodes there are!");
                    console.error(merr);
                    setUseInitValues(true);
                });
            }
        }
    }, [useparamshowid, mysid, iserr]);

    function getInitialValuesObjForType(museinitvals=useinitvals, mdata=myeps)
    {
        let myinitname = "";
        let myinitdescription = "";
        let myinitusrid = simpusrobj.id;
        let myinitprice = 0;
        let myinitshowid = -1;
        let myinitsnnum = -1;
        let myinitepnum = -1;
        if (typenm === "Episode" || typenm === "Toy")
        {
            let useparamshowid = false;
            if (cc.isItemNullOrUndefined(params.showid));
            else if (cc.isInteger(params.showid))
            {
                myinitshowid = Number(params.showid);
                useparamshowid = true;
            }
            //else;//do nothing
            console.log("useparamshowid = " + useparamshowid);
            console.log("myinitshowid = " + myinitshowid);
            console.log("museinitvals = " + museinitvals);
            console.log("mdata = ", mdata);

            if (typenm === "Toy")
            {
                if (useparamshowid)
                {
                    if (museinitvals)
                    {
                        return {"name": myinitname, "description": myinitdescription,
                            "show_id": myinitshowid, "price": myinitprice, "toy_number": -1};
                    }
                    else
                    {
                        //returns a list then in each item we can get the ep num
                        let tynums = mdata.map((item, index) => item.toy_number);
                        console.log("tynums = ", tynums);

                        let myinittynum = -1;
                        if (cc.isStringEmptyNullOrUndefined(tynums)) myinittynum = 1;
                        else myinittynum = Math.max(...tynums) + 1;
                        console.log("myinittynum = " + myinittynum);
                        
                        return {"name": myinitname, "description": myinitdescription,
                            "show_id": myinitshowid, "price": myinitprice,
                            "toy_number": myinittynum};
                    }
                }
                else
                {
                    return {"name": myinitname, "description": myinitdescription,
                            "show_id": myinitshowid, "price": myinitprice, "toy_number": -1};
                }
            }
            //else;//do nothing

            if (useparamshowid)
            {
                if (museinitvals)
                {
                    return {"name": myinitname, "description": myinitdescription,
                            "show_id": myinitshowid, "episode_number": myinitepnum,
                            "season_number": myinitsnnum};
                }
                else
                {
                    //returns a list then in each item we can get the ep num
                    let epnums = mdata.map((item, index) => item.episode_number);
                    let mysnums = mdata.map((item, index) => item.season_number);
                    console.log("epnums = ", epnums);
                    console.log("mysnums = ", mysnums);

                    if (cc.isStringEmptyNullOrUndefined(epnums)) myinitepnum = 1;
                    else myinitepnum = Math.max(...epnums) + 1;
                    if (cc.isStringEmptyNullOrUndefined(mysnums)) myinitsnnum = 1;
                    else myinitsnnum = Math.min(...mysnums);

                    console.log("myinitepnum = " + myinitepnum);
                    console.log("myinitsnnum = " + myinitsnnum);
                    
                    return {"name": myinitname, "description": myinitdescription,
                        "show_id": myinitshowid, "episode_number": myinitepnum,
                        "season_number": myinitsnnum};
                }
            }
            else
            {
                return {"name": myinitname, "description": myinitdescription,
                    "show_id": myinitshowid, "episode_number": myinitepnum,
                    "season_number": myinitsnnum};
            }
        }
        else if (typenm === "Show")
        {
            return {"name": myinitname, "description": myinitdescription,
                "user_id": myinitusrid};
        }
        else throw new Error(typenmerrmsg);
    }

    function myOnSubmitPostDataRequest(values, murl)
    {
        cc.letMustBeDefinedAndNotNull(values, "values");
        cc.letMustBeDefinedAndNotNull(murl, "murl");

        let myconfigobj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(values)
        };
        fetch(murl, myconfigobj).then((res) => res.json())
        .then((data) => {
            console.log(data);
            
            if (data === undefined || data === null)
            {
                setErrMsg("data was empty as the response back from the server!");
                return;
            }
            else
            {
                let dkys = Object.keys(data);
                console.log(dkys);
                for (let n = 0; n < dkys.length; n++)
                {
                    if (dkys[n] === "error")
                    {
                        setErrMsg(data["error"]);
                        return;
                    }
                }
            }

            if (typenm === "Toy" || typenm === "Episode")
            {
                let omky = "" + typenm.toLowerCase() + "_number";
                if (cc.isInteger(data[omky]));
                else throw new Error("the " + omky + " must be defined!");
            }
            else if (typenm === "Show");
            else throw new Error(typenmerrmsg);

            console.log("successfully posted the data to the server!");
            setSuccessMsg("successfully posted the data to the server!");

            history.push(murl);
        }).catch((merr) => {
            console.error("there was an error adding the data to the server!");
            console.error(merr);
            setErrMsg(merr.message);
        });
    }

    //https://stackoverflow.com/questions/71083815/
    //how-do-i-set-initialvalues-of-useformik-to-data-returned-from-an-api-request
    //for the enableReinitialize line only
    const formik = useFormik({
        initialValues: myinitvals,
        enableReinitialize: true,
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log("values = ", values);
            console.log("typenm = " + typenm);
            
            let murl = "";
            if (typenm === "Episode") murl = "/shows/" + values.show_id + "/episodes";
            else if (typenm === "Show") murl = "/shows";
            else if (typenm === "Toy") murl = "/toys";
            else throw new Error(typenmerrmsg);
            console.log("murl = " + murl);

            let doinfofetch = !iserr;
            let dopostfetch = !iserr;
            let getinfofromstate = false;
            if (typenm === "Toy" || typenm === "Episode")
            {
                let mynweps = myeps.filter((item) =>
                    (item.show.id === Number(values.show_id)));
                console.log("values.show_id = " + values.show_id);
                console.log("mynweps = ", mynweps);

                setMyItems(mynweps);
                let myky = "" + typenm.toLowerCase() + "_number";
                values[myky] = mynweps.length + 1;
                console.log("NEW values = ", values);

                if (cc.isInteger(values[myky]));
                else throw new Error("the " + myky + " must be defined!");

                //need to get the owner ID from the SHOW ID
                //then we need to verify it if we are allowed to post or not
                //if the current user ID is the owner ID -> allowed: otherwise not
                if (Number(values.show_id) === Number(params.showid))
                {
                    if (!iserr && useparamshowid) getinfofromstate = true;
                    else
                    {
                        if (iserr);//do not do either fetch and let it error out no access
                        else doinfofetch = true;
                    }
                }
                else doinfofetch = true;
            }
            //else;//do nothing
            console.log("getinfofromstate = " + getinfofromstate);
            console.log("doinfofetch = " + doinfofetch);
            console.log("NEW dopostfetch = " + dopostfetch);
            console.log("iserr = " + iserr);

            if (iserr);
            else
            {
                if (getinfofromstate)
                {
                    console.log("sownerid = " + sownerid);
                    console.log("simpusrobj.id = " + simpusrobj.id);
                    dopostfetch = (sownerid === simpusrobj.id);
                }
                else
                {
                    if (doinfofetch)
                    {
                        dopostfetch = false;
                        //do the post fetch in the then...
                        fetch("/shows/" + values.show_id).then((res) => res.json())
                        .then((data) => {
                            console.log(data);
            
                            if (data === undefined || data === null)
                            {
                                setErrMsg("data was empty as the response back " +
                                    "from the server!");
                                return;
                            }
                            else
                            {
                                let dkys = Object.keys(data);
                                console.log(dkys);
                                for (let n = 0; n < dkys.length; n++)
                                {
                                    if (dkys[n] === "error")
                                    {
                                        setErrMsg(data["error"]);
                                        return;
                                    }
                                }
                            }

                            console.log("successfully set the showname and the owner ID!");
                            setShowName(data.name);
                            setShowOwnerID(data.owner_id);

                            dopostfetch = (Number(data.owner_id) === simpusrobj.id);
                            console.log("FINAL dopostfetch = " + dopostfetch);
            
                            if (dopostfetch) myOnSubmitPostDataRequest(values, murl);
                            else
                            {
                                dopostfetch = false;
                                doinfofetch = false;
                                setErrMsg("You are not allowed to create new Episodes, " +
                                    "Toys, or Shows!");
                            }
                        }).catch((merr) => {
                            console.error("there was an error loading the needed data " +
                                "from the server!");
                            console.error(merr);
                            setErrMsg(merr.message);
                        });
                    }
                    //else;//do nothing
                }
            }
            console.log("FINAL dopostfetch = " + dopostfetch);
            
            if (dopostfetch) myOnSubmitPostDataRequest(values, murl);
            else
            {
                if (doinfofetch) return (<p>Waiting for response...!</p>);
                else
                {
                    setErrMsg("You are not allowed to create new Episodes, " +
                        "Toys, or Shows!");
                }
            }
        },
    });
    console.log(getInitialValuesObjForType(useinitvals, myeps));
    console.log("formik.values = ", formik.values);
    console.log("myinitvals = ", myinitvals);

    if (simpusrobj.access_level === 2);
    else
    {
        console.error(simpusrobj);
        console.error("You are not allowed to create new Episodes, Toys, or Shows!");
        return (<p style={{backgroundColor: "red"}}>
            You are not allowed to create new Episodes, Toys, or Shows!</p>);
    }

    let useerrcolor = false;
    if (!iserr && cc.isStringEmptyNullOrUndefined(errmsg) &&
        cc.isStringEmptyNullOrUndefined(formik.errors.price) &&
        cc.isStringEmptyNullOrUndefined(formik.errors.show_id) &&
        cc.isStringEmptyNullOrUndefined(formik.errors.user_id) &&
        cc.isStringEmptyNullOrUndefined(formik.errors.season_number) &&
        cc.isStringEmptyNullOrUndefined(formik.errors.episode_number) &&
        cc.isStringEmptyNullOrUndefined(formik.errors.name) &&
        cc.isStringEmptyNullOrUndefined(formik.errors.description))
    {
        //useerrcolor = false;//do nothing
    }
    else useerrcolor = true;
    //console.log("useerrcolor = " + useerrcolor);

    let myclassname = "";
    if (useerrcolor) myclassname = "errorcoloronly";
    else myclassname = "horizontal-gradient";
    //console.log("myclassname = " + myclassname);

    let mynwhdrstr = "New " + typenm;
    if (typenm === "Show");
    else if (typenm === "Episode" || typenm === "Toy") mynwhdrstr += " For Show: " + snm;
    else throw new Error(typenmerrmsg);

    return (<div className={myclassname}>
        <h1>{mynwhdrstr}</h1>
        <form onSubmit={formik.handleSubmit}>
            <label id="namelbl" htmlFor="myitemname">{typenm} name: </label>
            <input id="myitemname" type="text" name="name" value={formik.values.name}
                placeholder={"Enter " + typenm + " name"} onChange={formik.handleChange} />
            <p> {formik.errors.name}</p>
            <label id="desclbl" htmlFor="mydesc">Description: </label>
            <input id="mydesc" type="text" name="description" value={formik.values.description}
                style={{minWidth: "1100px", minHeight: "60px"}}
                placeholder={"Enter " + typenm + " description"}
                onChange={formik.handleChange} />
            <p> {formik.errors.description}</p>
            
            {(typenm === "Show") ? <><label id="myusridlbl" htmlFor="myusrid">User ID: </label>
            <input id="myusrid" type="number" step={1} name="user_id"
                onChange={formik.handleChange} value={formik.values.user_id} placeholder={0} />
            <p> {formik.errors.user_id}</p></>: null}
            
            {(typenm === "Show") ? null: <>
            <label id="myswidlbl" htmlFor="myswid">Show ID: </label>
            <input id="myswid" type="number" step={1} name="show_id"
                onChange={formik.handleChange} value={formik.values.show_id} placeholder={0} />
            <p> {formik.errors.show_id}</p></>}
            
            {(typenm === "Episode") ? <>
            <label id="mysnnumlbl" htmlFor="mysnnum">Season #: </label>
            <input id="mysnnum" type="number" step={1} name="season_number" placeholder={0}
                onChange={formik.handleChange} value={formik.values.season_number} />
            <p> {formik.errors.season_number}</p>
            <label id="myepnumlbl" htmlFor="myepnum">Episode #: </label>
            <input id="myepnum" type="number" step={1} name="episode_number" placeholder={0}
                onChange={formik.handleChange} value={formik.values.episode_number} />
            <p> {formik.errors.episode_number}</p></>: null}
            
            {(typenm === "Toy") ? <><label id="mypricelbl" htmlFor="myprice">Price: $</label>
            <input id="myprice" type="number" step="any" name="price" placeholder={0}
                onChange={formik.handleChange} value={formik.values.price} />
            <p> {formik.errors.price}</p></>: null}

            <button type="submit">Create {typenm} Now!</button>
        </form>
        <p>{(useerrcolor) ? errmsg : sucsmsg}</p>
    </div>);
}

export default NewShowToyEpisode;
