# Gome

This is a very robust game website, with a lot of cool features. 

Features:
 - Top bar info.
 - Integrated styling, no need to have any external .css files.
 - UI animations.
 - No external dependencies. 
 - Game thumbnails. 
 - Game descriptions.
 - Easy game adding. 
 - Easy file structure.
 - AND MORE.

## Development

This is made with CSS, HTML, and pure JavaScript. For the fonts, file-embedded base64 encoded fonts are used. To make the fonts base64, I used [Transfonter](https://transfonter.org/). 

A JSON file is used for the game paths and descriptions. The file is named `descriptions.json`. The JSON file structure is simply composed of 2 parameters for each game: game name, and game description.

The string is the game's name(must be the exact name used in the path), and the value is the description, it can be whatever you want it to be. Please note that every value must have a string, and every string must have a value.

Design of the website was made from scratch, by me.

## Adding game

To add a game, you have to first create a folder inside of the `assets` folder. This will be the game's name. Inside of that folder, you must have an image named `cover.png`. It must be in PNG format to work. That folder should also have an `index.html` file inside. 

After that, you must update the `descriptions.json` file. Make a new pair in the file, and then set the key to the game's **exact name**, and the value to it's description.

An example of an object in the `descriptions.json` file is below:

`"key": "value"`

You can use this example in the `descriptions.json` file, and then replace the key with the game name, and the value to it's description. 

All of the pairs must be inside of the curly brackets.
