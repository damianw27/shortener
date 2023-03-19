import { Service } from 'typedi';
import { open, RootDatabase } from 'lmdb';
import { RandomKeyService } from './random-key-service';
import { MappingEntry } from '../types/mapping-entry';

@Service()
export class MappingService {
  private database: RootDatabase;

  public constructor(private randomKeyService: RandomKeyService) {
    this.database = open({
      path: 'mapping-database',
      compression: true,
    });
  }

  public async mapUrl(url: string, code?: string): Promise<string> {
    const key = code ?? this.randomKeyService.generateRandomKey(6);

    const mappingEntry: MappingEntry = {
      key,
      url,
      created: new Date(),
      lastUsed: new Date(),
    };

    await this.database.put(key, mappingEntry);
    return key;
  }

  public async getUrl(code: string): Promise<string> {
    const mappingEntry = this.database.get(code) as MappingEntry;

    const updatedMappingEntry = {
      ...mappingEntry,
      lastUsed: new Date(),
    };

    await this.database.put(code, updatedMappingEntry);
    return mappingEntry.url;
  }
}
