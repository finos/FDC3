package com.fdc.appd.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * (Deprecated v1 API version) An intent definition as defined by spec https://github.com/FDC3/Intents/blob/master/src/Intent.yaml
 */

@Schema(name = "IntentV1", description = "(Deprecated v1 API version) An intent definition as defined by spec https://github.com/FDC3/Intents/blob/master/src/Intent.yaml")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-11-10T19:40:14.622447+05:30[Asia/Kolkata]", comments = "Generator version: 7.8.0")
public class IntentV1 {

  private String name;

  private String displayName;

  @Valid
  private List<String> contexts = new ArrayList<>();

  private Object customConfig;

  public IntentV1() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public IntentV1(String name) {
    this.name = name;
  }

  public IntentV1 name(String name) {
    this.name = name;
    return this;
  }

  /**
   * The name of the intent to 'launch'. In this case the name of an Intent supported by an application.
   * @return name
   */
  @NotNull 
  @Schema(name = "name", description = "The name of the intent to 'launch'. In this case the name of an Intent supported by an application.", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("name")
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public IntentV1 displayName(String displayName) {
    this.displayName = displayName;
    return this;
  }

  /**
   * An optional display name for the intent that may be used in UI instead of the name.
   * @return displayName
   */
  
  @Schema(name = "displayName", description = "An optional display name for the intent that may be used in UI instead of the name.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("displayName")
  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  public IntentV1 contexts(List<String> contexts) {
    this.contexts = contexts;
    return this;
  }

  public IntentV1 addContextsItem(String contextsItem) {
    if (this.contexts == null) {
      this.contexts = new ArrayList<>();
    }
    this.contexts.add(contextsItem);
    return this;
  }

  /**
   * A comma sepaarted list of the types of contexts the intent offered by the application can process.  where the first part of the context type is the namespace e.g.\"fdc3.contact, org.symphony.contact\"
   * @return contexts
   */
  
  @Schema(name = "contexts", description = "A comma sepaarted list of the types of contexts the intent offered by the application can process.  where the first part of the context type is the namespace e.g.\"fdc3.contact, org.symphony.contact\"", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("contexts")
  public List<String> getContexts() {
    return contexts;
  }

  public void setContexts(List<String> contexts) {
    this.contexts = contexts;
  }

  public IntentV1 customConfig(Object customConfig) {
    this.customConfig = customConfig;
    return this;
  }

  /**
   * Custom configuration for the intent that may be required for a particular desktop agent.
   * @return customConfig
   */
  
  @Schema(name = "customConfig", description = "Custom configuration for the intent that may be required for a particular desktop agent.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("customConfig")
  public Object getCustomConfig() {
    return customConfig;
  }

  public void setCustomConfig(Object customConfig) {
    this.customConfig = customConfig;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    IntentV1 intentV1 = (IntentV1) o;
    return Objects.equals(this.name, intentV1.name) &&
        Objects.equals(this.displayName, intentV1.displayName) &&
        Objects.equals(this.contexts, intentV1.contexts) &&
        Objects.equals(this.customConfig, intentV1.customConfig);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, displayName, contexts, customConfig);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class IntentV1 {\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    displayName: ").append(toIndentedString(displayName)).append("\n");
    sb.append("    contexts: ").append(toIndentedString(contexts)).append("\n");
    sb.append("    customConfig: ").append(toIndentedString(customConfig)).append("\n");
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

