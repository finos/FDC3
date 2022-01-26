---
id: overview
sidebar_label: App Directory Overview
title: App Directory Overview
hide_title: true
---

# App Directory Overview

An Application Directory (AppD) is a structured repository of information about apps that can be used in an FDC3-enabled desktop. In other words, it’s a convenient way of storing and managing metadata about apps in your ecosystem. 

The application metadata stored in appD includes the app name, type, details about how to run the application, its icons, publisher, support contact details and so on. All this information is readily available in one place and can be used both to populate a launcher or app catalog UI for your users , and by the desktop agent managing the apps on your desktop. In fact, if your smart desktop follows the FDC3 standard, appD is the primary way your desktop agent knows all the details about apps available to run on your desktop. Conversely, if an app is not listed in appD, the desktop agent can’t ensure its participation in context sharing or use it to resolve intents.


## Advantages 

Using appD offers many advantages both for the financial institutions running a smart desktop and for vendors that provide FDC3-compliant apps:


### For the user


#### Easier to find app info

AppD is the one place to collect all the information about apps. The more apps you have, the more you’ll appreciate the convenience of not having to chase down details about each. This is particularly important for large institutions with multiple desks.


#### Human readable

AppD has two kinds of users. One is the desktop agent, but the other is humans administrating and using the smart desktop at your organization. Hence, AppD contains information about apps in both machine- and  human-readable forms. For example, it includes both a unique identifier for the app that is used to refer to it in code and a human-friendly app name, icon, description and tooltip necessary to populate a launcher menu or app catalog user interface. 


#### Apps are discoverable

For large institutions, it can be difficult to keep track of all the apps (developed both in-house and by vendors), since a typical desktop could have many. Users can search appD to discover the apps they need. It may already reside on their system or be available to them over the internet, but if they don’t have a way to search the apps available to them, they won’t be able to find it. AppD provides a way for users to discover the apps they need.

AppD makes it possible to discover info about apps that reside on various domains, not just the one domain the appD itself is hosted on. In addition, you can find details about how to launch the apps in multiple, diverse environments. This is in sharp contrast to web app manifest, which is hosted on the same domain as the app, is limted to web apps, and is generally used to 'install' an app that the user has already accessed.


#### Updating apps

Typically, software evolves over time. The app versions you are running today will not be the same ones you need tomorrow. Therefore, you will need to upgrade apps periodically. Very few people look forward to upgrading, but appD and web deployment can make it easier for you. To roll out a new version of your  app, either update the existing entry for it in appD or add a new entry for that version (allowing users to select the version they will use).


#### Agent-agnostic

As a part of the FDC3 standard, appD isn't tied to any specific vendor. This is important, as it allows you more flexibility in that you are not tied to any specific container or desktop agent implementation. If at any point you want to switch to a different desktop agent, the process won’t be prohibitively difficult. The existing appD will work without any additional effort from you, as long as your new desktop agent is also FDC3-compliant. This is in contrast with proprietary solutions, where you would have to reconstruct the entire ecosystem from scratch. \
 \
AppD reduces fragmentation in the market and allows end-users more flexibility in what applications can be included in their desktop.


#### Intent resolution

AppD provides information to the Desktop Agent on which applications support particular intents and the context types they require as input to them. This allows the Desktop Agent to implement an intent resolver that can launch applications and pass the intent and context to them to operate on, supporting workflows between applications that didn't require prior bilateral agreements between the application providers.


### For an Application Provider

Until now, we've looked at appD from the perspective of a desktop owner and user. But appD also offers advantages to vendors who develop apps for the financial servicesdesktop.


#### Apps work well together out of the box

When your customers add your FDC3-compliant app to their desktop via an appD record accurately describing it, you can be sure that your app will interoperate with other apps that follow the FDC3 standard. You don’t have to do anything special, or arrange a bilateral agreement with anyone else. The benefit of the open standard is that any app that follows it will work well with any other compliant app.


#### Easy updates

As a vendor, you prefer for all your customers to run your latest software. However, many customers will postpone upgrades, sometimes for a long time, because upgrading is a pain. An advantage of a vencdor-hosted appD is that the configuration of app can be updated at any time and, if your customers need to choose when to upgrade, multiple versions of it made available, each with their own configuration. By making it easier for customers to update, you can drive better adoption.


### For the industry

AppD allows us to easily combine applications from various providers into one cohesive directory or to connect to directories from multiple providers (in standardized format) and provide a single view over them. This reduces fragmentation in the market, allows end-users more flexibility in what apps to include in their smart desktop, and obviates the need for vendors to provide application details in diverse formats or for their customers to work out these details for themselves.


## Sections to review

- [Application Directory Discovery](discovery.md) describes how to resolve the location of the Application Directory using an application identifier.
- [Application Directory Usage](usage.md) provides a simple view on how application directories can be used.  This also includes links to a reference implementation.
- [Application Directory specification](spec.md) is the interface definition required to support a compatible application directory.