function metaLoaded(meta) {
    document.getElementById('year-title').innerHTML += ' ' + meta.year;
    document.getElementById('main-title').innerHTML += ', day ' + meta.day;
    document.getElementById('puzzle-title').innerHTML = meta.title;
    document.getElementById('github-link').href += meta.year + '/day/' + meta.day;

    document.getElementById('instructions-content').innerHTML = meta.instructions;
    document.getElementById('puzzle-link').href = 'https://adventofcode.com/' + meta.year + '/day/' + meta.day;

    document.title = 'AoC ' + meta.year + ' - day ' + meta.day;
}

function loadMeta() {
    $.getJSON('metadata.json', metaLoaded);
}

document.onload = loadMeta();