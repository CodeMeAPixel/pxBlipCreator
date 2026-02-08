# Development

## Quick Start

Prerequisites: Node.js 16+, Git, FiveM server, MySQL database.

Setup in 5 steps:
```bash
git clone https://github.com/CodeMeAPixel/pxBlipCreator.git
cd pxBlipCreator
cd web && npm install && npm run build
```

Add to server.cfg:
```cfg
ensure oxmysql
ensure pxBlipCreator
```

Grant permission:
```lua
add_ace group.admin "command.blipcreator" allow
```

Run `/blipcreator` in-game to test.

## Project Structure

```
pxBlipCreator/
├── client/
│   ├── main.lua                  # Client core
│   ├── utils.lua                 # NUI callbacks
│   └── framework/                # Framework stubs
├── server/
│   └── main.lua                  # Server core & database
├── web/                          # Vite + React
│   ├── src/
│   │   ├── App.tsx               # Root component
│   │   ├── components/           # Reusable components
│   │   ├── layouts/              # Page views
│   │   ├── hooks/                # Custom hooks
│   │   ├── store/                # Zustand state
│   │   ├── theme/                # Theme config
│   │   └── utils/                # Utilities
│   ├── vite.config.ts            # Build config
│   └── build/                    # Built files (generated)
├── .ideas/                       # Planning docs
├── fxmanifest.lua               # FiveM manifest
└── runme.sql                    # Database schema
```

## Frontend Development

Start dev server:
```bash
cd web
npm run dev
```

Build for production:
```bash
npm run build
```

Output goes to `web/build/` (loaded in-game).

## Backend Development

Client → Server:
```lua
TriggerServerEvent('pxBlipCreator:editBlip', id, data)
```

Server → Client:
```lua
TriggerClientEvent('pxBlipCreator:setBlips', source, blips)
```

Web → Client (NUI):
```lua
RegisterNUICallback('createBlip', function(data, cb)
    cb(1)  -- Acknowledge
end)
```

## Debugging

Frontend (in-game console F8):
```javascript
console.log('Debug info');
```

Backend (server console):
```
refresh pxBlipCreator
stop pxBlipCreator
start pxBlipCreator
```

Database:
```sql
SELECT id, name FROM pxBlipCreator;
```

## Common Tasks

### Adding a Feature
1. Update [IMPROVEMENT_PLAN.md](.ideas/IMPROVEMENT_PLAN.md)
2. Make code changes (frontend, backend, or both)
3. Test thoroughly
4. Update documentation
5. Submit PR

### Modifying Database Schema
1. Backup database first
2. Update `server/main.lua` if adding columns
3. Update TypeScript types in `web/src/types.ts`
4. Document changes in `.ideas/SCHEMA.md`
5. Test thoroughly

Example:
```sql
ALTER TABLE pxBlipCreator ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
```

## Technology Stack

**Frontend:**
- React 18 with TypeScript
- Mantine UI components
- Zustand for state management
- Vite for builds

**Backend:**
- FiveM Lua runtime
- oxmysql for database
- NUI for client-server communication

**Database:**
- MySQL/MariaDB

## Code Style

### Lua
```lua
-- Descriptive names
local function getBlipById(blipId)
    return blips[blipId]
end

-- Comment complex logic
if not data.coords then
    local ped = GetPlayerPed(source)
    data.coords = GetEntityCoords(ped)
end

-- 4-space indentation
if condition then
    doSomething()
end
```

### TypeScript/React
```tsx
interface BlipData {
    id: number;
    name: string;
}

const BlipTable: React.FC<Props> = ({ blips }) => {
    const [visible, setVisible] = useState(false);
    return <table>{/* ... */}</table>;
};
```

## Testing Checklist

Before submitting PR:
- [ ] Tested in-game with admin permissions
- [ ] Create, edit, delete blips work
- [ ] Group visibility works
- [ ] Database entries created
- [ ] No console errors
- [ ] TypeScript compiles
- [ ] Web builds: `npm run build`

## Common Pitfalls

Don't:
- Hardcode database table names
- Use synchronous DB calls
- Skip server-side validation
- Forget to rebuild web UI
- Ignore TypeScript errors

Do:
- Use constants for magic numbers
- Use async/await or promises
- Validate on server before DB write
- Always rebuild: `npm run build`
- Fix TypeScript issues before commit

## Git Workflow

Branches:
- `feature/name` for features
- `bugfix/name` for bug fixes
- `docs/name` for documentation
- `refactor/name` for refactoring

Commits:
```
[FEATURE] Brief description

Optional detailed explanation.
```

Before committing:
- [ ] Code follows style guide
- [ ] TypeScript builds
- [ ] Web builds successfully
- [ ] Tested in-game
- [ ] Documentation updated
- [ ] No debug console.log() statements

## Getting Help

Resources:
- [FiveM Docs](https://docs.fivem.net/)
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Mantine UI](https://mantine.dev/)
- [Zustand](https://github.com/pmndrs/zustand)

Questions:
1. Check existing documentation
2. Search GitHub Issues
3. Ask in an issue or discussion

## Reporting Issues

Include:
1. Description of the problem
2. Steps to reproduce
3. Expected vs actual behavior
4. Environment (server, FiveM build)
5. Logs or error messages

Example:
```
## Bug: Blips not visible for new players

### Steps
1. Create a blip
2. Have another player join
3. New player doesn't see it

### Expected
New players see all existing blips

### Actual
Only appear after new player runs /blipcreator

### Environment
- FiveM: [build]
- Server: Linux/Windows
```

## Documentation

Comment code to explain **why**, not just **what**. Update relevant docs:
- `README.md` for user features
- `DEVELOPMENT.md` for dev changes
- `.ideas/` for architecture decisions