function fillList(year, basePath) {
    if (!basePath) {
        basePath = '';
    }
    let ulId = 'days-list';
    if (year) {
        ulId += '-' + year;
    }

    let ul = document.getElementById(ulId);
    for (let day = 1; day <= 25; day++) {
        createLi(day, ul, basePath);
    }
}

function createLi(day, parent, basePath) {
    let li = document.createElement('li');

    li.style.display = 'none';
    li.innerHTML = '<a href="' + basePath + 'day/' + day + '/index.html">Day ' + day + '</a>: ';
    $.getJSON(basePath + 'day/' + day + '/metadata.json', function(data) {
        fillInformation(li, data);
    }).fail(function(){
        parent.removeChild(li);
        if (!parent.innerHTML || parent.innerHTML === '') {
            parent.innerHTML = 'No puzzle solved for this year yet.';
        }
    });

    parent.appendChild(li);
}

function fillInformation(li, data) {
    li.innerHTML += '<strong>' + data.title + '</strong>';
    li.innerHTML += '<span> [<em>' + getTags(data.tags) + '</em>] </span>';
    
    // Solved parts of the puzzle
    for (let puzzle = 1; puzzle <= 2; puzzle++) {
        if (data.solved && data.solved.indexOf(puzzle) !== -1) {
            li.innerHTML += '<i class="fas fa-star" title="Part ' + puzzle + ' solved"></i>';
        } else {
            li.innerHTML += '<i class="far fa-star" title="Part ' + puzzle + ' not solved"></i>';
        }
    }

    // Visual interest
    let visuals = {};
    switch(data.visuals) {
        case 2:  visuals.icon = 'fas fa-heartbeat'; visuals.title = 'Great visuals'; break;
        case 1:  visuals.icon = 'fas fa-heart';     visuals.title = 'Good visuals'; break;
        default: visuals.icon = 'far fa-heart';     visuals.title = 'No visuals';break;
    }
    li.innerHTML += ' <i class="' + visuals.icon + '" title="' + visuals.title + '"></i>';

    // Note
    if (data.note) {
        li.innerHTML += ' <span class="far fa-sticky-note" title="' + data.note + '"></i>';
    }

    li.style.display = 'block';
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