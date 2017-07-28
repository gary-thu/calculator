// sets up a namespace in the window object to prevent collisions
if (!window.exchangeRates) {
    window.exchangeRates = {};
}

// define a method for making an http request
exchangeRates.loadData = function(uri, callbacks, params) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", encodeURI(uri));
    // Define a function to handle the response data.
    xhr.onload = function() {
        if (xhr.status === 200) {
            callbacks.success(xhr, params);
        } else {
            callbacks.failure(params);
            console.log("Request failed. Returned status of " + xhr.status);
        }
    };
    xhr.send();
}

// load exchange rates to exchangeRates.exchangeRates object
exchangeRates.populateDataLayer = function(uri) {
    exchangeRates.loadData(uri, {
        success: function(xhr, params) {
            var payload = JSON.parse(xhr.responseText);
            exchangeRates.exchangeRates = payload;
        },
        failure: function(params) {
            exchangeRates.exchangeRates = "unreachable";
            console.log("ERROR: Unable to talk to config URL: " + params.uri);
        }
    }, {
        success: {
            uri: uri
        },
        failure: {
            uri: uri
        }
    });
}

// test for the exchangeWidget name in the id
exchangeRates.regexTest = function(element) {
    var regexTest = new RegExp(/\bexchangeWidget\-/);

    return regexTest.test(element.id);
}

// gets the exchange rate from the exchangeRates.exchangeRates data layer
exchangeRates.getRate = function(element) {
    var currency = document.getElementById(element).value;
    var rate;
    if (currency === exchangeRates.exchangeRates.base) {
        rate = 1;
    } else {
        rate = exchangeRates.exchangeRates.rates[currency];
    }

    return rate;
}

// update the converted value when fields change
exchangeRates.updateConverted = function(element) {
    if (exchangeRates.exchangeRates !== "unreachable") {
        if (document.getElementById(element + "-inputNumber").value === "") {
            document.getElementById(element + "-outputNumber").value = null;
        } else {
            var inputValue = parseFloat(document.getElementById(element + "-inputNumber").value);
            var inputRate = exchangeRates.getRate(element + "-inputCurrency");
            var outputRate = exchangeRates.getRate(element + "-outputCurrency");
            var outputValue = Math.round((inputValue / inputRate * outputRate) * 100) / 100;
            document.getElementById(element + "-outputNumber").value = outputValue;
        }
    } else {
        document.getElementById(element + "-outputNumber").value = "Server Unavailable";
    }
}

// populate the widget with html
exchangeRates.populateWidget = function(element) {
    var content = "<input type=\"number\" id=\"" + element + "-inputNumber\" name=\"inputNumber\" oninput=\"exchangeRates.updateConverted(\'" + element + "\') \" class=\"field\"><select id=\"" + element + "-inputCurrency\" onchange=\"exchangeRates.updateConverted(\'" + element + "\')\" class=\"selector\"><option value=\"CAD\">CAD</option><option value=\"USD\">USD</option><option value=\"EUR\">EUR</option><option value=\"AUD\">AUD</option><option value=\"CNY\">CNY</option><option value=\"DKK\">DKK</option><option value=\"SGD\">SGD</option><option value=\"THB\">THB</option></select>";
    content += "<input type=\"text\" id=\"" + element + "-outputNumber\" name=\"outputNumber\" class=\"field\" disabled><select id=\"" + element + "-outputCurrency\" onchange=\"exchangeRates.updateConverted(\'" + element + "\')\" class=\"selector\"><option value=\"CAD\">CAD</option><option value=\"USD\">USD</option><option value=\"EUR\">EUR</option><option value=\"AUD\">AUD</option><option value=\"CNY\">CNY</option><option value=\"DKK\">DKK</option><option value=\"SGD\">SGD</option><option value=\"THB\">THB</option></select>";

    return content;
}

// check the dom for elements with the exchangeWidget prefix
exchangeRates.init = function() {
    exchangeRates.populateDataLayer("http://api.fixer.io/latest");
    var i = 0;
    while (!!document.getElementById("exchangeWidget-" + i)) {
        document.getElementById("exchangeWidget-" + i).innerHTML = exchangeRates.populateWidget("exchangeWidget-" + i);
        i++;
    }
}

// wait for the page to be ready (to prevent timing issues) and then fill the divs
document.onreadystatechange = function() {
    if (document.readyState === "complete") {
        exchangeRates.init();
    }
}