
// Converted previously written createPost and deletePost into async await

const posts = [];
const users = { name: 'User1', lastACtivityTime: new Date() };
console.log(users.name, 'last Activity Time =', users.lastACtivityTime)

function updateUserLastActivityTime() {
    return new Promise((res, rej) => {
        setTimeout(() => {
            users.lastACtivityTime = new Date();
            let error;
            if (error)
                rej('ERROR');
            else
                res(users.lastACtivityTime);
        }, 1000)
    })
}
function createPost(post) {
    return new Promise((res, rej) => {
        posts.push(post);
        let error;
        if (error)
            rej('ERROR')
        else
            res(posts);
    })
}
function deletePost() {
    return new Promise((res, rej) => {
        const lastPost = posts.pop();
        let error;
        if (error)
            rej('ERROR');
        else
            res(lastPost);
    })
}

const Async = async () => {
    try {
        await Promise.all([updateUserLastActivityTime(), createPost({ title: 'Post1' })]);
            console.log(posts);
            console.log(users.name, 'was last active at', users.lastACtivityTime.getTime());
        await Promise.all([updateUserLastActivityTime(), deletePost()]);
            console.log(posts);
            console.log(users.name, 'was last active at', users.lastACtivityTime.getTime());
        await Promise.all([updateUserLastActivityTime(), createPost({ title: 'Post2' })]);
            console.log(posts);
            console.log(users.name, 'was last active at', users.lastACtivityTime.getTime());
    } catch (e) {
        console.log(e);
    }
}
Async();