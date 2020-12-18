const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const bookController = require('../app/http/controllers/customers/bookController')
const homeController = require('../app/http/controllers/homeController')
const cancelController = require('../app/http/controllers/customers/cancelController')

//Middleware
const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth')
const admin = require('../app/http/middleware/admin')

function initRoutes (app) {
    
app.get('/', homeController().index)

app.get('/login',guest,authController().login)
app.post('/login',authController().postLogin)

app.get('/register',guest, authController().register)
app.post('/register', authController().postRegister)

app.post('/logout', authController().logout)

app.get('/cart', cartController().index)
app.post('/update-cart', cartController().update)

//customer routes
app.post('/books',auth, bookController().store)
app.get('/customers/books',auth, bookController().index)
app.get('/customers/book/:id',auth, bookController().show)

//cancel book
app.get('/customers/cancel',auth,cancelController().index)
app.post('/customers/cancel/:id',auth,cancelController().cancel)

}

module.exports = initRoutes