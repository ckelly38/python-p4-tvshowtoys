#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
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

    def getSerializedItem(self, cls, item):
        if (item == None): raise ValueError("the item object must not be null or None!");
        if (self.isClsValid(cls)): return item.to_dict(only=cls.full_list);
        else:
            raise ValueError("the class must be one of the following: " +
                             f"{self.getValidClassList()}!");

    def getSerializedItemOnly(self, item):
        if (item == None): raise ValueError("the item object must not be null or None!");
        else: return self.getSerializedItem(type(item), item);

    def getAllOfTypeAndSerializeThem(self, cls):
        return [self.getSerializedItem(cls, item) for item in self.getAllOfTypeFromDB(cls)];

    def getItemByID(self, id, cls):
        if (id == None or cls == None):
            raise ValueError("id and cls must not be null or None!");
        elif (type(id) != int): raise ValueError("id must be an integer!");
        elif (self.isClsValid(cls)): return cls.query.filter_by(id=id).first();
        else:
            raise ValueError("the class must be one of the following: " +
                             f"{self.getValidClassList()}!");

    def getItemByIDAndReturnResponse(self, id, cls):
        item = self.getItemByID(id, cls);
        if (item == None):
            errmsg = f"404 error item of type {self.getTypeStringForClass(cls)}";
            errmsg += f", with id {id} not found!";
            return {"error": errmsg}, 404;
        else: return self.getSerializedItem(cls, item), 200;

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
    def get(self):
        return cm.getAllOfTypeAndSerializeThem(Episode), 200;

    def post(self):
        pass;

api.add_resource(Episodes, "/shows/<int:showid>/episodes");

class EpisodesByID(Resource):
    def get(self, id):
        return cm.getItemByIDAndReturnResponse(id, Episode);

    def patch(self, id):
        pass;

    def delete(self, id):
        pass;

api.add_resource(EpisodesByID, "/shows/<int:showid>/episodes/<int:id>");

class Shows(Resource):
    def get(self):
        return cm.getAllOfTypeAndSerializeThem(Show), 200;

    def post(self):
        pass;

api.add_resource(Shows, "/shows");

class ShowsById(Resource):
    def get(self, id):
        return cm.getItemByIDAndReturnResponse(id, Show);

    def patch(self, id):
        pass;

    def delete(self, id):
        pass;

api.add_resource(ShowsById, "/shows/<int:id>");

class Toys(Resource):
    def get(self):
        return cm.getAllOfTypeAndSerializeThem(Toy), 200;

    def post(self):
        pass;

api.add_resource(Toys, "/toys");

class ToysByID(Resource):
    def get(self, id):
        return cm.getItemByIDAndReturnResponse(id, Toy);

    def patch(self, id):
        pass;

    def delete(self, id):
        pass;

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

