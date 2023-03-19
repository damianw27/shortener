import { Service } from 'typedi';
import { Config } from '../types/config';
import { readFileSync } from 'fs';
import YAML from 'yaml';

@Service()
export class ConfigService {
  public readonly config: Config;

  public constructor() {
    const configFile = readFileSync('./config.yml', 'utf-8');
    this.config = YAML.parse(configFile) as Config;
  }
}
