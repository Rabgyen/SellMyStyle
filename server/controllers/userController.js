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

exports.loginUser = (req, res) => {

    console.log("Login route hit");
    console.log(req.body);

    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        (err, result) => {

            if (err) {

                return res.status(500).json(err);

            }

            if (result.length === 0) {
                return res.json({
                    success: false,
                    field: "email",
                    message: "User not found"
                });
            }

            const user = result[0];

            if (user.password !== password) {
                return res.json({
                    success: false,
                    field: "password",
                    message: "Incorrect Password"
                });
            }

            res.json({
                success: true,
                message: "Login Successful"
            });

        }
    );

};