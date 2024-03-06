import React, { useEffect, useState, useRef } from "react";
import { Switch, Route, Link, useParams, useHistory, Redirect } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import CommonClass from "./commonclass";

function SellToForm({atmost, sellerID, usertoyobj, delitemfunc, resetstate}){
    const cc = new CommonClass();
    cc.letMustBeDefinedAndNotNull(atmost);
    cc.letMustBeDefinedAndNotNull(sellerID);
    cc.letMustBeDefinedAndNotNull(usertoyobj);
    cc.letMustBeDefinedAndNotNull(delitemfunc);
    if (cc.isInteger(atmost) && cc.isInteger(sellerID));
    else throw new Error("atmost and sellerID must both be integers!");

    let [errmsg, setErrMsg] = useState("");
    let [sucsmsg, setSuccessMsg] = useState("");
    let history = useHistory();

    const formSchema = yup.object().shape({
        buyerID: yup.number().integer().min(1)
        .notOneOf([sellerID], "You must enter something other than the " +
            "sellerID for the buyerID!")
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
            console.log("OLD usertoyobj = ", usertoyobj);
            console.log("sellerID = " + sellerID);
            fetch("/all-user-toy-data").then((res) => res.json()).then((data) => {
                console.log(data);
                if (data === undefined || data === null)
                {
                    setErrMsg("there is no user toy data because response was empty!");
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
                
                    let mybuyertoys = data.filter((mitem) =>
                        (mitem.user.id === values.buyerID));
                    console.log("mybuyertoys = ", mybuyertoys);
                    console.log("values: ", values);
                    console.log("OLD usertoyobj = ", usertoyobj);
                    console.log("sellerID = " + sellerID);

                    //the buyer has toys
                    //but we still don't know if it has our toy
                    //if it has our toy, get the old quantity and make a patch
                    //if it does not have our toy, make a post
                    let buyerdataitem = null;
                    let usepatch = false;
                    //no buyer toys that means POST
                    if (cc.isStringEmptyNullOrUndefined(mybuyertoys));
                    else
                    {
                        //buyer has toys, but it may not be the one we are looking for
                        for (let n = 0; n < mybuyertoys.length; n++)
                        {
                            if (cc.isItemNullOrUndefined(mybuyertoys[n]))
                            {
                                setErrMsg("no undefined items must be on the buyers " +
                                    "toys list!");
                                return;
                            }
                            else
                            {
                                if (mybuyertoys[n].toy.id === usertoyobj.toy.id)
                                {
                                    //found it
                                    buyerdataitem = mybuyertoys[n];
                                    usepatch = true;
                                    break;
                                }
                                //else;//do nothing
                            }
                        }
                    }
                    console.log("usepatch = ", usepatch);
                    console.log("buyerdataitem = ", buyerdataitem);

                    let murl = "/my-toys";
                    let bmthdnm = "";
                    let nwbyval = values.amount;
                    let nwslval = usertoyobj.quantity - values.amount;
                    if (usepatch)
                    {
                        murl += "/" + usertoyobj.toy.id;
                        bmthdnm = "PATCH";
                        nwbyval += buyerdataitem.quantity;
                    }
                    else bmthdnm = "POST";
                    let bpstdatobj = {
                        "toy_id": usertoyobj.toy.id,
                        "user_id": values.buyerID,
                        "quantity": nwbyval
                    };
                    let spstdatobj = {
                        "toy_id": usertoyobj.toy.id,
                        "user_id": sellerID,
                        "quantity": nwslval
                    };
                    let buyerconfigobj = {
                        method: bmthdnm,
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify(bpstdatobj)
                    };
                    let sellerconfigobj = {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify(spstdatobj)
                    };
                    console.log("nwbyval = " + nwbyval);
                    console.log("nwslval = " + nwslval);

                    let seldel = (nwslval === 0);
                    let nofetch = false;
                    if (nwslval === 0);//call the delete method from the parent component
                    else if (0 < nwslval);//make the seller patch
                    else
                    {
                        nofetch = true;
                        setErrMsg("seller new value must not be negative!");
                        return;
                    }
                    console.log("seldel = " + seldel);
                    console.log("nofetch = " + nofetch);

                    if (nofetch) return;

                    fetch(murl, buyerconfigobj).then((res) => res.json()).then((mdata) => {
                        console.log(mdata);

                        if (mdata === undefined || mdata === null)
                        {
                            setErrMsg("there is no user toy data because response was empty!");
                            return;
                        }
                        else
                        {
                            let odkys = Object.keys(mdata);
                            console.log(odkys);
                            for (let n = 0; n < odkys.length; n++)
                            {
                                if (odkys[n] === "error")
                                {
                                    setErrMsg(mdata["error"]);
                                    return;
                                }
                            }

                            console.log("buyer data updated successfully!");

                            if (seldel) delitemfunc(null);
                            else
                            {
                                fetch(murl, sellerconfigobj).then((res) => res.json())
                                .then((omdata) => {
                                    console.log(omdata);
            
                                    if (omdata === undefined || omdata === null)
                                    {
                                        setErrMsg("there is no user toy data " +
                                            "because response was empty!");
                                        return;
                                    }
                                    else
                                    {
                                        let adkys = Object.keys(omdata);
                                        console.log(adkys);
                                        for (let n = 0; n < adkys.length; n++)
                                        {
                                            if (adkys[n] === "error")
                                            {
                                                setErrMsg(omdata["error"]);
                                                return;
                                            }
                                        }
            
                                        console.log("seller data updated successfully!");
                                        setErrMsg("");
                                        setSuccessMsg("seller and buyer data " +
                                            "updated successfully!");
                                        resetstate();
                                        history.push("/redirectme");
                                    }
                                }).catch((omerr) => {
                                    console.error("there was an error putting the data " +
                                        "on the server for the seller!");
                                    console.error(omerr);
                                    setErrMsg(omerr.message);
                                });
                            }
                        }
                    }).catch((omerr) => {
                        console.error("there was an error putting the data on the " +
                            "server for the buyer!");
                        console.error(omerr);
                        setErrMsg(omerr.message);
                    });
                }
            }).catch((merr) => {
                console.error("there was an error getting the data from the server!");
                console.error(merr);
                setErrMsg(merr.message);
            });
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
    console.log("useerrcolor = " + useerrcolor);

    let bgcolor = cc.getBGColorToBeUsed(useerrcolor, "Toy");
    //lime for login, yellow for signup, pink for prefs
    //console.log("bgcolor = " + bgcolor);

    return (<div style={{ backgroundColor: bgcolor }}><h1>Transfer Toy(s) Form:</h1>
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
