var fs = require('fs')
var path = require('path')
const { spawn } = require('child_process')
var showdown = require('showdown')
var getPixels = require('get-pixels')
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

function isNotBlank(meta) {
  return !meta.pixels.data.every(n => n === 0)
}

function isNotWhite(meta) {
  return !meta.pixels.data.every(n => n === 255)
}

function hasPercentPixels(percent) {
  return meta => {
    const { data } = meta.pixels
    const length = data.length
    let colorpixels = 0
    let pixelcount = {}
    for (let i = 0; i < length; i += 3) {
      const rgb = [data[i], data[i + 1], data[i + 2]]
      if (!rgb.every(n => n === 255)) {
        colorpixels += 1
        if (!pixelcount[rgb.join()]) {
          pixelcount[rgb.join()] = 0
        }
        pixelcount[rgb.join()] += 1
      }
    }
    return length / colorpixels >= 100 / (100 - percent)
  }
}

function getScreenShotMeta(screenshots) {
  return Promise.all(
    screenshots.map(
      imageName =>
        new Promise((resolve, reject) => {
          const imagePath = path.resolve(screenshotsdir, imageName)
          getPixels(imagePath, (err, pixels) => {
            if (err) {
              reject(err)
            }
            resolve({
              imageName,
              imagePath,
              pixels
            })
          })
        })
    )
  )
}

phantomas.stdout.resume()
phantomas.stdout.setEncoding('utf8')

phantomas.stdout.on('data', function(chunk) {
  if (!chunk) return
  phantomasReport += chunk
})

phantomas.on('close', async code => {
  phantomasReport = phantomasReport.replace('undefined', '## ') // TODO figure out how to avoid this
  var html = converter.makeHtml(phantomasReport)
  var filename = path.resolve(process.cwd(), dirname, './report.html')
  var screenshots = await getScreenShotMeta(await getScreenShots())
  screenshots = screenshots
    .filter(isNotBlank)
    .filter(isNotWhite)
    .filter(hasPercentPixels(15))
    .map(meta => meta.imageName)
  fs.writeFile(
    filename,
    wrapHTML(html, wrapHTML.getFilmstriptHTML(screenshots, screenshotsdir)),
    function() {
      opener(filename)
    }
  )
})
