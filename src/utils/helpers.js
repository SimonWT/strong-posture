export function getSeconsFromTime (time) {
    let [minutes, seconds] = time.split(":")
    return parseInt(minutes) * 60 + parseInt(seconds)
}

export function getStringTimeFromSeconds(seconds) {
    return fancyTimeFormat(seconds)
}

function fancyTimeFormat(duration)
{   
    // Hours, minutes and seconds
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    ret += "" + (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

export function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }
  