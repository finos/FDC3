/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

export enum OpenError {
  AppNotFound = 'AppNotFound',
  ErrorOnLaunch = 'ErrorOnLaunch',
  AppTimeout = 'AppTimeout',
  ResolverUnavailable = 'ResolverUnavailable',
}

export enum ResolveError {
  NoAppsFound = 'NoAppsFound',
  ResolverUnavailable = 'ResolverUnavailable',
  UserCancelled = 'UserCancelledResolution',
  ResolverTimeout = 'ResolverTimeout',
  TargetAppUnavailable = 'TargetAppUnavailable',
  TargetInstanceUnavailable = 'TargetInstanceUnavailable',
}

export enum DataError {
  NoDataReturned = 'NoDataReturned',
  IntentHandlerRejected = 'IntentHandlerRejected',
}

export enum ChannelError {
  NoChannelFound = 'NoChannelFound',
  AccessDenied = 'AccessDenied',
  CreationFailed = 'CreationFailed',
}
