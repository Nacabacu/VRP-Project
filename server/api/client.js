const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;
const _ = require('lodash');

const { Client } = require('../models/client');

const errorHandler = (err, res) => {
    res.status(501).send(err);
};

// Clients
router.get('/get', (req, res) => {
    Client.find().then((clients) => {
        res.send({ clients });
    }, (err) => {
        errorHandler(err, res);
    });
});

router.get('/get/:phoneNumber', (req, res) => {
    var phoneNumber = req.params.phoneNumber;

    Client.findOne({ phoneNumber }).then((client) => {
        if (!client) {
            return res.status(404).send();
        }

        res.status(200).send(client);
    }).catch((err) => {
        errorHandler(err, res);
    });
});

router.patch('/updates', (req, res) => {
    req.body.clients.forEach(function(client) {
        var phoneNumber = client.phoneNumber;
        Client.findOneAndUpdate({ phoneNumber }, { $set: client}, {upsert: true}).then((client) => {
            if (!client) {
                res.status(404).send();
            }
        }).catch((err) => {
            errorHandler(err, res);
        });
    });
    res.status(200).send('update client successfully');
});

router.put('/update', (req, res) => {
    var phoneNumber = req.body.client.phoneNumber;
    var client = req.body.client;
    Client.findOneAndUpdate({ phoneNumber }, { $set: client }, { upsert: true }).then((client) => {
        if (!client) {
            res.status(404).send();
        }
    }).catch((err) => {
        errorHandler(err, res);
    });
    res.status(200).send('update client successfully');
});

router.delete('/delete/:phoneNumber', (req, res) => {
    var phoneNumber = req.params.phoneNumber;

    Client.findOneAndRemove({ phoneNumber }).then((client) => {
        if (!client) {
            res.status(404).send();
        }
    }).catch((err) => {
        errorHandler(err, res);
    });
});

module.exports = router;
