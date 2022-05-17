// Dependencies
const express = require('express')
const app = express()
const fs = require('fs')

// Variabler
const baseURL = process.env.BASE_URL || 'localhost'
const port = process.env.PORT || 80
const gameDataDir = './public/gamedata/'

// Legg til mappen public, brukes til CSS, bilder & favicon
app.use(express.static('public'))
// Bruk .pug til å tegne HTML (https://pugjs.org/)
app.set('view engine', 'pug')

// Hvis NODE_ENV er dev, kjør utviklermodus (liveserver).
// Liveserver oppdateres automatisk ved endringer av (pug|css|js) filer i mappene: ['views', 'views/templates', 'public', 'public/*']
if (process.env.NODE_ENV === 'dev') {
  console.log('WARNING: Dev mode initialized.')
  const path = require('path')
  const watchFolders = ['views', 'views/templates', 'public', 'public/css']
  var paths = []
  watchFolders.forEach(folder => {
    paths = paths.concat([path.join(__dirname, folder)])
  })
  app.use(require('easy-livereload')({
    watchDirs: paths,
    checkFunc: (file) => {
      return /.(pug|css|js|jpg|png|gif|svg)$/.test(file)
    }
  }))
}

// Data som er felles for alle sidene
const pugData = {
  base_url: `${baseURL}`,
  favicon: `//${baseURL}/favicon.ico`,
  css: `//${baseURL}/css/style.css`,
  gameList: {}
}

// Wildcard forespørsel, sender til / ved feil
app.get('/*', async (req, res) => {
  // Fjern ekstra leading slashes (/)
  // Regex: ^\/+ - se regexr.com for detaljer
  var url = req.url.replace(/^\/+/, '')

  // Hvis ingen side er spesifisert, vis hjemmeside
  if (url === '') {
    url = 'index'

    // Last inn liste over spill samt lagre JSON data
    // TODO: Migrer til et CDN / nocodb database
    fs.readdir(gameDataDir, async (err, files) => {
      if (err) {
        return console.log('Unable to scan directory: ' + err)
      }
      await files.forEach(async (file) => {
        const fn = await file.toLowerCase().replace('.json', '')
        if (!fn.startsWith('-')) {
          pugData.gameList[fn] = await require(`${gameDataDir}${file}`)
        }
      })
    })
  }

  // Hvis URL ikke er /, se om det er et spill
  if (url !== 'index') {
    try {
      pugData.gameData = require(`${gameDataDir}${url}.json`)
      res.render('game', pugData)
      return
    } catch {
      res.redirect(`//spill.${baseURL}`)
      return
    }
  }

  // Forsøk å laste inn, ved feil, send tilbake til index
  await res.render(url, pugData, (err, html) => {
    if (!err) {
      res.send(html)
    } else {
      res.redirect(`//spill.${baseURL}`)
    }
  })
})

// Start app
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
