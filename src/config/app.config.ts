// import { registerAs } from '@nestjs/config';

// export default registerAs('app', () => ({
//   name: process.env.APP_NAME,
//   environment: process.env.NODE_ENV,
// }));

import { Inject, Injectable } from '@nestjs/common';
import { ConvictSchema, Prop } from './decorators/convict';
@Injectable()
@ConvictSchema('app')
export class AppConfig {
  constructor(@Inject('CONFIG_SCHEMA') config: any) {
    const app = config.app;
    this.name = app.name;
    this.environment = app.environment;
    this.port = app.port;
    this.log = app.log;

    console.log('✅ App config loaded:', this);
  }

  @Prop({ format: String, default: 'ecommerce' }) name: string;
  @Prop({ format: String, default: 'development' }) environment: string;
  @Prop({ format: Number, default: 8081 }) port: number;
  @Prop({ format: String, default: 'info' }) log: string;
}
