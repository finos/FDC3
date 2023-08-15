/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { AppIdentifier } from './AppIdentifier';
import { Icon } from './Icon';
import { Image } from './Image';

/**
 * Extends an `AppIdentifier`, describing an application or instance of an application, with additional descriptive metadata that is usually provided by an FDC3 App Directory that the desktop agent connects to.
 *
 * The additional information from an app directory can aid in rendering UI elements, such as a launcher menu or resolver UI. This includes a title, description, tooltip and icon and screenshot URLs.
 *
 * Note that as `AppMetadata` instances are also `AppIdentifiers` they may be passed to the `app` argument of `fdc3.open`, `fdc3.raiseIntent` etc.
 */
export interface AppMetadata extends AppIdentifier {
  /** 
      The 'friendly' app name. 
      This field was used with the `open` and `raiseIntent` calls in FDC3 <2.0, which now require an `AppIdentifier` wth `appId` set. 
      Note that for display purposes the `title` field should be used, if set, in preference to this field.
   */
  readonly name?: string;

  /** The Version of the application. */
  readonly version?: string;

  /** An optional set of, implementation specific, metadata fields that can be used to disambiguate instances, such as a window title or screen position. Must only be set if `instanceId` is set. */
  readonly instanceMetadata?: { [key: string]: any };

  /** A more user-friendly application title that can be used to render UI elements  */
  readonly title?: string;

  /**  A tooltip for the application that can be used to render UI elements */
  readonly tooltip?: string;

  /** A longer, multi-paragraph description for the application that could include markup */
  readonly description?: string;

  /** A list of icon URLs for the application that can be used to render UI elements */
  readonly icons?: Array<Icon>;

  /** Images representing the app in common usage scenarios that can be used to render UI elements  */
  readonly screenshots?: Array<Image>;

  /** The type of output returned for any intent specified during resolution. May express a particular context type (e.g. "fdc3.instrument"), channel (e.g. "channel") or a channel that will receive a specified type (e.g. "channel<fdc3.instrument>"). */
  readonly resultType?: string | null;
}
