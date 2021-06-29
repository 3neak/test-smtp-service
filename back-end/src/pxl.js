const Pxl = require('pxl-mongodb')

let pxl = new Pxl()
pxl.connect(process.env.MONGODB_URI)


module.exports = pxl