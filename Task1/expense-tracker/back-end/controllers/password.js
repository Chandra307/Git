const User = require('../models/user');
const ForgotPasswordRequest = require('../models/password');

const Sib = require('sib-api-v3-sdk');

const bcrypt = require('bcryptjs');

const {v4: uuid4} = require('uuid');

exports.forgot = async (req, res, next) => {
    try{
        const {email} = req.body;
        const user = await User.findOne({where: {email: email}});
        const uuid = uuid4();
        console.log(uuid,'uniques stuff');
        await user.createForgotPasswordRequest({
            id: uuid,
            isActive: true
        });

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
            htmlContent: `<p>Click below to reset password!</p><a href='http://localhost:3000/password/resetpassword/${uuid}'>RESET PASSWORD</a>`
        });

        console.log(result);
        res.json(result);

    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

exports.resetPassword = async (req, res, next) => {
    try{
        const uuid = req.params.id;
        const request = await ForgotPasswordRequest.findOne({where: {id: uuid}});
        if(request.isActive){
            res.send(`<form action='http://localhost:3000/password/updatepassword'>
            Enter new password<br><input type='password' name='newPassword' required/>
            <input type='hidden' name='uuid' value='${uuid}'/><button type='submit'>Submit</button></form>`);
        }
        else {
            res.send(`<p style= 'color: red;'>Link expired!</p>`);
        }
    }
    catch(err){
        console.log(err, 'error in reset password');
        res.status(500).json(err);
    }
}

exports.updatePassword = async (req, res, next) => {
    try{
        const {newPassword, uuid} = req.query;
        console.log('form data', req.query, req.newPassword);
        const request = await ForgotPasswordRequest.findOne({where: {id: uuid}});
        await request.update({isActive: false});
        const user = await User.findOne({where: {id: request.userId}});
        bcrypt.hash(newPassword, 10, async (err, hash) => {
            try{

                if(err){
                    console.log(err,'error in hashing');                
                }
                await user.update({ password: hash});
                res.send('Your password is changed, try logging in with your new password!');
            }
            catch(err){
                throw new Error(err);
            }
        })
    }
    catch (err){
        console.log(err,'in updating password');
        res.status(500).json(err);
    }
}