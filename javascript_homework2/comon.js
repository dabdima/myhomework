/**
 * Created by Dmitry on 30.05.2017.
 */

var str;

// getting sentence
str = prompt("Enter you sentence", "");


function getTheLongestWord(s) {
    var strArray = s.split(" "),
        theLongestWord = "";

    for (i = 0; i < strArray.length; i++) {
        if (theLongestWord.length < strArray[i].length) {
            theLongestWord = strArray[i];
        }
    }

    return theLongestWord;
}


alert("The longest word in the sentence: " + "\n\"" + str + "\"" + "\nis: " + getTheLongestWord(str));






