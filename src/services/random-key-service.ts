import { Service } from 'typedi';

const possibleSigns =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';

@Service()
export class RandomKeyService {
  public generateRandomKey = (length: number): string => {
    const result: string[] = [];

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.random() * possibleSigns.length;
      const randomIndexInt = Math.floor(randomIndex);
      const randomChar = possibleSigns.charAt(randomIndexInt);
      result.push(randomChar);
    }

    return result.join('');
  };
}
