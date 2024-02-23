import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import CommonClass from "./commonclass";

function Login({setuser=null})
{
    //we want the user to enter a username and a password
    //both the username and the passwords cannot be blank
    //the username must be on the list of usernames
    //the password must be on the list of passwords

    let [errmsg, setErrMsg] = useState("");
    let [isin, setLoggedIn] = useState(false);
    const cc = new CommonClass();

    const formSchema = yup.object().shape({
        username: yup.string().required("You must enter a username!").min(1),
        password: yup.string().required("You must enter a password!").min(1),
    });

    const formik = useFormik({
        initialValues: {
          username: "",
          password: "",
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log("login-values: ", values);
            let myconfigobj = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(values)
            };
            fetch("/login", myconfigobj).then((res) => res.json()).then((data) => {
                console.log(data);
                
                let iserr = (data === undefined || data === null);
                if (iserr);
                else
                {
                    let dkys = Object.keys(data);
                    if (dkys === undefined || dkys === null || dkys.length < 1) iserr = true;
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
                    setErrMsg("there must have been a response given, but the data was empty!");
                    return;
                }
                else
                {
                    //finish logging in
                    console.log("Successfully logged in!");
                    let mynwusr = {...data};
                    mynwusr["password"] = values["password"];

                    setLoggedIn(true);
                    setuser(mynwusr);
                }
            }).catch((err) => {
                console.error("there was an error attempting to login!");
                console.error(err);
                setErrMsg(err.message);
            });
        },
    });


    let useerrcolor = false;
    if (cc.isStringEmptyNullOrUndefined(errmsg) &&
        cc.isStringEmptyNullOrUndefined(formik.errors.username) &&
        cc.isStringEmptyNullOrUndefined(formik.errors.password))
    {
        //useerrcolor = false;//do nothing
    }
    else useerrcolor = true;
    //console.log("useerrcolor = " + useerrcolor);

    let bgcolor = (useerrcolor ? "red" : "lime");
    //console.log("bgcolor = " + bgcolor);
    
    return (<div style={{ backgroundColor: bgcolor }}><h1>Login</h1>
        <form onSubmit={formik.handleSubmit}>
            <label id="usernamelbl" htmlFor="myusername">Username: </label>
            <input id="myusername" type="text" name="username" value={formik.values.username}
                placeholder="Enter your username" onChange={formik.handleChange} />
            <p> {formik.errors.username}</p>
            <label id="passwordlbl" htmlFor="mypassword">Password: </label>
            <input id="mypassword" type="password" name="password" value={formik.values.password}
                placeholder="Enter your password" onChange={formik.handleChange} />
            <p> {formik.errors.password}</p>
            <button type="submit">Submit</button>
        </form>
        <p>{(isin) ? "Successfully logged in!" : errmsg}</p>
    </div>);
}

export default Login;
