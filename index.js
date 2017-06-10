var fs = require('fs')
var path = require('path')
const { spawn } = require('child_process')
var showdown = require('showdown')
var opener = require('opener')
var wrapHTML = require('./wrap-html')
var converter = new showdown.Converter()
var phantomasReport

const dirname = `./reports/${new Date()}`
const screenshotsdir = `${dirname}/screenshots`
const phantomasPath = path.resolve(
  __dirname,
  './node_modules/phantomas/bin/phantomas.js'
)

var phantomas = spawn(phantomasPath, [
  'https://headspace.com',
  '--film-strip',
  `--film-strip-dir=${screenshotsdir}`
])

function getScreenShots() {
  return new Promise(function(resolve, reject) {
    var foldername = path.resolve(process.cwd(), screenshotsdir)
    fs.readdir(foldername, function(err, files) {
      if (err) return reject(err)
      resolve(files)
    })
  })
}

phantomas.stdout.resume()
phantomas.stdout.setEncoding('utf8')

phantomas.stdout.on('data', function(chunk) {
  if (!chunk) return
  phantomasReport += chunk
})

phantomas.on('close', async code => {
  var screenshots = await getScreenShots()
  phantomasReport = phantomasReport.replace('undefined', '## ') // TODO figure out how to avoid this
  var html = converter.makeHtml(phantomasReport)
  var filename = path.resolve(process.cwd(), dirname, './report.html')
  fs.writeFile(
    filename,
    wrapHTML(html, wrapHTML.getFilmstriptHTML(screenshots, screenshotsdir)),
    function() {
      opener(filename)
    }
  )
})
