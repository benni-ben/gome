# Gome

This is a very robust game website, with a lot of cool features. 

Features:
 - Top bar info.
 - Integrated styling, no need to have any external .css files.
 - UI animations.
 - No external dependencies/libraries. 
 - Game thumbnails. 
 - Runs offline(with local web server).
 - Game descriptions.
 - Easy game adding. 
 - Easy file structure.
 - Notification system. 
 - Holiday reminders(in case you forget that a holiday is on a certain day).
 - AND MORE...

## Development

This is made with CSS, HTML, and pure JavaScript. For the fonts, file-embedded base64 encoded fonts are used.

A JSON file is used for the game paths and descriptions. The file is named `descriptions.json`. The JSON file structure is simply composed of 2 parameters for each game: game name and game description.

The string is the game's name(must be the exact name used in the path), and the value is the description; it can be whatever you want it to be. Please note that every value must have a string, and every string must have a value.

### Header Gradients

On certain dates, the header will have a different color. This is because the header has certain gradient colors associated with each date. 

Gradients are stored in the `index.html` file(in the `occasionColors` variable), and they support 3 color inputs. All colors must be in HEX format, and all dates must be in "Month-Day" format, where the month is the month and the day is the day. 

An example of a gradient that happens on November 2nd is below:

```
"11-2": ["#8a62c9ff", "#c21742", "#ff9797ff"],
```

## Adding game

To add a game, you have to first create a folder inside the `assets` folder. This will be the game's name. Inside that folder, you must have an image named `cover.png`. It must be in PNG format to work. That folder should also have an `index.html` file inside. 

After that, you must update the `descriptions.json` file. Make a new pair in the file, and then set the key to the game's **exact name**, and the value to it's description.

An example of an object in the `descriptions.json` file is below:

```"key": "value",```

You can use this example in the `descriptions.json` file, and then replace the key with the game name, and the value to it's description. 

All of the pairs must be inside of the curly brackets.

If you delete a game, it's field must also be deleted frin the `descriptions.json` file(since it expects an index.html file and a PNG cover in the root of the game folder).

## Feedback

For connecting the feedback, **Netlify functions is used**, and is connected to a Discord webhook. The function on Netlify will send a `POST` request to Discord's webhook API, and return the status. For now, the avatar icon is just a picture of some potatoes. 🥔🥔🥔🥔 


## Development tools used

A wide variety of other tools(some closed source, but I will add them here anyway because they helped me) that were used during development are in this section(I am not being paid to promote any of these, they are just tools that I found helpful).

 - As of the 20th commit, [Coolors](https://coolors.co/palettes/) was used to get some of the colors for the header gradients.

 - To make the fonts base64 encoded, I used [Transfonter](https://transfonter.org/), which I highly recommend checking out if you want to make good single-file web apps.

 - VSCode was used as the development IDE. 

 - [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) was used to preview the pages quickly without having to start up a local server in another application.



## Supporting

If you want to suggest anything, ask a question, or make a contribution, please open an issue. That will help me get to it more easily. I will try my best to respond to all of them to the best of my ability. 


