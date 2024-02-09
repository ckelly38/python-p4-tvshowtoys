#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Show, Episode, Toy, UserToy, UserEpisodes

def bulkPrintAndCommitToDB(mlst, printit=True):
    for mobj in mlst:
        if (printit): print(mobj);
        db.session.add(mobj);
        db.session.commit();

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...");
        # Seed code goes here!
        print("BEGIN CLEARING DATABASE OF EXISTING DATA:");
        clrdb = True;
        if (clrdb):
            mycls = [User, Show, Episode, Toy, UserToy, UserEpisodes];
            for mcls in mycls:
                mcls.query.delete();
        print("DATABASE CLEARED BEGIN CREATING DUMMY DATA!");
        User.getValidator().enableValidator();
        cn = User(id=1, name="CN", access_level=2);
        cn.password_hash = "cnrocks";
        print(cn);
        db.session.add(cn);
        db.session.commit();
        kdone = User(id=2, name="Me", access_level=1);
        kdone.password_hash = "dummyfan";
        print(kdone);
        db.session.add(kdone);
        db.session.commit();
        kdtwo = User(id=3, name="MewTwo", access_level=1);
        kdtwo.password_hash = "dummyfantwo";
        print(kdtwo);
        db.session.add(kdtwo);
        db.session.commit();
        print("DONE CREATING DUMMY USERS!");
        pm = Show(id=1,
                  name="Pokemon",
                  description="Ash Ketchum and friends go around training and catching " +
                  "pokemon and also protects from the bounty hunters called Team Rocket " +
                  "and others trying to use Pokemon for their own evil purposes!",
                  owner=cn);
        print(pm);
        db.session.add(pm);
        db.session.commit();
        print("The show pokemon is create successfully!");
        print("DONE CREATING DUMMY SHOWS!");
        eppmone = Episode(id=1,
                          name="Meet Ash",
                          season_number=1,
                          episode_number=1,
                          show=pm,
                          description="This shows what Ash is normally like, how he is " +
                          "often late and likes to sleep in and missed his chance at " +
                          "getting an easy pokemon to train and got stuck with Pickachu " +
                          "who loved zapping him... It was not until later that Ash " +
                          "saved Pickachu from Team Rocket that Pickachu bonded with " +
                          "Ash well.");
        print(eppmone);
        db.session.add(eppmone);
        db.session.commit();
        print("DONE CREATING DUMMY EPISODES!");
        pikachu = Toy(name="Pikachu",
                      price=3.25,
                      description="Stuffed animal that looks, talks, and vibrates like " +
                      "Pickachu when you push the buttons in its paws! Cannot actually zap " +
                      "you!",
                      show=pm);
        print(pikachu);
        db.session.add(pikachu);
        db.session.commit();
        print("DONE CREATING DUMMY TOYS!");
        #the owner of the show, owns or has all of the toys
        ots = [UserToy(toy=t, user=t.show.owner, quantity=1) for t in Toy.query.all()];
        for oty in ots:
            #print("BEFORE DB COMMIT:");
            #print(oty);
            #print(oty.user);
            db.session.add(oty);
            db.session.commit();
            #print("AFTER DB COMMIT:");
            print(oty);
        print("OWNER DONE HAVING TOYS!");
        #kids also buy some toys
        uty = UserToy(toy=pikachu, user=kdone, quantity=3);
        db.session.add(uty);
        db.session.commit();
        print(uty);
        print("DONE LETTING A KID DO SHOPPING ON ITS OWN!");
        for sw in Show.query.all():
            swueps = [UserEpisodes(user=sw.owner, episode=ep) for ep in sw.episodes];
            for swuep in swueps:
                db.session.add(swuep);
                db.session.commit();
                print(swuep);
        print("DONE WITH EACH SHOW'S OWNERS WATCHING THE EPISODES!");
        uep = UserEpisodes(user=kdone, episode=eppmone);
        db.session.add(uep);
        db.session.commit();
        print(uep);
        print("DONE LETTING KIDS WATCH SOME OR ALL OF THE EPISODES!");
        print("DONE SEEDING THE DATABASE!");
        print();

        #test the constraints and validations for the database here and now
        print("BEGIN CONSTRAINTS AND VALIDATIONS TESTS NOW:");
        
        unitstfailed = True;
        User.getValidator().disableValidator();
        try:
            ocn = User(id=4, name="CN", access_level=2);
            ocn.password_hash = "cnrocks";
            print(ocn);
            db.session.add(ocn);
            db.session.commit();
        except:
            print("USERNAME MUST BE UNIQUE: TEST PAST!");
            unitstfailed = False;
        if (unitstfailed): raise Exception("unique constraint test failed!");

        unitstfailed = True;
        try:
            okdfr = User(id=4, name="", access_level=2);
            okdfr.password_hash = "cnrocks";
            print(okdfr);
            db.session.add(okdfr);
            db.session.commit();
        except:
            print("USERNAME MUST NOT BE BLANK: TEST PAST!");
            unitstfailed = False;
        if (unitstfailed): raise Exception("username must not be blank test failed!");

        unitstfailed = True;
        try:
            okdfv = User(id=4, name="otheruser", access_level=0);
            okdfv.password_hash = "cnrocks";
            print(okdfv);
            db.session.add(okdfv);
            db.session.commit();
        except:
            print("USER SITE ACCESS LEVEL MUST BE ONE OR TWO ONLY: TEST PAST!");
            unitstfailed = False;
        if (unitstfailed):
            raise Exception("user site access level must be one or two only test failed!");

        unitstfailed = True;
        try:
            opm = Show(id=2,
                    name="Pokemon",
                    description="Ash Ketchum and friends go around training and catching " +
                    "pokemon and also protects from the bounty hunters called Team Rocket " +
                    "and others trying to use Pokemon for their own evil purposes!",
                    owner=cn);
            print(opm);
            db.session.add(opm);
            db.session.commit();
        except:
            print("SHOW NAME MUST BE UNIQUE: TEST PAST!");
            unitstfailed = False;
        if (unitstfailed): raise Exception("show name must be unique constraint test failed!");

        try:
            unitstfailed = True;
            opmt = Show(id=3,
                    name="Pokemon",
                    description="",
                    owner=cn);
            print(opmt);
            db.session.add(opmt);
            db.session.commit();
        except:
            print("SHOW DESCRIPTION MUST NOT BE BLANK: TEST PAST!");
            unitstfailed = False;
        if (unitstfailed): raise Exception("show description must not be blank!");

        unitstfailed = True;
        try:
            opmf = Show(id=4,
                    name="",
                    description="description not blank",
                    owner=cn);
            print(opmf);
            db.session.add(opmf);
            db.session.commit();
        except:
            print("SHOW NAME MUST NOT BE BLANK: TEST PAST!");
            unitstfailed = False;
        if (unitstfailed): raise Exception("show name must not be blank!");

        unitstfailed = True;
        try:
            eppmtwo = Episode(id=2,
                            name="",
                            season_number=1,
                            episode_number=2,
                            show=pm,
                            description="This shows what Ash is normally like, how he is " +
                            "often late and likes to sleep in and missed his chance at " +
                            "getting an easy pokemon to train and got stuck with Pickachu " +
                            "who loved zapping him... It was not until later that Ash " +
                            "saved Pickachu from Team Rocket that Pickachu bonded with " +
                            "Ash well.");
            print(eppmtwo);
            db.session.add(eppmtwo);
            db.session.commit();
        except:
            print("EPISODE NAME MUST NOT BE BLANK: TEST PAST!");
            unitstfailed = False;
        if (unitstfailed): raise Exception("episode name must not be blank!");

        unitstfailed = True;
        try:
            eppmthree = Episode(id=3,
                                name="Other Episode",
                                season_number=1,
                                episode_number=2,
                                show=pm,
                                description="");
            print(eppmthree);
            db.session.add(eppmthree);
            db.session.commit();
        except:
            print("EPISODE DESCRIPTION MUST NOT BE BLANK: TEST PAST!");
            unitstfailed = False;
        if (unitstfailed): raise Exception("episode description must not be blank!");

        unitstfailed = True;
        try:
            eppmfour = Episode(id=4,
                                name="Other Episode1",
                                season_number=0,
                                episode_number=2,
                                show=pm,
                                description="description");
            print(eppmfour);
            db.session.add(eppmfour);
            db.session.commit();
        except:
            print("SEASON NUMBER MUST BE AT LEAST 1: TEST PAST!");
            unitstfailed = False;
        if (unitstfailed): raise Exception("season number must be at least 1!");

        unitstfailed = True;
        try:
            eppmfive = Episode(id=5,
                                name="Other Episode2",
                                season_number=1,
                                episode_number=0,
                                show=pm,
                                description="description");
            print(eppmfive);
            db.session.add(eppmfive);
            db.session.commit();
        except:
            print("EPISODE NUMBER MUST BE AT LEAST 1: TEST PAST!");
            unitstfailed = False;
        if (unitstfailed): raise Exception("episode number must be at least 1!");

        unitstfailed = True;
        try:
            toyone = Toy(name="",
                        price=3.25,
                        description="Stuffed animal that looks, talks, and vibrates like " +
                        "Pickachu when you push the buttons in its paws! Cannot actually zap " +
                        "you!",
                        show=pm);
            print(toyone);
            db.session.add(toyone);
            db.session.commit();
        except:
            print("TOY NAME MUST NOT BE BLANK: TEST PAST!");
            unitstfailed = False;
        if (unitstfailed): raise Exception("toy name must not be blank!");

        unitstfailed = True;
        try:
            toytwo = Toy(name="OtherToy",
                        price=3.25,
                        description="",
                        show=pm);
            print(toytwo);
            db.session.add(toytwo);
            db.session.commit();
        except:
            print("TOY DESCRIPTION MUST NOT BE BLANK: TEST PAST!");
            unitstfailed = False;
        if (unitstfailed): raise Exception("toy description must not be blank!");

        unitstfailed = True;
        try:
            toythree = Toy(name="OtherToy",
                        price=-1,
                        description="descrtption",
                        show=pm);
            print(toythree);
            db.session.add(toythree);
            db.session.commit();
        except:
            print("TOY PRICE MUST NOT BE LESS THAN FREE (ZERO): TEST PAST!");
            unitstfailed = False;
            #no idea why, but it does not finish running the tests otherwise
            db.session.rollback();
        if (unitstfailed): raise Exception("toy price must not be negative!");

        #add data for usertoy test
        print("CREATING DATA FOR USER-TOY QUANTITY TEST:");
        #print("USER GOING INTO USERTOY:");
        #kdone = User.query.filter_by(id=2).first();
        #print(kdone);
        #print("SHOW GOING INTO TOY:");
        #print(pm);
        toyfour = Toy(name="FakeToy",
                     price=20,
                     description="fake-toy",
                     show=pm);
        #print("TOY BEFORE ADDING IT TO THE DB:");
        #print(toyfour);
        db.session.add(toyfour);
        db.session.commit();
        #print("TOY AFTER ADDING IT TO THE DB:");
        print(toyfour);

        #begin actual usertoy test here
        print("BEGIN ACTUAL USERTOY QUANTITY TEST HERE:");
        unitstfailed = True;
        try:
            utyone = UserToy(toy=toyfour, user=kdone, quantity=-1);
            print(utyone);
            db.session.add(utyone);
            db.session.commit();
        except:
            print("USERTOY QUANTITY MUST NOT BE LESS THAN FREE (ZERO): TEST PAST!");
            unitstfailed = False;
        if (unitstfailed): raise Exception("usertoy quantity must not be negative!");
        
        print("ALL CONSTRAINTS AND VALIDATIONS TESTS PAST!");
