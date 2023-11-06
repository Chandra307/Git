"use strict";
const elem1 = document.getElementById('num1');
const elem2 = document.getElementById('num2');
const btn = document.querySelector('button');
const numResults = [];
const textResults = [];
function add(num1, num2) {
    if (typeof num1 === 'number' && typeof num2 === 'number') {
        return num1 + num2;
    }
    else if (typeof num1 === 'string' && typeof num2 === 'string') {
        return num1 + ' ' + num2;
    }
    return +num1 + +num2;
}
function printResult(resultObj) {
    return resultObj.val;
}
btn.addEventListener('click', function () {
    const result = add(+elem1.value, +elem2.value);
    numResults.push(result);
    const stringResult = add(elem1.value, elem2.value);
    textResults.push(stringResult);
    console.log(printResult({ val: result, timestamp: new Date() }));
    console.log(numResults, textResults);
});
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('promise fulfilled');
    }, 1000);
});
myPromise
    .then(r => console.log(r.split('f')))
    .catch(err => console.log(err));
