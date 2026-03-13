require('dotenv').config();
const express = require('express');
const emailRouter = require('./routes/email.router');

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 8000;

app.use("/api/v1/mailer", emailRouter);

app.listen(PORT, () => {
  console.log(`email server is running on port ${PORT}`);
});
