const router= require('express').Router();
const file = require('../controller/file.js')

router.post('/',file.fileUpload);
router.get('/:uuid',file.showfiles);
router.get('/download/:uuid',file.downloadFiles)
router.post("/sendmail",file.sendMail);
module.exports= router