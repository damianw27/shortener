import { Service } from 'typedi';
import { Api } from '../types/api';
import { Express, Request, Response } from 'express';
import { MappingService } from '../services/mapping-service';
import { ShortenBody } from '../types/shorten-body';
import { ConfigService } from '../services/config-service';

@Service()
export class CoreApi implements Api {
  public constructor(
    private mappingService: MappingService,
    private configService: ConfigService,
  ) {}

  public registerEndpoints = (app: Express): void => {
    app.post('/api/shorten', this.shortenLink);
    app.get('/*', this.redirect);
  };

  private shortenLink = async (
    request: Request,
    response: Response,
  ): Promise<void> => {
    const body = request.body as ShortenBody;
    const urlKey = await this.mappingService.mapUrl(body.url, body.code);
    const { protocol, baseDomain } = this.configService.config;
    const url = `${protocol}://${baseDomain}/${urlKey}`;
    response.send(url);
  };

  private redirect = async (
    request: Request,
    response: Response,
  ): Promise<void> => {
    const pathElements = request.path.split('/');
    const lastPathElement = pathElements[pathElements.length - 1];
    const url = await this.mappingService.getUrl(lastPathElement);
    response.redirect(url);
  };
}
