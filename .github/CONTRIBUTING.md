# Contributing

Ways to contribute: report bugs, suggest features, improve documentation, write code, or test.

## How to Report a Bug

1. Check [GitHub Issues](https://github.com/CodeMeAPixel/pxBlipCreator/issues) for duplicates
2. Reproduce the bug consistently and note steps
3. Open a new issue with:
   - Clear description of what's wrong
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment info (server, FiveM version)
   - Logs or screenshots if relevant

## How to Suggest Features

1. Check if the feature already exists
2. Review [IMPROVEMENT_PLAN.md](.ideas/IMPROVEMENT_PLAN.md)
3. Open an issue or GitHub discussion with:
   - What you want to add
   - Why (use case)
   - How it should work
   - Estimated difficulty (low/medium/high)

## Contribution Process

1. Fork the repository and clone your fork
2. Create a feature branch: `git checkout -b feature/name`
3. Make your changes and test
4. Commit with clear messages: `git commit -m "[TYPE] description"`
5. Push to your fork
6. Create a pull request

Branch naming:
- `feature/` for new features
- `bugfix/` for bug fixes
- `docs/` for documentation
- `refactor/` for code refactoring

Commit message format:
```
[FEATURE] Brief description

Optional detailed explanation.
```

## Pull Request Checklist

Before submitting:
- [ ] Code follows style guide (see DEVELOPMENT.md)
- [ ] All changes tested in-game
- [ ] TypeScript builds without errors
- [ ] Web builds: `npm run build`
- [ ] Documentation updated
- [ ] No debug console.log() statements
- [ ] Commit messages are clear

## Code Standards

### General
- Functions should be focused and simple
- Use meaningful variable/function names
- Comments explain **why**, not **what**
- Avoid code duplication (DRY principle)
- Validate inputs for security

### Lua Code

Good:
```lua
local function createBlip(blipData, playerId)
    if not blipData or not blipData.coords then
        return false, "Invalid blip data"
    end
    return true, blipData.id
end
```

Bad:
```lua
function createBlip(data)
    blips[data.id] = data  -- No validation
end
```

### TypeScript/React

Good:
```tsx
interface BlipProps {
    blipId: number;
    onEdit: (blip: BlipData) => void;
}

const BlipRow: React.FC<BlipProps> = ({ blipId, onEdit }) => {
    return <tr onClick={() => onEdit(blip)}>{/* ... */}</tr>;
};
```

Bad:
```tsx
const BlipRow = ({ blip, onClick }) => {
    return <tr onClick={() => onClick(blip)} />;  // No types
};
```

## Testing

Test your changes thoroughly before submitting:
- In-game with admin permissions
- Creating, editing, and deleting blips
- Group-based visibility
- Item-based visibility
- Database entries created correctly
- No console errors

Include a testing summary in your PR.

## Documentation

Comment code to explain **why** something is done, not just **what** it does. Update relevant docs:
- `README.md` for user-facing features
- `DEVELOPMENT.md` for developer changes
- `.ideas/` for architectural decisions

## Getting Help

Before starting work:
1. Check [IMPROVEMENT_PLAN.md](.ideas/IMPROVEMENT_PLAN.md) for planned work
2. Read [DEVELOPMENT.md](DEVELOPMENT.md) for setup and architecture
3. Search issues for duplicates

## License

By contributing, you agree your code will be licensed under GPL-3.0-or-later. You retain copyright; others can use and modify your work under the GPL.
