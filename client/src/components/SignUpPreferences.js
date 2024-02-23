import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import CommonClass from "./commonclass";

function SignUpPreferences({typenm, simpusrobj}) {
    let cc = new CommonClass();
    cc.letMustBeDefinedAndNotNull(typenm, "typenm");

    const typenmerrmsg = "typenm is invalid! It must be Preferences, SignUp, or Login, but it " +
        "was not!";
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
            return {"username": myinitusrnm, "password": myinitpswrd, "access_level": myinitacslv};
        }
        else throw new Error(typenmerrmsg);
    }
    

    const formik = useFormik({
        initialValues: getInitialValuesObjForType(),
        validationSchema: formSchema,
        onSubmit: null,
    });

    let useerrcolor = false;
    if (cc.isStringEmptyNullOrUndefined(formik.errors.access_level) &&
        cc.isStringEmptyNullOrUndefined(formik.errors.username) &&
        cc.isStringEmptyNullOrUndefined(formik.errors.password))
    {
        //useerrcolor = false;//do nothing
    }
    else useerrcolor = true;
    //console.log("useerrcolor = " + useerrcolor);

    let bgcolor = (useerrcolor ? "red" : "yellow");
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
            placeholder="Enter your username" onChange={formik.handleChange} />
        <p> {formik.errors.username}</p>
        <label id="passwordlbl" htmlFor="mypassword">Password: </label>
        <input id="mypassword" type="text" name="password" value={formik.values.password}
            placeholder="Enter your password" onChange={formik.handleChange} />
        <p> {formik.errors.password}</p>
        {useprefsorsignupschema ? <><label id="myacslvlbl" htmlFor="myacslv">Access Level: </label>
        <input id="myacslv" type="number" step={1} name="access_level"
            onChange={formik.handleChange} value={formik.values.access_level} placeholder={0} />
        <p> {formik.errors.access_level}</p></>: null}
        <button type="submit">{mybtnnm}</button>
    </form></div>);
}

export default SignUpPreferences;
