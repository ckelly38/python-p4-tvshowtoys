# TV Shows And Toys Project Info

## Basic Set-Up:

Home Shows Episodes Toys Login SignUp Preferences ] NAVBAR

Main Content will be displayed here ] The other component

## What it does?

This shows information about shows, episodes for the show, and toys produced about it.

Additionally users have the ability to create an account via SignUp. Then they can Login.

They can edit it if they are show owners.

If they want to create new shows, they can upgrade to creation access level 2.

Then they can create a show, then add episodes, and toys. They can also edit this information.

If they don't want this information anymore, show owners can remove information.

You must be logged in to view episodes that you have watched or to see and purchase toys.

You can also remove episodes from your watch history or get rid of or trade toys.

If you are a show owner, you can see how much profit you made from selling toys.

Only show owners can make a profit. So if they buy their own toys it is free to them.

No money will be exchanged on this site as it is only a demo site.

Once done making changes, etc, a user can log out.

If a logged in user no longer wishes to use the site, they can unsubscribe.

If you are a show owner, you cannot unsubscribe unless your show is transfered to another user.

# How To Do Something?

For the items below: there are ways to back out/cancel items provided. You can also navigate away.

To signup:
1. you must first navigate to the home page and click signup,
2. enter a username and password and the access level you want (1 or 2)
3. click signup,
4. you will be automatically logged in and see the home page which will tell you so.

To login:
1. you must first navigate to the home page and click login,
2. enter your username and password,
3. click submit
4. you will be redirected to the home page which will tell you if you are logged in or not.

To unsubscribe:
1. you must first login,
2. then click preferences,
3. then click unsubscribe/remove my account.

To edit a show or an episode or a toy:
1. you must first login,
2. then click on the page you want to edit and navigate to that item individually,
3. turn on edit mode,
4. make the changes,
5. click submit/update to update the item and the server
6. Don't forget to turn off edit mode. Logging out will turn off edit mode.

To remove a show or an episode or a toy:
1. you must first login,
2. navigate to the item you want to remove, but you must be in list form.
3. click remove.

To unwatch an episode:
1. you must first login,
2. click my episodes,
3. click unwatch next to the item you want to remove from your watch history.

To sell/transfer owned toys:
1. you must first login,
2. click my toys,
3. click throw out all of/show transfer form
Assuming you clicked Show Transfer Form (otherwise stop at 3):
4. Fill out the form entering the buyer's ID number and how many you want to give to the buyer.
5. Click submit/transfer/sell it.

To watch an episode:
1. you must first login,
2. navigate to the individual episode page

Note: if you did step 2 before step 1, you watched it without it being recorded on the server

To buy a toy:
1. you must first login,
2. navigate to the toy you want to buy on the list view,
3. click buy and enter how many.
4. click submit/buy.

## Basic Component Design and Heirarchy:

```
App-------------------------------------------------------------------------------------------
 |            |                     |                                    |           |       |
Home Login/SignUp/Preferences EpisodeShowToy----------           NewEpisodeShowToy Navbar Logout
                                    |                |
                              TransferToyShowForm EpisodeShowToy
```

I want to call your attention to the EpisodeShowToy component. Notice it has ITSELF as a kid.

It also means it has 2 or 3 levels (depending on how you count App component) which means it does not feel like prop drilling.


## URLS The Server Responds To:

| URL                                      | METHODS            | REQUIRED DATA
| ---------------------------------------- |:------------------:|:--------------------------------
| /signup                                  | POST               | Username, password, accesslevel
| /login                                   | PATCH              | Username, password, id
| /logout                                  | GET                | user-id
| /preferences                             | GET, PATCH         | Username, password, id, accesslevel
| /unsubscribe                             | DELETE             | user-id
| /my-watchlist                            | GET, POST          | user-id, episode-id
| /my-episodes                             | GET, POST          | user-id, episode-id
| /my-watchlist/<int:id>                   | GET, PATCH, DELETE | user-id, episode-id*
| /my-episodes/<int:id>                    | GET, PATCH, DELETE | user-id, episode-id*
| /my-toys                                 | GET, POST          | user-id, toy-id, quantity
| /my-toys/<int:id>                        | GET, PATCH, DELETE | user-id, toy-id*
| /all-user-toy-data                       | GET                | NOTHING
| /shows/<int:showid>/episodes             | GET, POST          | showid*, name, epnum, snnum, description
| /shows/<int:showid>/episodes/<int:epnum> | GET, PATCH, DELETE | showid*, epnum*, name, snnum, description
| /episodes_by_ID/<int:id>                 | GET, PATCH, DELETE | epid*, showid, epnum, name snnum, description
| /shows                                   | GET, POST          | name, description
| /shows/<int:id>                          | GET, PATCH, DELETE | id*, name, description
| /toys                                    | GET, POST          | showid, name, price, description
| /toys/<int:id>                           | GET, PATCH, DELETE | id*, name, price, description
| /shows/<int:showid>/toys                 | GET, POST          | showid*, name, price, description
| /shows/<int:showid>/toys/<int:toynum>    | GET, PATCH, DELETE | showid*, toynum*, name, price, description
| /                                        | GET                | NOTHING

NOTES:
NOTHING means the server does not require any data to access this.
The * on some things means this is required by the URL as a parameter and on the server
That GET usually only requires an id unless you are getting all of something
Getting all of something usually does not require anything.
The DELETE usually only requires an id
The REQUIRED DATA Column holds the maximum required data (usually needed for the PATCH)
There are only 4/5 HTTP methods: GET (ONE ITEM BY ID, OR ALL ITEMS), POST, PATCH, DELETE

# Phase 4 Full-Stack Application Project Template

## Learning Goals

- Discuss the basic directory structure of a full-stack Flask/React application.
- Carry out the first steps in creating your Phase 4 project.

---

## Introduction

Fork and clone this lesson for a template for your full-stack application. Take
a look at the directory structure before we begin (NOTE: node_modules will be
generated in a subsequent step):

```console
$ tree -L 2
$ # the -L argument limits the depth at which we look into the directory structure
.
├── CONTRIBUTING.md
├── LICENSE.md
├── Pipfile
├── README.md
├── client
│   ├── README.md
│   ├── package.json
│   ├── public
│   └── src
└── server
    ├── app.py
    ├── config.py
    ├── models.py
    └── seed.py
```

A `migrations` folder will be added to the `server` directory in a later step.

The `client` folder contains a basic React application, while the `server`
folder contains a basic Flask application. You will adapt both folders to
implement the code for your project .

NOTE: If you did not previously install `tree` in your environment setup, MacOS
users can install this with the command `brew install tree`. WSL and Linux users
can run `sudo apt-get install tree` to download it as well.

## Where Do I Start?

Just as with your Phase 3 Project, this will likely be one of the biggest
projects you've undertaken so far. Your first task should be creating a Git
repository to keep track of your work and roll back any undesired changes.

### Removing Existing Git Configuration

If you're using this template, start off by removing the existing metadata for
Github and Canvas. Run the following command to carry this out:

```console
$ rm -rf .git .canvas
```

The `rm` command removes files from your computer's memory. The `-r` flag tells
the console to remove _recursively_, which allows the command to remove
directories and the files within them. `-f` removes them permanently.

`.git` contains this directory's configuration to track changes and push to
Github (you want to track and push _your own_ changes instead), and `.canvas`
contains the metadata to create a Canvas page from your Git repo. You don't have
the permissions to edit our Canvas course, so it's not worth keeping around.

### Creating Your Own Git Repo

First things first- rename this directory! Once you have an idea for a name,
move one level up with `cd ..` and run
`mv python-p4-project-template <new-directory-name>` to change its name (replace
<new-directory-name> with an appropriate project directory name).

> **Note: If you typed the `mv` command in a terminal within VS Code, you should
> close VS Code then reopen it.**

> **Note: `mv` actually stands for "move", but your computer interprets this
> rename as a move from a directory with the old name to a directory with a new
> name.**

`cd` back into your new directory and run `git init` to create a local git
repository. Add all of your local files to version control with `git add --all`,
then commit them with `git commit -m'initial commit'`. (You can change the
message here- this one is just a common choice.)

Navigate to [GitHub](https://github.com). In the upper-right corner of the page,
click on the "+" dropdown menu, then select "New repository". Enter the name of
your local repo, choose whether you would like it to be public or private, make
sure "Initialize this repository with a README" is unchecked (you already have
one), then click "Create repository".

Head back to the command line and enter
`git remote add origin git@github.com:github-username/new-repository-name.git`.
NOTE: Replace `github-username` with your github username, and
`new-repository-name` with the name of your new repository. This command will
map the remote repository to your local repository. Finally, push your first
commit with `git push -u origin main`.

Your project is now version-controlled locally and online. This will allow you
to create different versions of your project and pick up your work on a
different machine if the need arises.

---

## Setup

### `server/`

The `server/` directory contains all of your backend code.

`app.py` is your Flask application. You'll want to use Flask to build a simple
API backend like we have in previous modules. You should use Flask-RESTful for
your routes. You should be familiar with `models.py` and `seed.py` by now, but
remember that you will need to use Flask-SQLAlchemy, Flask-Migrate, and
SQLAlchemy-Serializer instead of SQLAlchemy and Alembic in your models.

The project contains a default `Pipfile` with some basic dependencies. You may
adapt the `Pipfile` if there are additional dependencies you want to add for
your project.

To download the dependencies for the backend server, run:

```console
pipenv install
pipenv shell
```

You can run your Flask API on [`localhost:5555`](http://localhost:5555) by
running:

```console
python server/app.py
```

Check that your server serves the default route `http://localhost:5555`. You
should see a web page with the heading "Project Server".

### `client/`

The `client/` directory contains all of your frontend code. The file
`package.json` has been configured with common React application dependencies,
include `react-router-dom`. The file also sets the `proxy` field to forward
requests to `"http://localhost:5555". Feel free to change this to another port-
just remember to configure your Flask app to use another port as well!

To download the dependencies for the frontend client, run:

```console
npm install --prefix client
```

You can run your React app on [`localhost:3000`](http://localhost:3000) by
running:

```sh
npm start --prefix client
```

Check that your the React client displays a default page
`http://localhost:3000`. You should see a web page with the heading "Project
Client".

## Generating Your Database

NOTE: The initial project directory structure does not contain the `instance` or
`migrations` folders. Change into the `server` directory:

```console
cd server
```

Then enter the commands to create the `instance` and `migrations` folders and
the database `app.db` file:

```
flask db init
flask db upgrade head
```

Type `tree -L 2` within the `server` folder to confirm the new directory
structure:

```console
.
├── app.py
├── config.py
├── instance
│   └── app.db
├── migrations
│   ├── README
│   ├── __pycache__
│   ├── alembic.ini
│   ├── env.py
│   ├── script.py.mako
│   └── versions
├── models.py
└── seed.py
```

Edit `models.py` and start creating your models. Import your models as needed in
other modules, i.e. `from models import ...`.

Remember to regularly run
`flask db revision --autogenerate -m'<descriptive message>'`, replacing
`<descriptive message>` with an appropriate message, and `flask db upgrade head`
to track your modifications to the database and create checkpoints in case you
ever need to roll those modifications back.

> **Tip: It's always a good idea to start with an empty revision! This allows
> you to roll all the way back while still holding onto your database. You can
> create this empty revision with `flask db revision -m'Create DB'`.**

If you want to seed your database, now would be a great time to write out your
`seed.py` script and run it to generate some test data. Faker has been included
in the Pipfile if you'd like to use that library.

---

#### `config.py`

When developing a large Python application, you might run into a common issue:
_circular imports_. A circular import occurs when two modules import from one
another, such as `app.py` and `models.py`. When you create a circular import and
attempt to run your app, you'll see the following error:

```console
ImportError: cannot import name
```

If you're going to need an object in multiple modules like `app` or `db`,
creating a _third_ module to instantiate these objects can save you a great deal
of circular grief. Here's a good start to a Flask config file (you may need more
if you intend to include features like authentication and passwords):

```py
# Standard library imports

# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

# Local imports

# Instantiate app, set attributes
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)

```

Now let's review that last line...

#### CORS

CORS (Cross-Origin Resource Sharing) is a system that uses HTTP headers to
determine whether resources from different servers-of-origin can be accessed. If
you're using the fetch API to connect your frontend to your Flask backend, you
need to configure CORS on your Flask application instance. Lucky for us, that
only takes one line:

```py
CORS(app)

```

By default, Flask-CORS enables CORS on all routes in your application with all
fetching servers. You can also specify the resources that allow CORS. The
following specifies that routes beginning with `api/` allow CORS from any
originating server:

```py
CORS(app, resources={r"/api/*": {"origins": "*"}})

```

You can also set this up resource-by-resource by importing and using the
`@cross_origin` decorator:

```py
@app.route("/")
@cross_origin()
def howdy():
  return "Howdy partner!"

```

---

## Updating Your README.md

`README.md` is a Markdown file that describes your project. These files can be
used in many different ways- you may have noticed that we use them to generate
entire Canvas lessons- but they're most commonly used as homepages for online
Git repositories. **When you develop something that you want other people to
use, you need to have a README.**

Markdown is not a language that we cover in Flatiron's Software Engineering
curriculum, but it's not a particularly difficult language to learn (if you've
ever left a comment on Reddit, you might already know the basics). Refer to the
cheat sheet in this lesson's resources for a basic guide to Markdown.

### What Goes into a README?

This README should serve as a template for your own- go through the important
files in your project and describe what they do. Each file that you edit (you
can ignore your migration files) should get at least a paragraph. Each function
should get a small blurb.

You should descibe your application first, and with a good level of detail. The
rest should be ordered by importance to the user. (Probably routes next, then
models.)

Screenshots and links to resources that you used throughout are also useful to
users and collaborators, but a little more syntactically complicated. Only add
these in if you're feeling comfortable with Markdown.

---

## Conclusion

A lot of work goes into a full-stack application, but it all relies on concepts
that you've practiced thoroughly throughout this phase. Hopefully this template
and guide will get you off to a good start with your Phase 4 Project.

Happy coding!

---

## Resources

- [Setting up a respository - Atlassian](https://www.atlassian.com/git/tutorials/setting-up-a-repository)
- [Create a repo- GitHub Docs](https://docs.github.com/en/get-started/quickstart/create-a-repo)
- [Markdown Cheat Sheet](https://www.markdownguide.org/cheat-sheet/)
- [Python Circular Imports - StackAbuse](https://stackabuse.com/python-circular-imports/)
- [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/)
