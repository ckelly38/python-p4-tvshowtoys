class CommonClass{
    isItemNullOrUndefined(val)
    {
        return (val === undefined || val === null);
    }

    isStringEmptyNullOrUndefined(stra)
    {
        return (this.isItemNullOrUndefined(stra) || stra.length < 1);
    }
    
    letMustBeDefinedAndNotNull(val, vnm="varnm")
    {
        let varnm = "";
        if (this.isStringEmptyNullOrUndefined(vnm)) varnm = "varnm";
        else varnm = "" + vnm;
        if (this.isItemNullOrUndefined(val))
        {
            throw new Error("" + varnm + " must be a defined variable!");
        }
    }

    letMustBeBoolean(val, vnm="boolvarnm")
    {
        let varnm = "";
        if (this.isStringEmptyNullOrUndefined(vnm)) varnm = "boolvarnm";
        else varnm = "" + vnm;
        if (this.isItemNullOrUndefined(val))
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
        //if (this.isStringEmptyNullOrUndefined(vnm)) varnm = "numvarnm";
        //else varnm = "" + vnm;
        if (this.isItemNullOrUndefined(val)) return false;
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
        if (this.isStringEmptyNullOrUndefined(mstrs)) return false;
        else
        {
            for (let n = 0; n < mstrs.length; n++)
            {
                if (this.isItemNullOrUndefined(mstrs[n]))
                {
                    if (this.isItemNullOrUndefined(stra)) return true;
                }
                else
                {
                    if (this.isItemNullOrUndefined(stra));
                    else
                    {
                        if (stra === mstrs[n]) return true;
                    }
                }
            }

            return false;
        }
    }

    countNumberOfACharInString(mchar, stra)
    {
        if (this.isStringEmptyNullOrUndefined(stra)) return 0;
        else if (this.isItemNullOrUndefined(mchar)) return 0;
        else
        {
            let numc = 0;
            for (let n = 0; n < stra.length; n++) if (stra.charAt(n) === mchar) numc++;
            return numc;
        }
    }
}

export default CommonClass;
