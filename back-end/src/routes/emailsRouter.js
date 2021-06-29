const Router = require('express')
const Controller = require('../controllers/EmailsController')

const controller = new Controller()
const router = new Router()

router.get('/emails', controller.getEmails)
router.put('/email/put', controller.setEmail)

module.exports = router