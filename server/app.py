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

class Shows(Resource):
    def get(self):
        pass;

    def post(self):
        pass;

#api.add_resource(Class, "url");

class ShowsById(Resource):
    def get(self, id):
        pass;

    def patch(self, id):
        pass;

    def delete(self, id):
        pass;

#api.add_resource(Class, "url");

class Episodes(Resource):
    def get(self):
        pass;

    def post(self):
        pass;

#api.add_resource(Class, "url");

class EpisodesByID(Resource):
    def get(self, id):
        pass;

    def patch(self, id):
        pass;

    def delete(self, id):
        pass;

#api.add_resource(Class, "url");

class Toys(Resource):
    def get(self):
        pass;

    def post(self):
        pass;

#api.add_resource(Class, "url");

class ToysByID(Resource):
    def get(self, id):
        pass;

    def patch(self, id):
        pass;

    def delete(self, id):
        pass;

#api.add_resource(Class, "url");

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

