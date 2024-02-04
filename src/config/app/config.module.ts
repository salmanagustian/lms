import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { BaseResource } from '@utils/base-class/base.resource';
import config from './config';
import schema from './schema';
import { BaseResource } from '@utils/base-class/base.resource';

export async function getModuleEnv<T>(configModule: T): Promise<T> {
  await ConfigModule.envVariablesLoaded;
  return configModule;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      expandVariables: true,
      validationSchema: schema,
    }),
  ],
  providers: [BaseResource],
})
export class AppConfigModule {
  static BaseResouce: BaseResource;

  constructor(readonly baseResource: BaseResource) {
    AppConfigModule.BaseResouce = baseResource;
  }
}
