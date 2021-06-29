const Router = require('express')
const Controller = require('../controllers/MailingsController')

const controller = new Controller()
const router = new Router()

router.get('/mailings', controller.listMailings)
router.post('/mailing/add', controller.addMailing)
router.put('/mailing/edit', controller.editMailing)
router.delete('/mailing/remove/:id', controller.removeMailing)
router.put('/mailing/changeStatus', controller.changeMailingStatus)
router.get('/mailing/:id', controller.getMailingById)


module.exports = router