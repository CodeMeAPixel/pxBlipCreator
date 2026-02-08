# pxBlipCreator

A FiveM blip management tool with a web UI. Create, customize, and share map blips with persistent database storage.


![Version](https://img.shields.io/badge/version-0.0.1-blue)
![License](https://img.shields.io/badge/license-GPL--3.0--or--later-green)
![FiveM](https://img.shields.io/badge/FiveM-Cerulean-002e5c)

> [!CAUTION]
> This resource is not yet ready for production use and is only public at this stage for transparency. 

## Getting started
- [Installation](.docs/INSTALLATION.md)
- [Usage](.docs/USAGE.md)
- [API Reference](.docs/API.md)
- [Troubleshooting](.docs/TROUBLESHOOTING.md)

## Development & contributing
- [Development Guide](DEVELOPMENT.md)
- [Contributing Guide](CONTRIBUTING.md)

## What it does
- Create, edit, delete blips via web UI or in-game command.
- Real-time synchronization across all players.
- Persistent storage with MySQL.
- Group and item-based visibility rules.
- Customizable sprite, color, scale, alpha, and effects.

## Requirements
- FiveM (fx_version 'cerulean')
- oxmysql (must load before pxBlipCreator)
- Node.js 16+ (to build the UI)
- MySQL database

## Quick start
```bash
# Build the UI
cd web
npm install
npm run build

# Import database (optional; auto-creates on first run)
mysql -u root -p your_db < runme.sql

# Add to server.cfg
ensure oxmysql
ensure pxBlipCreator
```

> [!CAUTION]
> Ensure `oxmysql` is loaded before `pxBlipCreator` in your `server.cfg`.

### Command
- `/blipcreator` — open the UI (requires permission).

## License
GPL-3.0-or-later — see [LICENSE](../LICENSE).