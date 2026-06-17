// To parse this data:
//
//   import { Convert, AllApplicationsResponse, Application } from "./file";
//
//   const allApplicationsResponse = Convert.toAllApplicationsResponse(json);
//   const application = Convert.toApplication(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AllApplicationsResponseObject {
  /**
   * List of applications
   */
  applications?: Application[];
  /**
   * Response message providing status of query
   */
  message?: string;
  [property: string]: any;
}

/**
 * Defines an application retrieved from an FDC3 App Directory, which can then be launched.
 * Launching typically means running for a user on a desktop. The details around 'launching'
 * including who or what might do it, and how the launch action is initiated are discussed
 * elsewhere in the FDC3 App Directory spec.
 *
 * Defines an application retrieved from an FDC3 App Directory.
 */
export interface Application {
  /**
   * The unique application identifier located within a specific application directory
   * instance.
   */
  appId: string;
  /**
   * Title for the application, typically used in a launcher UI.
   */
  title: string;
  type: Type;
  details: LaunchDetails;
  /**
   * An array of string categories that describe the application. These are meant as a hint to
   * catalogs or stores listing FDC3-enabled apps and it is expected that these will make a
   * best effort to find appropriate categories (or category) under which to list the app.
   * AppD record authors are encouraged to use lower-case and, where possible, to select
   * categories from the following list:
   *
   * - allocations
   * - analytics
   * - charts
   * - chat
   * - communication
   * - compliance
   * - crm
   * - developer tools
   * - events
   * - execution management
   * - file sharing
   * - market data
   * - news
   * - networking
   * - office apps
   * - order management
   * - other
   * - portfolio management
   * - presentation
   * - pricing
   * - productivity
   * - research
   * - risk
   * - screen sharing
   * - security
   * - spreadsheet
   * - trade cost analysis
   * - trading system
   * - training
   * - travel
   * - video
   * - visualization
   * - weather
   */
  categories?: string[];
  /**
   * Optional e-mail to receive queries about the application
   */
  contactEmail?: string;
  /**
   * An optional set of name value pairs that can be used to deliver custom data from an App
   * Directory to a launcher. Deprecated due to a lack of a standard means of retrieval via
   * the Desktop Agent API. To be replaced in a future version with an `applicationConfig`
   * element and standard API to retrieve it. See issue
   * [#1006](https://github.com/finos/FDC3/issues/1006) for details.
   */
  customConfig?: Array<any[] | boolean | number | number | null | NameValuePairObject | string>;
  /**
   * Description of the application. This will typically be a 1-2 paragraph style blurb about
   * the application.
   */
  description?: string;
  hostManifests?: { [key: string]: { [key: string]: any } | string };
  /**
   * Holds Icons used for the application, a Launcher may be able to use multiple Icon sizes
   * or there may be a 'button' Icon
   */
  icons?: Icon[];
  interop?: Interop;
  /**
   * A language tag that specifies the primary language of both the application and its AppD
   * entry, as defined by IETF RFC 5646.
   */
  lang?: string;
  /**
   * Optional URL that provides more information about the application
   */
  moreInfo?: string;
  /**
   * Deprecated in favour of using `appId` to identify apps and `title` for their display
   * names. The name of the application. The name should be unique within an FDC3 App
   * Directory instance. The exception to the uniqueness constraint is that an App Directory
   * can hold definitions for multiple versions of the same app. The same appName could occur
   * in other directories. We are not currently specifying app name conventions in the
   * document.
   */
  name?: string;
  /**
   * The name of the company that owns the application. The publisher has control over their
   * namespace/app/signature.
   */
  publisher?: string;
  /**
   * Array of images to show the user when they are looking at app description. Each image can
   * have an optional description/tooltip
   */
  screenshots?: Image[];
  /**
   * Optional e-mail to receive support requests for the application
   */
  supportEmail?: string;
  /**
   * Optional tooltip description e.g. for a launcher
   */
  tooltip?: string;
  /**
   * Version of the application. This allows multiple app versions to be defined using the
   * same app name. This can be a triplet but can also include things like 1.2.5 (BETA)
   */
  version?: string;
  localizedVersions?: { [key: string]: any[] | boolean | number | number | null | BaseApplicationObject | string };
  [property: string]: any;
}

export interface NameValuePairObject {
  /**
   * name
   */
  name?: string;
  /**
   * value
   */
  value?: string;
  [property: string]: any;
}

/**
 * The type specific launch details of the application. These details are intended to be
 * vendor-agnostic and MAY be duplicated or overridden by details provided in the
 * hostManifests object for a specific host.
 *
 * Properties used to launch apps with `type: web`.
 *
 * Properties used to launch apps with `type: native` that are already installed on the
 * device.
 *
 * Properties used to launch apps virtualized apps with `type: citrix`.
 *
 * Properties used to launch a native apps with `type: onlineNative` that have an online
 * launcher, e.g. online ClickOnce app deployments.
 *
 * Apps with `type: other` are defined by a hostManifest and do not require other details.
 */
export interface LaunchDetails {
  /**
   * Application start URL.
   *
   * Application URL.
   */
  url?: string;
  /**
   * Arguments that must be passed on the command line to launch the app in the expected
   * configuration.
   */
  arguments?: string;
  /**
   * The path on disk from which the application is launched.
   */
  path?: string;
  /**
   * The Citrix alias / name of the virtual app (passed to the Citrix SelfService qlaunch
   * parameter).
   */
  alias?: string;
}

/**
 * Describes an Icon image that may be used to represent the application.
 */
export interface Icon {
  /**
   * The icon dimension, formatted as `<height>x<width>`.
   */
  size?: string;
  /**
   * The icon url.
   */
  src: string;
  /**
   * Icon media type. If not present the Desktop Agent may use the src file extension.
   */
  type?: string;
}

/**
 * Metadata that describes how the application uses FDC3 APIs. This metadata serves multiple
 * purposes:
 *
 * - It supports intent resolution by a desktop agent, by declaring what intents an app
 * listens for.
 * - It may be used, for example in an app catalog UI, to find apps that 'interoperate with'
 * other apps.
 * - It provides a standard location to document how the app interacts with user channels,
 * app channels, and intents, for use by other app developers and desktop assemblers.
 */
export interface Interop {
  /**
   * Describes the application's use of App Channels.
   *
   * This metadata is not currently used by the desktop agent, but is provided to help find
   * apps that will interoperate with this app and to document API interactions for use by
   * other app developers.
   */
  appChannels?: AppChannel[];
  /**
   * Describes the app's interactions with intents.
   */
  intents?: Intents;
  /**
   * Describes the application's use of context types on User Channels.
   *
   * This metadata is not currently used by the desktop agent, but is provided to help find
   * apps that will interoperate with this app and to document API interactions for use by
   * other app developers.
   */
  userChannels?: UserChannels;
  [property: string]: any;
}

export interface AppChannel {
  /**
   * Context type names that are broadcast by the application on the channel.
   */
  broadcasts?: string[];
  /**
   * A description of how the channel is used.
   */
  description?: string;
  /**
   * The id of the App Channel. N.b. in FDC3 2.0 this field was incorrectly called `name`.
   */
  id: string;
  /**
   * Context type names that the application listens for on the channel.
   */
  listensFor?: string[];
  [property: string]: any;
}

/**
 * Describes the app's interactions with intents.
 */
export interface Intents {
  /**
   * A mapping of Intents names that an app listens for via `fdc3.addIntentListener()` to
   * their configuration.
   *
   * Used to support intent resolution by desktop agents. Replaces the `intents` element used
   * in appD records prior to FDC3 2.0.
   */
  listensFor?: { [key: string]: any[] | boolean | number | number | null | IntentObject | string };
  /**
   * A mapping of Intent names that an app raises (via `fdc3.raiseIntent`) to an array of
   * context type names that it may be raised with.
   *
   * Use the intent name "any" to represent use of the `fdc3.raiseIntentForContext` and
   * `fdc3.findIntentForContext` functions, which allow the user to select from intents
   * available for a specified context type.
   *
   * This metadata is not currently used by the desktop agent, but is provided to help find
   * apps that will interoperate with this app and to document API interactions for use by
   * other app developers.
   */
  raises?: { [key: string]: string[] };
  [property: string]: any;
}

export interface IntentObject {
  /**
   * A comma separated list of the types of contexts the intent offered by the application can
   * process, where the first part of the context type is the namespace e.g."fdc3.contact,
   * org.symphony.contact"
   */
  contexts: string[];
  /**
   * Custom configuration for the intent that may be required for a particular desktop agent.
   * Deprecated due to a lack of defined use cases.
   */
  customConfig?: { [key: string]: any };
  /**
   * Optional display name for the intent. Deprecated in favour of the intent name, which is
   * common amongst all apps that support it, where the display name may vary as it is defined
   * in the app's AppD record.
   */
  displayName?: string;
  /**
   * An optional type for output returned by the application, if any, when resolving this
   * intent. May indicate a context type by type name (e.g. "fdc3.instrument"), a channel
   * (e.g. "channel") or a combination that indicates a channel that returns a particular
   * context type (e.g. "channel<fdc3.instrument>").
   */
  resultType?: string;
  [property: string]: any;
}

/**
 * Describes the application's use of context types on User Channels.
 *
 * This metadata is not currently used by the desktop agent, but is provided to help find
 * apps that will interoperate with this app and to document API interactions for use by
 * other app developers.
 */
export interface UserChannels {
  /**
   * Context type names that are broadcast by the application.
   */
  broadcasts?: string[];
  /**
   * Context type names that the application listens for.
   */
  listensFor?: string[];
  [property: string]: any;
}

export interface BaseApplicationObject {
  /**
   * The unique application identifier located within a specific application directory
   * instance.
   */
  appId?: string;
  /**
   * An array of string categories that describe the application. These are meant as a hint to
   * catalogs or stores listing FDC3-enabled apps and it is expected that these will make a
   * best effort to find appropriate categories (or category) under which to list the app.
   * AppD record authors are encouraged to use lower-case and, where possible, to select
   * categories from the following list:
   *
   * - allocations
   * - analytics
   * - charts
   * - chat
   * - communication
   * - compliance
   * - crm
   * - developer tools
   * - events
   * - execution management
   * - file sharing
   * - market data
   * - news
   * - networking
   * - office apps
   * - order management
   * - other
   * - portfolio management
   * - presentation
   * - pricing
   * - productivity
   * - research
   * - risk
   * - screen sharing
   * - security
   * - spreadsheet
   * - trade cost analysis
   * - trading system
   * - training
   * - travel
   * - video
   * - visualization
   * - weather
   */
  categories?: string[];
  /**
   * Optional e-mail to receive queries about the application
   */
  contactEmail?: string;
  /**
   * An optional set of name value pairs that can be used to deliver custom data from an App
   * Directory to a launcher. Deprecated due to a lack of a standard means of retrieval via
   * the Desktop Agent API. To be replaced in a future version with an `applicationConfig`
   * element and standard API to retrieve it. See issue
   * [#1006](https://github.com/finos/FDC3/issues/1006) for details.
   */
  customConfig?: Array<any[] | boolean | number | number | null | NameValuePairObject | string>;
  /**
   * Description of the application. This will typically be a 1-2 paragraph style blurb about
   * the application.
   */
  description?: string;
  details?: LaunchDetails;
  hostManifests?: { [key: string]: { [key: string]: any } | string };
  /**
   * Holds Icons used for the application, a Launcher may be able to use multiple Icon sizes
   * or there may be a 'button' Icon
   */
  icons?: Icon[];
  interop?: Interop;
  /**
   * A language tag that specifies the primary language of both the application and its AppD
   * entry, as defined by IETF RFC 5646.
   */
  lang?: string;
  /**
   * Optional URL that provides more information about the application
   */
  moreInfo?: string;
  /**
   * Deprecated in favour of using `appId` to identify apps and `title` for their display
   * names. The name of the application. The name should be unique within an FDC3 App
   * Directory instance. The exception to the uniqueness constraint is that an App Directory
   * can hold definitions for multiple versions of the same app. The same appName could occur
   * in other directories. We are not currently specifying app name conventions in the
   * document.
   */
  name?: string;
  /**
   * The name of the company that owns the application. The publisher has control over their
   * namespace/app/signature.
   */
  publisher?: string;
  /**
   * Array of images to show the user when they are looking at app description. Each image can
   * have an optional description/tooltip
   */
  screenshots?: Image[];
  /**
   * Optional e-mail to receive support requests for the application
   */
  supportEmail?: string;
  /**
   * Title for the application, typically used in a launcher UI.
   */
  title?: string;
  /**
   * Optional tooltip description e.g. for a launcher
   */
  tooltip?: string;
  type?: Type;
  /**
   * Version of the application. This allows multiple app versions to be defined using the
   * same app name. This can be a triplet but can also include things like 1.2.5 (BETA)
   */
  version?: string;
  [property: string]: any;
}

/**
 * Describes an image file, typically a screenshot, that often represents the application in
 * a common usage scenario.
 */
export interface Image {
  /**
   * Caption for the image.
   */
  label?: string;
  /**
   * The image dimension, formatted as `<height>x<width>`.
   */
  size?: string;
  /**
   * The image url.
   */
  src: string;
  /**
   * Image media type. If not present the Desktop Agent may use the src file extension.
   */
  type?: string;
}

/**
 * The technology type that is used to launch and run the application. Each application type
 * implies a particular set of launch `details`.
 * The supported types include:
 *
 * - `web`: Web applications launched via a URL
 * - `native`: Native applications pre-installed on a device and launch via a filesystem
 * path
 * - `citrix`: Apps virtualized via Citrix
 * - `onlineNative`: Native apps that have an online launcher, e.g. online ClickOnce app
 * deployments.
 * - `other`: Used to represent apps that do not conform to or cannot be launched via the
 * other types, and are likely to be defined solely by a hostManifest.
 *
 * FDC3 Desktop Agents MUST support at least the `web` application type and MAY support any
 * or all of the other types.
 */
export type Type = 'web' | 'native' | 'citrix' | 'onlineNative' | 'other';

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toAllApplicationsResponse(
    json: string
  ): any[] | boolean | number | number | null | AllApplicationsResponseObject | string {
    return cast(JSON.parse(json), u(a('any'), true, 3.14, 0, null, r('AllApplicationsResponseObject'), ''));
  }

  public static allApplicationsResponseToJson(
    value: any[] | boolean | number | number | null | AllApplicationsResponseObject | string
  ): string {
    return JSON.stringify(
      uncast(value, u(a('any'), true, 3.14, 0, null, r('AllApplicationsResponseObject'), '')),
      null,
      2
    );
  }

  public static toApplication(json: string): Application {
    return cast(JSON.parse(json), r('Application'));
  }

  public static applicationToJson(value: Application): string {
    return JSON.stringify(uncast(value, r('Application')), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : '';
  const keyText = key ? ` for key "${key}"` : '';
  throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`;
    } else {
      return `one of [${typ
        .map(a => {
          return prettyTypeName(a);
        })
        .join(', ')}]`;
    }
  } else if (typeof typ === 'object' && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(
      cases.map(a => {
        return l(a);
      }),
      val,
      key,
      parent
    );
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l('array'), val, key, parent);
    return val.map(el => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue(l('Date'), val, key, parent);
    }
    return d;
  }

  function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue(l(ref || 'object'), val, key, parent);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach(key => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    });
    Object.getOwnPropertyNames(val).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    });
    return result;
  }

  if (typ === 'any') return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === 'object' && typ.ref !== undefined) {
    ref = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty('arrayItems')
        ? transformArray(typ.arrayItems, val)
        : typ.hasOwnProperty('props')
          ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  AllApplicationsResponseObject: o(
    [
      { json: 'applications', js: 'applications', typ: u(undefined, a(r('Application'))) },
      { json: 'message', js: 'message', typ: u(undefined, '') },
    ],
    'any'
  ),
  Application: o(
    [
      { json: 'appId', js: 'appId', typ: '' },
      { json: 'title', js: 'title', typ: '' },
      { json: 'type', js: 'type', typ: r('Type') },
      { json: 'details', js: 'details', typ: r('LaunchDetails') },
      { json: 'categories', js: 'categories', typ: u(undefined, a('')) },
      { json: 'contactEmail', js: 'contactEmail', typ: u(undefined, '') },
      {
        json: 'customConfig',
        js: 'customConfig',
        typ: u(undefined, a(u(a('any'), true, 3.14, 0, null, r('NameValuePairObject'), ''))),
      },
      { json: 'description', js: 'description', typ: u(undefined, '') },
      { json: 'hostManifests', js: 'hostManifests', typ: u(undefined, m(u(m('any'), ''))) },
      { json: 'icons', js: 'icons', typ: u(undefined, a(r('Icon'))) },
      { json: 'interop', js: 'interop', typ: u(undefined, r('Interop')) },
      { json: 'lang', js: 'lang', typ: u(undefined, '') },
      { json: 'moreInfo', js: 'moreInfo', typ: u(undefined, '') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'publisher', js: 'publisher', typ: u(undefined, '') },
      { json: 'screenshots', js: 'screenshots', typ: u(undefined, a(r('Image'))) },
      { json: 'supportEmail', js: 'supportEmail', typ: u(undefined, '') },
      { json: 'tooltip', js: 'tooltip', typ: u(undefined, '') },
      { json: 'version', js: 'version', typ: u(undefined, '') },
      {
        json: 'localizedVersions',
        js: 'localizedVersions',
        typ: u(undefined, m(u(a('any'), true, 3.14, 0, null, r('BaseApplicationObject'), ''))),
      },
    ],
    'any'
  ),
  NameValuePairObject: o(
    [
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'value', js: 'value', typ: u(undefined, '') },
    ],
    'any'
  ),
  LaunchDetails: o(
    [
      { json: 'url', js: 'url', typ: u(undefined, '') },
      { json: 'arguments', js: 'arguments', typ: u(undefined, '') },
      { json: 'path', js: 'path', typ: u(undefined, '') },
      { json: 'alias', js: 'alias', typ: u(undefined, '') },
    ],
    false
  ),
  Icon: o(
    [
      { json: 'size', js: 'size', typ: u(undefined, '') },
      { json: 'src', js: 'src', typ: '' },
      { json: 'type', js: 'type', typ: u(undefined, '') },
    ],
    false
  ),
  Interop: o(
    [
      { json: 'appChannels', js: 'appChannels', typ: u(undefined, a(r('AppChannel'))) },
      { json: 'intents', js: 'intents', typ: u(undefined, r('Intents')) },
      { json: 'userChannels', js: 'userChannels', typ: u(undefined, r('UserChannels')) },
    ],
    'any'
  ),
  AppChannel: o(
    [
      { json: 'broadcasts', js: 'broadcasts', typ: u(undefined, a('')) },
      { json: 'description', js: 'description', typ: u(undefined, '') },
      { json: 'id', js: 'id', typ: '' },
      { json: 'listensFor', js: 'listensFor', typ: u(undefined, a('')) },
    ],
    'any'
  ),
  Intents: o(
    [
      {
        json: 'listensFor',
        js: 'listensFor',
        typ: u(undefined, m(u(a('any'), true, 3.14, 0, null, r('IntentObject'), ''))),
      },
      { json: 'raises', js: 'raises', typ: u(undefined, m(a(''))) },
    ],
    'any'
  ),
  IntentObject: o(
    [
      { json: 'contexts', js: 'contexts', typ: a('') },
      { json: 'customConfig', js: 'customConfig', typ: u(undefined, m('any')) },
      { json: 'displayName', js: 'displayName', typ: u(undefined, '') },
      { json: 'resultType', js: 'resultType', typ: u(undefined, '') },
    ],
    'any'
  ),
  UserChannels: o(
    [
      { json: 'broadcasts', js: 'broadcasts', typ: u(undefined, a('')) },
      { json: 'listensFor', js: 'listensFor', typ: u(undefined, a('')) },
    ],
    'any'
  ),
  BaseApplicationObject: o(
    [
      { json: 'appId', js: 'appId', typ: u(undefined, '') },
      { json: 'categories', js: 'categories', typ: u(undefined, a('')) },
      { json: 'contactEmail', js: 'contactEmail', typ: u(undefined, '') },
      {
        json: 'customConfig',
        js: 'customConfig',
        typ: u(undefined, a(u(a('any'), true, 3.14, 0, null, r('NameValuePairObject'), ''))),
      },
      { json: 'description', js: 'description', typ: u(undefined, '') },
      { json: 'details', js: 'details', typ: u(undefined, r('LaunchDetails')) },
      { json: 'hostManifests', js: 'hostManifests', typ: u(undefined, m(u(m('any'), ''))) },
      { json: 'icons', js: 'icons', typ: u(undefined, a(r('Icon'))) },
      { json: 'interop', js: 'interop', typ: u(undefined, r('Interop')) },
      { json: 'lang', js: 'lang', typ: u(undefined, '') },
      { json: 'moreInfo', js: 'moreInfo', typ: u(undefined, '') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'publisher', js: 'publisher', typ: u(undefined, '') },
      { json: 'screenshots', js: 'screenshots', typ: u(undefined, a(r('Image'))) },
      { json: 'supportEmail', js: 'supportEmail', typ: u(undefined, '') },
      { json: 'title', js: 'title', typ: u(undefined, '') },
      { json: 'tooltip', js: 'tooltip', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: u(undefined, r('Type')) },
      { json: 'version', js: 'version', typ: u(undefined, '') },
    ],
    'any'
  ),
  Image: o(
    [
      { json: 'label', js: 'label', typ: u(undefined, '') },
      { json: 'size', js: 'size', typ: u(undefined, '') },
      { json: 'src', js: 'src', typ: '' },
      { json: 'type', js: 'type', typ: u(undefined, '') },
    ],
    false
  ),
  Type: ['citrix', 'native', 'onlineNative', 'other', 'web'],
};
