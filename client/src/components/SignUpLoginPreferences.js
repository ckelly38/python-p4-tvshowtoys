import React, { useEffect, useState } from "react";
import { Switch, Route, Link, useParams, useHistory, Redirect } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import CommonClass from "./commonclass";

function SignUpLoginPreferences({typenm, simpusrobj, setuser}) {
    let cc = new CommonClass();
    cc.letMustBeDefinedAndNotNull(typenm, "typenm");
    cc.letMustBeDefinedAndNotNull(simpusrobj, "simpusrobj");
    cc.letMustBeDefinedAndNotNull(setuser, "setuser");

    let [errmsg, setErrMsg] = useState("");
    let [sucsmsg, setSuccessMsg] = useState("");
    let [swpswrd, setShowPassword] = useState(false);
    let history = useHistory();

    const typenmerrmsg = "typenm is invalid! It must be Preferences, SignUp, or Login, " +
        "but it was not!";
    if (typenm === "Preferences" || typenm === "SignUp" || typenm === "Login");
    else throw new Error(typenmerrmsg);

    const prefsSignUpSchema = yup.object().shape({
        username: yup.string().required("You must enter a username!").min(1),
        password: yup.string().required("You must enter a password!").min(1),
        access_level: yup.number().positive().integer().min(1).max(2)
        .required("You must enter the access level!")
        .typeError("You must enter a positive integer that is either 1 or 2 here!"),
    });
    const loginSchema = yup.object().shape({
        username: yup.string().required("You must enter a username!").min(1),
        password: yup.string().required("You must enter a password!").min(1),
    });
    const useprefsorsignupschema = (typenm === "Preferences" || typenm === "SignUp");
    const formSchema = (useprefsorsignupschema ? prefsSignUpSchema : loginSchema);

    //initialvalues for logging in is just a blank username and password
    //for signing up: blank username and password and 1 for access level
    //for updating: whatever is set from the current logged in user
    function getInitialValuesObjForType()
    {
        let myinitusrnm = "";
        let myinitpswrd = "";
        let myinitacslv = 1;
        if (typenm === "SignUp" || typenm === "Login");
        else if (typenm === "Preferences")
        {
            myinitusrnm = "" + simpusrobj.username;
            myinitpswrd = "" + simpusrobj.password;
            myinitacslv = simpusrobj.access_level;
        }
        else
        {
            throw new Error("typenm is invalid! It must be Preferences, SignUp, or Login, " +
                "but it was not!");
        }

        if (typenm === "Login") return {"username": myinitusrnm, "password": myinitpswrd};
        else if (typenm === "SignUp" || typenm === "Preferences")
        {
            return {"username": myinitusrnm, "password": myinitpswrd,
                "access_level": myinitacslv};
        }
        else throw new Error(typenmerrmsg);
    }
    
    const myinitvals = getInitialValuesObjForType();
    const formik = useFormik({
        initialValues: myinitvals,
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log("values: ", values);
            
            let mthdnm = "";
            if (typenm === "SignUp") mthdnm = "POST";
            else if (typenm === "Login" || typenm === "Preferences") mthdnm = "PATCH";
            else throw new Error(typenmerrmsg);
            console.log("mthdnm = " + mthdnm);

            let mytosrvrdataobj = null;
            let usesatleastoneval = true;
            if (typenm === "Preferences")
            {
                //need the new values of what changed ONLY otherwise it will screw up the server
                //need some way to get the OLD values
                usesatleastoneval = false;
                console.log("myinitvals = ", myinitvals);//OLD VALUES
                console.log("values: ", values);//NEW VALUES
                //console.log(formik.values.username);//NEW VALUES
                //console.log(formik.values.password);//NEW VALUES
                //console.log(formik.values.access_level);//NEW VALUES

                //need to know what changed...
                let mkys = Object.keys(myinitvals);
                let valschanged = mkys.map((mky) => (myinitvals[mky] !== values[mky]));
                console.log("valschanged = ", valschanged);
                
                for (let n = 0; n < valschanged.length; n++)
                {
                    cc.letMustBeBoolean(valschanged[n], "valschanged[" + n + "]");
                    
                    if (valschanged[n])
                    {
                        if (cc.isItemNullOrUndefined(mytosrvrdataobj)) mytosrvrdataobj = {};
                        //else;//do nothing
                        mytosrvrdataobj[mkys[n]] = values[mkys[n]];
                        if (usesatleastoneval);
                        else usesatleastoneval = true;
                    }
                }
            }
            else if (typenm === "Login" || typenm === "SignUp") mytosrvrdataobj = values;
            else throw new Error(typenmerrmsg);
            console.log("mytosrvrdataobj = ", mytosrvrdataobj);
            console.log("usesatleastoneval = " + usesatleastoneval);

            if (usesatleastoneval)
            {
                //changes at least one value OR needs to talk to the server

                cc.letMustBeDefinedAndNotNull(mytosrvrdataobj, "mytosrvrdataobj");

                let myconfigobj = {
                    method: mthdnm,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(mytosrvrdataobj)
                };
                let murl = "";
                if (typenm === "Login" || typenm === "Preferences" || typenm === "SignUp")
                {
                    murl = "/" + typenm.toLowerCase();
                }
                else throw new Error(typenmerrmsg);
                console.log("murl = " + murl);
    
                fetch(murl, myconfigobj).then((res) => res.json()).then((data) => {
                    console.log(data);
                    
                    let iserr = cc.isItemNullOrUndefined(data);
                    if (iserr);
                    else
                    {
                        let dkys = Object.keys(data);
                        if (cc.isStringEmptyNullOrUndefined(dkys)) iserr = true;
                        else
                        {
                            for (let n = 0; n < dkys.length; n++)
                            {
                                if (dkys[n] === "error")
                                {
                                    //set the error
                                    setErrMsg(data["error"]);
                                    return;
                                }
                            }
                        }
                    }
    
                    if (iserr)
                    {
                        //set the error
                        setErrMsg("there must have been a response given, but the " +
                            "data was empty!");
                        return;
                    }
                    else
                    {
                        if (typenm === "Login" || typenm === "SignUp" || typenm === "Preferences")
                        {
                            let mysucmsg = "";
                            if (typenm === "SignUp") mysucmsg = "Successfully signed up!";
                            else if (typenm === "Login") mysucmsg = "Successfully logged in!";
                            else mysucmsg = "Successfully updated the preferences!";
                            console.log(mysucmsg);

                            let mynwusr = {...data};
                            mynwusr["password"] = values["password"];

                            setSuccessMsg(mysucmsg);
                            setuser(mynwusr);
                        }
                        else throw new Error(typenmerrmsg);
                    }
                }).catch((err) => {
                    console.error("there was an error attempting to login!");
                    console.error(err);
                    setErrMsg(err.message);
                });
            }
            else
            {
                //does not change any preferences values
                //still ought to acknowledge this to the user
                let mysucmsg = "DID NOT CHANGE ANY PREFERENCES!";
                console.log(mysucmsg);
                if (cc.isStringEmptyNullOrUndefined(errmsg));
                else setErrMsg("");
                setSuccessMsg(mysucmsg);
            }
        },
    });


    let useerrcolor = false;
    if (cc.isStringEmptyNullOrUndefined(errmsg) &&
        cc.isStringEmptyNullOrUndefined(formik.errors.access_level) &&
        cc.isStringEmptyNullOrUndefined(formik.errors.username) &&
        cc.isStringEmptyNullOrUndefined(formik.errors.password))
    {
        //useerrcolor = false;//do nothing
    }
    else useerrcolor = true;
    //console.log("useerrcolor = " + useerrcolor);

    let bgcolor = cc.getBGColorToBeUsed(useerrcolor, typenm);
    //lime for login, yellow for signup, pink for prefs
    //console.log("bgcolor = " + bgcolor);

    let mybtnnm = "";
    if (typenm === "Preferences") mybtnnm = "Update";
    else if (typenm === "Login" || typenm === "SignUp") mybtnnm = "" + typenm;
    else throw new Error(typenmerrmsg);

    return (<div style={{ backgroundColor: bgcolor }}><h1>{typenm}:</h1>
    <form onSubmit={formik.handleSubmit}>
        <label id="usernamelbl" htmlFor="myusername">Username: </label>
        <input id="myusername" type="text" name="username" value={formik.values.username}
            placeholder="Enter your username" autoComplete="username"
            onChange={formik.handleChange} />
        <p> {formik.errors.username}</p>
        <label id="passwordlbl" htmlFor="mypassword">Password: </label>
        <input id="mypassword" type={swpswrd ? "text": "password"} name="password"
            value={formik.values.password} placeholder="Enter your password"
            autoComplete="current-password" onChange={formik.handleChange} />
        <button type="button" onClick={(event) => setShowPassword(!swpswrd)}>
            {(swpswrd ? "Hide": "Show") + " Password"}</button>
        <p> {formik.errors.password}</p>
        {useprefsorsignupschema ? <><label id="myacslvlbl" htmlFor="myacslv">
            Access Level: </label>
        <input id="myacslv" type="number" step={1} name="access_level"
            onChange={formik.handleChange} value={formik.values.access_level} placeholder={0} />
        <p> {formik.errors.access_level}</p></>: null}
        <button type="submit">{mybtnnm}</button>
        <button type="button" onClick={(event) => history.push("/")}>Cancel</button>
    </form>
    <p>{(useerrcolor) ? errmsg : sucsmsg}</p>
    </div>);
}

export default SignUpLoginPreferences;
