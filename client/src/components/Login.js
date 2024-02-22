import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

function Login(props)
{
    //we want the user to enter a username and a password
    //both the username and the passwords cannot be blank
    //the username must be on the list of usernames
    //the password must be on the list of passwords

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
        onSubmit: null,
    });
    
    return (<div><h1>Login</h1>
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="usernamelbl">Username: </label>
            <input type="text" name="username" value={formik.values.username}
                placeholder="Enter your username" onChange={formik.handleChange} />
            <p style={{ color: "red" }}> {formik.errors.username}</p>
            <label htmlFor="passwordlbl">Password: </label>
            <input type="password" name="password" value={formik.values.password}
                placeholder="Enter your password" onChange={formik.handleChange} />
            <p style={{ color: "red" }}> {formik.errors.password}</p>
            <button type="submit">Submit</button>
        </form>
    </div>);
}

export default Login;
