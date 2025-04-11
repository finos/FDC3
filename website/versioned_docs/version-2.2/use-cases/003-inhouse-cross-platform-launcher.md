---
id: uc-3
title: "Use Case 3: Inhouse Cross Platform Launcher"
sidebar_label: 3. Inhouse Cross Platform Launcher
layout: use_case
---

## Preconditions
The user wants a single launch pad / toolbar to access my applications and which can also provide the primary UI access point for notifications and alerts.
On the desktop this user will typically have:
- In house, container hosted, applications.
- 3rd party container hosted applications.
- In house applications written in .Net which are installed onto the user' desktops using inhouse installers.
- Applications from a 3rd parties including e-mail applications and Desktop terminal applications


## Workflow 1
The launcher is started by the user, or automatically run after login, in order to provide access to Applications.

The launcher may prompts the user to logon using the Enterprise's SSO system, which may be different to the Desktop login.

The launcher has a list of Application Directory URLs  it is configured to connect to, and passes the logged on user name and SSO identity/cookie of the logged in user to each App Directory as part of its sign on.
NB It is possible that some of the systems used may ignore the SSO login and may prompt for their own login identity, however by having a first login in the launcher and sharing those details the user may avoid multiple logins to the same Identity system.


The In-House app directory holding details of the in-house applications uses this identity and internal entitlement information to define what applications this user is permissioned to run. This is reflected in the list of applications the App Directory presents to the user.

## Workflow 2
When the Launcher runs an in-house application, the Launcher should provide details of the logged on user including the SSO identity/cookie to the apps as they are launched to avoid forcing the user to repeatedly sign on.

NB The use case is not saying that SSO is part of the FDC3 interfaces but that mechanisms should be defined to allow any SSO information to be passed to App Directories and App Launchers who are free to use this information if appropriate.

## Workflow 3
The launcher starts a container based application using the container selected by the Enterprise. The selection of the container has been built into the Launcher design.

## Workflow 4
The Launcher starts a desktop exe. The exe has been defined by the one of the App Directories and includes the path to the installed application.

There is no attempt to install desktop applications for which the user is permissioned but which have not been installed, instead the launcher may show a 'failed to start' error message of some kind.

## Workflow 5
The Launcher runs an application from a 3rd party vendor such as a Desktop terminal application.
NB These 'Desktop terminal applications' typically support tens or even hundreds of different window types which are referred to here as FDC3 Applications even when they are hosted in a single Desktop Application.

## Workflow 6
One or more FDC3 Platforms offer save and restore layout functions. The Layout save and restore functionality is available from the The Launcher.  The Enterprise may also make  'standard' pre-built layouts available to users. The layouts made available depend on the user's role.

## Workflow 7
As a User with a sales focus, many of the applications I run are related to a client (aka a customer or prospect of my organisation) and I want to launch applications with a customer pre-selected, rather than being forced to select the customer (aka Client) in the application. Therefore the Launcher provides a Client search capability that allows selection of a customer or prospect from an in-house client databases and/or CRM system.

## Workflow 8
As a User with a trading focus, I have a similar requirement to Workflow 7, but instead I want to Select an Instrument.
