var rain_amount = 100;

var isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
var isMobile = /Mobi|Android/i.test(navigator.userAgent);
var should_tilt = false;

var tiles = document.getElementsByClassName('tile');

function draw_rain() {
    // Rain initialization

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
    });
}

function setup_tile_borders() {
    document.addEventListener('mousemove', function(e) {
        if (should_tilt) {
            for (let tile of tiles) {
                let rect = tile.getBoundingClientRect()
                let x = e.clientX - rect.left
                let y = e.clientY - rect.top;

               tile.style.background = "radial-gradient(70em circle at " + x + "px " + y + "px, rgba(50, 255, 150, 1), transparent 40%)";
            };
        }
    });

    document.addEventListener('mouseleave', function(e) {
        if (should_tilt) {
            for(let tile of tiles) {
                tile.style.background = "radial-gradient(70em circle at 0px 1000em, rgba(50, 255, 150, 1), transparent 40%)";
            };
        }
    });
}

function setup_tile_tilts() {

    function calculate_tilt(tile, e) { 
        const rect = tile.getBoundingClientRect();
        const x_center = rect.left + rect.width / 2;
        const y_center = rect.top + rect.height / 2;

        const dx = e.clientX - x_center;
        const dy = e.clientY - y_center;

        var rotate_x = 2 * dy / (rect.height / 2);
        var rotate_y = -2 * dx / (rect.width / 2);
        tile.style.transition = 'none';
        tile.style.transform = `perspective(1000px) rotateX(${rotate_x}deg) rotateY(${rotate_y}deg)`;
    }

    for (var i = 0; i < tiles.length; i++) {
        let tile = tiles[i];

        tile.classList.remove("fly_in");

        tile.addEventListener('mousemove', function(e) {
            if (should_tilt) {
                calculate_tilt(tile, e);
            }
        });

        tile.addEventListener('mouseleave', (e) => {
            tile.style.transition = 'all 1s ease';
            tile.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
    }
}

function calculate_rain_amount() {
    if (isMobile) {
        rain_amount *= 0.1;
        console.log("Mobile detected, spawned only " + rain_amount + " drops");
    } else if (window.innerWidth < 500) {
        rain_amount *= 0.1;
        console.log("Very small screen detected, spawned only " + rain_amount + " drops");
    } else if (window.innerWidth < 800) {
        rain_amount *= 0.5;
        console.log("Small screen detected, spawned only " + rain_amount + " drops");
    }
}

async function main() {
    
    if (!isReduced) {
        calculate_rain_amount();
        draw_rain();
        setup_parallax();
        setup_easter_egg();
        
        if (!isMobile) {
            should_tilt = true;
            setup_tile_borders();
            // wait for for initial tile fly in
            setTimeout(function(){                
                setup_tile_tilts();
            }, 1000);
            
        }

    }

    setup_super_unsafe_css();
}

main()

window.onresize = function() {
    var isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
    var isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isReduced || isMobile) {
        console.log("Resized - should not tilt!");
        should_tilt = false;
    } else {
        console.log("Resized - should tilt!");
        should_tilt = true;
    }
}