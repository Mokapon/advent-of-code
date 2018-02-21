function metaLoaded(meta) {
    document.getElementById("year-title").innerHTML += ' ' + meta.year;
    document.getElementById("day-title").innerHTML += ', day ' + meta.day;
    document.getElementById("puzzle-title").innerHTML = meta.title;

    document.getElementById("instructions-content").innerHTML = meta.instructions;
    document.getElementById("puzzle-link").href = 'https://adventofcode.com/' + meta.year + '/day/' + meta.day;

    document.title = 'AoC ' + meta.year + ' - day ' + meta.day;
}

function loadMeta() {
    $.getJSON("metadata.json", metaLoaded);
}

document.onload = loadMeta();