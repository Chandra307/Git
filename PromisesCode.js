console.log('Person1: shows ticket');
console.log('Person2: shows ticket');
const wifeBringingTickets = new Promise((res, rej) => {
    setTimeout(() => {
        res('ticket');
    }, 3000)
})
const getPopcorn = wifeBringingTickets
    .then((msg) => {
        console.log('Wife: Here is the ticket.');
        console.log('Husband: We should go in.');
        console.log('Wife: No! I am hungry.');
        console.log('Husband: Okay, I will get some popcorn.');
        return new Promise((res, rej) => res(`${msg}, popcorn`));
    });
const Butter = getPopcorn.then((msg) => {
    console.log('Husband: Here you go.. Popcorn!');
    console.log('Wife: I want butter on my popcorn.');
    console.log('Husband: Alright! Let me bring then.');
    return new Promise((res, rej) => res(`${msg}, butter`))
});
const getColdDrink = Butter.then((msg) => {
    console.log('Husband: Hey honey...butter!Anything else?');
    console.log('Wife: Hmm.... a colddrink if we can afford.');
    console.log('Husband: Fine!');
    return new Promise((res, rej) => res(`${msg}, colddrink`))
})
getColdDrink
    .then((msg) => {
        console.log(`The couple now has ${msg} and it is movie time.`);
        wifeBringingTickets.then((msg) => console.log(`Person3: shows ${msg}`))
    });

console.log('Person4: shows ticket');
console.log('Person5: shows ticket');