class CommonClass{
    letMustBeDefinedAndNotNull(val, vnm="varnm")
    {
        let varnm = "";
        if (vnm === undefined || vnm === null || vnm.length < 1) varnm = "varnm";
        else varnm = "" + vnm;
        if (val === undefined || val === null)
        {
            throw new Error("" + varnm + " must be a defined variable!");
        }
    }

    letMustBeBoolean(val, vnm="boolvarnm")
    {
        let varnm = "";
        if (vnm === undefined || vnm === null || vnm.length < 1) varnm = "boolvarnm";
        else varnm = "" + vnm;
        if (val === undefined || val === null)
        {
            throw new Error("" + varnm + " must be a defined boolean variable!");
        }
        else
        {
            if (val === true || val === false);
            else throw new Error("" + varnm + " must be a defined boolean variable!");
        }
    }

    isNumberOrInteger(val, useint=false)//, vnm="numvarnm"
    {
        this.letMustBeBoolean(useint, "useint");
        
        //let varnm = "";
        //if (vnm === undefined || vnm === null || vnm.length < 1) varnm = "numvarnm";
        //else varnm = "" + vnm;
        if (val === undefined || val === null) return false;
        else
        {
            if (isNaN(val)) return false;
            else
            {
                try
                {
                    let num = Number(val);
                    if (useint) return (num == parseInt(val));
                    else return true;
                }
                catch(ex)
                {
                    return false;
                }
            }
        }
    }
    isInteger(val)//, vnm="numvarnm"
    {
        return this.isNumberOrInteger(val, true);//, vnm
    }
    isNumber(val)//, vnm="numvarnm"
    {
        return this.isNumberOrInteger(val, false);//, vnm
    }

    isStringAOnStringBList(stra, mstrs)
    {
        if (mstrs === undefined || mstrs === null || mstrs.length < 1) return false;
        else
        {
            for (let n = 0; n < mstrs.length; n++)
            {
                if (mstrs[n] === undefined || mstrs[n] === null)
                {
                    if (stra === undefined || stra === null) return true;
                }
                else
                {
                    if (stra === undefined || stra === null);
                    else
                    {
                        if (stra === mstrs[n]) return true;
                    }
                }
            }

            return false;
        }
    }
}

export default CommonClass;
