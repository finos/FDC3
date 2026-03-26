/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import React, { useEffect, useRef, useState } from 'react';
import JSONEditor, { JSONEditorOptions, ParseError, SchemaValidationError } from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import { Theme } from '@mui/material/styles';
import { Box } from '@mui/material';

interface JsonInputProps {
  json?: object | null;
  schemaUrl?: URL | null;
  schema?: object | null;
  onJsonError?: (errors: Array<string>) => void;
  readOnly?: boolean;
  onChange: (value: any) => void;
  error?: string | false;
}

const classes = {
  root: (theme: Theme) => ({
    position: 'relative',
    flexGrow: 1,
    padding: theme.spacing(1),
    border: `1px solid #0086bf`,
    borderRadius: theme.shape.borderRadius,
    '& .jsoneditor': {
      border: 'none',
    },
    '& .ace-jsoneditor .ace_gutter': {
      backgroundColor: 'transparent',
    },
    '& .ace-jsoneditor .ace_gutter-active-line': {
      backgroundColor: theme.palette.grey['200'],
    },
    '& .ace-jsoneditor .ace_marker-layer .ace_active-line': {
      backgroundColor: theme.palette.grey['200'],
    },
  }),
  jsonInput: {
    height: '270px',
  },
  errorText: (theme: Theme) => ({
    bottom: '-8px',
    padding: theme.spacing(0, 0.5),
    fontSize: '0.75rem',
    position: 'absolute',
    backgroundColor: '#fff',
    color: theme.palette.error.main,
  }),
} as const;

export const JsonInput: React.FC<JsonInputProps> = (props: JsonInputProps) => {
  const [jsoneditor, setJsoneditor] = useState<JSONEditor>();
  const container = useRef<HTMLDivElement>(null);
  const initialSettings: JSONEditorOptions = {
    mode: 'code',
    mainMenuBar: false,
    statusBar: false,
    indentation: 2,
    onChangeText: (text: string) => {
      if (text === '') {
        props.onChange(null);
      } else {
        try {
          props.onChange(JSON.parse(text));
        } catch (e) {}
      }
    },
    onValidationError: (error: readonly (SchemaValidationError | ParseError)[]) => {
      if (props.onJsonError) {
        if (error.length > 0) {
          const errorMsg: string = error[0].type === 'error' ? 'Bad json format' : "Json doesn't match the schema";
          props.onJsonError([errorMsg]);
        } else {
          props.onJsonError([]);
        }
      }
    },
  };

  useEffect(() => {
    (async () => {
      const options: JSONEditorOptions = { ...initialSettings };

      if (container.current) {
        if (props.schema) {
          try {
            options.schema = await $RefParser.dereference(props.schema, {
              dereference: {
                circular: true,
              },
            });
          } catch (err) {
            console.error(err);
          }
        }

        if (props.schemaUrl) {
          try {
            options.schema = await $RefParser.dereference(props.schemaUrl.href, {
              dereference: {
                circular: true,
              },
            });
          } catch (err) {
            console.error(err);
          }
        }

        const editor = new JSONEditor(container.current, options, props.json);

        setJsoneditor(editor);
      }
    })();

    return jsoneditor?.destroy;
  }, []);

  useEffect(() => {
    if (props.schema) {
      jsoneditor?.setSchema(props.schema);
    }
  }, [props.schema]);

  useEffect(() => {
    (async () => {
      if (props.schemaUrl) {
        try {
          const schema = await $RefParser.dereference(props.schemaUrl.href, {
            dereference: {
              circular: true,
            },
          });

          jsoneditor?.setSchema(schema);
        } catch (err) {
          console.error(err);
        }
      }
    })();
  }, [props.schemaUrl]);

  useEffect(() => {
    if (jsoneditor && (props.json || props.json === null)) {
      if (props.json === null) {
        jsoneditor.set({});
      } else {
        jsoneditor.set(props.json);
      }
    }
  }, [props.json, jsoneditor]);

  return (
    <Box sx={classes.root} tabIndex={0}>
      <Box sx={classes.jsonInput} ref={container} />
      {!!props.error && <Box sx={classes.errorText}>{props.error}</Box>}
    </Box>
  );
};
