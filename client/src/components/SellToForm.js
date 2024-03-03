import React, { useEffect, useState, useRef } from "react";
import { Switch, Route, Link, useParams, useHistory, Redirect } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import CommonClass from "./commonclass";

function SellToForm({atmost, sellerID}){
    const cc = new CommonClass();
    cc.letMustBeDefinedAndNotNull(atmost);
    cc.letMustBeDefinedAndNotNull(sellerID);
    if (cc.isInteger(atmost) && cc.isInteger(sellerID));
    else throw new Error("atmost and sellerID must both be integers!");

    let [errmsg, setErrMsg] = useState("");
    let [sucsmsg, setSuccessMsg] = useState("");
    let history = useHistory();

    const formSchema = yup.object().shape({
        buyerID: yup.number().integer().min(1)
        .notOneOf([sellerID], "You must enter something other than the sellerID for the buyerID!")
        .required("You must enter the buyer ID!")
        .typeError("You must enter an integer that is at least 1 and up to something!"),
        amount: yup.number().integer().min(0).max(atmost)
        .required("You must enter the amount you want to sell!")
        .typeError("You must enter an integer that is at least 0 and up to " + atmost + "!"),
    });

    const formik = useFormik({
        initialValues: {
            amount: 0,
            buyerID: 0,
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log("values: ", values);
        },
    });


    let useerrcolor = false;
    if (cc.isStringEmptyNullOrUndefined(errmsg) &&
        cc.isStringEmptyNullOrUndefined(formik.errors.buyerID) &&
        cc.isStringEmptyNullOrUndefined(formik.errors.amount))
    {
        //useerrcolor = false;//do nothing
    }
    else useerrcolor = true;
    //console.log("useerrcolor = " + useerrcolor);

    let bgcolor = cc.getBGColorToBeUsed(useerrcolor, "Toy");
    //lime for login, yellow for signup, pink for prefs
    //console.log("bgcolor = " + bgcolor);

    return (<div style={{ backgroundColor: bgcolor }}><h1>Sell Toy(s) Form:</h1>
    <form onSubmit={formik.handleSubmit}>
        <label id="mybyridlbl" htmlFor="mybyrid">Buyer ID: </label>
        <input id="mybyrid" type="number" step={1} name="buyerID"
            onChange={formik.handleChange} value={formik.values.buyerID} placeholder={0} />
        <p> {formik.errors.buyerID}</p>
        <label id="myamntlbl" htmlFor="myamnt">Amount: </label>
        <input id="myamnt" type="number" step={1} name="amount"
            onChange={formik.handleChange} value={formik.values.amount} placeholder={0} />
        <p> {formik.errors.amount}</p>
        <button type="submit">Sell It</button>
        <button type="button" onClick={(event) => history.push("/")}>Cancel</button>
    </form>
    <p>{(useerrcolor) ? errmsg : sucsmsg}</p>
    </div>);
}

export default SellToForm;
