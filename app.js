const express = require('express');
const cors = require('cors');
require('dotenv').config();

const submissionRoutes = require('./routes/submission');
const sequelize = require('./util/database');

const app = express();
app.use(cors());
app.use(express.json({ extended: false }));
app.use('/submission', submissionRoutes);

// const options = {
//   method: 'POST',
//   url: 'https://judge0-ce.p.rapidapi.com/submissions',
//   params: {
//     base64_encoded: 'true',
//     fields: '*'
//   },
//   headers: {
//     // 'content-type': 'application/json',
//     // 'Content-Type': 'application/json',
//     'X-RapidAPI-Key': process.env.RAPID_API_KEY,
//     'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
//   },
//   data: {
//     language_id: 52,
//     source_code: 'I2luY2x1ZGUgPHN0ZGlvLmg+CgppbnQgbWFpbih2b2lkKSB7CiAgY2hhciBuYW1lWzEwXTsKICBzY2FuZigiJXMiLCBuYW1lKTsKICBwcmludGYoImhlbGxvLCAlc1xuIiwgbmFtZSk7CiAgcmV0dXJuIDA7Cn0=',
//     stdin: 'SnVkZ2Uw'
//   }
// };

// try {
//   const response = await axios.request(options);
//   console.log(response.data);
// } catch (error) {
//   console.error(error);
// }
sequelize.sync()
  // sequelize.sync({ force: true })
  .then(() => {
    app.listen(process.env.PORT, () => console.log('Server is up and listening'))
  })
  .catch((err) => console.log(err, 'DB error'));
