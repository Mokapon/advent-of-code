function fillList(year, basePath) {
    if (!basePath) {
        basePath = '';
    }
    let ul = document.getElementById('days-list-' + year);
    for (let day = 1; day <= 25; day++) {
        createLi(day, ul, basePath);
    }
}

function createLi(day, parent, basePath) {
    let li = document.createElement('li');

    li.innerHTML = '<a href="' + basePath + 'day/' + day + '/index.html">Day ' + day + '</a>: ';
    $.getJSON(basePath + 'day/' + day + '/metadata.json', function(data) {
        li.innerHTML += '<strong>' + data.title + '</strong>';
        li.innerHTML += ' [<em>' + getTags(data.tags) + '</em>]';
    }).fail(function(){
        parent.removeChild(li);
        if (!parent.innerHTML || parent.innerHTML === '') {
            parent.innerHTML = 'No puzzle solved for this year yet.';
        }
    });

    parent.appendChild(li);
}

function getTags(tags) {
    let result = '';
    for (let i = 0; i < tags.length; i++) {
        result += tags[i];
        if (i < tags.length - 1) {
            result += ', ';
        }
    }
    return result;
}