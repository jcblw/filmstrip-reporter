var path = require('path')
var fs = require('fs')

var cssPath = path.resolve(__dirname, './styles.css')

module.exports = function(html, filmstrip) {
  return `<!doctype html>
    <html>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css"
        type="text/css"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.6.0/github-markdown.min.css"
        type="text/css"
        rel="stylesheet"
      />
      <style type="text/css">
        ${fs.readFileSync(cssPath).toString('utf8')}
      </style>
      <body>
        <div class="markdown-body">
          <h1>Report</h1>
          <h2>Filmstrip</h2>
        </div>
        <div class='filmstrip-container'>
          ${filmstrip}
        </div>
        <div class="markdown-body">
          ${html}
        </div>
      </body>
    </html>
  `
}

module.exports.getFilmstriptHTML = (screenshots, screenshotsdir) => {
  return `
  <ul class='filmstrip'>
  ${screenshots
    .map(file => {
      const ms = file.imageName.split('-').pop().split('.').shift()
      return {
        ms,
        path: file.relImagePath
      }
    })
    .sort((x, y) => {
      return x.ms - y.ms
    })
    .map(data => {
      return `
        <li>
          <img style="max-width:100%;" src=${encodeURI(data.path)} />
          <p>${data.ms} MS</p>
        </li>
      `
    })
    .join('')}
  </ul>
  `
}
