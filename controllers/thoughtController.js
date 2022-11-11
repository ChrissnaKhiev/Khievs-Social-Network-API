const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
    getThoughts(req, res) {
        Thought.find({}, (err, result) => {
            if (result) {
                res.status(200).json(result);
            } else {
                console.log('Error');
                res.status(500).json({ error: 'Error' });
            }
        });
    },
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'No thought with that ID' })
                : res.json({
                    thought
                    })
        )
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                return User.findOneAndUpdate(
                { username: req.body.username },
                { $addToSet: { thoughts: thought._id } },
                {  new: true}
            )
            })
    .then((user) =>
    !user
      ? res.status(404).json({
          message: 'Thought created, but found no user with that ID',
        })
      : res.json('Created the Thought 🎉')
  )
            .catch((err) => res.status(500).json(err));
    },
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true },
            (err, result) => {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(500).json({ message: 'Failed Update' });
                }
            }
        )
        .then((thought) => {
            return User.findOneAndUpdate(
            { username: req.body.username },
            { $addToSet: { thoughts: thought._Id } },
            { runValidators: true, new: true}
        )
    })
        .catch((err) => res.status(500).json(err));
    },
    deleteThought(req, res) {
        Thought.findOneAndDelete(
            { _id: req.params.thoughtId }, (err, result) => {
                if (result) {
                    res.status(200).json(result);
                    console.log(`Deleted: ${result}`);
                } else {
                    res.status(500).json({ message: 'Failed to delete.' });
                }
            }
        );
    },
    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions:  req.body } },
            { runValidators: true, new: true}
        )
        .then((thought) => 
            ! thought
                ? res.status(404).json({ message: 'No thought with that ID' })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId }, 
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true })
          .then((thought) => 
            !thought
                ? res.status(404).json( { message: 'No thought with that ID' } )
                : res.json(thought),
          )
          .catch((err) => res.status(500).json(err));
    }
}