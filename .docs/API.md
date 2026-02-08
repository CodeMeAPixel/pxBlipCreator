## API & Events

### Client Events (from server)

| Event | Description |
| --- | --- |
| `pxBlipCreator:triggeredCommand` | Player used `/blipcreator` command; open UI |
| `pxBlipCreator:setBlips` | Receive all blips as a table on join or manual request |
| `pxBlipCreator:setBlip` | Receive a single blip update when created (id, source, data) |
| `pxBlipCreator:editBlip` | Receive blip update after edit/delete (id, data or nil) |
| `pxBlipCreator:exportData` | Receive JSON export of all blips |
| `pxBlipCreator:importResult` | Receive import result (imported_count, failed_count) |

### Server Events (from client)

| Event | Parameters | Purpose |
| --- | --- | --- |
| `pxBlipCreator:getBlips` | none | Request all currently stored blips |
| `pxBlipCreator:editBlip` | `id, data` | Create (id=nil), update (id, data), or delete (id, data=nil) a blip |
| `pxBlipCreator:exportBlips` | none | Export all blips as JSON |
| `pxBlipCreator:importBlips` | `json_string` | Import blips from JSON |

### Blip Data Structure

```lua
{
  id = 1,                 -- integer: unique identifier (auto-generated)
  name = "Police Station",-- string: blip display name
  coords = vector3(427.5, -979.3, 29.4),  -- vector3: blip location
  zone = "Downtown",      -- string: zone name (auto-detected)
  Sprite = 227,           -- integer: blip sprite ID
  sColor = 3,             -- integer: blip color ID
  scale = 100,            -- integer: scale as percentage (100 = 1.0)
  alpha = 255,            -- integer: opacity (0-255)
  tickb = false,          -- boolean: show tick checkbox
  bflash = false,         -- boolean: enable flashing
  ftimer = 500,           -- integer: flash interval in milliseconds
  outline = false,        -- boolean: show outline
  hideb = false,          -- boolean: hide radar blip
  sRange = false,         -- boolean: blip only visible at short range
  hideUi = false,         -- boolean: hide from UI list
  groups = { police = 0 },-- table: group name => grade (can view if grade >= required)
  items = nil,            -- table: item names required to view (not yet enforced)
  SpriteImg = nil,        -- string: custom sprite image asset (UI cache)
  scImg = nil,            -- string: custom color image asset (UI cache)
  colors = nil            -- integer: color palette selection (UI state)
}
```

### Blip Field Reference

- **Visibility**: Blips automatically hide for players not in required `groups` or without `items`
- **Zone**: Auto-detected on client; set from nearest zone label
- **Scale**: Must be 10–500; raw FiveM scale = scale / 100
- **Flash Timer**: Only applies if `bflash = true`; milliseconds between flash cycles
- **Sprite/Color**: Use FiveM native IDs; UI caches custom images for preview
