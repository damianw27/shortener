import { Service } from 'typedi';
import { ConfigService } from './services/config-service';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { CoreApi } from './apis/core-api';
import cors from 'cors';

@Service()
export class Main {
  public constructor(
    private configService: ConfigService,
    private coreApi: CoreApi,
  ) {}

  public run = (): void => {
    dotenv.config();
    const app: Express = express();
    app.use(bodyParser.json());
    app.use(cors());
    this.coreApi.registerEndpoints(app);
    app.listen(this.configService.config.port);
  };
}
