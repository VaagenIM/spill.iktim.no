# spill.iktim.no
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
      - ./gamedata:/app/public/gamedata
```

## Utvikling
Last ned kildekoden og åpne `src` i din IDE.
Installer prosjektet via `npm i`
Start utviklingsserver via `npm run dev`

OBS. Ingen spill skal lastes inn på GitHub! De vil være hos et eget CDN (Content Delivery Network)

Foreløpig lenker siden inn hoved-CSS (fargevariabler) fra https://iktim.no.

## Bruk
I mappen `gamedata` (Via `docker-compose.yml` så genereres den i samme mappe som `docker-compose.yml`) legger man inn datafiler (`<spill_navn>.json`) med innholdet for spillet. Se [-template.json](https://github.com/VaagenIM/spill.iktim.no/blob/main/src/public/gamedata/-template.json) i /src/public/gamedata mappen for en mal av hvilke datafelt som kan benyttes. (Obs. `gallery` er ikke integrert enda).

Viktige felt:
- `title`- Hva heter spillet?
- `description` - Teksten om spillet
- `url` - Hvis spillet foregår i nettleser, kan denne benyttes
- `win_dl` - Lenke til spillets fil. Filbanen og mappen `/games/` (definert av `docker-compose.yml`) kan benyttes som et selvhostet filserver
- `mac_dl`, `linux_dl`, `android_dl` er samme som over - dette generer en annen stil.
- `cover` - Lenke til et bilde av spillet, i `460x215` oppløsning. Dette er det samme som Steam kjører. https://www.steamgriddb.com/ er en god ressurs for å finne bilder. Kan enten URL til filen hostet hos en annen nettside (f.eks. Steam), eller legges inn i `/games/` mappen, f.eks. `/games/covers/<spill_navn>.jpg`

I feltet `links` kan det legges til en liste over lenker hvor spillene eventuelt kan kjøpes. Støttede lenker er:
- https://store.steampowered.com/
- https://store.epicgames.com/
- https://www.gog.com/
- https://www.humblebundle.com/
- https://play.google.com/store
- https://www.apple.com/app-store/
- https://www.nintendo.com/store/
- https://itch.io/

Minimumskrav for at noe skal kunne vises på siden:
```json
{
  "cover": "/games/covers/template.png",
  "title": "Template Mininmum"
}
```

## Oppsett
Krever et FQDN (Fully Qualified Domain Name), valgfrie `.env` variabler via `docker build`:
`BASE_URL=iktim.no`

CSS lastes inn via https://iktim.no
