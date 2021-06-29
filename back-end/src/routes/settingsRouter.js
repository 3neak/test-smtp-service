const Router = require('express')
const SettingsController = require('../controllers/SettingsController')

const controller = new SettingsController()
const router = new Router()

router.get('/settings', controller.get)
router.post('/settings/change', controller.set)
router.post('/settings/check', controller.checkSettings)

module.exports = router