import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';

export default class New extends Command {
  static description = 'Scaffold a new Laravel + Next.js application';

  static examples = ['$ create-nextstream-app new app'];

  static flags = {
    debug: flags.boolean({ char: 'v', description: 'debug output' }),
  };

  static args = [{ name: 'name' }];

  async run() {
    const { args, flags } = this.parse(New);

    this.log('Creating frontend project...');
    const rootFolder = path.join(process.cwd(), args.name);
    const frontendFolder = path.join(rootFolder, 'frontend');
    const backendFolder = path.join(rootFolder, 'backend');
    fs.mkdirSync(rootFolder);
    execSync(
      'git clone https://github.com/ozziexsh/nextstream-ts.git frontend',
      { cwd: rootFolder },
    );
    execSync('rm -rf frontend/.git', { cwd: rootFolder });

    this.log('Installing npm dependencies');
    execSync('npm i', { cwd: frontendFolder });

    this.log('Creating environment file');
    execSync('cp .env.local.example .env.local', { cwd: frontendFolder });

    this.log('Creating Laravel project...');
    execSync(`laravel new backend`, { cwd: rootFolder });

    this.log('Installing Nextstream...');
    execSync(`composer require ozzie/nextstream`, { cwd: backendFolder });
    execSync(`php artisan nextstream:install`, { cwd: backendFolder });
  }
}
