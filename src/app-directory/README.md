# Application Directory API -- THIS IS NOT A RATIFIED FDC3 API or SPECIFICATION

**This is NOT a ratified API or specification but rather a tool to evaluate both the use cases and technology implementations.**
[View FULL SPECIFICATION HERE](https://fdc3-app-directory.finos.org/)

## Overview
This project is a POC focused on creation of an Application Directory API as defined through initial proposals and
ongoing discussions in the Application Directory FDC3 working group.  The purpose of this POC is to:
* Define an intial interface through an OpenAPI sepcification
* Start to ratify schema/models
* Generate example server stubs for java and nodejs
* Generate example client binding for java

[View it in a nice swagger editor](https://editor.swagger.io/?url=https://raw.githubusercontent.com/FDC3/appd-api/master/specification/appd.yaml)

## Build

Compilation requires **jdk 8+** and **maven**

Build:

    #git clone..*:
    #cd cloned_directory
    #mvn clean install package


## Directory structure

*  **appd-api/specification**:
    Contains the OpenAPI specification for interfaces and models.
    [View it here](https://editor.swagger.io/?url=https://raw.githubusercontent.com/FDC3/appd-api/master/specification/appd.yaml)
*  **appd-api/appd-java-server-stubs**:
    Contains the generated java server stubs (jaxrs/Jersey2) which the application server implements.  After build, you can reference the stubs using the following dependency.
     ```
     <dependency>
        <groupId>org.fdc3.appd</groupId>
        <artifactId>appd-server-stubs</artifactId>
        <version>0.0.1-SNAPSHOT</version>
     </dependency>
     ```
* **appd-api/appd-nodejs-server-stubs**:
    Contains the generated nodejs server stubs.
* **appd-api/appd-jersey-client**:
    Contains a java (jersey2) client binding to the application directory


## Example implementation

Please see the [Application Directory POC](https://github.com/FDC3/appd-poc) for an implementation of the specification.

*END*
