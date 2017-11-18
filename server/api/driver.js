const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;
const _ = require('lodash');

const { Driver } = require('../models/driver');

const errorHandler = (err, res) => {
    res.status(501).send(err);
};

// Drivers
router.get('/get', (req, res) => {
    Driver.find().then((drivers) => {
        res.send({ drivers });
    }, (err) => {
        errorHandler(err, res);
    });
});

router.get('/get/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Driver.findById(id).then((driver) => {
        if (!driver) {
            return res.status(404).send();
        }

        res.status(200).send(driver);
    }).catch((err) => {
        errorHandler(err, res);
    });
});

router.post('/create', (req, res) => {
    var newDriver = new Driver(req.body.driver);
    newDriver.save(function (err) {
        if (err) errorHandler(err, res);
        res.status(200).send('create driver successfully');
    });
});

router.delete('/delete/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Driver.findByIdAndRemove(id).then((driver) => {
        if (!driver) {
            return res.status(404).send();
        }

        res.status(200).send('delete driver successfully');
    }).catch((err) => {
        errorHandler(err, res);
    });
});

module.exports = router;
