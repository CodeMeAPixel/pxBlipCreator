## Installation

### 1. Build the Web UI

From the `web` folder:

```bash
cd web
npm install
npm run build
```

You can also use `pnpm` or `bun` instead of `npm`.

### 2. Database

Import the SQL schema (optional; the resource auto-creates the table if missing):

```bash
mysql -u root -p your_database < runme.sql
```

> [!WARNING]
> If you skip manual import, the resource creates the table on first run. Confirm your database connection works and `oxmysql` has appropriate permissions.

### 3. Server Configuration

Add to `server.cfg`:

```cfg
ensure oxmysql
ensure pxBlipCreator
```

> [!CAUTION]
> `oxmysql` must load **before** `pxBlipCreator`, otherwise the resource will fail to start.

### 4. Permissions

Add ACE permissions as needed. Master permission grants all actions:

```cfg
add_ace group.admin "command.blipcreator" allow
```

Or use granular permissions:

```cfg
add_ace group.admin "pxblip.access" allow
add_ace group.admin "pxblip.create" allow
add_ace group.admin "pxblip.edit" allow
add_ace group.admin "pxblip.delete" allow
add_ace group.admin "pxblip.export" allow
add_ace group.admin "pxblip.import" allow
```
