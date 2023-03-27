const must_fetch = false
const prices_root = "https://api.etorostatic.com/sapi/candles/closingprices.json"
const instruments = {
    315: "BTC",
    316: "ETH",
    313: "5YUS",
    314: "2YUS",
    27: "SPX500",
    3026: "DOWJNS",
    28: "NSDQ100",
    33: "AUS200",
    17: "GOLD",
    18: "SLV",
    22: "OIL",
    19: "GAS",
}


const max_news_age = 3 * 60 * 60 * 1000;    // How often should the news be refreshed, default=3 hours
const max_prices_age = 1 * 60 * 60 * 1000;   // How often should the prices be refreshed, default=1 hour

async function get_news() {
    // Get the news from local storage or from reddit

    // Check local storage
    var news = JSON.parse(localStorage.getItem("news"));

    if (news != null && !must_fetch) {
        var time_diff = Date.now() - news.timestamp;
        if (time_diff < max_news_age) {
            console.log("News loaded from local storage");
            return news;
        }
    }

    // Grabbing news from reddit
    SRC = "https://www.reddit.com/r/news/.json?limit=5"

    var json = await fetch(SRC).then(function(response) {
        return response.json();
    })

    var results = {
        "timestamp": Date.now(),
        "data": {}
    }

    for (var i = 0; i < json.data.children.length; i++) {
        results.data[json.data.children[i].data.title] = json.data.children[i].data.url;
    }

    console.log("News loaded from reddit");

    // Saving news to local storage
    localStorage.setItem("news", JSON.stringify(results));

    return results;
}

async function show_news() {
    // Show results of get_news() in the news list

    var results = await get_news();
    var headlines = Object.keys(results.data);

    var news = document.getElementById("news");

    // Removing old news
    var news_tmp = document.getElementById("news_tmp");
    news_tmp.innerHTML = "";

    for (var i = 0; i < headlines.length; i++) {

        // Creating news element
        var news_element = document.createElement("li");
        news_element.className = "selectable";

        // Creating link element
        var link_element = document.createElement("a");
        link_element.href = results.data[headlines[i]];
        link_element.target = "_blank";
        link_element.innerHTML = headlines[i];
        
        // Appending link to news element
        news_element.appendChild(link_element);

        // Appending news element to news list
        news.appendChild(news_element);
    }
}


async function load_prices() {
    // Load prices from local storage or from etoro
   
    // Check local storage
    var prices = JSON.parse(localStorage.getItem("prices"));

    if (prices != null && !must_fetch) {
        var time_diff = Date.now() - prices.timestamp;
        if (time_diff < max_prices_age) {
            console.log("Prices loaded from local storage");
            return prices;
        }
    }

    json = await fetch(prices_root).then(function(response) {
        return response.json();
    })
        
    var results = {
        "timestamp": Date.now(),
        "data": {}
    }

    // Parse the json for the stocks we want and for local storage
    var instruments_ids = Object.keys(instruments)

    for (var i = 0; i < json.length; i++) {
        
        if (instruments_ids.includes(json[i].InstrumentId.toString())) {

            var change = ( json[i].OfficialClosingPrice - json[i].ClosingPrices.Weekly.Price ) / json[i].ClosingPrices.Weekly.Price;

            if (change == 0) {
                // ¯\_(ツ)_/¯
                change = (Math.random() * 2 - 1) * 0.01;
            }

            results.data[instruments[json[i].InstrumentId]] = change;
        }

    }

    console.log("Prices loaded from etoro");

    // Save to local storage
    localStorage.setItem("prices", JSON.stringify(results));

    return results;

}

async function random_prices() {
    // Add noise to prices (+/- 0.2%) to make it look more realistic

    var prices = await load_prices();
    var keys = Object.keys(prices.data);
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = prices.data[key];
        var noise = Math.random() * 2 - 1;
        prices.data[key] = value * (1 + noise * 0.002);
    }
    return prices;

}

async function show_prices() {
    // Show results of random_prices() in the prices list

    var prices = await random_prices();
    var keys = Object.keys(prices.data);

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = prices.data[key];

        // Set direction sign
        if (value > 0) {
            var direction = "+";
        } else {
            var direction = "";
        }

        // Set element's color
        var price_element = document.getElementById(key + "_price");
        price_element.innerHTML = direction + (value * 100).toFixed(2) + "%";
    }

}

async function main() {
    show_news()
    show_prices()
}

main()