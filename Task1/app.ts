const elem1 = document.getElementById('num1') as HTMLInputElement;
const elem2 = document.getElementById('num2') as HTMLInputElement;
const btn = document.querySelector('button')!;

const numResults: Array<number> = [];
const textResults: Array<string> = [];

type Numing = number | string;
type Result = { val: number; timestamp: Date };

interface ResultObj{
    val: number;
    timestamp: Date
}

function add(num1: Numing, num2: Numing) {
    if(typeof num1 === 'number' && typeof num2 === 'number'){
        return num1 + num2;
    }
    else if (typeof num1 === 'string' && typeof num2 === 'string'){
        return num1 + ' ' + num2;
    }
    return +num1 + +num2;
}
function printResult(resultObj: ResultObj) {
    return resultObj.val;
}
btn.addEventListener('click', function () {
    const result = add(+elem1.value, +elem2.value);
    numResults.push(result as number);
    const stringResult = add(elem1.value, elem2.value);
    textResults.push(stringResult as string);
    console.log(printResult({ val: result as number, timestamp: new Date() }));
    console.log(numResults, textResults);
})

const myPromise = new Promise<string>( (resolve, reject) => {
    setTimeout( () => {
        resolve('promise fulfilled');
    }, 1000);
})

myPromise
.then(r => console.log(r.split('f')))
.catch(err => console.log(err));