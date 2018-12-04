toLoad = [EXAMPLE_P1, PART1];

const RECORD_REGEXP =/\[([^\]]*)\] (wakes up|falls asleep|Guard #([0-9]*) begins shift)/;

// display
const RESULTS_P1_Y = 20;
const RESULTS_P2_Y = 40;
const HEADER_Y = 60;
const LINE_HEIGHT = 20;
const MINUTE_WIDTH = 15;
const DAYS_LIST_X = 100;
const DAYS_LIST_Y = HEADER_Y+MINUTE_WIDTH;
const MARGIN = 10;
const DAY_X = 40;
const GUARD_X = DAYS_LIST_X-(DAY_X-MARGIN)/2;
let listPrinter;

// resolution data
let records;
let currentRecordIndex;
let currentDayIndex;
let days;
let guards;

// results
let sleepiestGuardId;
let mostConsistentSleeperGuardId;
let resultP1;
let resultP2;

function initDisplay() {
    createCanvas(1010, 400).parent('sketch');
    // Initialize display elements that don't change (textAlign, colors, etc.)
    textAlign(CENTER, CENTER);
}

function updateDisplay() {
    background(240);

    drawDaysGrid();
    
    // Draw actual list of days
    listPrinter.printList(currentDayIndex);

    // Draw results
    fill(0);
    noStroke();
    text('Guard that sleeps the most: ' + sleepiestGuardId, width/4, RESULTS_P1_Y);
    text('Minute they slept the most during: ' + (sleepiestGuardId ? guards[sleepiestGuardId].mostSleptMinute : ''), width*2/4, RESULTS_P1_Y);
    text('(Part 1) Answer: ' + resultP1, width*3/4, RESULTS_P1_Y);

    text('Guard that sleeps the most consistently: ' + mostConsistentSleeperGuardId, width/4, RESULTS_P2_Y);
    text('Minute they slept the most during: ' + (mostConsistentSleeperGuardId ? guards[mostConsistentSleeperGuardId].mostSleptMinute : ''), width*2/4, RESULTS_P2_Y);
    text('(Part 2) Answer: ' + resultP2, width*3/4, RESULTS_P2_Y);
}

function drawDaysGrid() {
    let h = MINUTE_WIDTH + listPrinter.displayedElements*LINE_HEIGHT;
    let x = DAYS_LIST_X;
    let y = HEADER_Y;

    stroke(0);
    noFill();
    rect(MARGIN, y, 2*(DAY_X-MARGIN), h);
    rect(GUARD_X-(DAYS_LIST_X-GUARD_X), y, 2*(DAYS_LIST_X-GUARD_X), h);
    fill(0);
    noStroke();
    text('Date', DAY_X, y+MINUTE_WIDTH/2+1);
    text('Guard', GUARD_X, y+MINUTE_WIDTH/2+1);

    // Draw the table of days header
    for (let i = 0; i < 60; i++) {
        fill(0);
        noStroke();
        text(i, x+MINUTE_WIDTH/2, y+MINUTE_WIDTH/2+1);
        stroke(0);
        noFill();
        rect(x, y, MINUTE_WIDTH, h);
        x+=MINUTE_WIDTH;
    }
}

function updatePuzzle() {
    let currentDay = days[currentDayIndex];
    let record = records[currentRecordIndex];
    do {
        if (record.event === EVENT_FALL_ASLEEP) {
            currentDay.startSleep(record.date.getMinutes());
        } else if (record.event === EVENT_WAKE_UP) {
            currentDay.wakeUp(record.date.getMinutes());
        }
        record = records[++currentRecordIndex];
    } while(record && record.event !== EVENT_SHIFT_START);

    currentDay.end();

    let currentGuard = guards[currentDay.guardId];
    // Evaluate if the sleepiest guard is beaten [part 1]
    if (!guards[sleepiestGuardId] || currentGuard.sleepMinutes >= guards[sleepiestGuardId].sleepMinutes) {
        sleepiestGuardId = currentGuard.id;
        resultP1 = currentGuard.id * guards[sleepiestGuardId].mostSleptMinute;
    }
    // Evaluate if the guard that slept the most consistently is beaten [part 2]
    let consistentSleeper = guards[mostConsistentSleeperGuardId];
    if (!consistentSleeper || currentGuard.minutes[currentGuard.mostSleptMinute] >= consistentSleeper.minutes[consistentSleeper.mostSleptMinute]) {
        mostConsistentSleeperGuardId = currentGuard.id;
        resultP2 = currentGuard.id * guards[mostConsistentSleeperGuardId].mostSleptMinute;
    }

    if (++currentDayIndex >= days.length || currentRecordIndex>= records.length) {
        puzzleSolved();
    }
}

function initPuzzle(input) {
    currentRecordIndex = 0;
    currentDayIndex = 0;
    records = [];
    days = [];
    guards = {};
    sleepiestGuardId = '';
    mostConsistentSleeperGuardId = '';
    resultP1 = '';
    resultP2 = '';

    for (let line of input) {
        let match = line.match(RECORD_REGEXP);
        let date = new Date(match[1]);
        let guardId = match[3];
        if (guardId) {
            // New day
            if (!guards[guardId]) {
                guards[guardId] = new Guard(guardId);
            }
            records.push(new Record(date, EVENT_SHIFT_START, guardId));
            // In case the shift is started before midnight, move to next day for the days list
            if (date.getHours()!==0) {
                date = new Date(date);
                date.setDate(date.getDate()+1);
            }
            days.push(new RecordDay(date.toLocaleDateString('en-US'), guardId));        
        } else {
            let event = match[2] === 'wakes up' ? EVENT_WAKE_UP : EVENT_FALL_ASLEEP;
            records.push(new Record(date, event));
        }
    }

    // Sort based on the dates
    days.sort(compareDays);
    records.sort(compareRecords);

    // list Printer because there will be more days than we can print on screen
    listPrinter = new ListPrinter(DAYS_LIST_Y, height - DAYS_LIST_Y, LINE_HEIGHT, days.length, displayDay);
}

function displayDay(index, y) {
    let day = days[index];
    
    push();

    // Text
    noStroke();
    fill(0);
    text(day.dateString, DAY_X, y+LINE_HEIGHT/2);
    text(day.guardId, GUARD_X, y+LINE_HEIGHT/2);

    // Border
    stroke(0);
    noFill();
    rect(MARGIN, y, width-MARGIN*2, LINE_HEIGHT);

    fill(AOC_ACCENT_COLOR);
    // Sleeping times
    for (let session of day.sleepSessions) {
        rect(DAYS_LIST_X + session.from * MINUTE_WIDTH, y, session.duration * MINUTE_WIDTH, LINE_HEIGHT);
    }

    pop();
}

