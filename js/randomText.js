const randTextElem = document.getElementById("randText");
function getRandomText(text) {
    if (text == null || text == undefined) {
        const texts = [
            "hi",
            "if you want more games, use the feedback(its at the top",
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
            "🥶",
            "glub",
            "go follow my github please",
            "🦖",
            "very website",
            "do you like the interface? do you want more animations added? if so, please send feedback.",
            "a",
            "e",
            "👁️👅👁️",
            "fffff",
            "apple is shit",
            "CLICK ME PLEASE!!!!!!!!",
            "i want to be clicked"
        ];
        randTextElem.textContent = texts[randomNumber(0, texts.length-1)];
    } else {
        randTextElem.textContent = text;
    }
}