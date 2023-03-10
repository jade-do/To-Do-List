//console.log(module);

module.exports.getDate = getDate;
module.exports.getDay = getDay;

var getDate = function () { // getDate variable is bound to an anonymous
    var today = new Date();
    var options = {
        weekday: "long", // write out the entire day of the week
        day: "numeric",
        month: "long"
    }
    var day = today.toLocaleDateString("en-US", options);

    return day;
};

function getDay() {
    var today = new Date();
    var options = {
        weekday: "long" // write out the entire day of the week
    }
    var day = today.toLocaleDateString("en-US", options);

    return day;  
};
