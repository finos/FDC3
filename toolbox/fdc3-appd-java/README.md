# FDC3 APP Directory Reference Implementation - Java + Springboot

An application directory (appD) is a structured repository of information about apps that can be used in an FDC3-enabled desktop(more info [here](https://fdc3.finos.org)). In other words, it’s a convenient way of storing and managing metadata about apps in your ecosystem.

The application metadata stored in appD records may include: the app name, type, details about how to run the application, its icons, publisher, support contact details and so on. It may also include links to or embed manifest formats defined elsewhere, such as proprietary manifests for launching the app in a container product or a Web Application Manifest (as defined by the W3C).

All this information is readily available in one place and can be used both to populate a launcher or app catalog UI for your users, and by the Desktop Agent managing the apps on your desktop. In fact, if your desktop platform supports the FDC3 standard, appD is the primary way that the FDC3 Desktop Agent implementation should receive the details about apps available to run on your desktop. Conversely, if an app is not listed in appD, the Desktop Agent can’t ensure its participation in context sharing or use it to resolve intents.

## Foreword 

This is a reference implementation for app Directory implemented in Java and springboot.

The implementation is packaged with a sample App Directory JSON (src/main/resources/local.v2.json) to demo the functional APIs out of he bix We have also configured a sample user base to demo the authorization and authentication. The details for exeuting the API end points are given below.


## Try out on local machine

> Note : Required Java Version 17+.

1. Clone the repository to your local machine 

> mkdir FDC3 
>
> cd FDC3
> 
> git clone https://github.com/amanjmd/FINOS.git
> 

2. Install the Dependencies

> cd FINOS/fdc3-app-directory-java
> 
> mvn clean install 

3. Run the application

>java -jar target/*.jar
>

# Test the application
>curl --location 'http://localhost:8080/v2/apps' \
>
>--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWxpY2UifQ.2cfycMS2ZZlROOrhG23Dz8fxnq2AnW4dspC3agP2MMo' \
>
>--data ''


### API End points implemented 
1. /v2/apps
2. /v2/apps/{appId}


# Key Demos 

## Support for multiple Datasources 
This is implementation by default implementation for the JSON datasource . 
It can  be further extended using the "V2ApplicationReader" to provide the custom implementation for other datasources like releational , NoSQL etc.

## Support for authentication/ authorization 

This implementaiton further includes a simpler implementation of authentication and authorization . Here in ,  there are 2 valid users "alice", "bob" (user_db.json).

To run this application in local , we would require the JWT tokens . Below are the tokens for Alice and Bob , which needs to be sent in "Authorization" header. 

> Alice : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWxpY2UiLCJyb2xlIjoicG9ydGZvbGlvLW1hbmFnZXIifQ.iJk3t2bUjWQJ-CNaJ4dzzJ5AQfcjpb8oxq0epX9G8cg
> 
> Bob : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYm9iIiwicm9sZSI6ImVxdWl0eS1zZWxsLXRyYWRlciJ9.NLfQbFWUrOtiHEe_FpMsB3TK-DtJgLJdBrHwVNGbbIw
> 
> Key to generate token : mIU3RoraRfc8TF3ScboaF8lcQF0nb5gb
> 
> 
Note : In the enterprise implementation , there would be an IAM services in place to generate the token.Hence the UserManagementService can be modified accordingly.







