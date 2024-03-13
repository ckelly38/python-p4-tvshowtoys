import React, { useEffect, useState, useRef } from "react";
import { Switch, Route, Link, useParams, useHistory, Redirect } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import CommonClass from "./commonclass";

function SellToForm({atmost, sellerID, usertoyobj, usemax, buyerisseller, delitemfunc,
        resetstate, typenm="Toy", initbyrIDval=0}){
    const cc = new CommonClass();
    cc.letMustBeDefinedAndNotNull(typenm, "typenm");
    cc.letMustBeDefinedAndNotNull(atmost, "atmost");
    cc.letMustBeDefinedAndNotNull(sellerID, "sellerID");
    cc.letMustBeDefinedAndNotNull(usertoyobj, "usertoyobj");
    cc.letMustBeDefinedAndNotNull(delitemfunc, "delitemfunc");
    cc.letMustBeBoolean(usemax, "usemax");//usemax = usemy
    cc.letMustBeBoolean(buyerisseller, "buyerisseller");
    if (cc.isInteger(atmost) && cc.isInteger(sellerID) && cc.isInteger(initbyrIDval));
    else throw new Error("atmost, sellerID, and initbyrIDval must be integers!");
    if (initbyrIDval < 0) throw new Error("initbyrIDval must be at least 0!");
    if (typenm === "Toy" || typenm === "Show");
    else throw new Error(cc.getTypeErrorMsgFromList(["Toy", "Show"]));

    let [errmsg, setErrMsg] = useState("");
    let [sucsmsg, setSuccessMsg] = useState("");
    let history = useHistory();

    const amtfpart = (usemax ? yup.number().integer().min(0).max(atmost):
        yup.number().integer().min(0));
    const bidfpart = (buyerisseller ? yup.number().integer().min(1):
        yup.number().integer().min(1).notOneOf([sellerID],
            "You must enter something other than the sellerID for the buyerID!"));
    
    const showSchema = yup.object().shape({
        buyerID: bidfpart.required("You must enter the buyer ID!")
        .typeError("You must enter an integer that is at least 1 and up to something!"),
    });
    const toySchema = yup.object().shape({
        buyerID: bidfpart.required("You must enter the buyer ID!")
        .typeError("You must enter an integer that is at least 1 and up to something!"),
        amount: amtfpart.required("You must enter the amount you want to sell!")
        .typeError("You must enter an integer that is at least 0 and up to " +
            atmost + "!"),
    });
    const formSchema = (typenm === "Show" ? showSchema: toySchema);

    function submitToyData(sellerisbuyer, values)
    {
        cc.letMustBeBoolean(sellerisbuyer, "sellerisbuyer");
        cc.letMustBeDefinedAndNotNull(values, "values");

        console.log("INSIDE OF SUBMIT TOY DATA():");
        console.log("values = ", values);
        console.log("sellerisbuyer = " + sellerisbuyer);
        console.log("usertoyobj = ", usertoyobj);

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

                //if using my-toys, then use: usertoyobj.toy.id
                //if not using my-toys, then use: usertoyobj.id
                const mytoyid = (usemax ? usertoyobj.toy.id: usertoyobj.id);
                console.log("mytoyid = " + mytoyid);

                //the buyer has toys
                //but we still don't know if it has our toy
                //if it has our toy, get the old quantity and make a patch
                //if it does not have our toy, make a post
                let buyerdataitem = null;
                let byrusepatch = false;
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
                            if (mybuyertoys[n].toy.id === mytoyid)
                            {
                                //found it
                                buyerdataitem = mybuyertoys[n];
                                byrusepatch = true;
                                break;
                            }
                            //else;//do nothing
                        }
                    }
                }
                console.log("byrusepatch = ", byrusepatch);
                console.log("buyerdataitem = ", buyerdataitem);

                let baseurl = "/my-toys";
                let bmthdnm = "";
                let nwbyval = values.amount;
                let byrurl = "" + baseurl;
                let slrurl = "" + baseurl + "/" + mytoyid;
                if (byrusepatch)
                {
                    byrurl += "/" + mytoyid;
                    bmthdnm = "PATCH";
                    nwbyval += buyerdataitem.quantity;
                }
                else bmthdnm = "POST";
                let nwslval = (sellerisbuyer ? nwbyval:
                    (usertoyobj.quantity - values.amount));
                let bpstdatobj = {
                    "toy_id": mytoyid,
                    "user_id": values.buyerID,
                    "quantity": nwbyval
                };
                let spstdatobj = {
                    "toy_id": mytoyid,
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
                
                console.log("byrurl = " + byrurl);

                fetch(byrurl, buyerconfigobj).then((res) => res.json()).then((mdata) => {
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
                        console.log("sellerisbuyer = " + sellerisbuyer);
                        if (sellerisbuyer)
                        {
                            console.log("buyer is the seller, so all data " +
                                "updated successfully!");
                            setErrMsg("");
                            setSuccessMsg("buyer is the seller, so all data " +
                                "updated successfully!");
                            resetstate();
                            history.push("/redirectme");
                        }
                        else
                        {
                            console.log("seldel = " + seldel);

                            if (seldel) delitemfunc(null);
                            else
                            {
                                console.log("Attempting to update the seller now!");
                                console.log("slrurl = " + slrurl);

                                fetch(slrurl, sellerconfigobj).then((res) => res.json())
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
                                            else if (adkys[n] === "message")
                                            {
                                                setErrMsg(omdata["message"]);
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
    }

    function submitShowData(sellerisbuyer, values)
    {
        cc.letMustBeBoolean(sellerisbuyer, "sellerisbuyer");
        cc.letMustBeDefinedAndNotNull(values, "values");

        //need to patch the shows
        console.log("INSIDE OF SUBMIT SHOW DATA():");
        console.log("values = ", values);
        console.log("sellerisbuyer = " + sellerisbuyer);
        console.log("showobj = usertoyobj = ", usertoyobj);

        //patch must have updated data only
        //"name": usertoyobj.name,
        //"description": usertoyobj.description,
          
        let mynwshowobj = {
            "id": usertoyobj.id,
            "owner_id": values.buyerID,
        };
        let myconfigobj = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(mynwshowobj)
        };
        if (sellerisbuyer)
        {
            setErrMsg("Seller is not allowed to be the buyer for shows!");
        }
        else
        {
            fetch("/shows/" + usertoyobj.id, myconfigobj).then((res) => res.json())
            .then((data) => {
                console.log(data);
                
                if (data === undefined || data === null)
                {
                    setErrMsg("empty response from the shows recieved!");
                    return;
                }
                else
                {
                    let adkys = Object.keys(data);
                    console.log(adkys);
                    for (let n = 0; n < adkys.length; n++)
                    {
                        if (adkys[n] === "error")
                        {
                            setErrMsg(data["error"]);
                            return;
                        }
                    }
                    
                    console.log("shows data updated successfully!");
                    setErrMsg("");
                    setSuccessMsg("shows data updated successfully!");
                    resetstate();
                    history.push("/redirectme");
                }
            }).catch((merr) => {
                console.error("there was an error updating the shows data on the server!");
                console.error(merr);
                setErrMsg(merr.message);
            });
        }
    }

    const formik = useFormik({
        initialValues: {
            amount: 0,
            buyerID: initbyrIDval,
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log("values: ", values);
            console.log("OLD usertoyobj = ", usertoyobj);
            console.log("sellerID = " + sellerID);

            const sellerisbuyer = (sellerID === values.buyerID);
            console.log("sellerisbuyer = " + sellerisbuyer);
            console.log("typenm = " + typenm);

            if (typenm === "Toy") submitToyData(sellerisbuyer, values);
            else submitShowData(sellerisbuyer, values);
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

    let bgcolor = cc.getBGColorToBeUsed(useerrcolor, typenm);
    //lime for login, yellow for signup, pink for prefs
    //console.log("bgcolor = " + bgcolor);

    let hnm = "Transfer " + typenm;
    if (typenm === "Toy") hnm += "(s) Form:";
    else hnm += " Form:";
    return (<div style={{ backgroundColor: bgcolor }}><h1>{hnm}</h1>
    <form onSubmit={formik.handleSubmit}>
        <label id="mybyridlbl" htmlFor="mybyrid">Buyer ID: </label>
        <input id="mybyrid" type="number" step={1} name="buyerID"
            onChange={formik.handleChange} value={formik.values.buyerID} placeholder={0} />
        <p> {formik.errors.buyerID}</p>
        {typenm === "Toy" ? <><label id="myamntlbl" htmlFor="myamnt">Amount: </label>
        <input id="myamnt" type="number" step={1} name="amount"
            onChange={formik.handleChange} value={formik.values.amount} placeholder={0} />
        <p> {formik.errors.amount}</p></>: null}
        <button type="submit">Sell It</button>
        <button type="button" onClick={(event) => history.push("/")}>Cancel</button>
    </form>
    <p>{(useerrcolor) ? errmsg : sucsmsg}</p>
    </div>);
}

export default SellToForm;
