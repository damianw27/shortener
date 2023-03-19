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

    if (urlKey === undefined) {
      response.status(400);

      response.send({
        at: new Date().toUTCString(),
        error: {
          code: 400,
          message: `Provided code '${body.code}' is already in use.`,
        },
      });
    }

    const { protocol, baseDomain } = this.configService.config;
    const url = `${protocol}://${baseDomain}/${urlKey}`;

    response.send({
      at: new Date().toUTCString(),
      url,
    });
  };

  private redirect = async (
    request: Request,
    response: Response,
  ): Promise<void> => {
    const pathElements = request.path.split('/');
    const lastPathElement = pathElements[pathElements.length - 1];
    const url = await this.mappingService.getUrl(lastPathElement);

    if (url === undefined) {
      response.sendFile(process.cwd() + '/static/404.html');
      return;
    }

    response.redirect(url);
  };
}
