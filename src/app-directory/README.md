# FDC3 Application Directory API

## Overview
This folder contains the FDC3 Application Directory specification as defined through initial proposals and
ongoing discussions in the FDC3 Standards Working Group.  

The purpose of the Application Directory specification within FDC3 is to:
* Define a REST application directory interface through an OpenAPI specification
* Ratify related schemas and models
* Generate example server stubs for Java and NodeJS
* Generate example client bindings for Java

## Specification

* [View the OpenAPI Specification in Swagger](https://editor.swagger.io/?url=https://fdc3.finos.org/schemas/1.1/app-directory.yaml)
* [More about the Specification on the FDC3 Website](https://fdc3.finos.org/docs/1.1/app-directory/overview)


## Directory structure

*  **`app-directory/specification`**:
    Contains the OpenAPI specification for interfaces and models.
    [View it here](./specification/appd.yaml)

*  **`app-directory/appd-java-server-stubs`**:
    Contains the generated java server stubs (jaxrs/Jersey2) which the application server implements.  After build, you can reference the stubs using the following dependency.
     ```xml
     <dependency>
        <groupId>org.fdc3.appd</groupId>
        <artifactId>appd-server-stubs</artifactId>
        <version>0.0.1-SNAPSHOT</version>
     </dependency>
     ```
* **`app-directory/appd-nodejs-server-stubs`**:
    Contains the generated nodejs server stubs.
* **`app-directory/appd-jersey-client`**:
    Contains a java (jersey2) client binding to the application directory

## Build

Compilation requires **jdk 8+** and **maven**.

Build:

```
cd src/app-directory
mvn clean install package
```

## Example implementation

 Please see the [Application Directory POC](https://github.com/FDC3/appd-poc) for an example implementation of the specification.
