from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property

from config import db, bcrypt, metadata

class GenerateSerializableRulesClass:
    def combineLists(self, lista, listb):
        cmbserializelist = ["" + item for item in lista];
        for item in listb:
            cmbserializelist.append(item);
        return cmbserializelist;

    def combineThreeLists(self, lista, listb, listc):
        cmblistab = self.combineLists(lista, listb);
        return self.combineLists(cmblistab, listc);

    def prependStringToListItems(self, mstr, mlist):
        return ["" + mstr + item for item in mlist];

    def getSafeListForClassName(self, clsnm):
        if (clsnm == "User"): return ["id", "name", "access_level"];
        elif (clsnm == "Show"): return ["id", "name", "description", "owner_id"];
        elif (clsnm == "Episode"):
            return ["id", "name", "description", "season_number", "episode_number"];
        elif (clsnm == "Toy"): return ["id", "name", "description", "price", "toy_number"];
        elif (clsnm == "UserEpisodes"): return [];
        elif (clsnm == "UserToy"): return ["quantity"];
        else:
            raise ValueError(f"clsnm {clsnm} must be User, Show, Episode, Toy, " +
                             "UserEpisodes, or UserToy, but it was not!");
    
    def genUnSafeListForClassName(self, clsnm):
        #safe lists needed to generate the unsafe lists
        epsafelist = self.getSafeListForClassName("Episode");
        tsafelist = self.getSafeListForClassName("Toy");
        swsafelist = self.getSafeListForClassName("Show");
        usrsafelist = self.getSafeListForClassName("User");
        #unsafe lists
        #show unsafe lists
        swunsafelist = self.prependStringToListItems("show.", swsafelist);
        #episode unsafe lists
        epunsafelistwiths = self.prependStringToListItems("episodes.", epsafelist);
        epunsafelistnos = self.prependStringToListItems("episode.", epsafelist);
        #toy unsafe lists
        tunsafelistwiths = self.prependStringToListItems("toys.", tsafelist);
        tunsafelistnos = self.prependStringToListItems("toy.", tsafelist);
        #user unsafe lists
        usrunsafelistwiths = self.prependStringToListItems("users.", usrsafelist);
        usrunsafelistnos = self.prependStringToListItems("user.", usrsafelist);
        #get the return list here
        if (clsnm == "User"):
            swlist = self.prependStringToListItems("episodes.", swunsafelist);
            return self.combineThreeLists(epunsafelistwiths, swlist, tunsafelistwiths);
        elif (clsnm == "Show"):
            usrlist = self.prependStringToListItems("owner.", usrsafelist);
            return self.combineThreeLists(epunsafelistwiths, tunsafelistwiths, usrlist);
        elif (clsnm == "Episode" or clsnm == "Toy"):
            return self.combineLists(swunsafelist, usrunsafelistwiths);
        elif (clsnm == "UserEpisodes"):
            swlist = self.prependStringToListItems("episode.", swunsafelist);
            return self.combineThreeLists(usrunsafelistnos, epunsafelistnos, swlist);
        elif (clsnm == "UserToy"):
            swlist = self.prependStringToListItems("toy.", swunsafelist);
            return self.combineThreeLists(usrunsafelistnos, tunsafelistnos, swlist);
        else:
            raise ValueError(f"clsnm {clsnm} must be User, Show, Episode, Toy, " +
                             "UserEpisodes, or UserToy, but it was not!");
    
    def getUnOrSafeListForClassName(self, clsnm, usesafe=True):
        if (usesafe == True or usesafe == False): pass;
        else: raise ValueError("usesafe must be a boolean variable with a boolean value!");
        if (usesafe): return self.getSafeListForClassName(clsnm);
        else: return self.genUnSafeListForClassName(clsnm);

genlists = GenerateSerializableRulesClass();

class MyValidator:
    disablevalidator = False;

    def disableValidator(self):
        self.disablevalidator = True;
    
    def enableValidator(self):
        self.disablevalidator = False;
    
    def isenabled(self): return (not(self.disablevalidator));

    def stringHasAtMinimumXChars(self, mstr, x):
        if (x == None or type(x) != int): raise ValueError("x must be a number");
        elif (x < 0): raise ValueError("the minimum allowed for x is zero!");
        if (self.disablevalidator): return True;
        if (x < 1): return True;
        else:
            if (mstr == None): return False;
            else: return (not(len(mstr) < x));

    #no max is anything less than 0
    def stringHasAtMaximumXChars(self, mstr, x):
        if (x == None or type(x) != int): raise ValueError("x must be a number");
        elif (x < 0): return True;
        if (self.disablevalidator): return True;
        if (x < 1):
            if (mstr == None or len(mstr) < 1): return True;
            else: return False;
        else:
            if (mstr == None): return False;
            else: return (not(x < len(mstr)));

    def stringHasAtMinimumXAndAtMaximumYChars(self, mstr, x, y):
        return (self.stringHasAtMinimumXChars(mstr, x) and
            self.stringHasAtMaximumXChars(mstr, y));

    def isstringnotblank(self, val, typestr):
        vlen = self.stringHasAtMinimumXChars(val, 1);
        if (vlen): return val;
        else: raise ValueError(f"{typestr} must not be blank!");

    def isnamevalid(self, val, typestr, cls):
        self.isstringnotblank(val, typestr);
        unms = [usr.name for usr in cls.query.all()];
        if (val in unms): raise ValueError(f"{typestr} must be unique!");
        else: return val;

mv = MyValidator();

# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = "users";

    __table_args__ = (db.CheckConstraint("length(name) >= 1"),
                     db.CheckConstraint("access_level == 1 OR access_level == 2"));
    

    #if I want to use postgressql and deploy using render change this to SERIAL
    id = db.Column(db.Integer, primary_key=True);
    name = db.Column(db.String, unique=True, nullable=False);
    _password_hash = db.Column(db.String);
    access_level = db.Column(db.Integer, default=1);
    #every user has edit access (they can change their own toys)
    #when access_level is 2 (they can create or delete their own toys)
    
    #safeserializelist = ["id", "name", "access_level"];
    safeserializelist = genlists.getUnOrSafeListForClassName("User", True);
    unsafelist = genlists.getUnOrSafeListForClassName("User", False);
    #unsafelist = ["episodes.id", "episodes.name", "episodes.description",
    #              "episodes.show.id", "episodes.show.name", "episodes.show.description",
    #              "toys.id", "toys.name", "toys.description"];
    full_list = genlists.combineLists(safeserializelist, unsafelist);
    

    #serialize_rules = ("-episodes.user", "-toys.user", "-user_toys.user",
    #                   "-user_toys.toy.users", "-episodes.show.owner",
    #                   "-toys.user_toys.user", "-toys.user_toys.toy.users",
    #                   "-episodes.show.toys.user_toys.user",
    #                   "-episodes.show.toys.user_toys.toy.users",
    #                   "-episodes.show.toys.users", "-episodes.show.toys.show");
    #serialize_only = tuple(genlists.combineLists(safeserializelist, []));#unsafelist
    serialize_only = tuple(safeserializelist);


    #other stuff after that
    episodes = db.relationship("Episode", secondary="user_episodes", back_populates="users");
    toys = db.relationship("Toy", secondary="user_toys", back_populates="users");
    user_toys = db.relationship("UserToy", back_populates="user",
                                cascade="all, delete-orphan");

    @hybrid_property
    def password_hash(self):
        raise AttributeError("not allowed to view the password hashes from an outside class!");

    @password_hash.setter
    def password_hash(self, val):
        print("SETTING A NEW PASSWORD:");
        print(f"val = {val}");
        phsh = bcrypt.generate_password_hash(val.encode("utf-8"));
        self._password_hash = phsh.decode("utf-8");
    
    def authenticate(self, val):
        return bcrypt.check_password_hash(self._password_hash, val.encode("utf-8"));

    #validation code
    @classmethod
    def getValidator(cls): return mv;

    @validates("name")
    def isnamevalid(self, key, val):
        return mv.isnamevalid(val, "username", User);

    @validates("access_level")
    def isaccesslevelvalid(self, key, val):
        if (val == 1 or val == 2): return val;
        else: raise ValueError("invalid value found and used here for access_level!");

    def getEpisodeIds(self):
        return [ep.id for ep in self.episodes];

    def __repr__(self):
        mystr = f"<User id={self.id}, name={self.name}, ";
        mystr += f"access-level={self.access_level}";
        mystr += f", episode_ids={self.getEpisodeIds()}>";
        return mystr;

class Show(db.Model, SerializerMixin):
    __tablename__ = "shows";

    #constraints go inside the tableargs
    __table_args__ = (db.CheckConstraint("length(description) >= 1"),
                     db.CheckConstraint("length(name) >= 1"));

    #if I want to use postgressql and deploy using render change this to SERIAL
    id = db.Column(db.Integer, primary_key=True);
    name = db.Column(db.String, unique=True, nullable=False);
    description = db.Column(db.String, nullable=False);

    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), default=0);

    #serialize_rules = ("-episodes.show", "-owner.episodes.show", "-toys.show",
    #                   "-toys.user_toys.toy.show", "-users.episodes.show",
    #                   "-users.user_toys.toy.show");
    #safeserializelist = ["id", "name", "description"];
    safeserializelist = genlists.getUnOrSafeListForClassName("Show", True);
    unsafelist = genlists.getUnOrSafeListForClassName("Show", False);
    #unsafelist = ["episodes.id", "episodes.name", "episodes.description", "toys.id",
    #              "toys.name", "toys.description", "owner.id", "owner.name",
    #              "owner.access_level"];
    full_list = genlists.combineLists(safeserializelist, unsafelist);
    #serialize_only = ("id", "name", "description", "episodes.id", "episodes.name",
    #                  "episodes.description", "toys.id", "toys.name", "toys.description",
    #                  "owner.id", "owner.name", "owner.access_level");
    #serialize_only = tuple(genlists.combineLists(safeserializelist, []));#unsafelist
    serialize_only = tuple(safeserializelist);

    #other stuff after that
    episodes = db.relationship("Episode", back_populates="show", cascade="all, delete-orphan");
    owner = db.relationship("User");
    toys = db.relationship("Toy", back_populates="show", cascade="all, delete-orphan");

    #validation code
    @classmethod
    def getValidator(cls): return mv;

    @validates("name")
    def isnamevalid(self, key, val):
        return mv.isnamevalid(val, "show name", Show);
    
    @validates("description")
    def isdescriptionvalid(self, key, val):
        return mv.isstringnotblank(val, "show description");

    def getEpisodeIds(self):
        return [ep.id for ep in self.episodes];

    def __repr__(self):
        mystr = f"<Show id={self.id}, owner-id={self.owner_id}, ";
        mystr += f"name={self.name}, description={self.description}, ";
        mystr += f"owner={self.owner}, episode_ids={self.getEpisodeIds()}>";
        return mystr;

class Episode(db.Model, SerializerMixin):
    __tablename__ = "episodes";

    #constraints go inside the tableargs
    __table_args__ = (db.CheckConstraint("length(description) >= 1"),
                     db.CheckConstraint("length(name) >= 1"),
                     db.CheckConstraint("season_number >= 1"),
                     db.CheckConstraint("episode_number >= 1"));

    #if I want to use postgressql and deploy using render change this to SERIAL
    id = db.Column(db.Integer, primary_key=True);
    name = db.Column(db.String, nullable=False);
    description = db.Column(db.String, nullable=False);
    season_number = db.Column(db.Integer, default=1);
    episode_number = db.Column(db.Integer, default=1);
    
    show_id = db.Column(db.Integer, db.ForeignKey("shows.id"));

    #safeserializelist = ["id", "name", "description", "season_number", "episode_number"];
    safeserializelist = genlists.getUnOrSafeListForClassName("Episode", True);
    unsafelist = genlists.getUnOrSafeListForClassName("Episode", False);
    #unsafelist = ["show.id", "show.name", "show.description", "users.id", "users.name",
    #              "users.access_level"];
    full_list = genlists.combineLists(safeserializelist, unsafelist);

    #serialize_rules = ("-show.episodes", "-users.episodes");
    #serialize_only = ("id", "name", "description", "season_number", "episode_number",
    #                  "show.id", "show.name", "show.description", "users.id", "users.name",
    #                  "users.access_level");
    #serialize_only = tuple(genlists.combineLists(safeserializelist, []));#unsafelist
    serialize_only = tuple(safeserializelist);

    #other stuff after that
    users = db.relationship("User", secondary="user_episodes", back_populates="episodes");
    show = db.relationship("Show", back_populates="episodes");

    #validation code
    @classmethod
    def getValidator(cls): return mv;
    
    @validates("name")
    def isnamevalid(self, key, val):
        return mv.isstringnotblank(val, "episode name");

    @validates("description")
    def isdescriptionvalid(self, key, val):
        return mv.isstringnotblank(val, "episode description");

    def getUserIds(self):
        return [usr.id for usr in self.users];

    def __repr__(self):
        mystr = f"<Episode id={self.id}, show-id={self.show_id}, ";
        mystr += f"season_number={self.season_number}, episode_number={self.episode_number}, ";
        mystr += f"name={self.name}, description={self.description}, ";
        mystr += f"userids={self.getUserIds()}>";
        return mystr;

class Toy(db.Model, SerializerMixin):
    __tablename__ = "toys";

    #constraints go inside the tableargs
    __table_args__ = (db.CheckConstraint("length(description) >= 1"),
                     db.CheckConstraint("length(name) >= 1"),
                     db.CheckConstraint("price >= 0"),
                     db.CheckConstraint("toy_number >= 1"),
                     db.UniqueConstraint("toy_number", "show_id",
                                         name="unique_showid_toynumcombo"));

    #if I want to use postgressql and deploy using render change this to SERIAL
    #https://stackoverflow.com/questions/10059345/sqlalchemy-unique-across-multiple-columns
    #above link is for UniqueConstraint method call
    id = db.Column(db.Integer, primary_key=True);
    price = db.Column(db.Float, default=1);
    name = db.Column(db.String, nullable=False);
    description = db.Column(db.String, nullable=False);
    
    show_id = db.Column(db.Integer, db.ForeignKey("shows.id"));
    toy_number = db.Column(db.Integer);
    
    #safeserializelist = ["id", "name", "description", "price", "toy_number"];
    safeserializelist = genlists.getUnOrSafeListForClassName("Toy", True);
    unsafelist = genlists.getUnOrSafeListForClassName("Toy", False);
    #unsafelist = ["show.id", "show.name", "show.description", "users.id", "users.name",
    #              "users.access_level"];
    full_list = genlists.combineLists(safeserializelist, unsafelist);

    #serialize_rules = ("-show.toys", "-user_toys.toy", "-users.toys",
    #                   "-users.episodes.show.toys", "-users.user_toys.toy");
    #serialize_only = ("id", "name", "description", "price", "show.id", "show.name",
    #                  "show.description", "users.id", "users.name", "users.access_level");
    #serialize_only = tuple(genlists.combineLists(safeserializelist, []));#unsafelist
    serialize_only = tuple(safeserializelist);

    #other stuff after that
    show = db.relationship("Show", back_populates="toys");
    users = db.relationship("User", secondary="user_toys", back_populates="toys");
    user_toys = db.relationship("UserToy", back_populates="toy",
                                cascade="all, delete-orphan");

    #validation code
    @classmethod
    def getValidator(cls): return mv;
    
    @validates("name")
    def isnamevalid(self, key, val):
        return mv.isstringnotblank(val, "toy name");
    
    @validates("price")
    def ispricevalid(self, key, val):
        if (val == None or (type(val) != float and type(val) != int)):
            raise ValueError("the value for the price must be a number!");
        else:
            if (val < 0): raise ValueError("the price cannot be negative!");
            else: return val;

    @validates("description")
    def isdescriptionvalid(self, key, val):
        return mv.isstringnotblank(val, "toy description");

    def __repr__(self):
        mystr = f"<Toy id={self.id}, show-id={self.show_id}, price={self.price}, ";
        mystr += f"name={self.name}, description={self.description}>";
        return mystr;

class UserEpisodes(db.Model, SerializerMixin):
    __tablename__ = "user_episodes";

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True);
    episode_id = db.Column(db.Integer, db.ForeignKey("episodes.id"), primary_key=True);
    
    #safeserializelist = [];
    safeserializelist = genlists.getUnOrSafeListForClassName("UserEpisodes", True);
    #User.safeserializelist prepend "user." 
    #unsafelist = ["user.id", "user.name", "user.access_level", "episode.id", "episode.name",
    #              "episode.description", "episode.show.id", "episode.show.name",
    #              "episode.show.description"];
    unsafelist = genlists.getUnOrSafeListForClassName("UserEpisodes", False);
    full_list = genlists.combineLists(safeserializelist, unsafelist);
    
    #serialize_rules = ("-user.episodes",);
    serialize_only = ("user.id", "user.name", "user.access_level", "episode.id",
                      "episode.name", "episode.description", "episode.show.id",
                      "episode.show.name", "episode.show.description");

    #other stuff after that
    user = db.relationship("User");
    episode = db.relationship("Episode");

    @classmethod
    def getValidator(cls): return mv;

    def __repr__(self):
        return f"<UserEpisodes user_id={self.user_id}, episode_id={self.episode_id}>";

class UserToy(db.Model, SerializerMixin):
    __tablename__ = "user_toys";

    #constraints go inside the tableargs
    __table_args__ = (db.CheckConstraint("quantity >= 0"),);

    #if I want to use postgressql and deploy using render change this to SERIAL
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True);
    toy_id = db.Column(db.Integer, db.ForeignKey("toys.id"), primary_key=True);
    quantity = db.Column(db.Integer, default=0);

    #serialize_rules = ("-user.user_toys", "-toy.user_toys", "-user.toys.user_toys",
    #                   "-toy.users.user_toys", "-toys.user_toys", "-users.user_toys");
    #safeserializelist = ["quantity"];
    safeserializelist = genlists.getUnOrSafeListForClassName("UserToy", True);
    unsafelist = genlists.getUnOrSafeListForClassName("UserToy", False);
    #unsafelist = ["user.id", "user.name", "user.access_level", "toy.id", "toy.name",
    #              "toy.description", "toy.show.id", "toy.show.name", "toy.show.description"];
    full_list = genlists.combineLists(safeserializelist, unsafelist);
    #serialize_only = ("user.id", "user.name", "user.access_level", "toy.id", "toy.name",
    #                  "toy.description", "quantity", "toy.show.id", "toy.show.name",
    #                  "toy.show.description");
    #serialize_only = tuple(genlists.combineLists(safeserializelist, []));#unsafelist
    serialize_only = tuple(safeserializelist);

    #other stuff after that
    user = db.relationship("User", back_populates="user_toys");
    toy = db.relationship("Toy", back_populates="user_toys");

    #validation code
    @classmethod
    def getValidator(cls): return mv;
    
    @validates("quantity")
    def isquantityvalid(self, key, val):
        if (val == None or type(val) != int):
            raise ValueError("the value for the quantity must be a number!");
        else:
            if (val < 0): raise ValueError("the quantity cannot be negative!");
            else: return val;

    def __repr__(self):
        mystr = f"<UserToy user-id={self.user_id}, toy-id={self.toy_id}, ";
        mystr += f"quantity={self.quantity}>";
        return mystr;
