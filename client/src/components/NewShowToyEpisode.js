import React, { useEffect, useState } from "react";
import { Switch, Route, Link, useParams, useHistory, Redirect } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import CommonClass from "./commonclass";

function NewShowToyEpisode({typenm, simpusrobj}) {
    const params = useParams();

    let cc = new CommonClass();
    cc.letMustBeDefinedAndNotNull(typenm, "typenm");
    cc.letMustBeDefinedAndNotNull(simpusrobj, "simpusrobj");

    console.log("BEGIN COMPONENT WORK FOR NEW-SHOW-EPISODE-TOY COMPONENT HERE:");
    console.log("SET INITIAL VALUES OBJ HERE (NO FETCH):");

    let [errmsg, setErrMsg] = useState("");
    let [sucsmsg, setSuccessMsg] = useState("");
    let [snm, setShowName] = useState("Show Name");
    let [useinitvals, setUseInitValues] = useState(true);
    let [myeps, setMyEps] = useState([]);

    console.log("useinitvals = " + useinitvals);
    console.log("myeps = ", myeps);

    let [myinitvals, setMyInitValuesObj] = useState(getInitialValuesObjForType(useinitvals, myeps));

    console.log("AFTER INITIAL CALL TO SET INITIAL VALUES OBJ!");

    const iserr = (simpusrobj.access_level !== 2);

    const typenmerrmsg = "typenm is invalid! It must be Episode, Toy, or Show, but it was not!";
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
        price: yup.number().positive().min(1)
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
                    
                    console.log("successfully set the showname!");
                    setShowName(data.name);
                }

                fetch("/shows/" + mysid + "/episodes").then((res) => res.json())
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
                        setMyEps(data);
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
            console.log("SET INITIAL VALUES OBJ HERE (NO FETCH):");
            console.log("useinitvals = " + useinitvals);
            console.log("myeps = " + myeps);
            setMyInitValuesObj(getInitialValuesObjForType(useinitvals, myeps));
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
                myinitshowid = params.showid;
                useparamshowid = true;
            }
            //else;//do nothing
            console.log("useparamshowid = " + useparamshowid);
            console.log("myinitshowid = " + myinitshowid);
            console.log("museinitvals = " + museinitvals);
            console.log("mdata = ", mdata);

            if (typenm === "Toy")
            {
                return {"name": myinitname, "description": myinitdescription,
                    "show_id": myinitshowid, "price": myinitprice};
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

                    myinitepnum = Math.max(...epnums);
                    myinitsnnum = Math.min(...mysnums);

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
            return {"name": myinitname, "description": myinitdescription, "user_id": myinitusrid};
        }
        else throw new Error(typenmerrmsg);
    }

    
    const formik = useFormik({
        initialValues: getInitialValuesObjForType(useinitvals, myeps),
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log("values = ", values);
            //do something here...
            return null;
        },
    });
    console.log(getInitialValuesObjForType(useinitvals, myeps));
    console.log("formik.values = ", formik.values);

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
                placeholder={"Enter " + typenm + " description"} onChange={formik.handleChange} />
            <p> {formik.errors.description}</p>
            
            {(typenm === "Show") ? <><label id="myusridlbl" htmlFor="myusrid">User ID: </label>
            <input id="myusrid" type="number" step={1} name="user_id"
                onChange={formik.handleChange} value={formik.values.user_id} placeholder={0} />
            <p> {formik.errors.user_id}</p></>: null}
            
            {(typenm === "Show") ? null: <><label id="myswidlbl" htmlFor="myswid">Show ID: </label>
            <input id="myswid" type="number" step={1} name="show_id"
                onChange={formik.handleChange} value={formik.values.show_id} placeholder={0} />
            <p> {formik.errors.show_id}</p></>}
            
            {(typenm === "Episode") ? <><label id="mysnnumlbl" htmlFor="mysnnum">Season #: </label>
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
