/**
 * Created by Dmitry on 27.05.2017.
 */

var num1,
    num2,
    act,
    err = 0,
    result;


// getting 1st number with subsequently validation
num1 = prompt("Enter the 1st number", "");
num1 = validateNum(num1, "Enter the 1st number");


// getting action(math operation) with subsequently validation
do {
    act = prompt("Enter one of the operations: \"+\", \"-\", \"*\", \"\/\"", "");
    if ((act !== "+") && (act !== "-") && (act !== "*") && (act !== "/")) {
        err = 1;
        alert("Incorrect action! You can use only \"+\", \"-\", \"*\", \"\/\"");
    } else {
        err = 0;
    }
} while (err === 1);


// getting 2st number with subsequently validation
num2 = prompt("Enter the 2st number", "");
num2 = validateNum(num2, "Enter the 2st number");


// operation performing
switch (act) {
    case "+":
        result = +num1 + (+num2);
        break;
    case "-":
        result = +num1 - (+num2);
        break;
    case "*":
        result = +num1 * (+num2);
        break;
    case "/":
        result = +num1 / (+num2);
        break;
    default:
}


alert("Your result is: " + result);






// function for num1 and num2 validation
function validateNum(a, message) {
    do {
        if ((a === undefined) || (isNaN(Number(a))) || (a === "") || (a === null) || (a.indexOf(" ") !== -1)) {
            alert("Incorrect data! Try once more");
            a = prompt(message, "");
            err = 1;
        } else{
            // in case we divide by 0
            if ((act === "/") && (a == 0)) {
                alert("you cannot divide by \"0\"! Try another number");
                a = prompt(message, "");
                err = 1;
            } else{
                err = 0;
            }
        }
    } while (err === 1);

    return a;
}

