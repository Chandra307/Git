
console.log('Person1: shows ticket');
console.log('Person2: shows ticket');
const exp = async () => {
    const wifeBringingTickets = new Promise((res, rej) => {
        setTimeout(() => res('ticket'), 3000)
    })
    const getPopcorn = new Promise((res, rej) => res(`Popcorn`));
    const addButter = new Promise((res, rej) => res('butter'));
    const getColdDrink = new Promise((res, rej) => res('colddrink'));

    let ticket;
    try {
        ticket = await wifeBringingTickets;
    } catch {
        ticket = 'sad face'
    }
    console.log('Wife: Here is the ticket.');
    console.log('Husband: We should go in.');
    console.log('Wife: No! I am hungry.');
    console.log('Husband: Okay, I will get some popcorn.');
    let Popcorn;
    try {
        Popcorn = await getPopcorn;
    } catch {
        Popcorn = 'Popcon not fresh'
    }
    console.log('Husband: Here you go.. Popcorn!');
    console.log('Wife: I want butter on my popcorn.');
    console.log('Husband: Alright! Let me bring then.');
    let butter;
    try {
        butter = await addButter;
    } catch {
        butter = 'butter out of stock';
    }
    console.log('Husband: Hey honey...butter!Anything else?');
    console.log('Wife: Hmm.... a colddrink if we can afford.');
    console.log('Husband: Fine!');
    let ColdDrink;
    try {
        ColdDrink = await getColdDrink;
    } catch {
        ColdDrink = 'drink not so cool';
    }

    console.log('Wife: Ohh! I love this drink.')
    console.log('Husband: Come on....the movie is about to start.');
    return ticket;
}
exp().then((r) => console.log(`Person3: shows ${r}`))

console.log('Person4: shows ticket');
console.log('Person5: shows ticket');
