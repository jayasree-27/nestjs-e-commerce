import { Provider } from '@nestjs/common';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { TypeMetaDataStorage } from './decorators/convict';

const yamlPath = `${process.cwd()}/config.yaml`;
const yamlConfig = yaml.load(fs.readFileSync(yamlPath, 'utf8')) as Record<
  string,
  any
>;

interface LoadedConfigSchema {
  app?: {
    name: string;
    environment: string;
    port: number;
    log: string;
  };
  database?: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
    synchronize: boolean;
  };
  redis?: {
    host: string;
    port: number;
  };
  [key: string]: any;
}

export const configProviders: Provider[] = [
  {
    provide: 'CONFIG_SCHEMA',
    useFactory: (): LoadedConfigSchema => {
      const schema = TypeMetaDataStorage.buildConfigSchema();
      const loadedConfig: LoadedConfigSchema = {};

      Object.keys(schema).forEach((schemaKey) => {
        loadedConfig[schemaKey] = {};
        Object.keys(schema[schemaKey]).forEach((propKey) => {
          loadedConfig[schemaKey]![propKey] =
            yamlConfig?.[schemaKey]?.[propKey] ??
            schema[schemaKey][propKey].default;
        });
      });

      console.log('✅ Final Loaded Config:', loadedConfig);
      return loadedConfig;
    },
  },
];
