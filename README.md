# MemeMuc Project Group 51

Welcome to our repository for the bonus project for the _Online Multimedia Lecture_ in the winter semester 2022/23 at LMU Munich.

Watch our **[demonstration video](mememuc-launcher/project%20demonstration.mp4)** to see a demo of our project!

## Third-party content used:

- [Material UI](https://mui.com/material-ui/)
- [ImgFlip Meme API](https://imgflip.com/api)

## Running our project

To start our project run this code:
```bash
cd mememuc-launcher && npm run installall && npm start
```

If things don't work as expected, try running the following commands consecutively
```bash
cd mememuc-launcher && npm run installall
cd ..
cd node-backend && npm start
```
_In an additional terminal:_
```bash
cd react-frontend && npm start
```

For us the in-memory mongoserver didn't work, so make sure a mongod instance is running on your computer!

### Requirements for our project:

- [Nodejs](https://nodejs.org/en/download/)
- [MongoDb](https://www.mongodb.com/try/download/community)

## How To Use

1. Login/Signup
2. Make a new meme by uploading an image/using your camera or selecting one from the templates-List
3. Use your creativity to craft the next viral meme by adding your own title and text to your image. Position the text by either typing in the coordinates or by choosing the pencil to click anywhere on the canvas
4. Save the meme either in your collection, when you want to edit it later or directly save it to the database. For easier sharing you can also download the meme directly


Have fun with our project !

## Team
This project was developed for a course at the LMU Munich by
|members |
|:--------------------------------------------------------------------|
|Annika Köhler <br> [Github: 4nn1k4](https://github.com/4nn1k4) <br> [annika.koehler@campus.lmu.de](mailto:annika.koehler@campus.lmu.de) |
|Jannik Wiese <br> [Github: ragor114](https://github.com/ragor114) <br> [jannik.wiese@campus.lmu.de](mailto:jannik.wiese@campus.lmu.de) |
|Markus Schmidbauer <br> [Github: 00Markus0](https://github.com/00Markus0) <br> [m.schmidbauer@campus.lmu.de](mailto:m.schmidbauer@campus.lmu.de) |

<br/>
<br/>

Looking for the [template Readme](mememuc-launcher/template_readme.md) or a [feature list](mememuc-launcher/Group_51_Featurelist.xlsx) for our project?