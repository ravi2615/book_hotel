
const Book = require('../../../models/book')
const moment = require('moment')

function orderController () {
    return {
        store(req, res) {
    //         //Validate request
            const{ phone, address,date } = req.body
            if(!phone || !address) {
                req.flash('error', 'All Fields are required')
                return res.redirect('/cart')
            }
            const book = new Book({
                customerId: req.user._id,
                items: req.session.cart.items,
                paymentAmount: req.session.cart.totalPrice,
                bookedTime: date,
                phone,
                address,
            })

            book.save().then(result => {
                Book.populate(result, {path: 'customerId'}, (err, bookOrder) => {
                    
                    req.flash('success', 'Booking placed successfully')
                    delete req.session.cart
                    //Emit
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('bookPlaced', result)
                   
                    return res.redirect('/customers/books')
                    
                })
             }).catch(err => {
                req.flash('error', 'Something went wrong')
                    return res.redirect('/cart')
             })
        },
        async index(req, res) {
            const books = await Book.find({ customerId: req.user._id },
                null,
                { sort: { 'createdAt': -1 } })
                res.header('Cache-Control', 'no-store')
            res.render('customers/books', { book: books, moment: moment })
        },
        async show(req, res) {
           const book = await Book.findById(req.params.id)
           //Authorize user
           if(req.user._id.toString() === book.customerId.toString() ){
               return res.render('customers/singleBooking', { book })
           }
               res.redirect('/')
        }
    }
}

module.exports = orderController