var path = require('path')

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
        .markdown-body {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
        }

        ul.film-strip {
          display: flex;
          list-style-type: none;
          padding: 0;
        }

        ul.film-strip li {
          flex: 1;
        }

        ul.film-strip li:hover {
          flex: 6;
        }
      </style>
      <body>
        <div class="markdown-body">
          <h1>Report</h1>
          <h2>Filmstrip</h2>
          ${filmstrip}
          ${html}
        </div>
      </body>
    </html>
  `
}

module.exports.getFilmstriptHTML = (screenshots, screenshotsdir) => {
  return `
  <ul class='film-strip'>
  ${screenshots
    .map(file => {
      const ms = file.split('-').pop().split('.').shift()
      return {
        ms,
        path: path.resolve(path.resolve(process.cwd(), screenshotsdir, file))
      }
    })
    .sort((x, y) => {
      return x.ms - y.ms
    })
    .map(data => {
      return `
        <li>
          <img style="max-width:100%;" src=${encodeURI(data.path)} />
          <p>${data.ms}</p>
        </li>
      `
    })
    .join('')}
  </ul>
  `
}
