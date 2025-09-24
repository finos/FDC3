package com.fdc.appd.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.annotation.Generated;

/**
 * The technology type that is used to launch and run the application.  Each application type implies a particular set of launch `details`. The supported types include:  - `web`: Web applications launched via a URL - `native`: Native applications pre-installed on a device and launch via a filesystem path - `citrix`: Apps virtualized via Citrix - `onlineNative`: Native apps that have an online launcher, e.g. online ClickOnce app deployments. - `other`: Used to represent apps that do not conform to or cannot be launched via the other types, and are likely to be defined solely by a hostManifest.  FDC3 Desktop Agents MUST support at least the `web` application type and MAY support any or all of the other types. 
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-11-10T19:40:14.622447+05:30[Asia/Kolkata]", comments = "Generator version: 7.8.0")
public enum Type {
  
  WEB("web"),
  
  NATIVE("native"),
  
  CITRIX("citrix"),
  
  ONLINE_NATIVE("onlineNative"),
  
  OTHER("other");

  private String value;

  Type(String value) {
    this.value = value;
  }

  @JsonValue
  public String getValue() {
    return value;
  }

  @Override
  public String toString() {
    return String.valueOf(value);
  }

  @JsonCreator
  public static Type fromValue(String value) {
    for (Type b : Type.values()) {
      if (b.value.equals(value)) {
        return b;
      }
    }
    throw new IllegalArgumentException("Unexpected value '" + value + "'");
  }
}

