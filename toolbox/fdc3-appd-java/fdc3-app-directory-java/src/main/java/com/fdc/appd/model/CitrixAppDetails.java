package com.fdc.appd.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.constraints.NotNull;

import java.util.Objects;

/**
 * Properties used to launch apps virtualized apps with &#x60;type: citrix&#x60;.
 */

@Schema(name = "CitrixAppDetails", description = "Properties used to launch apps virtualized apps with `type: citrix`.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-11-10T19:40:14.622447+05:30[Asia/Kolkata]", comments = "Generator version: 7.8.0")
public class CitrixAppDetails implements LaunchDetails {

  private String alias;

  private String arguments;

  public CitrixAppDetails() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public CitrixAppDetails(String alias) {
    this.alias = alias;
  }

  public CitrixAppDetails alias(String alias) {
    this.alias = alias;
    return this;
  }

  /**
   * The Citrix alias / name of the virtual app (passed to the Citrix SelfService qlaunch parameter).
   * @return alias
   */
  @NotNull 
  @Schema(name = "alias", description = "The Citrix alias / name of the virtual app (passed to the Citrix SelfService qlaunch parameter).", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("alias")
  public String getAlias() {
    return alias;
  }

  public void setAlias(String alias) {
    this.alias = alias;
  }

  public CitrixAppDetails arguments(String arguments) {
    this.arguments = arguments;
    return this;
  }

  /**
   * Arguments that must be passed on the command line to launch the app in the expected configuration.
   * @return arguments
   */
  
  @Schema(name = "arguments", description = "Arguments that must be passed on the command line to launch the app in the expected configuration.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("arguments")
  public String getArguments() {
    return arguments;
  }

  public void setArguments(String arguments) {
    this.arguments = arguments;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    CitrixAppDetails citrixAppDetails = (CitrixAppDetails) o;
    return Objects.equals(this.alias, citrixAppDetails.alias) &&
        Objects.equals(this.arguments, citrixAppDetails.arguments);
  }

  @Override
  public int hashCode() {
    return Objects.hash(alias, arguments);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class CitrixAppDetails {\n");
    sb.append("    alias: ").append(toIndentedString(alias)).append("\n");
    sb.append("    arguments: ").append(toIndentedString(arguments)).append("\n");
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

