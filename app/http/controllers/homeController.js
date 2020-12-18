const List = require('../../models/list')
function homeController() {
    return {
        async index(req, res) {
            const Hotel = await List.find()
            return res.render('home', { hotels: Hotel })
        }
    }
}

module.exports = homeController