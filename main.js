var rain_amount = 100;

var is_reduced_motion = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
var is_mobile = /Mobi|Android/i.test(navigator.userAgent);
var css_enabled = true;

var tiles = document.getElementsByClassName('tile');

function calculate_rain_amount() {
    // Rain is somwhat heavy on mobile devices, so we reduce the amount of rain drops
    if (is_mobile) {
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

function draw_rain() {
    // Spawn rain drop elements into screen
    if (is_reduced_motion) {
        console.log("Reduced motion detected, not spawning rain");
        return;
    }

    calculate_rain_amount();

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
        if (!is_reduced_motion && css_enabled) {
            var current_scroll = document.scrollingElement.scrollTop;
            var target = document.getElementsByClassName("background")[0];
            var yvalue = current_scroll * 0.8;
            target.style.transform = "translate3d(0px, " + yvalue + "px, 0px)";
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
    // Makes tile borders glow when mouse is close to them

    function draw_glow(e) {
        if (!is_mobile && !is_reduced_motion && css_enabled) {
            for (let tile of tiles) {
                let rect = tile.getBoundingClientRect()
                let x = e.clientX - rect.left
                let y = e.clientY - rect.top;
    
               tile.style.background = "radial-gradient(100em circle at " + x + "px " + y + "px, rgba(50, 255, 150, 1), transparent 40%)";
            };
        }
    }

    function remove_glow(e) {
        if (!is_mobile && !is_reduced_motion && css_enabled) {
            for(let tile of tiles) {
                tile.style.background = "radial-gradient(100em circle at 0px 1000em, rgba(50, 255, 150, 1), transparent 40%)";
            };
        }
    }

    document.addEventListener('mousemove', function(e) {draw_glow(e)});
    document.addEventListener('mouseleave', function(e) {remove_glow(e)});
}

function setup_tile_tilts() {
    // Makes tiles tilt when mouse is over them, must be used without css animations
    
    function calculate_tilt(tile, e) {
        // calculate tilt based on mouse position
        const rect = tile.getBoundingClientRect();
        const x_center = rect.left + rect.width / 2;
        const y_center = rect.top + rect.height / 2;

        const dx = e.clientX - x_center;
        const dy = e.clientY - y_center;

        var rotate_x = 2 * dy / (rect.height / 2);
        var rotate_y = -2 * dx / (rect.width / 2);

        tile.style.transform = `perspective(1000px) rotateX(${rotate_x}deg) rotateY(${rotate_y}deg)`;
    }

    function transition_throttle(tile) {
        // On mouse enter or leave, we must have an initial smooth transition, then we can remove it

        // Remove previous timeout as we are resetting or beginning a new transition
        clearTimeout(tile.timeout);
        tile.style.transition = 'transform 1000ms cubic-bezier(0, 1, 0.9, 1)';

        // Remove transition after 500ms
        tile.timeout = setTimeout(function() {
            tile.style.transition = "";
        }, 1000);
    }

    function add_event_listeners() {
        // Add event listeners to all tiles

        for (var i = 0; i < tiles.length; i++) {
            let tile = tiles[i];
            
            // removes initial fly in animation after 1 second
            tile.classList.remove("fly_in");
    
            tile.addEventListener('mousemove', function(e) {
                if (!is_mobile && !is_reduced_motion && css_enabled) {
                    calculate_tilt(tile, e);
                }
            });
    
            tile.addEventListener('mouseleave', (e) => {
                tile.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
                transition_throttle(tile);
            });

            tile.addEventListener('mouseenter', (e) => {
                transition_throttle(tile);
            });
        }
    }

    setTimeout(function(){add_event_listeners()}, 1000);
}

function check_resized_and_css() {
    // If window is resized, update reduced motion and mobile variables
    window.onresize = function() {
        is_reduced_motion = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
        is_mobile = /Mobi|Android/i.test(navigator.userAgent);
    }

    // Check if for some reason css is not loaded (but javascript is?)
    setInterval(function() {
        wrapper = document.getElementById("wrapper");
        style = window.getComputedStyle(wrapper);
        if (style.getPropertyValue("display") == "block") {
            if (css_enabled) {
                console.log("CSS is not loaded? Disabling tilt effect...");
            }
            css_enabled = false;
        } else {
            if (!css_enabled) {
                console.log("CSS is loaded? Enabling tilt effect...");
            }
            css_enabled = true;
        }
    }, 100);
}

async function main() {
    // Pixelated background
    setup_super_unsafe_css();

    // Calculating variables
    check_resized_and_css();
    
    // Drawing rain
    draw_rain();
    
    // Setting up parallax
    setup_parallax();
    
    // Special tile effects
    setup_tile_borders();
    setup_tile_tilts();
}

main()