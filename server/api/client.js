const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;
const _ = require('lodash');

const { Client } = require('../models/client');

const errorHandler = (err, res) => {
    res.status = 501;
    res.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(res);
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
        res.status(200).send('create client successfully');
    });
});

router.patch('/update/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body.client, ['client', 'companyName', 'branches']);

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    Client.findByIdAndUpdate(id, { $set: body }, { new: true }).then((client) => {
        if (!client) {
            res.status(404).send();
        }

        res.status(200).send('update client successfully');
    }).catch((err) => {
        errorHandler(err, res);
    });
})

router.delete('/delete/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Client.findByIdAndRemove(id).then((client) => {
        if (!client) {
            return res.status(404).send();
        }

        res.status(200).send('delete client successfully');
    }).catch((err) => {
        errorHandler(err, res);
    });
});

module.exports = router;
