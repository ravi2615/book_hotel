
const Book = require('../../../../app/models/book')
const Cancel = require('../../../../app/models/cancel')
const moment = require('moment')
const Noty = require('noty')
const book = require('../../../../app/models/book')

function cancelController () {
    return {
        async cancel (req,res) {

            // console.log("deletting")
            const books = await Book.findById(req.params.id)
            // console.log(moment().format('YYYY-MM-DD'))

            //check checkin date and booked date
            if(books.bookedTime != moment().format('YYYY-MM-DD')) {

            await Book.findByIdAndDelete({_id: req.params.id})

            const deductCharge = ((0.15*books.paymentAmount))  // 15% Charge
            const refundedAmount = books.paymentAmount - deductCharge // 15% deducted as internet handling charges
            // books.status="canceled"
            const canceledTime = moment().format('YYYY-MM-DD')
            const cancel = new Cancel({
                customerId: req.user._id,
                items: books.items,
                refundedAmount: refundedAmount,
                deductCharge: deductCharge,
                cardNumber: books.cardNumber,
                phone: books.phone,
                address: books.address,
                bookedTime: books.bookedTime,
            })
            cancel.save().then(result => {
                Cancel.populate(result, {path: 'customerId'}, (err, canceledOrder) => {
                    
                    req.flash('success', `Booking canceled successfully ! 
                    You will get refund SMS on your mobile number(given during book), 
                    after deducting internet handle charges of 15%, within 15 minutes.
                     For any query call to our toll free number 4440004440.`)
                    
                    return res.redirect('/customers/cancel')
                    
                })
             }).catch(err => {
                req.flash('error', 'Something went wrong')
                    return res.redirect('/customers/cancel')
             })
             
            }
            else {
                req.flash('success', 'Too Late')
                    return res.redirect('/customers/books')
            }

            
        },
        async index(req, res) {
            const books = await Cancel.find({ customerId: req.user._id },
                null,
                { sort: { 'createdAt': -1 } })
                res.header('Cache-Control', 'no-store')
                
            res.render('customers/cancel', {books, moment})
            
        }
    }
}

module.exports = cancelController
