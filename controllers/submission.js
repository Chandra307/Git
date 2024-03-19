const axios = require('axios');
const { createClient } = require('redis');

const Submission = require('../models/submission');


// let redisClient;
// (async () => {
//     try {
//         redisClient = createClient();
//         redisClient.on('error', (err) => {
//             console.error('Error connecting to redisServer', err);
//         })
//         await redisClient.connect();
//     }
//     catch (err) {
//         console.log(err);
//     }
// })();

exports.postSubmission = async (req, res, next) => {
    try {
        const { userName, languageId, stdIn, sourceCode } = req.body;
        if (isInputInvalid(userName) || isInputInvalid(languageId) || isInputInvalid(stdIn)
            || isInputInvalid | (sourceCode)) {
            return res.status(400).json('Please fill all input fields!');
        }

        const options = {
            method: 'POST',
            url: 'https://judge0-ce.p.rapidapi.com/submissions',
            params: {
                //   base64_encoded: 'true',
                fields: 'stdout,stderr,token,language',
                wait: true
            },
            headers: {
                // 'content-type': 'application/json',
                // 'Content-Type': 'application/json',
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            data: {
                language_id: languageId,
                source_code: sourceCode,
                stdin: stdIn
            }
        };
        const { data } = await axios(options);
        console.log(data, '*******************');
        if (data.stderr) {
            return res.status(422).json({
                message: 'Your code was not submitted, re-check your code.',
                Error: data.stderr
            });
        }
        const submissionDetails = {
            userName,
            languagePref: data.language.name,
            stdIn,
            sourceCode,
            token: data.token,
            stdOut: data.stdout
        }
        // const promise1 = Submission.create(submissionDetails);
        // const promise2 = redisClient.get('submisssionData');
        // const [submission, cachedData] = await Promise.all([promise1, promise2]);
        // const results = cachedData ? JSON.parse(cachedData) : [];
        // results.push(submission);
        // redisClient.set('submissionData', JSON.stringify(results));
        const submission = await Submission.create(submissionDetails);
        res.status(201).json(submission);
    } catch (err) {
        console.log(err, 'line-70 subCtrl');
        res.status(500).json(err);
    }
}

exports.getSubmissions = async (req, res, next) => {
    try {
        // const cachedData = await redisClient.get('submissionData');
        // if (!cachedData) {
        //     const submissionsFromDB = await Submission.findAll();
        //     return res.status(200).json(submissionsFromDB);
        // }
        const submissions = await Submission.findAll();
        res.status(200).json(submissions);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

function isInputInvalid(input) {
    return !input ? true : false;
}