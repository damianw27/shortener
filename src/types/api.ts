import { Express } from 'express';

export interface Api {
  readonly registerEndpoints: (express: Express) => void;
}
