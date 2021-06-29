const Placeholder = require('../models/Placeholder')

class PlaceholderController {
    static async getPlaceholders() {
        try {
            const data = await Placeholder.find({})
            return {
                status: 0,
                data: data[0].placeholders
            }
        } catch (error) {
            return {
                status: 1,
                data: error
            }
        }
    }
}

module.exports = PlaceholderController