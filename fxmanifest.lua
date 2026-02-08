fx_version   'cerulean'
use_experimental_fxv2_oal 'yes'
lua54        'yes'
game         'gta5'

name         'pxBlipCreator'
version      '0.0.1'
license      'GPL-3.0-or-later'
author       'CodeMeAPixel'
repository   'https://github.com/CodeMeAPixel/pxBlipCreator'

shared_scripts {
	'shared/logger.lua',
}

client_scripts {
	'client/main.lua',
	'client/utils.lua',
	'client/framework/*.lua',
}

server_scripts {
	'@oxmysql/lib/MySQL.lua',
	'server/main.lua',
}

ui_page 'web/build/index.html'

files {
	'web/build/index.html',
	'web/build/**/*',
}

dependencies {
	'oxmysql',
}
