const { Schema, model } = require('mongoose');

const thoughtsSchema = new Schema({
        thoughtText: {
            type: String,
            required: true,
            min: 1,
            max: 280
        },
        createdAt: {
            type: Date, 
            default: Date.now
        },
        username: {
            type: String,
            required: true,
            ref: 'user'
        },
        reactions: [reactionSchema]
    }
);