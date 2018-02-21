function Room(name, sector, checksum) {
  this.name = name;
  this.sector = sector;
  this.givenChecksum = checksum;
  this.properChecksum = getProperChecksum(name);
  this.decipheredName = decipherName(name, sector);

  this.isValid = function() {
    return this.properChecksum === this.givenChecksum;
  }

  function decipherName(name, sector) {
    var a = 'a'.charCodeAt(0);
    var hyphen = '-'.charCodeAt(0);
    var nbLetters = 26;
  
    var decipheredName = '';
    for (var i = 0; i < name.length; i++) {
      var chr = name.charCodeAt(i);
      if (chr === hyphen) {
        decipheredName += ' ';
      } else {
        var newChar = (chr - a + sector) % nbLetters + a;
        decipheredName += String.fromCharCode(newChar);
      }
    }
    
    return decipheredName
  }

  function getProperChecksum(name) {
    var occ = getLettersOccurrence(name.replace(/-/g, ''));

    occ.sort(function(l1, l2) {
      var occDiff = l2.occ - l1.occ;
      if (occDiff === 0) {
        return l1.letter.charCodeAt(0) - l2.letter.charCodeAt(0);
      }
      return occDiff;
    });

    var checksum = '';
    for (var i = 0; i < checksumLength; i++) {
      checksum += occ[i].letter;
    }
    return checksum;
  }

  function getLettersOccurrence(name) {
    var occ = [];

    for (var i = 0; i < name.length; i++) {
      var char = name.charAt(i);
      var alreadyExists = false;
      for (var j = 0; j < occ.length; j++) {
        if (occ[j].letter === char) {
          occ[j].occ++;
          alreadyExists = true;
          break;
        }
      }
      if (!alreadyExists) {
        occ.push({
          letter: char,
          occ: 1
        })
      }
    }

    return occ;
  }
}