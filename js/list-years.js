let firstYear = 2015;
let lastYear = new Date().getMonth() === 11? new Date().getFullYear() : new Date().getFullYear()-1;

function createList() {
    let div = document.getElementById('content-years');
    if (!div) {
        return;
    }
    for (let i = lastYear; i >= firstYear; i--) {
        createYearCollapsibleElement(i, div);
    }
}

function createYearCollapsibleElement(year, parent) {
    let collaspseId = 'year-list-' + year;

    // Card
    let cardDiv = document.createElement('div');
    cardDiv.setAttribute('class', 'card bg-light');
    parent.appendChild(cardDiv);

    // Card header
    let cardHeader = document.createElement('div');
    cardHeader.setAttribute('class', 'card-header');
    cardHeader.innerHTML = '<h4><a href="#' + collaspseId + '" aria-expanded="true" data-toggle="collapse" aria-controls="' + collaspseId + '">Advent of Code ' + year + '</a></h4>';
    cardDiv.appendChild(cardHeader);

    // Card content
    let cardContent = document.createElement('div');
    cardContent.setAttribute('class', 'collapse');
    if (year === lastYear) {
        cardContent.setAttribute('class', 'show');
    }
    cardContent.setAttribute('id', collaspseId);
    cardDiv.appendChild(cardContent);

    // List Container
    let container = document.createElement('div');
    container.setAttribute('class', 'card-body');
    cardContent.appendChild(container);

    createYearList(year, container);
}

function createYearList(year, parent) {
    let ul = document.createElement('ul');
    ul.setAttribute('id', 'days-list-' + year);
    parent.appendChild(ul);
    fillList(year, 'year/' + year + '/')
}

document.onLoad = createList();