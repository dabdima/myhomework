/**
 * Created by Dmitry on 30.05.2017.
 */

var str,
    strAlert,
    currentWord,
    res ="";

// getting sentence
str = prompt("Enter you sentence", "");
strAlert = str;


 do {
    currentWord = str.substring(0, str.indexOf(" "));

    if (res.length < currentWord.length) {
        res = currentWord;
    }
    str = str.substring(str.indexOf(" ") + 1);

} while (str.indexOf(" ") !== -1);


alert("The longest word in the sentence: " + "\n\"" + strAlert + "\"" + "\nis: " + res);
















// function getTheLongestWord(s) {
//     var strArray = s.split(" "),
//         theLongestWord = "";
//
//     for (i = 0; i < strArray.length; i++) {
//         if (theLongestWord.length < strArray[i].length) {
//             theLongestWord = strArray[i];
//         }
//     }
//
//     return theLongestWord;
// }
//
//
// alert("The longest word in the sentence: " + "\n\"" + str + "\"" + "\nis: " + getTheLongestWord(str));




