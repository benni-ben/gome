# Gome

This is a very robust game website, with a lot of cool features. 

Features:
 - Top bar info.
 - Integrated styling, no need to have any external .css files.
 - UI animations.
 - No external dependencies/libraries. 
 - Game thumbnails. 
 - Runs offline.
 - Game descriptions.
 - Easy game adding. 
 - Easy file structure.
 - AND MORE...

## Development

This is made with CSS, HTML, and pure JavaScript. For the fonts, file-embedded base64 encoded fonts are used. To make the fonts base64, I used [Transfonter](https://transfonter.org/). 

A JSON file is used for the game paths and descriptions. The file is named `descriptions.json`. The JSON file structure is simply composed of 2 parameters for each game: game name, and game description.

The string is the game's name(must be the exact name used in the path), and the value is the description, it can be whatever you want it to be. Please note that every value must have a string, and every string must have a value.

### Header Gradients

On certain dates, the header will have a different color. This is because the header has certain gradient colors associated with each date. 

Gradients are stored in the `index.html` file(in the `occasionColors` variable), and they support 3 color inputs. All colors must be in HEX format, and all dates must be in "Month-Day" format, where the month is the month and the day is the day. 

An example of a gradient that happens on November 2nd is below:

```
"11-2": ["#8a62c9ff", "#c21742", "#ff9797ff"],
```

As of the 20th commit, [Coolors](https://coolors.co/palettes/) was used to get some of the colors for the header gradients.


## Adding game

To add a game, you have to first create a folder inside of the `assets` folder. This will be the game's name. Inside of that folder, you must have an image named `cover.png`. It must be in PNG format to work. That folder should also have an `index.html` file inside. 

After that, you must update the `descriptions.json` file. Make a new pair in the file, and then set the key to the game's **exact name**, and the value to it's description.

An example of an object in the `descriptions.json` file is below:

```"key": "value",```

You can use this example in the `descriptions.json` file, and then replace the key with the game name, and the value to it's description. 

All of the pairs must be inside of the curly brackets.

## Supporting

If you want to suggest anything, ask a question, or make a contribution, please open an issue. That will help me get to it easier. I will try my best to respond to all of them to the best of my ability. 

