// let see how this thingh really works jai hind  




htPunctuation = {};
listStaticSuffix = {};
listStaticPrefix = {};
listHelpNotation = {};

// do we create a empty function in  javascript  
var InrToWordConverter = function () {

};

InrToWordConverter.Initialize = function () {
    InrToWordConverter.LoadStaticPrefix();
    InrToWordConverter.LoadStaticSuffix();
    InrToWordConverter.LoadHelpofNotation();
};

InrToWordConverter.ConvertToWord = function (value) {
    value = value.toString();

    if (value) {
        var tokens = value.split(".");
        var rsPart = "";
        var psPart = "";
        if (tokens.length === 2) {
            rsPart = String.trim(tokens[0]) || "0";
            psPart = String.trim(tokens[1]) || "0";
        }
        else if (tokens.length === 1) {
            rsPart = String.trim(tokens[0]) || "0";
            psPart = "0";
        }
        else {
            rsPart = "0";
            psPart = "0";
        }

        htPunctuation = {};
        var rsInWords = InrToWordConverter.ConvertToWordInternal(rsPart) || "Zero";
        var psInWords = InrToWordConverter.ConvertToWordInternal(psPart) || "Zero";

        var result = "Rupees " + rsInWords + "and " + psInWords + " Paise.";
        return result;
    }
};

InrToWordConverter.ConvertToWordInternal = function (value) {
    var convertedString = "";
    if (!(value.toString().length > 40))
    {
        if (InrToWordConverter.IsNumeric(value.toString()))
        {
            try
            {
                var strValue = InrToWordConverter.Reverse(value);
                switch (strValue.length)
                {
                    case 1:
                        if (parseInt(strValue.toString()) > 0) {
                            convertedString = InrToWordConverter.GetWordConversion(value);
                        }
                        else {
                            convertedString = "Zero ";
                        }
                        break;
                    case 2:
                        convertedString = InrToWordConverter.GetWordConversion(value);
                        break;
                    default:
                        InrToWordConverter.InsertToPunctuationTable(strValue);
                        InrToWordConverter.ReverseHashTable();
                        convertedString = InrToWordConverter.ReturnHashtableValue();
                        break;
                }
            }
            catch (exception) {
                convertedString = "Unexpected Error Occured <br/>";
            }
        }
        else {
            convertedString = "Please Enter Numbers Only, Decimal Values Are not supported";
        }
    }
    else {
        convertedString = "Please Enter Value in Less Then or Equal to 40 Digit";
    }
    return convertedString;
};

InrToWordConverter.IsNumeric = function (valueInNumeric) {
    var isFine = true;
    valueInNumeric = valueInNumeric || "";
    var len = valueInNumeric.length;
    for (var i = 0; i < len; i++) {
        var ch = valueInNumeric[i];
        if (!(ch >= '0' && ch <= '9')) {
            isFine = false;
            break;
        }
    }
    return isFine;
};

InrToWordConverter.ReturnHashtableValue = function () {
    var strFinalString = "";
    var keysArr = [];
    for (var key in htPunctuation) {
        keysArr.push(key);
    }
    for (var i = keysArr.length - 1; i >= 0; i--) {
        var hKey = keysArr[i];
        if (InrToWordConverter.GetWordConversion((htPunctuation[hKey]).toString()) !== "") {
            strFinalString = strFinalString + InrToWordConverter.GetWordConversion((htPunctuation[hKey]).toString()) + InrToWordConverter.StaticPrefixFind((hKey).toString());
        }
    }
    return strFinalString;
};

InrToWordConverter.ReverseHashTable = function () {
    var htTemp = {};
    for (var key in htPunctuation) {
        var item = htPunctuation[key];
        htTemp[key] = InrToWordConverter.Reverse(item.toString());
    }
    htPunctuation = {};
    htPunctuation = htTemp;
};

InrToWordConverter.InsertToPunctuationTable = function (strValue) {
    htPunctuation[1] = strValue.substr(0, 3).toString();
    var j = 2;
    for (var i = 3; i < strValue.length; i = i + 2) {
        if (strValue.substr(i).length > 0) {
            if (strValue.substr(i).length >= 2) {
                htPunctuation[j] = strValue.substr(i, 2).toString();
            }
            else {
                htPunctuation[j] = strValue.substr(i, 1).toString();
            }
        }
        else {
            break;
        }
        j++;

    }
};

InrToWordConverter.Reverse = function (strValue) {
    var reversed = "";
    for (var i in strValue) {
        var ch = strValue[i];
        reversed = ch + reversed;
    }
    return reversed;
};

InrToWordConverter.GetWordConversion = function (inputNumber) {
    var toReturnWord = "";
    if (inputNumber.length <= 3 && inputNumber.length > 0) {
        if (inputNumber.length === 3) {
            if (parseInt(inputNumber.substr(0, 1)) > 0) {
                toReturnWord = toReturnWord + InrToWordConverter.StaticSuffixFind(inputNumber.substr(0, 1)) + "Hundred ";
            }

            var tempString = InrToWordConverter.StaticSuffixFind(inputNumber.substr(1, 2));

            if (tempString === "")
            {
                toReturnWord = toReturnWord + InrToWordConverter.StaticSuffixFind(inputNumber.substr(1, 1) + "0");
                toReturnWord = toReturnWord + InrToWordConverter.StaticSuffixFind(inputNumber.substr(2, 1));
            }
            toReturnWord = toReturnWord + tempString;
        }
        if (inputNumber.length === 2)
        {
            var tempString = InrToWordConverter.StaticSuffixFind(inputNumber.substr(0, 2));
            if (tempString === "")
            {
                toReturnWord = toReturnWord + InrToWordConverter.StaticSuffixFind(inputNumber.substr(0, 1) + "0");
                toReturnWord = toReturnWord + InrToWordConverter.StaticSuffixFind(inputNumber.substr(1, 1));
            }
            toReturnWord = toReturnWord + tempString;
        }
        if (inputNumber.length === 1)
        {
            toReturnWord = toReturnWord + InrToWordConverter.StaticSuffixFind(inputNumber.substr(0, 1));
        }

    }
    return toReturnWord;
};

InrToWordConverter.StaticSuffixFind = function (numberKey) {
    var valueFromNumber = "";
    for (var key in listStaticSuffix) {
        if (String.trim(key.toString()) === String.trim(numberKey)) {
            valueFromNumber = listStaticSuffix[key].toString();
            break;
        }
    }
    return valueFromNumber;
};

InrToWordConverter.StaticPrefixFind = function (numberKey) {
    var valueFromNumber = "";
    for (var key in listStaticPrefix) {
        if (String.trim(key) === String.trim(numberKey)) {
            valueFromNumber = listStaticPrefix[key].toString();
            break;
        }
    }
    return valueFromNumber;
};

InrToWordConverter.StaticHelpNotationFind = function (numberKey) {
    var helpText = "";
    for (var key in listHelpNotation) {
        if (String.trim(key.toString()) === String.trim(numberKey)) {
            helpText = listHelpNotation[key].toString();
            break;
        }
    }
    return helpText;
};

InrToWordConverter.LoadStaticPrefix = function () {
    listStaticPrefix[2] = "Thousand ";
    listStaticPrefix[3] = "Lac ";
    listStaticPrefix[4] = "Crore ";
    listStaticPrefix[5] = "Arab ";
    listStaticPrefix[6] = "Kharab ";
    listStaticPrefix[7] = "Neel ";
    listStaticPrefix[8] = "Padma ";
    listStaticPrefix[9] = "Shankh ";
    listStaticPrefix[10] = "Maha-shankh ";
    listStaticPrefix[11] = "Ank ";
    listStaticPrefix[12] = "Jald ";
    listStaticPrefix[13] = "Madh ";
    listStaticPrefix[14] = "Paraardha ";
    listStaticPrefix[15] = "Ant ";
    listStaticPrefix[16] = "Maha-ant ";
    listStaticPrefix[17] = "Shisht ";
    listStaticPrefix[18] = "Singhar ";
    listStaticPrefix[19] = "Maha-singhar ";
    listStaticPrefix[20] = "Adant-singhar ";
};

InrToWordConverter.LoadStaticSuffix = function () {
    listStaticSuffix[1] = "One ";
    listStaticSuffix[2] = "Two ";
    listStaticSuffix[3] = "Three ";
    listStaticSuffix[4] = "Four ";
    listStaticSuffix[5] = "Five ";
    listStaticSuffix[6] = "Six ";
    listStaticSuffix[7] = "Seven ";
    listStaticSuffix[8] = "Eight ";
    listStaticSuffix[9] = "Nine ";
    listStaticSuffix[10] = "Ten ";
    listStaticSuffix[11] = "Eleven ";
    listStaticSuffix[12] = "Twelve ";
    listStaticSuffix[13] = "Thirteen ";
    listStaticSuffix[14] = "Fourteen ";
    listStaticSuffix[15] = "Fifteen ";
    listStaticSuffix[16] = "Sixteen ";
    listStaticSuffix[17] = "Seventeen ";
    listStaticSuffix[18] = "Eighteen ";
    listStaticSuffix[19] = "Nineteen ";
    listStaticSuffix[20] = "Twenty ";
    listStaticSuffix[30] = "Thirty ";
    listStaticSuffix[40] = "Fourty ";
    listStaticSuffix[50] = "Fifty ";
    listStaticSuffix[60] = "Sixty ";
    listStaticSuffix[70] = "Seventy ";
    listStaticSuffix[80] = "Eighty ";
    listStaticSuffix[90] = "Ninty ";
};

InrToWordConverter.LoadHelpofNotation = function () {
    listHelpNotation[2] = "=1,000 (3 Trailing Zeros)";
    listHelpNotation[3] = "=1,00,000 (5 Trailing Zeros)";
    listHelpNotation[4] = "=1,00,00,000 (7 Trailing Zeros)";
    listHelpNotation[5] = "=1,00,00,00,000 (9 Trailing Zeros)";
    listHelpNotation[6] = "=1,00,00,00,00,000 (11 Trailing Zeros)";
    listHelpNotation[7] = "=1,00,00,00,00,00,000 (13 Trailing Zeros)";
    listHelpNotation[8] = "=1,00,00,00,00,00,00,000 (15 Trailing Zeros)";
    listHelpNotation[9] = "=1,00,00,00,00,00,00,00,000 (17 Trailing Zeros)";
    listHelpNotation[10] = "=1,00,00,00,00,00,00,00,00,000 (19 Trailing Zeros)";
    listHelpNotation[11] = "=1,00,00,00,00,00,00,00,00,00,000 (21 Trailing Zeros)";
    listHelpNotation[12] = "=1,00,00,00,00,00,00,00,00,00,00,000 (23 Trailing Zeros)";
    listHelpNotation[13] = "=1,00,00,00,00,00,00,00,00,00,00,00,000 (25 Trailing Zeros)";
    listHelpNotation[14] = "=1,00,00,00,00,00,00,00,00,00,00,00,00,000 (27 Trailing Zeros)";
    listHelpNotation[15] = "=1,00,00,00,00,00,00,00,00,00,00,00,00,00,000 (29 Trailing Zeros)";
    listHelpNotation[16] = "=1,00,00,00,00,00,00,00,00,00,00,00,00,00,00,000 (31 Trailing Zeros)";
    listHelpNotation[17] = "=1,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,000 (33 Trailing Zeros)";
    listHelpNotation[18] = "=1,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,000 (35 Trailing Zeros)";
    listHelpNotation[19] = "=1,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,000 (37 Trailing Zeros)";
    listHelpNotation[20] = "=1,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,000 (39 Trailing Zeros)";
};
    if (!String.trim) {
    String.trim = function (str) {
        var result = "";
        var firstNonWhiteSpaceFound = false;
        var startIndex = -1;
        var endIndex = -1;
        if (str) {
            for (var i = 0; i < str.length; i++) {
                if (firstNonWhiteSpaceFound === false) {
                    if (str[i] === ' ' || str[i] === '\t') {
                        continue;
                    }
                    else {
                        firstNonWhiteSpaceFound = true;
                        startIndex = i;
                        endIndex = i;
                    }
                }
                else {
                    if (str[i] === ' ' || str[i] === '\t') {
                        continue;
                    }
                    else {
                        endIndex = i;
                    }
                }
            }
            if (startIndex !== -1 && endIndex !== -1) {
                result = str.slice(startIndex, endIndex + 1);
            }
        }
        return result;
    };
}

InrToWordConverter.Initialize();
// InrToWordConverter.Initialize();

document.addEventListener("input",function(){

    
    var intInput = document.getElementById("number_id").value ; 
    if ( intInput == null ){
        console.log("why the fuck it shows a wrong in put bhenchoad ") ;
    }
    // var amount = 234234523235235423; 
    // var amount = intInput.value ; 
    var amount = toString(intInput);
    var inWords = InrToWordConverter.ConvertToWord(intInput);
    console.log(inWords); 

    var intword = intConverter(intInput);
    var div1 = document.getElementById("inputValue");
    div1.innerText = intword ;  
    console.log(intword);  

    // var amount = intInput.value ; 


});
// console.log(inWords); 


// ************************
// $$$$$$$$$$$$$$$$$$$$$$$$
// This is function to create a converter from number to word in million form 
// $$$$$$$$$$$$$$$$$$$$$$$$
// ************************


var digit2 = {
    0 : "",
    1 : "one " ,
    2 : "two " , 
    3 : "three " , 
    4 : "four ", 
    5 : "five " , 
    6 : "six " , 
    7 : "seven " , 
    8 : "eight " , 
    9 : "nine " , 
    10 : "ten " , 
    11 : "eleven " , 
    12 : "twelve " , 
    13 : "thirteen " , 
    14 : "fourteen " , 
    15 : "fifteen " , 
    16 : "sixteen " , 
    17 : "seventeen " , 
    18 : "eighteen " , 
    19 : "nineteen " , 

} ;

var tens = {
    2 : "twenty " , 
    3 : "thirty " , 
    4 : "fourty " , 
    5 : "fifty "  , 
    6 : "sixty " , 
    7 : "seventy " , 
    8 : "eighty " , 
    9 : "ninety "  
} ;


var digits = {
    0 : "", 
    1 : "Thousand " ,
    2 : "Million " , 
    3 : "Billion " , 
    4 : "Trillion " , 
    5 : "Quadrillion ",
    6 : "Quintillion ", 
    7 : "Sextillion ",
    8 : "Septillion ",
    9 : "Octillion ",
    10 : "Nonillion ", 
    11 : "Decillion ",
    12 : "Undecillion ", 
    13 : "Duodecillion ", 
    14 : "Tredecillion ",
    15 : "Quattuordecillion ",
    16 : "Quidecillion ",
    17 : "Sexdecillion ",
    18 : "Septendecillion " ,
    19 : "Octodecillion ",
    20 : "Novemdecillion ",
    21 : "Vigintillion ",
    22: "Unvigintillion ",
    23 : "Duovigintillion ",
    24 : "Trevigintillion ",
    25 : "Quattuorvigintillion ",
    26 : "Quinvigintillion ",
    27 : "Sexvigintillion ",
    28 : "Septenvigintillion ",
    29 : "Octovigintillion ",
    30 : "Novemvigintillion ",
    31 : "Trigintillion ",
    32 : "Untrigintillion ",
    33 : "Duotrigintillion "

};

//  I think there should be limit and this limit will be 10 raise to 100  which is called googol 
// first i have to create a funtion which can convert from 0 - 999 seamlessly thankyou 


function tenthConverter(value){
    var valueInt = parseInt(value);
    var resultWord = ""

    if (valueInt == 0 ){
        return resultWord ; 
    }

    if (valueInt < 20 ){
        resultWord += digit2[valueInt] ;
        return resultWord ; 
    }

    else {
        var tenth = Math.floor(valueInt/10); 
        var onth = valueInt % 10 ; 
        resultWord +=  tens[tenth] ; 
        resultWord += digit2[onth] ;
        return resultWord ; 
    }


}
// console.log(tenthConverter("0"));
console.log(hundredConverter("999"));
function hundredConverter(value){
    var valueLen = value.length ;
    var resultWord = "" ;
    var valueInt = parseInt(value) ;

    
    
    if (valueLen == 3){
        var hundredInt = parseInt(value.substr(0,1));
        resultWord += digit2[hundredInt] + "Hundred " ;
        resultWord += tenthConverter(value.substr(1,2)); 
        return resultWord ;   
        
    }
    else {
        resultWord = tenthConverter(value) ; 
        return resultWord 
    }
}

// Now i have to create the main function 
// for example 232344243242424242424 this is a input then i have to just break it in three part 
// console.log(intConverter("100000000000000000000000000000000000000000000000000000000000000000000000000000")); 

function intConverter(inputStr){
//    console.log("is this working "); 
    var inputLen = inputStr.length ;
    var remainder = inputLen % 3 ; 
    var quotient = Math.floor(inputLen/3);
    var resultWord = ""; 
    var cycle = 0 ; 
    if (remainder > 0 ){
    cycle = quotient +1 ; 
    } 
    else {
        cycle = quotient ; 
    }
    var positionCounter = 0 ; 
    
    for (  i = cycle ; i >= 1 ; i-- ){
         
        // console.log("print jai hind "); 

        var subStringUsed  = "" ; 
        var subInt = 0;

        if (positionCounter == 0 ){
            // console.log("from positoin counter"); 
            if(remainder != 0 ){
                var subStringUsed  = inputStr.substr(positionCounter,remainder) ; 
                var subInt = parseInt(subStringUsed);
                 
                if (subInt == 0 ){
                    resultWord += "" ; 
                }
                else{
                    resultWord += hundredConverter(subStringUsed) + digits[i-1] ; 
                }

                positionCounter += remainder ; 
            }
            else {

                var subStringUsed  = inputStr.substr(positionCounter,3) ; 
                var subInt = parseInt(subStringUsed);
        
                if (subInt == 0 ){
                    resultWord += "" ; 
                }
                else{
                    resultWord += hundredConverter(subStringUsed) + digits[i-1] ; 
                }
                positionCounter += 3 ; 


            }
        }

        else {
            var subStringUsed  = inputStr.substr(positionCounter,3) ; 
            var subInt = parseInt(subStringUsed);
    
            if (subInt == 0 ){
                resultWord += "" ; 
            }
            else{
                resultWord += hundredConverter(subStringUsed) + digits[i-1] ; 
            }
            positionCounter += 3; 


        }


    }
    // cycle-- ;
    return resultWord ; 
    
}


