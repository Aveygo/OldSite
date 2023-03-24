var rain_amount = 100;                // Number of rain drops, default=100

const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

function draw_rain() {
    // Rain initialization

    // check screen width or mobile

    if (/Mobi|Android/i.test(navigator.userAgent)) {
        rain_amount *= 0.1;
        console.log("Mobile detected, spawned only " + rain_amount + " drops");
    } else if (window.innerWidth < 500) {
        rain_amount *= 0.1;
        console.log("Very small screen detected, spawned only " + rain_amount + " drops");
    } else if (window.innerWidth < 800) {
        rain_amount *= 0.5;
        console.log("Small screen detected, spawned only " + rain_amount + " drops");
    }

    for (let i = 0; i < rain_amount; i++) {
        
        // Create the element/rain drop
        rain_element = document.createElement("div");
        rain_element.className = "rain_drop";

        // Add randomness to the rain drop
        rain_element.style.left = "calc(" + Math.random() * 90 + "vw)";
        rain_element.style.animationDuration = 1 + Math.random() * 0.3 + "s";
        rain_element.style.animationDelay = Math.random() * 2 + "s";
        
        // Append the rain drop to the rain container
        document.getElementById("rain").appendChild(rain_element);
    }
}

function setup_parallax() {
    // Parallax effect with background
    document.body.onscroll = function myFunction() {  
        var current_scroll = document.scrollingElement.scrollTop;
        var target = document.getElementsByClassName("background")[0];
        var yvalue = current_scroll * 0.8;
        target.style.transform = "translate3d(0px, " + yvalue + "px, 0px)";

    }
}

function shuffle_colors() {
    // randomize css :root r, g, b colors
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);

    document.documentElement.style.setProperty('--r', r);
    document.documentElement.style.setProperty('--g', g);
    document.documentElement.style.setProperty('--b', b);

    return "r: " + r + " g: " + g + " b: " + b;
}

function setup_easter_egg() {
    // disco mode when footer is clicked 3 times
    var footer_clicks = 0;
    document.getElementsByClassName("footer")[0].onclick = function() {
        footer_clicks++;
        if (footer_clicks == 3) {
            document.getElementsByClassName("footer")[0].onclick = null;
            
            setInterval(function() {
                shuffle_colors();
            }, 300);
        }
    }
}

function setup_super_unsafe_css() {
    // sets image-rendering to pixelated after page load
    window.addEventListener('load', function () {
        document.getElementsByClassName("background")[0].style.imageRendering = "pixelated";
        /*
        var tiles = document.getElementsByClassName("tile");
        for (var i = 0; i < tiles.length; i++) {
            tiles[i].style.minWidth = "min(100%, 600px)";
        }
        var small_tiles = document.getElementsByClassName("small_tile");
        for (var i = 0; i < small_tiles.length; i++) {
            small_tiles[i].style.minWidth = "min(100%, 200px)";
        }
        */

    });
}

async function main() {
    if (!isReduced) {
        draw_rain();
        setup_parallax();
        setup_easter_egg();
    }
    setup_super_unsafe_css();
}

main()