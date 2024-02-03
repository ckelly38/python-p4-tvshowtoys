from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property

from config import db, bcrypt, metadata

user_episodes = db.Table(
    "user_episodes",
    metadata,
    db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
    db.Column("episode_id", db.Integer, db.ForeignKey("episodes.id"), primary_key=True)
);

# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = "users";

    #constraints go inside the tableargs
    #__tableargs__ = (db.checkConstraint("colname operation value"));

    #if I want to use postgressql and deploy using render change this to SERIAL
    id = db.Column(db.Integer, primary_key=True);
    name = db.Column(db.String, nullable=False);
    _password_hash = db.Column(db.String);
    access_level = db.Column(db.Integer, default=1);
    #every use has edit access (they can change their own toys)
    #when access_level is 2 (they can create or delete their own toys)
    
    #other stuff after that
    episodes = db.relationship("Episode", secondary=user_episodes, back_populates="users");

    @hybrid_property
    def password_hash(self):
        raise AttributeError("not allowed to view the password hashes from an outside class!");

    @password_hash.setter
    def setPassword(self, val):
        phsh = bcrypt.generate_password_hash(val.encode("utf-8"));
        self._password_hash = phsh.decode("utf-8");
    
    @hybrid_property
    def authenticate(self, val):
        return bcrypt.check_password_hash(self._password_hash, bcrypt.val.encode("utf-8"));

    #@validates("colname")
    #def isvalid(self, key, val): return val;

class Show(db.Model, SerializerMixin):
    __tablename__ = "shows";

    #constraints go inside the tableargs
    #__tableargs__ = (db.checkConstraint("colname operation value"));

    #if I want to use postgressql and deploy using render change this to SERIAL
    id = db.Column(db.Integer, primary_key=True);
    name = db.Column(db.String, nullable=False);
    description = db.Column(db.String, nullable=False);

    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), default=0);

    #other stuff after that
    episodes = db.relationship("Episode");
    owner = db.relationship("User");
    
    #@validates("colname")
    #def isvalid(self, key, val): return val;

class Episode(db.Model, SerializerMixin):
    __tablename__ = "episodes";

    #constraints go inside the tableargs
    #__tableargs__ = (db.checkConstraint("colname operation value"));

    #if I want to use postgressql and deploy using render change this to SERIAL
    id = db.Column(db.Integer, primary_key=True);
    name = db.Column(db.String, nullable=False);
    description = db.Column(db.String, nullable=False);
    season_number = db.Column(db.Integer, default=1);
    episode_number = db.Column(db.Integer, default=1);
    
    show_id = db.Column(db.Integer, db.ForeignKey("shows.id"));

    #other stuff after that
    users = db.relationship("User", secondary=user_episodes, back_populates="episodes");
    show = db.relationship("Show");
    
    #@validates("colname")
    #def isvalid(self, key, val): return val;

class Toy(db.Model, SerializerMixin):
    __tablename__ = "toys";

    #constraints go inside the tableargs
    #__tableargs__ = (db.checkConstraint("colname operation value"));

    #if I want to use postgressql and deploy using render change this to SERIAL
    id = db.Column(db.Integer, primary_key=True);
    price = db.Column(db.Float);
    name = db.Column(db.String, nullable=False);
    description = db.Column(db.String, nullable=False);
    
    show_id = db.Column(db.Integer, db.ForeignKey("shows.id"));
    
    #other stuff after that
    show = db.relationship("Show");

    #@validates("colname")
    #def isvalid(self, key, val): return val;


class UserToy(db.Model, SerializerMixin):
    __tablename__ = "user_toys";

    #constraints go inside the tableargs
    #__tableargs__ = (db.checkConstraint("colname operation value"));

    #if I want to use postgressql and deploy using render change this to SERIAL
    user_id = db.Column(db.Integer, primary_key=True);
    toy_id = db.Column(db.Integer, primary_key=True);
    quantity = db.Column(db.Integer, default=0);

    #other stuff after that
    user = db.relationship("User");
    toy = db.relationship("Toy");

    #@validates("colname")
    #def isvalid(self, key, val): return val;
