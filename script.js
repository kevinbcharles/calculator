const buttons = document.getElementById("buttons");
var screen = document.getElementById("screenText");
const symbols = ["C","√","±","÷",7,8,9,"x",4,5,6,"-",1,2,3,"+",0,0,".","="];
var input = "";
var op = "";
var opNew = ""
var dot = false;
var holdVal = 0;
var holdOp = "";

function createButtons() {
    for (i = 1; i <= 20; i++) {
        var content = document.createElement("div");
        content.setAttribute("id", "item"+i);
        
        if ([4,8,12,16,20].includes(i)) {
            content.setAttribute("class","box opperator");
        } else {
            content.setAttribute("class","box");
        };
        content.textContent = symbols[i-1];
        content.addEventListener("click", buttonPress);
        buttons.appendChild(content);
    }
}
createButtons();


function buttonPress() {
    console.log("input = " +input);
    if (this.id === "item1") { //if you press clear button, reset everything
        a = 0;
        b = 0;
        input = "";
        op = "";
        opNew = "";
        screen.textContent = 0;
        dot = false;
    }else if (this.id === "item2"){ //if you press square root button
        a = parseFloat(input);
        op = this.textContent;
        screen.textContent = calculate(op,a);
        input = "";
    }else if (this.id === "item3") { //if you press plus or minus button
        if (input != "0" || input != "") { //only change the sign if input is a nonzero number
            if (input[0] == "-") { //if negative, remove negative sign
                input = input.slice(1);
                screen.textContent = input;
            }else { 
                input = "-" + input; //if positive, add negative sign
                screen.textContent = input;
            }
        }
        
    
    }else if (this.id === "item19") { //if you press decimal button
        if (dot == false) {
            dot = true;
            input += this.textContent;
            screen.textContent = input;
        }
    }else if (len(input) == 10){ //if you try to type in too many numbers, overflow
        screen.textContent = "overflow";
    } else {
        opperate(this); 
    } 
}

function opperate(pressed) {
    input += pressed.textContent; //add pressed digit to input string
    if (pressed.classList.contains("opperator")) {
        dot = false;  //reset decimal point tracker
        if (op === "") { // if op is blank, then this is your first input number
            screen.textContent = pressed.textContent;
            op = pressed.textContent;
            a = parseFloat(input); //convert input string to float
            input = ""; //reset input to blank so you can enter next number
            
        } else { //op exists so you just entered the second number
            opNew = pressed.textContent;
            b = parseFloat(input);
            if (opNew == "=") {
                if (holdOp == "") { //check if hold addition needs to be done because pemdas
                    screen.textContent = calculate(op,a,b);
                }else {
                    b = calculate(op,a,b);
                    a = calculate(holdOp,hold,b);
                    screen.textContent = a;
                }
                
            }else if (opNew == "x" || opNew == "÷") {
                if (op == "x" || op == "÷") { //if you multiplied before multiplying, order doesnt matter
                    a = calculate(op,a,b);
                } else { // if you added before multiplying, hold addition step for after multiplying is done
                    hold = a;
                    holdOp = op;
                    a = b;
                }
                op = opNew;
                screen.textContent = a;
                input = "";
            }else if (opNew == "+" || opNew == "-") {
                if (op == "x" || op == "÷") {
                    if (holdOp ==""){
                        a = calculate(op,a,b);
                    }else {
                        b = calculate(op,a,b);
                        a = calculate(holdOp,holdVal,b);
                    }
                    op = opNew;
                    screen.textContent = a;
                    input = "";
                } else {
                    a = calculate(op,a,b);
                    op = opNew;
                    screen.textContent = a;
                    input = "";
                }
            }
        }  
    } else {
        screen.textContent = input;
    }
}

function multiply(a,b) {
    return round(a*b);
}
function add(a,b) {
    return round(a+b);
}

function divide(a,b) {
    return round(a/b);
}

function subtract(a,b) {
    return round(a-b);
}

function sqrt(a) {
    return round(a**.5);
}

function calculate(val,a,b) {
    if (val == "x") {
        return multiply(a,b);
    }else if (val == "÷"){
        return divide(a,b);
    }else if (val == "+") {
        return add(a,b);
    }else if (val == "-") {
        return subtract(a,b);
    }else if (val == "√") {
        console.log("square root of "+a);
        return sqrt(a);
    }
}

function len(val) { //returns the number of integer digits of number
    return Math.floor(Math.log10(val))+1;
}

function round(val) { /*rounds off decmial numbers to prevent overflow, 
    or return overflow if int is too long*/
    var length = len(val);
    var digits = 8 - length;  //this is number of digits you can have after decimal
    if (length > 10) {
        return "overflow"
    }
    var scale = 10**digits;
    return Math.round((val+.00000000001)*scale)/scale;
}

