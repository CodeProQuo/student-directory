//server/server.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = 4000;
const router = express.Router();

const Student = require("./model.js");

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://daanali96:R6INq0itiDo5gzvt@cluster-lwaef.azure.mongodb.net/react-portfolio-app?retryWrites=true&w=majority",
    {useNewUrlParser: true});

const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
});


router.get('/', function (req, res) {
    Student.find(function (err, students) {
        if (err) {
            console.log(err);
        } else {
            res.json(students);
        }
    });
});

router.route('/:id').get(function (req, res) {
    const id = req.params.id;
    Student.findById(id, function (err, student) {
        res.json(student);
    });
});

router.route('/add')
    .post(function (req, res) {
        const student = new Student();
        student.email = req.body.email;
        student.firstName = req.body.firstName;
        student.lastName = req.body.lastName;
        student.skill = req.body.skill;
        student.city = req.body.city;
        student.company = req.body.company;
        student.grades = req.body.grades;
        student.id = req.body.id;
        student.pic = req.body.pic;
        student.save().then(student => {
            res.status(200).send('Student successfully added!');
        }).catch(err => {
            res.status(400).send('Adding new student failed');
        });
    });

router.route('/update/:id')
    .post(function (req, res) {
        Student.findById(req.params.id, function (err, student) {
            if (!student) {
                res.status(404).send("data is not found");
            }
            else {
                student.email = req.body.email;
                student.firstName = req.body.firstName;
                student.lastName = req.body.lastName;
                student.skill = req.body.skill;
                student.city = req.body.city;
                student.company = req.body.company;
                student.grades = req.body.grades;
                student.id = req.body.id;
                student.pic = req.body.pic;
                student.save().then(student => {
                    res.json('Student updated!');
                })
                    .catch(err => {
                        res.status(400).send("Update not possible");
                    });
            }
        });
    });

app.use('/', router);

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});
