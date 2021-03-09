const express = require('express');
const path = require('path');
const multer = require('multer'); 

const app = express();

//  Ejs setup
app.set('view engine', 'ejs');

//      Static files
app.use('/public/uploads', express.static('public/uploads'));

//   Set diskStorage
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(res, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

//   Set uploader
const upload = multer({
  storage: storage,
  // limits: {fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFile(file, cb);
  }
}).array('myImage', 2)

//  Check fileType
function checkFile(file, cb){
  const fileTypes = /jpeg|jpg|png|gif|mp4/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if(mimetype && extName){
    return cb(null, true);
  } else {
    return cb('Error! Only for images')
  }
}

app.get('/', (req, res) => {
  res.render('index');
})

// Download file

app.post('/download/:filename', (req, res) => {
  var file = req.params.filename;
  var fileLocation = path.join(__dirname, `public/uploads/${file}`);
  res.download(fileLocation, file);
})

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('index', {
        msg: err
      })
    } else {
      if(req.files){
        if(req.files == undefined){
          res.render('index', {
            msg: 'No files selected'
          })
        } else {
          res.render('index', {
            msg: 'Files uploaded!',
            pics: req.files
          })
        }
      }
    }
  })
})

app.listen(4000);