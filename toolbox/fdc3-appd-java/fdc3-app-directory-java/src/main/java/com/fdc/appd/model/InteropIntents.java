package com.fdc.appd.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeName;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Describes the app&#39;s interactions with intents.
 */

@Schema(name = "Interop_intents", description = "Describes the app's interactions with intents.")
@JsonTypeName("Interop_intents")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-11-10T19:40:14.622447+05:30[Asia/Kolkata]", comments = "Generator version: 7.8.0")
public class InteropIntents {

  @Valid
  private Map<String, Intent> listensFor = new HashMap<>();

  @Valid
  private Map<String, Intent> raises = new HashMap<>();

  public InteropIntents listensFor(Map<String, Intent> listensFor) {
    this.listensFor = listensFor;
    return this;
  }

  public InteropIntents putListensForItem(String key, Intent listensForItem) {
    if (this.listensFor == null) {
      this.listensFor = new HashMap<>();
    }
    this.listensFor.put(key, listensForItem);
    return this;
  }

  /**
   * A mapping of Intents names that an app listens for via `fdc3.addIntentListener()` to their  configuration.   Used to support intent resolution by desktop agents. Replaces the `intents` element used in appD records prior to FDC3 2.0.  
   * @return listensFor
   */
  @Valid 
  @Schema(name = "listensFor", description = "A mapping of Intents names that an app listens for via `fdc3.addIntentListener()` to their  configuration.   Used to support intent resolution by desktop agents. Replaces the `intents` element used in appD records prior to FDC3 2.0.  ", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("listensFor")
  public Map<String, Intent> getListensFor() {
    return listensFor;
  }

  public void setListensFor(Map<String, Intent> listensFor) {
    this.listensFor = listensFor;
  }

  public InteropIntents raises(Map<String, Intent> raises) {
    this.raises = raises;
    return this;
  }

  public InteropIntents putRaisesItem(String key, Intent raisesItem) {
    if (this.raises == null) {
      this.raises = new HashMap<>();
    }
    this.raises.put(key, raisesItem);
    return this;
  }

  /**
   * A mapping of Intent names that an app raises (via `fdc3.raiseIntent`) to an array of context  type names that it may be raised with.  Use the intent name \"any\" to represent use of the `fdc3.raiseIntentForContext` and  `fdc3.findIntentForContext` functions, which allow the user to select from intents available for a  specified context type.  This metadata is not currently used by the desktop agent, but is provided to help find apps that will interoperate with this app and to document API interactions for use by other app developers. 
   * @return raises
   */
  @Valid 
  @Schema(name = "raises", description = "A mapping of Intent names that an app raises (via `fdc3.raiseIntent`) to an array of context  type names that it may be raised with.  Use the intent name \"any\" to represent use of the `fdc3.raiseIntentForContext` and  `fdc3.findIntentForContext` functions, which allow the user to select from intents available for a  specified context type.  This metadata is not currently used by the desktop agent, but is provided to help find apps that will interoperate with this app and to document API interactions for use by other app developers. ", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("raises")
  public Map<String, Intent> getRaises() {
    return raises;
  }

  public void setRaises(Map<String,Intent> raises) {
    this.raises = raises;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    InteropIntents interopIntents = (InteropIntents) o;
    return Objects.equals(this.listensFor, interopIntents.listensFor) &&
        Objects.equals(this.raises, interopIntents.raises);
  }

  @Override
  public int hashCode() {
    return Objects.hash(listensFor, raises);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class InteropIntents {\n");
    sb.append("    listensFor: ").append(toIndentedString(listensFor)).append("\n");
    sb.append("    raises: ").append(toIndentedString(raises)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}

