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
 * Definition of an intent that an app listens for
 */

@Schema(name = "Intent", description = "Definition of an intent that an app listens for")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-11-10T19:40:14.622447+05:30[Asia/Kolkata]", comments = "Generator version: 7.8.0")
public class Intent {

  private String displayName;

  @Valid
  private List<String> contexts = new ArrayList<>();

  private String resultType;

  private Object customConfig;

  public Intent() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public Intent(List<String> contexts) {
    this.contexts = contexts;
  }

  public Intent displayName(String displayName) {
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

  public Intent contexts(List<String> contexts) {
    this.contexts = contexts;
    return this;
  }

  public Intent addContextsItem(String contextsItem) {
    if (this.contexts == null) {
      this.contexts = new ArrayList<>();
    }
    this.contexts.add(contextsItem);
    return this;
  }

  /**
   * A comma separated list of the types of contexts the intent offered by the application can process,   where the first part of the context type is the namespace e.g.\"fdc3.contact, org.symphony.contact\"
   * @return contexts
   */
  @NotNull 
  @Schema(name = "contexts", description = "A comma separated list of the types of contexts the intent offered by the application can process,   where the first part of the context type is the namespace e.g.\"fdc3.contact, org.symphony.contact\"", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("contexts")
  public List<String> getContexts() {
    return contexts;
  }

  public void setContexts(List<String> contexts) {
    this.contexts = contexts;
  }

  public Intent resultType(String resultType) {
    this.resultType = resultType;
    return this;
  }

  /**
   * An optional type for output returned by the application, if any, when resolving this intent.  May indicate a context type by type name (e.g. \"fdc3.instrument\"), a channel (e.g. \"channel\")  or a combination that indicates a channel that returns a particular context type  (e.g. \"channel<fdc3.instrument>\").
   * @return resultType
   */
  
  @Schema(name = "resultType", description = "An optional type for output returned by the application, if any, when resolving this intent.  May indicate a context type by type name (e.g. \"fdc3.instrument\"), a channel (e.g. \"channel\")  or a combination that indicates a channel that returns a particular context type  (e.g. \"channel<fdc3.instrument>\").", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("resultType")
  public String getResultType() {
    return resultType;
  }

  public void setResultType(String resultType) {
    this.resultType = resultType;
  }

  public Intent customConfig(Object customConfig) {
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
    Intent intent = (Intent) o;
    return Objects.equals(this.displayName, intent.displayName) &&
        Objects.equals(this.contexts, intent.contexts) &&
        Objects.equals(this.resultType, intent.resultType) &&
        Objects.equals(this.customConfig, intent.customConfig);
  }

  @Override
  public int hashCode() {
    return Objects.hash(displayName, contexts, resultType, customConfig);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Intent {\n");
    sb.append("    displayName: ").append(toIndentedString(displayName)).append("\n");
    sb.append("    contexts: ").append(toIndentedString(contexts)).append("\n");
    sb.append("    resultType: ").append(toIndentedString(resultType)).append("\n");
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

