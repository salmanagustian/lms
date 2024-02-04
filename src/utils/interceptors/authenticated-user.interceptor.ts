import {
  Injectable, ExecutionContext, CallHandler,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticatedUserInterceptor {
  constructor(
    private readonly clsService: ClsService,
  ) {

  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.clsService.set('user', context.switchToHttp().getRequest().user || null);
    return next.handle();
  }
}
