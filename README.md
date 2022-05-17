# spill.iktim.no
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

## Oppsett
Krever et FQDN (Fully Qualified Domain Name), valgfrie `.env` variabler via `docker build`:
`BASE_URL=iktim.no`

CSS lastes inn via https://iktim.no
