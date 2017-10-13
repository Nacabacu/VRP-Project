const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;

const { mongoose } = require('../db/mongoose');
const { Depot } = require('../models/depot');
const { Client } = require('../models/client');
const { Driver } = require('../models/driver');
const { PlanningResult } = require('../models/planningResult');

router.get('/depots', (req, res) => {
    Depot.find().then((depots) => {
        res.send({ depots });
    }, (e) => {
        res.status(400).send(e);
    });
});

router.get('/clients', (req, res) => {
    Client.find().then((clients) => {
        res.send({ clients });
    }, (e) => {
        res.status(400).send(e);
    });
});

router.get('/drivers', (req, res) => {
    Driver.find().then((drivers) => {
        res.send({ drivers });
    }, (e) => {
        res.status(400).send(e);
    });
});

router.get('/planningResults', (req, res) => {
    PlanningResult.find().then((results) => {
        res.send({ results });
    }, (e) => {
        res.status(400).send(e);
    });
});

module.exports = router;