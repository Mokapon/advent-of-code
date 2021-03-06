function metaLoaded(meta) {
    document.getElementById('year-title').innerHTML += ' ' + meta.year;
    document.getElementById('main-title').innerHTML += ', day ' + meta.day;
    document.getElementById('puzzle-title').innerHTML = meta.title;
    document.getElementById('github-link').href += meta.year + '/day/' + meta.day;

    document.getElementById('instructions-content').innerHTML = parseInstructions(meta.instructions);
    document.getElementById('puzzle-link').href = 'https://adventofcode.com/' + meta.year + '/day/' + meta.day;

    document.title = 'AoC ' + meta.year + ' - day ' + meta.day;
}

function parseInstructions(instructions) {
    let content = '';
    for (let key of Object.keys(instructions)) {
        content+= '<div><strong>' + key + '</strong>'
        for (let element of instructions[key]) {
            content += '<p>' + element + '</p>'
        }
        content+= '</div>'
    }
    return content;
}

function loadMeta() {
    $.getJSON('metadata.json', metaLoaded);
}

document.onload = loadMeta();