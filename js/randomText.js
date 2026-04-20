const randTextElem = document.getElementById("randText");
function getRandomText(text) {
    if (text == null || text == undefined) {
        const texts = [
            "hi",
            "AAAAAAAAHHHHHHH",
            "please donate me im broke :(",
            "Did you know: Your computer is on.",
            "gome gome gome gome gome gome gome",
            "pls star the repo on github",
            "pls join the discord server",
            "🥔🥔🥔🥔🥔🥔🥔🥔🥔🥔",
            "hello",
            "fuck microslop",
            "👁️👄👁️",
            "eaeaeaeae",
            "🦛<-a pig",
            "hi",
            "🥶",
            "pool noodle",
            "glub",
            "go follow my github please",
            "🦖",
            "very website",
            "a",
            "e",
            "👁️👅👁️",
            "fffff",
            "apple is shit",
            "CLICK ME PLEASE!!!!!!!!",
            "Damn... you went down far twin... 🙉😋🗿",
            "i want to be clicked"
        ];
        randTextElem.textContent = texts[randomNumber(0, texts.length-1)];
    } else {
        randTextElem.textContent = text;
    }
}