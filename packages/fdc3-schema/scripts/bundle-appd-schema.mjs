/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import SwaggerParser from '@apidevtools/swagger-parser';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, '..');
const schemasDir = join(packageRoot, 'schemas');
const outputPath = join(packageRoot, 'generated', 'app-directory', 'appd.bundled.schema.json');
const contextSchemaPath = join(packageRoot, '..', 'fdc3-context', 'schemas', 'context', 'context.schema.json');

const schemaParserOptions = {
  resolve: {
    file: {
      canRead: true,
      read(file) {
        if (file.url.endsWith('context/context.schema.json')) {
          return readFileSync(contextSchemaPath, 'utf-8');
        }
        return readFileSync(file.url, 'utf-8');
      },
    },
  },
};

const bundled = await SwaggerParser.bundle(join(schemasDir, 'appd.schema.json'), schemaParserOptions);

if (JSON.stringify(bundled).includes('appDirectory/')) {
  throw new Error('Bundled appd.schema.json still contains external appDirectory references');
}

writeFileSync(outputPath, JSON.stringify(bundled, null, 2) + '\n');
console.log(`Wrote bundled App Directory OpenAPI schema to ${outputPath}`);
