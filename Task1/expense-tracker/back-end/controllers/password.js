const User = require('../models/user');

const Sib = require('sib-api-v3-sdk');

exports.forgot = async (req, res, next) => {
    try{
        const {email} = req.body;
        console.log(email);

        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY;

        const tranEmailApi = new Sib.TransactionalEmailsApi();

        const sender = {
            email: 'chandra19151425@gmail.com',
            name: 'Ravi Chandra'
        };
        const receivers = [
            {
                email: 'rc19151425@gmail.com'
            }
        ];
        const result = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: `Confirmation mail to reset password`,
            htmlContent: `<p>Click below to reset password!</p><a href='something.com'>RESET PASSWORD</a> `
        });

        console.log(result);
        res.json(result);

    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}