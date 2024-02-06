#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Show, Episode, Toy, UserToy, UserEpisodes

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
        uty = UserToy(toy=pikachu, user=kdone, quantity=3);
        print(uty);
        db.session.add(uty);
        db.session.commit();
        print("DONE LETTING A KID DO SHOPPING ON ITS OWN!");
        for sw in Show.query.all():
            swueps = [UserEpisodes(user=sw.owner, episode=ep) for ep in sw.episodes];
            for swep in swueps:
                db.session.add(swep);
                db.session.commit();
        print("DONE WITH EACH SHOW'S OWNERS WATCHING THE EPISODES!");
        uep = UserEpisodes(user=kdone, episode=eppmone);
        db.session.add(uep);
        db.session.commit();
        print("DONE LETTING KIDS WATCH SOME OR ALL OF THE EPISODES!");
        print("DONE SEEDING THE DATABASE!");

