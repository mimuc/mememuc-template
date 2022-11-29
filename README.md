# MemeMuc Launcher

This "template" is made to unify the meme generator bonus project submissions. When we run `npm run install all && npm start` inside the _mememuc-launcher_ folder, your submission should run without any further adaptions.

It contains two folder that are relevant to you: _node-backend_ and _react-frontend_. Your project implementation is supposed to go in these two folders. Currently, both folder are filled with some dummy projects. The other two folders, _mememuc-launcher_ and _mongoserver_ must not be changed! The first implements a launcher project that simplifies and unifies how to install and launch everything. The second constitutes a local in-memory database server.

You have to use this for your submission. It is independent of any local installation and not persistent, thus with every restart regardless of on which computer it will serve be at the same data state. 
In case you replace the _node-backend_ project, be sure to re-include to parts of the code:
- In _app.js_: The block at the very top, commented with _Important_
- In _package.json_: The _scripts_ block

Do not alter the _mememuc-launcher_ project and _mongoserver_ (despite the _data_ folder)!

## How To Use

### Development

For development we recommend to work with the two project (_node-backend_ and _react-frontend_) individually. However if you prefer, you can use the mememuc-launcher during development too, with the following two commands:

`cd mememuc-launcher`
Navigates your commandline into the mememuc launcher project

`npm run installall`
Installs the dependencies of all (sub)projects

`npm run startdev`
The backend project will connect to a local MongoDB instance (assuming it is running on your localhost, at the default port 27017).


### Submission

To take a look on your submission, we will launch the following two commands:

`cd mememuc-launcher`
Navigates your commandline into the mememuc launcher project

`npm run installall`
Installs the dependencies of all (sub)projects

`npm start`
The backend project will connect to a non-persistent in-memory MongoDB instance.

### How To Prepare Your Submission

- Export the MongoDB database status that you want to have us used for the submission from your local MongoDB as json files. You can use e.g. the _mongoexport_ command: 
`mongoexport --uri="mongodb://localhost:65535/omm-ws2223" --collection=users --out=omm-ws2223.json`
- Put all these json files into the folder _mongoserver/data_. The in-memory database server (_mongoserver_) will import these files as default data whenever you (re)launch the project (_not implemented yet_).
- Run the two commands shown under _Submission_ to check whether everything works well

