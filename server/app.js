const express = require("express");
const db = require('./config/db');
const app = express();
const port = 7000;
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(express.json());
app.use(cors(corsOptions));

app.listen(port, () => {
    console.log(`RUN http://localhost:${port}`);

    db.query('select * from user', function(err, rows) {
        if (err) throw err;
        console.log('Response: ', rows);
      });

    

});

app.post("/login", function (req, res) {
    var account = req.body.account;
    var password = req.body.password;
    
    db.query(
        `SELECT * FROM user WHERE FAccount='${account}' AND FPassword='${password}'`,
        function (err, rows, fields) {
            console.log('rows:',rows);
            if (rows.length === 0) {
                return res.status(500).send('查無資料');
            };
            return res.send(rows);
        }
    );
});