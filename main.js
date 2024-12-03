const { ElectronEgg } = require('ee-core');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

new ElectronEgg();