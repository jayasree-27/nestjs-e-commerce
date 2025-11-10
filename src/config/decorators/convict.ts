import { Type } from '@nestjs/common';

export const propMetaData: Array<{
  property: string;
  options: any;
  target: any;
}> = [];
export const schemaMetaData: Array<{ options: string; target: any }> = [];

export class TypeMetaDataStorage {
  static addPropertyMetaData(property: string, options: any, target: any) {
    propMetaData.push({ property, options, target });
  }

  static addSchemaMetaData(options: string, target: any) {
    schemaMetaData.push({ options, target });
  }

  static buildConfigSchema() {
    const convitSchema: Record<string, any> = {};

    schemaMetaData.forEach((schema) => {
      propMetaData.forEach((prop) => {
        if (prop.target.constructor.name === schema.target.name) {
          if (!convitSchema[schema.options]) convitSchema[schema.options] = {};
          convitSchema[schema.options][prop.property] = prop.options;
        }
      });
    });

    return convitSchema;
  }

  static getConfigKeyByClass(ref: Type): string {
    let targetKey = '';
    schemaMetaData.forEach((schema) => {
      if (ref.name === schema.target.name) targetKey = schema.options;
    });

    return targetKey;
  }
}

export function ConvictSchema(configKey?: string): ClassDecorator {
  return (target: any) => {
    TypeMetaDataStorage.addSchemaMetaData(configKey ?? 'default', target);
  };
}

export function Prop(options?: any): PropertyDecorator {
  return (target: Record<string, any>, propertyKey: string | symbol) => {
    if (typeof propertyKey === 'symbol') propertyKey = propertyKey.toString();
    TypeMetaDataStorage.addPropertyMetaData(propertyKey, options, target);
  };
}
