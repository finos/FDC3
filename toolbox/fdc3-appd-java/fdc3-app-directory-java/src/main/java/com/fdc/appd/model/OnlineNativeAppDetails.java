package com.fdc.appd.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.net.URI;
import java.util.Objects;

/**
 * Properties used to launch a native apps with &#x60;type: onlineNative&#x60; that have an online launcher, e.g. online ClickOnce app deployments.
 */

@Schema(name = "OnlineNativeAppDetails", description = "Properties used to launch a native apps with `type: onlineNative` that have an online launcher, e.g. online ClickOnce app deployments.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-11-10T19:40:14.622447+05:30[Asia/Kolkata]", comments = "Generator version: 7.8.0")
public class OnlineNativeAppDetails implements LaunchDetails {

  private URI url;

  public OnlineNativeAppDetails() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public OnlineNativeAppDetails(URI url) {
    this.url = url;
  }

  public OnlineNativeAppDetails url(URI url) {
    this.url = url;
    return this;
  }

  /**
   * Application URL.
   * @return url
   */
  @NotNull @Valid 
  @Schema(name = "url", description = "Application URL.", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("url")
  public URI getUrl() {
    return url;
  }

  public void setUrl(URI url) {
    this.url = url;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    OnlineNativeAppDetails onlineNativeAppDetails = (OnlineNativeAppDetails) o;
    return Objects.equals(this.url, onlineNativeAppDetails.url);
  }

  @Override
  public int hashCode() {
    return Objects.hash(url);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class OnlineNativeAppDetails {\n");
    sb.append("    url: ").append(toIndentedString(url)).append("\n");
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

