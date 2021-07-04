var express = require('express')
var paillier = require('jspaillier')
var jsbn = require('jsbn')
var body = require('body-parser')
require('datejs')

var keys = paillier.generateKeys(128)

var router = express.Router();

router.get('/encrypt/:id', function(req, res) {
    var ekey = req.params.id
    ekey = keys.pub.encrypt(keys.pub.convertToBn(ekey)).toString()
    res.send(ekey)
})

router.get('/decrypt/:id', function(req, res) {
    var dkey = req.params.id
    dkey = keys.sec.decrypt(keys.pub.convertToBn(dkey)).toString()
    res.send(dkey)
})

router.get('/add/:id/:id2', function(req, res) {
    var ein1 = req.params.id
    var ein2 = req.params.id2
    eadd = keys.pub.add(keys.pub.convertToBn(ein1), keys.pub.convertToBn(ein2)).toString()
    res.send(eadd)
})

router.get('/getTime', function(req, res) {
    var timestamp = Math.round((new Date()).getTime() / 1000)
    res.send("" + timestamp)
})

module.exports = router;