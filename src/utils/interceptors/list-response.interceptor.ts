import { AppConfigModule } from '@config/app/config.module';
import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Resource } from '../base-class/base.resource';

type Meta = {
  currentRecordCount: number;
  totalRecordCount: number;
  totalPage: number;
  currentPage: number;
  perPage: number;
  startOf: number;
};

@Injectable()
export class ResponsePaginationInterceptor<T>
implements NestInterceptor<T, any> {
  serializeName: Resource;

  constructor(serializeName: Resource) {
    this.serializeName = serializeName;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        const request: FastifyRequest<{
          Querystring: {
            page: string,
            size: string,
          }
        }> = context.switchToHttp().getRequest();
        const meta = this.meta({
          count: response.count,
          rowsLength: response.rows.length,
          additionalMeta: response.additionalMeta,
        }, request.query);

        // make to json serialize
        const baseResource = AppConfigModule.BaseResouce;
        const resource = baseResource.serialize(this.serializeName, response.rows);
        return {
          ...resource,
          meta,
          // links: this.links(meta, {
          //   url: request.url,
          //   page: request.query.page,
          //   hostname: request.headers.hostname || '',
          // }),
        };
      }),
    );
  }

  // /**
  //  * link of response
  //  * @param param0
  //  */
  // private links({ currentPage, totalPage }: Meta) {
  //   // LINKS

  //   const self = () => this.linkQueries(currentPage);
  //   const prev = () => {
  //     const prevPage = +currentPage - 1;
  //     if (prevPage < 1) return undefined;

  //     return this.linkQueries(prevPage);
  //   };
  //   const next = () => {
  //     if (+currentPage >= +totalPage) return undefined;

  //     return this.linkQueries(+currentPage + 1);
  //   };

  //   const last = () => {
  //     if (!+totalPage) return undefined;
  //     return this.linkQueries(totalPage);
  //   };

  //   return {
  //     self: self(),
  //     prev: prev(),
  //     next: next(),
  //     last: last(),
  //   };
  // }

  // private linkQueries(itsPage: number): string {
  //   const updatedQuery = this.queryString.replace(
  //     `page=${this.query.page}`,
  //     `page=${itsPage}`,
  //   );

  //   if (!updatedQuery) return this.pathname;
  //   return `${this.pathname}?${updatedQuery}`;
  // }

  /**
   * generate meta of response pagination
   * @param count
   * @param rows
   * @param additionalMeta
   */
  private meta(args: { count: number | unknown[],
    additionalMeta?: any,
    rowsLength: number }, { size, page }): Meta {
    // META
    const total: number = typeof args.count === 'object' ? args.count?.length || 0 : args.count;

    const totalPage = size ? Math.ceil(total / size) : 0;

    const offset = (size && page) ? size * page - +size : 0;

    return (
      (total >= 0 && {
        totalRecordCount: total,
        currentRecordCount: args?.rowsLength || 0,
        totalPage: totalPage || 0,
        currentPage: +(args?.additionalMeta?.meta?.page || page || 1),
        perPage: +(size || 0),
        startOf: (args.count && offset + 1) || 0,
        ...args.additionalMeta,
      })
      || undefined
    );
  }
}
