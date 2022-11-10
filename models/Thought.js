const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction')

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
    },
    {
        virtuals: {
            reactionCount: {
                get() {
                    return this.reactions.length;
                }
            }
        }
    },
    {
        toJSON: {
          getters: true,
        },
    }
);

const Thought = model('thought', thoughtsSchema);
module.exports = Thought;