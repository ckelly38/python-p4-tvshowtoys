#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Show, Episode, Toy, UserToy, UserEpisodes

# Views go here!
#anyone (not just users, not needed to be logged in) needs to know what:
#shows, episodes, and toys we sell
#anyone should be able to create an account for the site
#a user needs to be able to login and logout
#a user should be allowed to delete their account
#a user should be allowed to change their password
#a user should be allowed to change their username
#a user should be allowed to change their access level (upgrade or downgrade)
#a user should be allowed to get rid of their account
#a user should be allowed to purchase toys, and watch episodes from shows
#a user should be allowed to list the toys, episodes, and shows they have watched
#a user should be allowed to create or delete shows, episodes, and toys
#(if they have that access level)
#a user should be able to change their watch history
#a user should be able to get rid of purchased toys (sell, donate, or throw them out)

class Commonalities:
    def getValidClassList(self):
        return [User, Show, Episode, Toy, UserToy, UserEpisodes];

    def isClsValid(self, cls):
        if (cls == None): return False;
        else: return (cls in self.getValidClassList());

    def getTypeStringForClass(self, cls):
        if (cls == None): raise ValueError("the class must not be null and None!");
        elif (cls == User): return "User";
        elif (cls == Show): return "Show";
        elif (cls == Episode): return "Episode";
        elif (cls == Toy): return "Toy";
        elif (cls == UserToy): return "UserToy";
        elif (cls == UserEpisodes): return "UserEpisodes";
        else:
            raise ValueError("the class must be one of the following: " +
                             f"{self.getValidClassList()}!");

    def getAllOfTypeFromDB(self, cls, retall=True, usrid=0):
        if (retall == True or retall == False): pass;
        else: raise ValueError("retall must be a booleanv value for the variable!");
        if (self.isClsValid(cls)):
            if (retall): return cls.query.all();
            if (cls == UserToy or cls == UserEpisodes):
                if (usrid == None or type(usrid) != int):
                    raise ValueError("usrid must be a number!");
                else: return cls.query.filter_by(user_id=usrid).all();
            else: return cls.query.all();
        else:
            raise ValueError("the class must be one of the following: " +
                             f"{self.getValidClassList()}!");

    def getSerializedItem(self, cls, item, numlisttype=3):
        if (item == None): raise ValueError("the item object must not be null or None!");
        if (numlisttype == None or type(numlisttype) != int):
            raise ValueError("numlisttype must be a number!");
        if (self.isClsValid(cls)):
            if (numlisttype == 1): return item.to_dict(only=cls.safeserializelist);
            elif (numlisttype == 2): return item.to_dict(only=cls.unsafelist);
            elif (numlisttype == 3): return item.to_dict(only=cls.full_list);
            else:
                raise ValueError("numlisttype must be 1 (safe), 2 (unsafe), or 3 (full) only!");
        else:
            raise ValueError("the class must be one of the following: " +
                             f"{self.getValidClassList()}!");

    def getSerializedItemOnly(self, item, numlisttype=3):
        if (item == None): raise ValueError("the item object must not be null or None!");
        elif (numlisttype == None or type(numlisttype) != int):
            raise ValueError("numlisttype must be a number!");
        else: return self.getSerializedItem(type(item), item, numlisttype);

    def getAllOfTypeAndSerializeThem(self, cls, numlisttype=3, retall=True, usrid=0):
        if (numlisttype == None or type(numlisttype) != int):
            raise ValueError("numlisttype must be a number!");
        return [self.getSerializedItem(cls, item, numlisttype)
                for item in self.getAllOfTypeFromDB(cls, retall, usrid)];

    def getItemByID(self, id, cls, usrid=0):
        if (id == None or cls == None or usrid == None):
            raise ValueError("id, usrid and cls must not be null or None!");
        elif (type(id) != int): raise ValueError("id must be an integer!");
        elif (type(usrid) != int): raise ValueError("usrid must be an integer!");
        elif (self.isClsValid(cls)):
            if (cls == UserToy or cls == UserEpisodes):
                if (cls == UserToy):
                    return cls.query.filter_by(user_id=usrid, toy_id=id).first();
                elif (cls == UserEpisodes):
                    return cls.query.filter_by(user_id=usrid, episode_id=id).first();
                else:
                    raise ValueError("the class was UserToy or UserEpisdes, but now it " +
                                     "is not!");
            else: return cls.query.filter_by(id=id).first();
        else:
            raise ValueError("the class must be one of the following: " +
                             f"{self.getValidClassList()}!");

    def getItemByIDAndReturnResponse(self, id, cls, numlisttype=3, usrid=0):
        item = self.getItemByID(id, cls, usrid);
        if (numlisttype == None or type(numlisttype) != int):
            raise ValueError("numlisttype must be a number!");
        if (item == None):
            errmsg = f"404 error item of type {self.getTypeStringForClass(cls)}";
            errmsg += f", with id {id} not found!";
            return {"error": errmsg}, 404;
        else: return self.getSerializedItem(cls, item, numlisttype), 200;

    def isLoggedIn(self, msess):
        if (msess == None): raise ValueError("the session object must be defined!");
        mkys = msess.keys();
        if ("user_id" in mkys): pass;
        else: return False;
        if (type(msess["user_id"]) == int): pass;
        else: raise ValueError("the user_id in the session object must be an integer!");
        if (msess["user_id"] < 1): return False;
        else: return True;
    
    def getUserFromTheSession(self, msess):
        if (self.isLoggedIn(msess)): return self.getItemByID(msess["user_id"], User);
        else: return None;

    def getUserFromTheSessionAndReturnResponse(self, msess, numlisttype=3):
        if (self.isLoggedIn(msess)):
            return self.getItemByIDAndReturnResponse(msess["user_id"], User, numlisttype);
        else: return {"error": "401 error no users logged in!"}, 401;

    def isAuthorized(self, msess):
        usrobj = self.getUserFromTheSession(msess);
        if (usrobj == None): return False;
        else: return (usrobj.access_level == 2);

    def makeSureAuthorized(self, msess):
        if (msess == None): raise ValueError("the session object must be defined!");
        isallowed = False;
        try:
           isallowed = self.isAuthorized(msess);
        except Exception as ex:
            if (ex.message == "User not found with that ID!"):
                errmsg = "404 and 500 error: User not found with that ID ";
                errmsg += f"{msess['user_id']}!\n";
                errmsg += "The user ID was from the session object. At one point it was ";
                errmsg += "valid, but now it is not!\n It seems the user was deleted, but ";
                errmsg += "the ID was not removed from the session object!\n";
                return {"error": errmsg}, 500;
            else: raise ex;
        if (isallowed): return {"message": "authorized"}, 200;
        else:
            errmsg = "401 error you are not allowed to do that. You must be logged in and ";
            errmsg += "have creation/deletion access!";
            return {"error": errmsg}, 401;

    def getDataObjectFromRequest(self, rqst):
        if (rqst == None): raise ValueError("the request object must be defined!");
        rfm = rqst.form;
        rjson = rqst.get_json();
        dataobj = None;
        if (rfm == None or len(rfm) < 1): dataobj = rjson;
        elif (rjson == None or len(rjson) < 1): dataobj = rfm;
        else:
            raise ValueError("the form data and the json data were both empty, but " +
                             "should not have been empty!");
        return dataobj;

    def getUserIDFrom(self, msess, dataobj, param):
        notsession = (msess == None);
        notdata = (dataobj == None);
        if (notsession): pass;
        else:
            if ("user_id" in msess.keys()):
                if (msess["user_id"] == 0): notsession = True;
                else: return msess["user_id"];
            else: notsession = True;
        if (notdata): pass;
        else:
            if ("user_id" in dataobj.keys()):
                if (dataobj["user_id"] == 0): notdata = True;
                else: return dataobj["user_id"];
            else: notdata = True;
        return param;

    def getShowIDFrom(self, dataobj, param):
        notdata = (dataobj == None);
        if (notdata): pass;
        else:
            if ("show_id" in dataobj.keys()):
                if (dataobj["show_id"] == 0): notdata = True;
                else: return dataobj["show_id"];
            else: notdata = True;
        return param;

    def addOrUpdateItemOnDBAndReturnResponse(self, id, cls, rqst, msess, useadd, showid=0,
                                             numlisttype=3, usrid=0):
        #for the generic post
        #we also get the old data object from the db (only difference from patch)
        #we get the data from the request
        #either form OR json (FRONT-END WILL ONLY GIVE JSON DATA)
        #then we need to validate said data...
        #then we need to add it to the db
        #db.session.add(nwobj);
        #db.session.commit();
        #then we need to return a response
        #return cm.getSerializedItem(Episode, nwobj, numlisttype), 201;
        if (numlisttype == None or type(numlisttype) != int):
            raise ValueError("numlisttype must be a number!");
        if (showid == None or type(showid) != int):
            raise ValueError("showid must be a number!");
        if (id == None or type(id) != int): raise ValueError("id must be a number!");
        if (usrid == None or type(usrid) != int): raise ValueError("usrid must be a number!");
        if (useadd == True or useadd == False): pass;
        else: raise ValueError("useadd must be a boolean value!");
        if (msess == None): raise ValueError("the session object must be defined!");
        if (rqst == None): raise ValueError("the request object must be defined!");
        #print(f"useadd = {useadd}");
        #print(cls);
    
        item = None;
        if (useadd): pass;
        else:
            item = self.getItemByID(id, cls, usrid);
            if (item == None):
                errmsg = f"404 error item of type {self.getTypeStringForClass(cls)}";
                errmsg += f", with id {id} not found!";
                return {"error": errmsg}, 404;
        dataobj = self.getDataObjectFromRequest(rqst);
        #print(dataobj);
        if (self.isClsValid(cls)):
            try:
                cls.getValidator().enableValidator();
                if (useadd):
                    #print("DOING POST HERE!");
                    if (cls == User):
                        item = cls(name=dataobj["username"],
                                   access_level=dataobj["access_level"]);
                        item.password_hash = dataobj["password"];
                    elif (cls == Show):
                        item = cls(name=dataobj["name"], description=dataobj["description"],
                                owner_id=msess["user_id"]);
                    elif (cls == Episode):
                        item = cls(name=dataobj["name"], description=dataobj["description"],
                                season_number=dataobj["season_number"],
                                episode_number=dataobj["episode_number"], show_id=showid);
                    elif (cls == Toy):
                        item = cls(name=dataobj["name"], description=dataobj["description"],
                                price=dataobj["price"],
                                show_id=self.getShowIDFrom(dataobj, showid));
                        #show-id comes in the dataobj object: dataobj["show_id"]
                        #show-id comes in as a parameter: showid
                    elif (cls == UserEpisodes):
                        #user-id comes in the session object: msess["user_id"]
                        #user-id comes in the dataobj object: dataobj["user_id"]
                        #user-id comes in as a parameter: usrid 
                        item = cls(user_id=self.getUserIDFrom(msess, dataobj, usrid),
                                   episode_id=dataobj["episode_id"]);
                    elif (cls == UserToy):
                        item = cls(user_id=self.getUserIDFrom(msess, dataobj, usrid),
                                   toy_id=dataobj["toy_id"], quantity=dataobj["quantity"]);
                    else:
                        raise ValueError("the class must be one of the following: " +
                                        f"{self.getValidClassList()}!");
                else:
                    #print("DOING PATCH HERE!");
                    for attr in dataobj:
                        mky = '';
                        if (cls == User):
                            if (attr == "username"): mky = 'name';
                            elif (attr == "password"): mky = 'password_hash';
                            else: mky = '' + attr;
                        else: mky = '' + attr;
                        #print(f"key = {mky}");
                        #print(f"value = {dataobj[attr]}");
                        setattr(item, mky, dataobj[attr]);
                    #print(f"NEW item = {item}");
                db.session.add(item);
                db.session.commit();
            except Exception as ex:
                print(ex);
                errmsg = "422 error invalid data used to ";
                errmsg += f"{('create' if useadd else 'update')}";
                errmsg += f" item of type {self.getTypeStringForClass(cls)}!";
                return {"error": errmsg}, 422;
        else:
            raise ValueError("the class must be one of the following: " +
                             f"{self.getValidClassList()}!");
        statuscode = 0;
        if (useadd): statuscode = 201;
        else: statuscode = 200;
        return self.getSerializedItem(cls, item, numlisttype), statuscode;

    def addItemToDBAndReturnResponse(self, cls, rqst, msess, showid=0, numlisttype=3, usrid=0):
        return self.addOrUpdateItemOnDBAndReturnResponse(0, cls, rqst, msess, True, showid,
                                                         numlisttype, usrid);

    def updateItemOnDBAndReturnResponse(self, id, cls, rqst, msess,
                                        showid=0, numlisttype=3, usrid=0):
        return self.addOrUpdateItemOnDBAndReturnResponse(id, cls, rqst, msess, False, showid,
                                                         numlisttype, usrid);

    def removeItemGivenItemFromDBAndReturnResponse(self, id, cls, item):
        #for the generic delete
        #grab it by its id
        #then remove it from the db
        #db.session.delete(obj);
        #db.session.commit();
        #then return a successful response
        if (item == None):
            errmsg = f"404 error item of type {self.getTypeStringForClass(cls)}";
            errmsg += f", with id {id} not found!";
            return {"error": errmsg}, 404;
        db.session.delete(item);
        db.session.commit();
        msg = f"200 successfully deleted item of type {self.getTypeStringForClass(cls)} ";
        msg += f"with id {id}!";
        return {"message": msg}, 200;

    def removeItemGivenItemOnlyFromDBAndReturnResponse(self, item):
        if (item == None): return {"error": "404 error item must not be null or None"}, 404;
        else: return self.removeItemGivenItemFromDBAndReturnResponse(item.id, type(item), item);

    def removeItemFromDBAndReturnResponse(self, id, cls, usrid=0):
        item = self.getItemByID(id, cls, usrid);
        return self.removeItemGivenItemFromDBAndReturnResponse(id, cls, item);

    def postOrPatchAndReturnResponse(self, cls, rqst, msess, useadd, showid=0, id=0,
                                     numlisttype=3, usrid=0):
        resobj = self.makeSureAuthorized(msess);#returns a tuple for the response
        if (resobj[1] == 200):
            return self.addOrUpdateItemOnDBAndReturnResponse(id, cls, rqst, msess, useadd,
                                                             showid, numlisttype, usrid);
        else: return resobj;

    def completeDeleteItemFromDBAndReturnResponse(self, id, cls, msess):
        resobj = cm.makeSureAuthorized(msess);#returns a tuple for the response
        if (resobj[1] == 200): return cm.removeItemFromDBAndReturnResponse(id, cls);
        else: return resobj;

cm = Commonalities();

#what happens on signup?
#the user enters their desired username, password, and other information
#the request will hold this information in either the form or JSON
#then we need to create the new user (POST)
#the user_id will be added to the session object
#then a successful response will be returned

class Signup(Resource):
    def post(self):
        res = cm.addItemToDBAndReturnResponse(User, request, session, 0, 3);
        #print(res);
        if (res[1] in [200, 201]): session["user_id"] = res[0]["id"];
        return res; 

api.add_resource(Signup, "/signup");

#what happens on login?
#the user enters their username and password
#the request will hold this information in either the form or JSON (PATCH)
#the user_id will be added to the session object
#then a successful response will be returned

class Login(Resource):
    def patch(self):
        dataobj = cm.getDataObjectFromRequest(request);
        usr = User.query.filter_by(name=dataobj["username"]).first();
        badusrnm = True;
        err = (usr == None);
        if (err): pass;
        else:
            if (usr.authenticate(dataobj["password"])):
                session["user_id"] = usr.id;
                return cm.getSerializedItem(User, usr, 3), 200;
            else: badusrnm = False;
        errmsg = f"401 error invalid {('username' if badusrnm else 'password')} given!";
        return {"error": errmsg}, 401;

api.add_resource(Login, "/login");

#what happens on logout?
#sees if a valid user is logged in and if so
#removes the user_id from the session object
#returns a sucessful response
#if not, then returns an error, but the user is already logged out...

class Logout(Resource):
    def get(self):
        usr = cm.getUserFromTheSession(session);
        session["user_id"] = 0;
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return {"message": "successfully logged out!"}, 200;

api.add_resource(Logout, "/logout");

#what happens on preferences?
#all users must be logged in to view this
#this gets the given user's information (GET)
#only accessible once logged in

class MyUser(Resource):
    def get(self):
        return cm.getUserFromTheSessionAndReturnResponse(session, 3);

    def patch(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.updateItemOnDBAndReturnResponse(usr.id, User, request, session, 0, 3);

api.add_resource(MyUser, "/preferences");

#what happens on unsubscribe?
#all users must be logged in to view this
#deletes the user from the list of users and removes all of their information from the DB
#removes the user_id from the session object
#returns a sucessful response (DELETE)

class Unsubscribe(Resource):
    def delete(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.removeItemGivenItemFromDBAndReturnResponse(usr.id, User, usr);

api.add_resource(Unsubscribe, "/unsubscribe");

#what happens on watchlist?
#all users must be logged in to view this
#this gets a list of all of the episodes that the user has watched
#a user is also allowed to add items to this list
#a user is also allowed to remove items from this list

class MyEpisodes(Resource):
    def get(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.getAllOfTypeAndSerializeThem(UserEpisodes, 3, False, usr.id);

    def post(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else:
            return cm.addItemToDBAndReturnResponse(UserEpisodes, request, session, 0, 3,
                                                   usr.id);

api.add_resource(MyEpisodes, "/my-watchlist", "/my-episodes");

class MyEpisodesByID(Resource):
    def get(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.getItemByIDAndReturnResponse(id, UserEpisodes, 3, usr.id);

    def patch(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else:
            return cm.updateItemOnDBAndReturnResponse(id, UserEpisodes, request, session, 0, 3,
                                                      usr.id);

    def delete(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.removeItemFromDBAndReturnResponse(id, UserEpisodes, usr.id);

api.add_resource(MyEpisodesByID, "/my-watchlist/<int:id>", "/my-episodes/<int:id>");

#what happens on my-toys?
#all users must be logged in to view this
#this gets a list of all of the toys that a user has purchased
#a user is allowed to sell or get rid of purchased toys
#a user is allowed to add more items to this list OR
#buy more of one item already bought

class MyToys(Resource):
    def get(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.getAllOfTypeAndSerializeThem(UserToy, 3, False, usr.id);

    def post(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.addItemToDBAndReturnResponse(UserToy, request, session, 0, 3, usr.id);

api.add_resource(MyToys, "/my-toys");

class MyToysByID(Resource):
    def get(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.getItemByIDAndReturnResponse(id, UserToy, 3, usr.id);

    def patch(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else:
            return cm.updateItemOnDBAndReturnResponse(id, UserToy, request, session, 0, 3,
                                                      usr.id);

    def delete(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.removeItemFromDBAndReturnResponse(id, UserToy, usr.id);

api.add_resource(MyToysByID, "/my-toys/<int:id>");

class Episodes(Resource):
    def get(self, showid):
        #get all episodes, then if they have a certain show id add them to the list
        #then serialize said items on the list
        #then return it
        #return cm.getAllOfTypeAndSerializeThem(Episode, numlisttype), 200;
        return [cm.getSerializedItem(Episode, item, 3)
                for item in cm.getAllOfTypeFromDB(Episode) if item.show_id == showid], 200;
        #sw = cm.getItemByID(showid, Show, 0);
        #if (sw == None): return {"error": f"404 error show with id {showid} not found!"}, 404;
        #else: return [cm.getSerializedItem(Episode, ep, 3) for ep in sw.episodes], 200;

    def post(self, showid):
        #you must be logged in first and be authorized
        return cm.postOrPatchAndReturnResponse(Episode, request, session, True, showid, 0, 3);
        
api.add_resource(Episodes, "/shows/<int:showid>/episodes");

class EpisodesByID(Resource):
    def get(self, showid, id):
        return cm.getItemByIDAndReturnResponse(id, Episode, 3);

    def patch(self, id, showid):
        #you must be logged in first and be authorized
        return cm.postOrPatchAndReturnResponse(Episode, request, session, False, showid, id, 3);

    def delete(self, showid, id):
        #you must be logged in first and be authorized
        return cm.completeDeleteItemFromDBAndReturnResponse(id, Episode, session);

api.add_resource(EpisodesByID, "/shows/<int:showid>/episodes/<int:id>");

class Shows(Resource):
    def get(self):
        return cm.getAllOfTypeAndSerializeThem(Show, 1), 200;

    def post(self):
        #you must be logged in first and be authorized
        return cm.postOrPatchAndReturnResponse(Show, request, session, True, 0, 0, 3);

api.add_resource(Shows, "/shows");

class ShowsById(Resource):
    def get(self, id):
        return cm.getItemByIDAndReturnResponse(id, Show, 1);

    def patch(self, id):
        #you must be logged in first and be authorized
        return cm.postOrPatchAndReturnResponse(Show, request, session, False, id, id, 3);

    def delete(self, id):
        #you must be logged in first and be authorized
        return cm.completeDeleteItemFromDBAndReturnResponse(id, Show, session);

api.add_resource(ShowsById, "/shows/<int:id>");

class Toys(Resource):
    def get(self):
        return cm.getAllOfTypeAndSerializeThem(Toy, 3), 200;

    def post(self):
        #you must be logged in first and be authorized
        return cm.postOrPatchAndReturnResponse(Toy, request, session, True, 0, 0, 3);

api.add_resource(Toys, "/toys");

class ToysByID(Resource):
    def get(self, id):
        return cm.getItemByIDAndReturnResponse(id, Toy, 3);

    def patch(self, id):
        #you must be logged in first and be authorized
        return cm.postOrPatchAndReturnResponse(Toy, request, session, False, 0, id, 3);

    def delete(self, id):
        #you must be logged in first and be authorized
        return cm.completeDeleteItemFromDBAndReturnResponse(id, Toy, session);

api.add_resource(ToysByID, "/toys/<int:id>");

class ToysForShow(Resource):
    def get(self, showid):
        return [cm.getSerializedItem(Toy, item, 3)
                for item in cm.getAllOfTypeFromDB(Toy) if item.show_id == showid], 200;
        #sw = cm.getItemByID(showid, Show, 0);
        #if (sw == None): return {"error": f"404 error show with id {showid} not found!"}, 404;
        #else: return [cm.getSerializedItem(Toy, ty, 3) for ty in sw.toys], 200;

    def post(self, showid):
        #you must be logged in first and be authorized
        return cm.postOrPatchAndReturnResponse(Toy, request, session, True, showid, 0, 3);

api.add_resource(ToysForShow, "/shows/<int:showid>/toys");

class ToysForShowByID(Resource):
    def get(self, id, showid):
        return cm.getItemByIDAndReturnResponse(id, Toy, 3);

    def patch(self, id, showid):
        #you must be logged in first and be authorized
        return cm.postOrPatchAndReturnResponse(Toy, request, session, False, showid, id, 3);

    def delete(self, id, showid):
        #you must be logged in first and be authorized
        return cm.completeDeleteItemFromDBAndReturnResponse(id, Toy, session);

api.add_resource(ToysForShowByID, "/shows/<int:showid>/toys/<int:id>");

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

