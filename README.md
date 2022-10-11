# spill.iktim.no (<a href="https://vaagenim.github.io/spill.iktim.no/">Klikk her for demovisning</a>)
[![Build Status](https://img.shields.io/github/workflow/status/VaagenIM/spill.iktim.no/CI)](https://github.com/VaagenIM/spill.iktim.no/)
[![GitHub latest commit](https://img.shields.io/github/last-commit/VaagenIM/spill.iktim.no)](https://github.com/VaagenIM/spill.iktim.no/commit/)

Kildekoden til https://spill.iktim.no

Kjøres via `docker-compose.yml`:
```yaml
version: "3.3"
services:
  spill.iktim.no:
    image: ghcr.io/vaagenim/spill.iktim.no
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./games:/app/public/games
      - ./gamedb.db:/app/gamedb.db
  spilldb.iktim.no:
    image: nocodb/nocodb
    restart: unless-stopped
    ports:
      - "8080:8080"
    volumes:
      - ./gamedb.db:/usr/src/app/noco.db
      - ./uploads:/usr/app/data/nc/uploads
```

## Utvikling
Last ned kildekoden og åpne `src` i din IDE.
Installer prosjektet via `npm i`
Start utviklingsserver via `npm run dev`

OBS. Ingen spill skal lastes inn på GitHub! De vil være hos et eget CDN (Content Delivery Network)

Foreløpig lenker siden inn hoved-CSS (fargevariabler) fra https://iktim.no.

## Bruk
Prosjektet bruker SQLITE3 som database back-end.

I NocoDB (`:8080`):
- Koble til en database, velg databasetype `SQLITE`. Database-sti er `noco.db`
- I databasen `Games` endrer du `Cover` kolonnetypen til `Attachments`
- Cover fungerer best med oppløsning `460x215` (SteamDB)
- `win_dl` skal ha filnavnet som ligger i `Games/Windows/` mappen, `mac_dl` i `Games/Mac/`.

## Oppsett
Krever et FQDN (Fully Qualified Domain Name), valgfrie `.env` variabler via `docker build`:
`BASE_URL=iktim.no`

FQDN kan settes opp via https://nginxproxymanager.com/

CSS lastes inn via https://iktim.no
