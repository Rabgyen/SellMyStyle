const db = require("../config/db");

exports.signUpUser = (req, res) => {

    const { fullName, email, password } = req.body;

    db.query(
        "INSERT INTO users(username,email,password) VALUES (?,?,?)",
        [fullName, email, password],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "User Registered Successfully"
            });

        }
    );

};