const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;
const _ = require('lodash');

const { Depot } = require('../models/depot');

const errorHandler = (err, res) => {
    res.status = 501;
    res.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(res);
};

// Depots
router.get('/get', (req, res) => {
    Depot.find().then((depots) => {
        res.send({ depots });
    }, (err) => {
        errorHandler(err, res);
    });
});

router.post('/create', (req, res) => {
    var newDepot = new Depot(req.body.depot);
    newDepot.save(function (err) {
        if (err) errorHandler(err, res);
        res.status(200).send('create depot successfully');
    });
});

router.patch('/update/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body.depot, ['depotName', 'coordinate']);

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    Depot.findByIdAndUpdate(id, { $set: body }, { new: true }).then((depot) => {
        if (!depot) {
            res.status(404).send();
        }

        res.status(200).send('update depot successfully');
    }).catch((err) => {
        errorHandler(err, res);
    });
});

router.delete('/delete/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Depot.findByIdAndRemove(id).then((depot) => {
        if (!depot) {
            return res.status(404).send();
        }

        res.status(200).send('delete depot successfully');
    }).catch((err) => {
        errorHandler(err, res);
    });
});

module.exports = router;