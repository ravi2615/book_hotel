const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({
    customerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
                },
    items: { type: Object, required: true },
    phone: { type: String, required: true},
    address: { type: String, required: true},
    paymentType: { type: String, default: 'CARD'},
    cardNumber: { type: Number, default: 0},
    paymentAmount: { type: Number, default: 0},
    paymentStatus: { type: Boolean, default: true },
    status: { type: String, default: 'book_placed'},
    bookedTime: { type: String, required: true},
}, { timestamps: true })

module.exports = mongoose.model('Book', bookSchema)