package com.fdc.appd.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.constraints.NotNull;

import java.util.Objects;

/**
 * Properties used to launch apps with &#x60;type: native&#x60; that are already installed on the device.
 */

@Schema(name = "NativeAppDetails", description = "Properties used to launch apps with `type: native` that are already installed on the device.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-11-10T19:40:14.622447+05:30[Asia/Kolkata]", comments = "Generator version: 7.8.0")
public class NativeAppDetails implements LaunchDetails {

  private String path;

  private String arguments;

  public NativeAppDetails() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public NativeAppDetails(String path) {
    this.path = path;
  }

  public NativeAppDetails path(String path) {
    this.path = path;
    return this;
  }

  /**
   * The path on disk from which the application is launched.
   * @return path
   */
  @NotNull 
  @Schema(name = "path", description = "The path on disk from which the application is launched.", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("path")
  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public NativeAppDetails arguments(String arguments) {
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
    NativeAppDetails nativeAppDetails = (NativeAppDetails) o;
    return Objects.equals(this.path, nativeAppDetails.path) &&
        Objects.equals(this.arguments, nativeAppDetails.arguments);
  }

  @Override
  public int hashCode() {
    return Objects.hash(path, arguments);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class NativeAppDetails {\n");
    sb.append("    path: ").append(toIndentedString(path)).append("\n");
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

