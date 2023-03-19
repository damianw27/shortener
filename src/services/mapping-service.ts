import { Service } from 'typedi';
import { open, RootDatabase } from 'lmdb';
import { RandomKeyService } from './random-key-service';
import { MappingEntry } from '../types/mapping-entry';

const defaultSizeOfKey = 6;

@Service()
export class MappingService {
  private database: RootDatabase;

  public constructor(private randomKeyService: RandomKeyService) {
    this.database = open({
      path: 'mapping-database',
      compression: true,
    });
  }

  public async mapUrl(url: string, code?: string): Promise<string | undefined> {
    let key = code ?? this.randomKeyService.generateRandomKey(defaultSizeOfKey);

    if (code === undefined) {
      while (this.database.doesExist(key)) {
        key = this.randomKeyService.generateRandomKey(defaultSizeOfKey);
      }
    } else {
      if (this.database.doesExist(key)) {
        return undefined;
      }
    }

    const mappingEntry: MappingEntry = {
      key,
      url,
      created: new Date(),
      lastUsed: new Date(),
    };

    await this.database.put(key, mappingEntry);
    return key;
  }

  public async getUrl(code: string): Promise<string | undefined> {
    const mappingEntry = this.database.get(code) as MappingEntry | undefined;

    if (mappingEntry === undefined) {
      return undefined;
    }

    const updatedMappingEntry = {
      ...mappingEntry,
      lastUsed: new Date(),
    };

    await this.database.put(code, updatedMappingEntry);
    return mappingEntry.url;
  }
}
