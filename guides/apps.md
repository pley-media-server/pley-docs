# All apps

Pley's own apps, the apps that work with it, and how to write your own.

## Pley's apps

| App | Runs on | Store | Install |
|---|---|---|---|
| Web app | Any browser | Part of the server | Open `http://<server address>:7539` |
| Desktop | Windows, macOS, Linux | Not yet | From the [latest release](https://github.com/pley-media-server/pley/releases/latest) |
| [Android](../docs/ANDROID.md) | Phones, tablets, Android TV, Google TV, Fire TV | Not yet in Google Play or the Amazon Appstore | APK |
| [Samsung TV](../docs/TV_PLATFORMS.md) | Samsung TVs from 2018 | Not yet | Developer mode |
| [LG TV](../docs/LG.md) | LG TVs from 2018 | LG's store takes no native apps | Developer Mode, or a rooted TV |
| [Roku](../docs/ROKU.md) | Roku players and TVs | Not yet | Developer mode |
| [Kodi](../docs/KODI.md) | Kodi 20 and later | Not yet in an add-on repository | Zip |
| [Home Assistant](https://github.com/pley-media-server/pley-homeassistant) | Home Assistant | Not yet in HACS's default list | HACS, as a custom repository |
| Apple | iPhone, iPad, Apple TV, Mac | In development | |

## Other apps

Pley speaks Jellyfin's and Plex's APIs, so apps built for them work with it
([Plex and Jellyfin compatibility](../docs/COMPATIBILITY.md)).

- **Jellyfin apps,** such as Jellyfin's own, Findroid, JellyCon, Plezy and
  Infuse: add Pley as a Jellyfin server and sign in with your Pley account.
- **Plex tools,** such as Kometa, Maintainerr, `python-plexapi` scripts and,
  in part, Tautulli: give each one Pley's address and a token from
  **Account → Tokens for other apps**.

Tools that need a plex.tv sign-in don't work, such as Overseerr, Ombi, and
Sonarr's and Radarr's Plex connection.

## Write your own

Pley's own apps use its HTTP API ([Pley's API](../docs/API.md)), at your
server's address with `/api`.

- **Apps** sign in through [OAuth 2.1](../docs/API.md#apps-oauth-21): no
  client secret, no registration. An administrator allows each app.
- **Scripts** can sign in with `POST /api/auth/login` and send the token as
  `Authorization: Bearer <token>`.
