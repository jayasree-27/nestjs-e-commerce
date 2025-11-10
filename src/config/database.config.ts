import { Injectable, Inject } from '@nestjs/common';
import { ConvictSchema, Prop } from './decorators/convict';

@Injectable()
@ConvictSchema('database')
export class DatabaseConfig {
  constructor(@Inject('CONFIG_SCHEMA') config: any) {
    const db = config.database;
    this.host = db.host;
    this.port = db.port;
    this.username = db.username;
    this.password = db.password;
    this.name = db.name;
    this.synchronize = db.synchronize;

    console.log('✅ Database config loaded:', this);
  }

  @Prop({ format: String, default: 'localhost', env: 'DB_HOST' })
  host: string;

  @Prop({ format: Number, default: 5432, env: 'DB_PORT' })
  port: number;

  @Prop({ format: String, default: 'postgres', env: 'DB_USERNAME' })
  username: string;

  @Prop({ format: String, default: '', env: 'DB_PASSWORD' })
  password: string;

  @Prop({ format: String, default: '', env: 'DB_NAME' })
  name: string;

  @Prop({ format: Boolean, default: false, env: 'DB_SYNC' })
  synchronize: boolean;
}
