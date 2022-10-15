// Dependencies
const express = require('express')
const sqlite3 = require('sqlite3')
const app = express()

// Variabler
const baseURL = process.env.BASE_URL || 'iktim.no'
const port = process.env.PORT || 80

const db = new sqlite3.Database('./gamedb.db')
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS games (" +
      "id INTEGER NOT NULL PRIMARY KEY," +
      "title TEXT NOT NULL," +
      "description TEXT," +
      "note TEXT," +
      "cover BLOB," +
      "time_to_beat TEXT," +
      "category1 TEXT," +
      "category2 TEXT," +
      "category3 TEXT," +
      "developer TEXT," +
      "developer_link TEXT," +
      "url TEXT," +
      "win_dl TEXT," +
      "mac_dl TEXT," +
      "linux_dl TEXT," +
      "android_dl TEXT," +
      "steam TEXT," +
      "humblebundle TEXT," +
      "gog TEXT," +
      "itchio TEXT)")
});
db.close()

// Legg til mappen public, brukes til CSS, spill, bilder & favicon
app.use(express.static('public'))
// Bruk .pug til å tegne HTML (https://pugjs.org/)
app.set('view engine', 'pug')

// Hvis NODE_ENV er dev, kjør utviklermodus (liveserver).
// Liveserver oppdateres automatisk ved endringer av (pug|css|js) filer i mappene: ['views', 'views/templates', 'public', 'public/*']
if (process.env.NODE_ENV === 'dev') {
  console.log('WARNING: Dev mode initialized.')
  const path = require('path')
  const watchFolders = ['views', 'views/templates', 'public', 'public/css']
  let paths = []
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

// Hent data fra database
function update_gameList() {
  // Purge database entries
  try {for (const [key, _] of Object.entries(pugData.gameList)) { delete pugData.gameList[key] }} catch{}
  try {for (const [key, _] of Object.entries(pugData.gameData)) { delete pugData.gameData[key] }} catch{}

  // Connect and load table 'games'
  let db = new sqlite3.Database('./gamedb.db')
  db.all("SELECT * FROM games ORDER BY (CASE WHEN title LIKE 'The %' THEN substring(title, 5, 1000) ELSE title END)", function(err, rows) {
    rows.forEach(function (row) {
      let key = row.title.replaceAll(' ', '-')
      key = key.replaceAll(':', '')

      // Essential data
      pugData.gameList[key] = {title: row.title}
      if (row.description)    {pugData.gameList[key]["description"]    = row.description}
      if (row.note)           {pugData.gameList[key]["note"]           = row.note}
      if (row.cover)          {pugData.gameList[key]["cover"]          = JSON.parse(row.cover)[0].url}
      if (row.time_to_beat)   {pugData.gameList[key]["ttb"]            = row.time_to_beat}
      if (row.developer)      {pugData.gameList[key]["developer"]      = row.developer}
      if (row.developer_link) {pugData.gameList[key]["developer_link"] = row.developer_link}

      // Download buttons / URLs
      if (row.url)        {pugData.gameList[key]["url"]        = row.url}
      if (row.win_dl)     {pugData.gameList[key]["win_dl"]     = `/games/Windows/${row.win_dl}`}
      if (row.mac_dl)     {pugData.gameList[key]["mac_dl"]     = `/games/Mac/${row.mac_dl}`}
      if (row.linux_dl)   {pugData.gameList[key]["linux_dl"]   = `/games/Linux/${row.linux_dl}`}
      if (row.android_dl) {pugData.gameList[key]["android_dl"] = `/games/Android/${row.android_dl}`}

      // Categories
      pugData.gameList[key]["category"] = []
      if (row.category1) {pugData.gameList[key]["category"].push(row.category1)}
      if (row.category2) {pugData.gameList[key]["category"].push(row.category2)}
      if (row.category3) {pugData.gameList[key]["category"].push(row.category3)}

      // Links
      pugData.gameList[key]["links"] = []
      if (row.steam) {pugData.gameList[key]["links"].push(row.steam)}
      if (row.gog) {pugData.gameList[key]["links"].push(row.gog)}
      if (row.itchio) {pugData.gameList[key]["links"].push(row.itchio)}
      if (row.humblebundle) {pugData.gameList[key]["links"].push(row.humblebundle)}
      })
    });
  db.close()
}

// Wildcard forespørsel, sender til / ved feil
app.get('/*', async (req, res) => {
  // Fjern ekstra leading slashes (/)
  // Regex: ^\/+ - se regexr.com for detaljer
  let url = req.url.replace(/^\/+/, '')

  // Hvis ingen side er spesifisert, vis hjemmeside
  if (url === '') {
    url = 'index'
  } else {
    // Hvis spill finnes i database, last inn den
    pugData.gameData = pugData.gameList[url]
    if (pugData.gameData !== undefined) {url = 'game'}  // url = game.pug
  }

  try {
    res.render(url, pugData, (err, html) => {
      if (err) { throw err }
      else { res.send(html) }
    })
  } catch {
    res.redirect(`//spill.${baseURL}`)
  }

  // Reload db
  update_gameList()
})

// Start app
app.listen(port, () => {
  update_gameList()
  console.log(`Listening on port ${port}`)
})
