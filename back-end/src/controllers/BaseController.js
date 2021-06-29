class BaseController {
    responseError(response, error) {
        console.error(error)
        response.status(500).json({
            status: 'NOK',
            code: 500,
            data: error
        })
    }

    responseSuccess(response, data) {
        response.status(200).json({
            status: 'OK',
            code: 200,
            data
        })
    }

    responseWarning(response, msg) {
        response.status(422).json({
            status: 'NOK',
            code: 422,
            data: msg
        })
    }

    validateRequestParams(...params) {
        for (const param of params) {
            if (param === undefined) {
                return false
            }
        }

        return true
    }
}

module.exports = BaseController