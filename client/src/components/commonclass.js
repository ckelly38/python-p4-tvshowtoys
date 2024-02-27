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

    getBGColorToBeUsed(err, typenm)
    {
        this.letMustBeBoolean(err, "err");
        this.letMustBeDefinedAndNotNull(typenm, "typenm");

        let mybgcolor = "";
        if (err) mybgcolor = "red";
        else
        {
            if (typenm === "Episode") mybgcolor = "cyan";
            else if (typenm === "Toy") mybgcolor = "orange";
            else if (typenm === "Show") mybgcolor = "yellow";
            else throw new Error("typenm must be Episode, Toy, or Show, but it was not!");
        }
        return mybgcolor;
    }

    getAcceptedNamesForNumEpisodesPerSeason()
    {
        return ["~ Total Episodes/Season", "Approximate Total Episodes/Season",
            "Approximate Total Episodes Per Season", "Rough Total Episodes Per Season",
            "Rough Total Episodes/Season", "Rough Total Episodes /Season",
            "Rough Total Episodes/ Season", "Rough Total Episodes / Season",
            "Approximate Total Episodes /Season", "Approximate Total Episodes/ Season",
            "Approximate Total Episodes / Season", "~ Total Episodes /Season",
            "~ Total Episodes/ Season", "~ Total Episodes / Season"];
    }

    getCSSClassNameForHeader(hstr, usecntr=false)
    {
        this.letMustBeDefinedAndNotNull(hstr, "hstr");
        this.letMustBeBoolean(usecntr, "usecntr");
        
        let mycntrtxtnm = "";
        if (usecntr) mycntrtxtnm = "align";

        if (hstr === "Season #") return "seasnum" + mycntrtxtnm;
        else if (hstr === "Episode #") return "epnum" + mycntrtxtnm;
        else if (hstr === "Price") return "epnum" + mycntrtxtnm;
        else if (hstr === "# Of Episodes") return "seasnum" + mycntrtxtnm;
        else if (hstr === "# Of Seasons") return "seasnum" + mycntrtxtnm;
        else if (this.isStringAOnStringBList(hstr, this.getAcceptedNamesForNumEpisodesPerSeason()))
        {
            return "seasnum" + mycntrtxtnm;
        }
        else if (0 <= hstr.indexOf("Name") && hstr.indexOf("Name") < hstr.length) return "namecol";
        else return "border";
    }

    getHeadersForType(typenm, useindivdisp=false)
    {
        this.letMustBeBoolean(useindivdisp, "useindivdisp");
        this.letMustBeDefinedAndNotNull(typenm, "typenm");

        let hlist = null;
        if (typenm === "Episode")
        {
            console.log("useindivdisp = " + useindivdisp);

            let shortephlist = ["Name", "Season #", "Episode #", "Watch Link", "Description"];
            let longephlist = ["Show Name", "Name", "Season #", "Episode #", "Watch Link",
                "Description"];
            if (useindivdisp) return longephlist;
            else return shortephlist;
        }
        else if (typenm === "Toy")
        {
            hlist = ["Name", "Show Name", "Price", "Description"];
            if (useindivdisp)
            {
                let tempitem = "" + hlist[0];
                hlist[0] = "" + hlist[1];
                hlist[1] = "" + tempitem;
            }
        }
        else if (typenm === "Show")
        {
            hlist = ["Name", "# Of Seasons", "# Of Episodes", "~ Total Episodes/Season",
                "Episodes Link", "Toys Link", "Description"];
        }
        else throw new Error("typenm must be Episode, Toy, or Show, but it was not!");
        return hlist;
    }
    isHeaderCentered(hstr)
    {
        //for episodes the headers are:
        //episode name
        //season number (center)
        //episode number (center)
        //watch link
        //description

        //for shows the headers are:
        //name
        //total seasons (center)
        //total episodes (center)
        //~ total episodes/season (center)
        //episodes link
        //description

        //for toys the headers are:
        //name
        //showname
        //price (center)
            //description

        let centeredheaders = ["Season #", "Episode #", "Price", "# Of Episodes", "# Of Seasons",
            "# Of Episodes", "~ Total Episodes/Season"];
        this.letMustBeDefinedAndNotNull(hstr, "hstr");
        for (let n = 0; n < centeredheaders.length; n++)
        {
            if (hstr === centeredheaders[n]) return true;
        }
        return false;
    }
    getAreHeadersForTypeCentered(myhlist = this.getHeadersForType())
    {
        if (myhlist === undefined || myhlist === null) return null;
        else return myhlist.map((item) => this.isHeaderCentered(item));
    }

    getTheDataKeyNameFromString(mstr,
        epspersnnameslist=this.getAcceptedNamesForNumEpisodesPerSeason())
    {
        let myoepsnameslist = null;
        if (epspersnnameslist === undefined || epspersnnameslist === null ||
            epspersnnameslist.length < 10)
        {
            myoepsnameslist = this.getAcceptedNamesForNumEpisodesPerSeason();
        }
        else myoepsnameslist = epspersnnameslist;
        //console.log("myoepsnameslist = ", myoepsnameslist);

        let mky = "";
        if (mstr === "Show Name") mky = "showname";
        else if (mstr === "Season #") mky = "season_number";
        else if (mstr === "Episode #") mky = "episode_number";
        else if (mstr === "# Of Episodes") mky = "totalepisodes";
        else if (mstr === "# Of Seasons") mky = "numseasons";
        else if (this.isStringAOnStringBList(mstr, myoepsnameslist))
        {
            mky = "numepisodesperseason";
        }
        else if (mstr === "Watch Link" || mstr === "Episodes Link" || mstr === "Toys Link");
        else mky = "" + mstr.toLowerCase();
        return mky;
    }

    addItemToBeginningOfList(myotds, usemytd, pusemy)
    {
        this.letMustBeDefinedAndNotNull(myotds, "myotds");
        this.letMustBeBoolean(pusemy, "pusemy");

        let mytds = null;
        if (pusemy)
        {
            this.letMustBeDefinedAndNotNull(usemytd, "usemytd");

            mytds = [usemytd];
            myotds.forEach((item) => {
                mytds.push(item);
            });
        }
        else mytds = myotds;
        return mytds;
    }
}

export default CommonClass;
