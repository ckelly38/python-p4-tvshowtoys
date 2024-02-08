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

        ocn = User(id=4, name="CN", access_level=2);
        ocn.password_hash = "cnrocks";
        print(ocn);
        unitstfailed = True;
        try:
            db.session.add(ocn);
            db.session.commit();
        except:
            print("TEST PAST!");
            unitstfailed = False;
        if (unitstfailed): raise Exception("unique constraint test failed!");
