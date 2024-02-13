const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton")
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols =  '!@#$%^&*()_-+={}[]|?/.,;:~`<>\"\\';

let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();

// set strength color to gray
setIndicator("#ccc");


// set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max; 

    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}


function getRandomInteger(min, max){
  return Math.floor(Math.random() * (max - min ) ) + min;
}

function generateRandomInteger(){
    return getRandomInteger(0, 9);
}

function generateLowercase(){
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUppercase(){
    return String.fromCharCode(getRandomInteger(65, 90));
}

function generateSymbol(){
   const randomNum = getRandomInteger(0, symbols.length);
   return symbols.charAt(randomNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolCheck.checked) hasSym=true;

    if(hasUpper && hasLower && hasNum || hasSym && passwordLength >= 8){
        setIndicator("#0f0");
    } 
    else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6 
      ){
        setIndicator("#0ff0");
        }
     else {
        setIndicator("#f00");
    }
}

async function copyContent(){
  try{
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
}

  catch(e){
    copyMsg.innerText = "failed";
  }

  copyMsg.classList.add("active");
  
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array){
  // fisher yates Method
  for (let i = array.length - 1; i > 0; i--){
    // finding random j
    const j = Math.floor(Math.random() * (i + 1));
    // swapping number at i index and j index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckBoxChange(){
   checkCount = 0;
   allCheckBox.forEach((checkbox) => {
   if(checkbox.checked)
    checkCount++;
   });

   if(passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
   }
}
allCheckBox.forEach( (checkbox) => {
  checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
    copyContent(); 
})
generateBtn.addEventListener('click', () => {
  //  none of the check box are selected

  if(checkCount == 0)
   return;
   
  if(passwordLength < checkCount){
    passwordLength = checkCount;
    handleSlider();
  }

  // lets start the journey to find new password
  // remove old password

  password = "";

 // lets put the stuff mentioned by checkbox
 
//  if(uppercaseCheck.checked){
//   password += generateUppercase();
//  }

//  if(lowercaseCheck.checked){
//   password += generateLowercase();
//  }

//  if(numbersCheck.checked){
//   password += generateRandomInteger();
//  }

//  if(symbolCheck.checked){
//   password += generateSymbol();
//  }

let functArr = [];

if(uppercaseCheck.checked)
 functArr.push(generateUppercase);

if(lowercaseCheck.checked)
 functArr.push(generateLowercase);

if(numbersCheck.checked)
 functArr.push(generateRandomInteger);

if(symbolCheck.checked)
 functArr.push(generateSymbol);

//  compulsory addition

for (let i=0; i<functArr.length; i++){
  password += functArr[i]();
}

// remaining addition

for (let i=0; i<passwordLength-functArr.length; i++) {
  let ranIndex = getRandomInteger(0, functArr.length); 
  password += functArr[ranIndex]();
}

// shuffle password
password = shufflePassword(Array.from(password));

// show in UI
passwordDisplay.value = password;

// calculate strength
calcStrength();

});