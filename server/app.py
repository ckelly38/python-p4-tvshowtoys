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
#a user should be allowed to change their username (maybe)
#a user should be allowed to purchase toys, and watch episodes from shows
#a user should be allowed to list the toys, episodes, and shows they have watched
#a user should be allowed to create or delete shows, episodes, and toys
#(if they have that access level)
#a user should be allowed to change their access level (upgrade or downgrade)
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

    def getAllOfTypeFromDB(self, cls):
        if (self.isClsValid(cls)): return cls.query.all();
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

    def getAllOfTypeAndSerializeThem(self, cls, numlisttype=3):
        if (numlisttype == None or type(numlisttype) != int):
            raise ValueError("numlisttype must be a number!");
        return [self.getSerializedItem(cls, item, numlisttype)
                for item in self.getAllOfTypeFromDB(cls)];

    def getItemByID(self, id, cls):
        if (id == None or cls == None):
            raise ValueError("id and cls must not be null or None!");
        elif (type(id) != int): raise ValueError("id must be an integer!");
        elif (self.isClsValid(cls)): return cls.query.filter_by(id=id).first();
        else:
            raise ValueError("the class must be one of the following: " +
                             f"{self.getValidClassList()}!");

    def getItemByIDAndReturnResponse(self, id, cls, numlisttype=3):
        item = self.getItemByID(id, cls);
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

    def isAuthorized(self, msess):
        if (self.isLoggedIn(msess)): pass;
        else: return False;
        usrobj = self.getItemByID(msess["user_id"], User);
        if (usrobj == None): raise Exception("User not found with that ID!");
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

    def addOrUpdateItemOnDBAndReturnResponse(self, id, cls, rqst, msess, useadd, showid=0,
                                             numlisttype=3):
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
        if (useadd == True or useadd == False): pass;
        else: raise ValueError("useadd must be a boolean value!");
        if (msess == None): raise ValueError("the session object must be defined!");
        if (rqst == None): raise ValueError("the request object must be defined!");
    
        item = None;
        if (useadd): pass;
        else:
            item = self.getItemByID(id, cls);
            if (item == None):
                errmsg = f"404 error item of type {self.getTypeStringForClass(cls)}";
                errmsg += f", with id {id} not found!";
                return {"error": errmsg}, 404;
        rfm = rqst.form;
        rjson = rqst.get_json();
        dataobj = None;
        if (rfm == None or len(rfm) < 1): dataobj = rjson;
        elif (rjson == None or len(rjson) < 1): dataobj = rfm;
        else:
            raise ValueError("the form data and the json data were both empty, but " +
                             "should not have been empty!");
        if (self.isClsValid(cls)):
            try:
                cls.getValidator().enableValidator();
                if (useadd):
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
                                price=dataobj["price"], show_id=showid);
                    elif (cls == UserEpisodes):
                        item = cls(user_id=dataobj["user_id"],
                                   episode_id=dataobj["episode_id"]);
                    elif (cls == UserToy):
                        item = cls(user_id=dataobj["user_id"], toy_id=dataobj["toy_id"],
                                quantity=dataobj["quantity"]);
                    else:
                        raise ValueError("the class must be one of the following: " +
                                        f"{self.getValidClassList()}!");
                else:
                    for attr in dataobj:
                        setattr(item, attr, dataobj[attr]);
                db.session.add(item);
                db.session.commit();
            except:
                errmsg = "422 error invalid data used to ";
                errmsg += f"{('create' if useadd else 'update')}";
                errmsg += f" item of type {self.getTypeStringForClass(cls)}!";
                return {"error": errmsg}, 422;
        else:
            raise ValueError("the class must be one of the following: " +
                             f"{self.getValidClassList()}!");
        return self.getSerializedItem(cls, item, numlisttype), 200;

    def addItemToDBAndReturnResponse(self, cls, rqst, msess, showid=0, numlisttype=3):
        return self.addOrUpdateItemOnDBAndReturnResponse(0, cls, rqst, msess, True, showid,
                                                         numlisttype);

    def updateItemOnDBAndReturnResponse(self, id, cls, rqst, msess, showid=0, numlisttype=3):
        return self.addOrUpdateItemOnDBAndReturnResponse(id, cls, rqst, msess, False, showid,
                                                         numlisttype);

    def removeItemFromDBAndReturnResponse(self, id, cls):
        #for the generic delete
        #grab it by its id
        #then remove it from the db
        #db.session.delete(obj);
        #db.session.commit();
        #then return a successful response
        item = self.getItemByID(id, cls);
        if (item == None):
            errmsg = f"404 error item of type {self.getTypeStringForClass(cls)}";
            errmsg += f", with id {id} not found!";
            return {"error": errmsg}, 404;
        db.session.delete(item);
        db.session.commit();
        msg = f"200 successfully deleted item of type {self.getTypeStringForClass(cls)} ";
        msg += f"with id {id}!";
        return {"message": msg}, 200;

    def completeDeleteItemFromDBAndReturnResponse(self, id, cls, msess):
        resobj = cm.makeSureAuthorized(msess);#returns a tuple for the response
        if (resobj[1] == 200): return cm.removeItemFromDBAndReturnResponse(id, cls);
        else: return resobj;

cm = Commonalities();

class Users(Resource):
    def get(self):
        pass;

    def post(self):
        pass;

#api.add_resource(Class, "url");

class UsersByID(Resource):
    def get(self, id):
        pass;

    def patch(self, id):
        pass;

    def delete(self, id):
        pass;

#api.add_resource(Class, "url");

class Episodes(Resource):
    def get(self, showid):
        #get all episodes, then if they have a certain show id add them to the list
        #then serialize said items on the list
        #then return it
        return [cm.getSerializedItem(Episode, item, 3)
                for item in cm.getAllOfTypeFromDB(Episode) if item.show_id == showid], 200;
        #return cm.getAllOfTypeAndSerializeThem(Episode, numlisttype), 200;

    def post(self, showid):
        #you must be logged in first and be authorized
        #print(f"showid = {showid}");
        resobj = cm.makeSureAuthorized(session);#returns a tuple for the response
        if (resobj[1] == 200):
            return cm.addItemToDBAndReturnResponse(Episode, request, session, showid, 3);
        else: return resobj;
        

api.add_resource(Episodes, "/shows/<int:showid>/episodes");

class EpisodesByID(Resource):
    def get(self, id):
        return cm.getItemByIDAndReturnResponse(id, Episode);

    def patch(self, id, showid):
        #you must be logged in first and be authorized
        resobj = cm.makeSureAuthorized(session);#returns a tuple for the response
        if (resobj[1] == 200):
            return cm.updateItemOnDBAndReturnResponse(id, Episode, request, session, showid, 3);
        else: return resobj;

    def delete(self, id):
        #you must be logged in first and be authorized
        return cm.completeDeleteItemFromDBAndReturnResponse(id, Episode, session);

api.add_resource(EpisodesByID, "/shows/<int:showid>/episodes/<int:id>");

class Shows(Resource):
    def get(self):
        return cm.getAllOfTypeAndSerializeThem(Show, 1), 200;

    def post(self):
        #you must be logged in first and be authorized
        resobj = cm.makeSureAuthorized(session);#returns a tuple for the response
        if (resobj[1] == 200):
            return cm.addItemToDBAndReturnResponse(Show, request, session, 0, 3);
        else: return resobj;

api.add_resource(Shows, "/shows");

class ShowsById(Resource):
    def get(self, id):
        return cm.getItemByIDAndReturnResponse(id, Show, 1);

    def patch(self, id):
        #you must be logged in first and be authorized
        resobj = cm.makeSureAuthorized(session);#returns a tuple for the response
        if (resobj[1] == 200):
            return cm.updateItemOnDBAndReturnResponse(id, Show, request, session, id, 3);
        else: return resobj;

    def delete(self, id):
        #you must be logged in first and be authorized
        return cm.completeDeleteItemFromDBAndReturnResponse(id, Show, session);

api.add_resource(ShowsById, "/shows/<int:id>");

class Toys(Resource):
    def get(self):
        return cm.getAllOfTypeAndSerializeThem(Toy, 3), 200;

    def post(self):
        #you must be logged in first and be authorized
        resobj = cm.makeSureAuthorized(session);#returns a tuple for the response
        if (resobj[1] == 200):
            return cm.addItemToDBAndReturnResponse(Toy, request, session, 0, 3);
        else: return resobj;

api.add_resource(Toys, "/toys");

class ToysByID(Resource):
    def get(self, id):
        return cm.getItemByIDAndReturnResponse(id, Toy, 3);

    def patch(self, id):
        #you must be logged in first and be authorized
        resobj = cm.makeSureAuthorized(session);#returns a tuple for the response
        if (resobj[1] == 200):
            return cm.updateItemOnDBAndReturnResponse(id, Toy, request, session, 0, 3);
        else: return resobj;

    def delete(self, id):
        #you must be logged in first and be authorized
        return cm.completeDeleteItemFromDBAndReturnResponse(id, Toy, session);

api.add_resource(ToysByID, "/toys/<int:id>");

#not sure if these are needed or not...

class UserToys(Resource):
    def get(self):
        pass;

    def post(self):
        pass;

#api.add_resource(Class, "url");

class UserToysByID(Resource):
    def get(self, id):
        pass;

    def patch(self, id):
        pass;

    def delete(self, id):
        pass;

#api.add_resource(Class, "url");

class UserEpisodesList(Resource):
    def get(self):
        pass;

    def post(self):
        pass;

#api.add_resource(Class, "url");

class UserEpisodesListByID(Resource):
    def get(self, id):
        pass;

    def patch(self, id):
        pass;

    def delete(self, id):
        pass;

#api.add_resource(Class, "url");

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

