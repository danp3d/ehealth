User     = require './../models/userMdl'
Train    = require './../models/trainMdl'
jwt      = require './../services/jwt'
utils    = require './../utils/utils'
mongoose = require 'mongoose'

class TrainCtrl
    getTraining: (req, res) =>
        user_id = utils.getUserID req, res
        
        Train.find user_id: new mongoose.Types.ObjectId user_id.toString()
            .exec (err, training) ->
                res.status(500).send message: 'Internal server error. ' + err if err
                res.status(500).send message: 'Impossivel encontrar treinos' if not err and not training
                if training
                    res.status(200).send training: training
    
    insertTrain: (req, res) =>
        self = this
        data = req.body
        user_id = utils.getUserID req, res
        
        if not data.train_date or not data.durationMinutes or not data.intensity or data.type not in ['cardio', 'strength']
            res.status(500).send message 'Invalid data!'
        else
            newTrn = new Train
                "user_id": user_id
                date_created: new Date()
                train_date: data.train_date
                type: data.type
                durationMinutes: data.durationMinutes
                intensity: data.intensity

            # Try to save it
            newTrn.save (err) ->
                if err
                    res.status 500
                    res.send err
                else
                    res.status(200).send training: newTrn

    editTrain: (req, res) =>
        self = this
        data = req.body
        user_id = utils.getUserID req, res
        
        if not data.train_id or not data.train_date or not data.durationMinutes or not data.intensity or data.type not in ['cardio', 'strength']
            res.status(500).send message 'Invalid data!'
        else
            Train.findOne _id: data.train_id
                .populate('user_id')
                .exec (err, train) ->
                    res.status(500).send message: 'Internal server error' if err
                    res.status(500).send message: 'Couldn\'t find record' if not train
                    res.status(500).send message: 'You can\'t edit other users\' records' if train.user_id != user_id
                    
                    train.train_date = data.train_date;
                    train.durationMinutes = data.durationMinutes;
                    train.type = data.type;
                    train.save (err) ->
                        if err
                            res.status(500).send err
                        else
                            res.status(200).send training: train
                            
#Export
ctrl = new TrainCtrl()
module.exports = ctrl
    
