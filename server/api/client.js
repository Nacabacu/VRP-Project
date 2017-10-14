const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;
const _ = require('lodash');

const { mongoose } = require('../db/mongoose')
const { Client } = require('../models/client');

const errorHandler = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Clients
router.get('/get', (req, res) => {
    Client.find().then((clients) => {
        res.send({ clients });
    }, (err) => {
        errorHandler(err, res);
    });
});

router.post('/create', (req, res) => {
    var newClient = new Client(req.body.client);
    newClient.save(function (err) {
        if (err) errorHandler(err, res);
        res.status(200).send('success')
    })
});

router.patch('/update/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body.client, ['client','companyName','branches']);

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }   

    Client.findByIdAndUpdate(id, { $set: body }, { new: true }).then((client) => {
        if (!client) {
            res.status(404).send();
        }

        res.status(200).send('success');
    }).catch((err) => {
        errorHandler(err, res);
    })
})

router.delete('/delete/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Client.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.status(200).send('success');
    }).catch((e) => {
        res.status(400).send();
    });
});

module.exports = router;