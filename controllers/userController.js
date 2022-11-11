const { ObjectId } = require('mongoose').Types;
const { User } = require('../models');

module.exports = {
    getUsers(req, res) {
        User.find({}, (err, result) => {
            if (result) {
                res.status(200).json(result);
            } else {
                console.log('Error');
                res.status(500).json({ error: 'Error' });
            }
        });
    },
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
        .select('-__v')
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user with that ID' })
                : res.json({
                    user
                    })
        )
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    deleteUser(req, res) {
        User.findOneAndDelete(
            { _id: req.params.userId }, (err, result) => {
                if (result) {
                    res.status(200).json(result);
                    console.log(`Deleted: ${result}`);
                } else {
                    res.status(500).json({ message: 'Failed to delete.' });
                }
            }
        );
    },
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true },
            (err, result) => {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(500).json({ message: 'Failed Update' });
                }
            }
        );
    },
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends:  req.params.friendId } },
            { runValidators: true, new: true}
        )
        .then((user) => 
            ! user
                ? res.status(404).json({ message: 'No user with that ID' })
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
          )
          .then((user) => 
            !user
                ? res.status(404).json( { message: 'No user with that ID' } )
                : res.json(user),
          )
          .catch((err) => res.status(500).json(err));
    }
};