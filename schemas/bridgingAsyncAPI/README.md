# Agent Bridging AsyncAPI schema

This folder contains an AsyncAPI schema that may be used to generate clients and server stubs for Desktop Agent Bridging. It is based on references to the JSON schema files that define the various messages in the adjacent schemas/bridging folder.

Example commands to generate code from the AsyncAPI schema:
(run from the root of your FDC3 checkout)

First run:

```ps
npm install -g @asyncapi/generator
```

Then:

- .NET

    ```ps
    ag --install schemas/bridgingAsyncAPI/bridgingAsyncAPI.json @asyncapi/dotnet-nats-template -o ../some/path/outside/FDC3/folder
    ```

- Node.js

     ```ps
     ag --install schemas/bridgingAsyncAPI/bridgingAsyncAPI.json @asyncapi/nodejs-ws-template -o ../some/path/outside/FDC3/folder -p server=local
     ```

- Markdown

     ```ps
     ag --install schemas/bridgingAsyncAPI/bridgingAsyncAPI.json @asyncapi/markdown-template -o ../some/path/outside/FDC3/folder 
     ```

- HTML

    ```ps
    ag --install schemas/bridgingAsyncAPI/bridgingAsyncAPI.json @asyncapi/html-template -o ../some/path/outside/FDC3/folder 
    ```
