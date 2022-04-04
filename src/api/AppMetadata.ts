/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { Icon } from './Icon';

/**
 * Describes an application, or instance of an application, using metadata that is usually  provided by an FDC3 App Directory that the desktop agent connects to.
 *
 * Will always include at least a `name` property, which can be used with [`open`](DesktopAgent#open) and [`raiseIntent`](DesktopAgent#raiseIntent). If the `instanceId` field is set then the `AppMetadata` object represents a specific instance of the application that may be addressed using that Id.
 *
 * Optionally, extra information from the app directory can be returned, to aid in rendering UI elements, e.g. a context menu. This includes a title, description, tooltip and icon and image URLs.
 *
 * In situations where a desktop agent connects to multiple app directories or multiple versions of the same app exists in a single app directory, it may be neccessary to specify appId and version to target applications that share the same name.
 */
export interface AppMetadata {
  /** The unique app name that can be used with the open and raiseIntent calls. */
  readonly name: string;

  /** The unique application identifier located within a specific application directory instance. An example of an appId might be 'app@sub.root' */
  readonly appId?: string;

  /** The Version of the application. */
  readonly version?: string;

  /** An optional instance identifier, indicating that this object represents a specific instance of the application described.*/
  readonly instanceId?: string;

  /** An optional set of, implementation specific, metadata fields that can be used to disambiguate instances, such as a window title or screen position. Must only be set if `instanceId` is set. */
  readonly instanceMetadata?: Record<string, any>;

  /** A more user-friendly application title that can be used to render UI elements  */
  readonly title?: string;

  /**  A tooltip for the application that can be used to render UI elements */
  readonly tooltip?: string;

  /** A longer, multi-paragraph description for the application that could include markup */
  readonly description?: string;

  /** A list of icon URLs for the application that can be used to render UI elements */
  readonly icons?: Array<Icon>;

  /** A list of image URLs for the application that can be used to render UI elements */
  readonly images?: Array<string>;

  /** The type of output returned for any intent specified during resolution. May express a particular context type (e.g. "fdc3.instrument"), channel (e.g. "channel") or a channel that will receive a specified type (e.g. "channel<fdc3.instrument>"). */
  readonly resultType?: string | null;
}
