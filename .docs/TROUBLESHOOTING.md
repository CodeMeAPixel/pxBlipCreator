## Troubleshooting

### UI doesn't load

**Symptoms**: `/blipcreator` opens nothing or shows a blank/error screen.

**Check**:
- Confirm `web/build/index.html` exists
- FiveM server console for load errors
- Browser console (F8) for JavaScript errors

**Fix**:
```bash
cd web && npm run build
```

### Database connection errors

**Symptoms**: Server console shows MySQL-related errors; blips don't save or load.

**Check**:
- `oxmysql` is running (`status oxmysql`)
- Database credentials in `oxmysql` config are correct
- `pxBlipCreator` loads after `oxmysql` in `server.cfg`

**Fix**: Restart both resources after verifying the config.

### Blips not visible to other players

**Symptoms**: You see your blips, but other players don't.

**Check**:
- Blip has group restrictions enabled with the player's group
- Player has the required group/grade
- Blip is not hidden via the `hideUi` setting

**Fix**: Edit the blip and remove group restrictions, or add the player to the required group.

### Command not recognized

**Symptoms**: `/blipcreator` shows "Unknown command."

**Check**:
- Resource is running: `status pxBlipCreator`
- Player has permission: `add_ace user.STEAM_ID "command.blipcreator" allow`

**Fix**: Add permission and restart the resource or the player must rejoin the server.
