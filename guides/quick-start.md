# Quick start

Install Pley, create your account, add your media and start watching.

## What you need

- **A computer that stays on:** a PC, a Mac, a Linux server or a NAS.
- **Your media in folders,** with movies, shows and music kept apart
  ([Naming your media](../deploy/docker/media/README.md)).
- **Port 7539** reachable on your home network.

A graphics card is optional: Pley uses one only to convert video a device
can't play. The details are in [Requirements](../deploy/README.md#what-pley-needs).

## 1. Install Pley

Follow the guide for where Pley will run:

- [Docker](../deploy/docker/README.md), on a Linux server or NAS
- [Unraid](../deploy/unraid/README.md)
- [Synology](../deploy/synology/README.md)
- [Windows](../deploy/windows/README.md)
- [macOS](../deploy/README.md#macos-launchd)
- [Linux, without Docker](../deploy/README.md#linux-systemd)

## 2. Create your account

When Pley first starts, it gives you a link with a one-time setup code.
Open it and create the administrator account. Until you do, anyone with the
code can claim the server.

- **Docker:** `./setup.sh` prints the link. To see it again:

  ```sh
  docker compose logs pley
  ```

- **Unraid:** in the container's logs.
- **Synology:** in Package Center.
- **Windows:** on the installer's last page.
- **macOS:** in Pley's log, `~/Library/Application Support/pley/logs/pley.log`.
- **Linux:**

  ```sh
  journalctl -u pley
  ```

## 3. Add your media

Setup asks whether to bring over a Plex server or start fresh
([Moving from Plex](../docs/MOVING_FROM_PLEX.md)). Starting fresh, give
Movies, TV Shows and Music their folders. Pley scans them, and Home shows
its progress ([First start](../docs/CONFIGURATION.md#first-start)). Add more
libraries later in **Settings → Libraries**.

## 4. Start watching

Open `http://<server address>:7539` in a browser: the web app comes with the
server. For TVs, phones and computers, [choose an app](apps.md).

Apps look for Pley on your network. If one doesn't find it, type the
server's address.

With Docker, Pley answers only on its own computer at first. To reach it
from other devices, set this in `.env`:

```sh
PLEY_LISTEN=0.0.0.0:7539
```

Then restart it:

```sh
docker compose up -d
```

## Next steps

- **Watch away from home:** put Pley behind a reverse proxy with TLS
  ([Remote access](../deploy/README.md#firewall-and-remote-access)).
- **Back up** Pley's data folder ([Storage and backups](../docs/STORAGE.md)).
- **Hardware transcoding:** your install guide covers it.
