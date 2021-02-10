import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';

export default class New extends Command {
  static description = 'Scaffold a new Laravel + Next.js application';

  static examples = ['$ nexstream new app'];

  static flags = {
    // flag with a value (-n, --name=VALUE)
    // name: flags.string({ char: 'n', description: 'name to print' }),
  };

  static args = [{ name: 'name' }];

  async run() {
    const { args } = this.parse(New);

    this.log('Creating frontend project...');
    const rootFolder = path.join(process.cwd(), args.name);
    const frontendFolder = path.join(rootFolder, 'frontend');
    const backendFolder = path.join(rootFolder, 'backend');
    fs.mkdirSync(rootFolder);
    try {
      fs.copySync(
        path.join(__dirname, '../', 'stubs', 'frontend'),
        frontendFolder,
      );
    } catch (e) {
      this.error('Failed to create frontend project');
    }

    this.log('Installing npm dependencies');
    execSync('npm i', { cwd: frontendFolder });

    this.log('Creating environment file');
    execSync('cp .env.local.example .env.local', { cwd: frontendFolder });

    this.log('Creating Laravel project...');
    execSync(`laravel new backend`, { cwd: rootFolder });

    this.log('Installing Fortify...');
    execSync(`composer require laravel/fortify`, { cwd: backendFolder });

    this.log('Copying Fortify configuration...');
    execSync(
      `php artisan vendor:publish --provider="Laravel\\Fortify\\FortifyServiceProvider"`,
      { cwd: backendFolder },
    );

    this.log('Installing Sanctum...');
    execSync(`composer require laravel/sanctum`, { cwd: backendFolder });

    this.log('Copying Sanctum configuration...');
    execSync(
      `php artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider"`,
      { cwd: backendFolder },
    );

    // this.log('Installing Nextstream...');
    // execSync(`composer require ozzie/nextstream`, { cwd: backendFolder });

    // this.log('Copying Nextstream configuration...');
    // execSync(
    //   `php artisan vendor:publish --provider="Ozzie\\Nextstream\\NextstreamServiceProvider"`,
    //   { cwd: backendFolder },
    // );
  }
}
