const EVENT_SHIFT_START = 0;
const EVENT_FALL_ASLEEP = 1;
const EVENT_WAKE_UP = 2;

function Record(date, event, guardId) {
    this.date = date;
    this.event = event;
    this.guardId = guardId;

    this.isShiftStart = function() {
        return this.event === EVENT_SHIFT_START;
    }
}

function Guard (guardId) {
    this.id = guardId;
    this.sleepingDays = 0;
    this.sleepMinutes = 0;
    this.minutes = [];
    this.mostSleptMinute;

    this.registerDay = function(sleepSessions) {
        if (sleepSessions.length > 0) {
            this.sleepingDays++;
        }
        for (let session of sleepSessions) {
            for (let i=session.from; i <= session.to; i++) {
                if (!this.minutes[i]) {
                    this.minutes[i] = 1;
                } else {
                    this.minutes[i]++;
                }
                if (!this.mostSleptMinute || this.minutes[i] > this.minutes[this.mostSleptMinute]) {
                    this.mostSleptMinute = i;
                }
                this.sleepMinutes++;
            }
        }
    }
}

function RecordDay (dateString, guardId) {
    this.dateString = dateString;
    this.guardId = guardId;
    this.sleepSessions = [];
    this.lastSession;
    this.sleepDuration = 0;

    this.startSleep = function(minute) {
        this.lastSession = { from: minute };
        this.sleepSessions.push(this.lastSession);
    }
    this.wakeUp = function(minute) {
        this.lastSession.to = minute - 1;
        this.lastSession.duration = minute - this.lastSession.from;
        this.sleepDuration += this.lastSession.duration
    }
    this.end = function() {
        if (this.lastSession && !this.lastSession.to) {
            this.wakeUp(60);
        }
        guards[this.guardId].registerDay(this.sleepSessions);
    }
}

function compareDays(d1, d2) {
    return new Date(d1.dateString) - new Date(d2.dateString);
}

function compareRecords(r1, r2) {
    return r1.date - r2.date;
}