package com.fdc.appd.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.constraints.NotNull;

import java.util.Objects;

/**
 * Properties used to launch apps with &#x60;type: web&#x60;.
 */

@Schema(name = "WebAppDetails", description = "Properties used to launch apps with `type: web`.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-11-10T19:40:14.622447+05:30[Asia/Kolkata]", comments = "Generator version: 7.8.0")
public class WebAppDetails implements LaunchDetails {

  private String url;

  public WebAppDetails() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public WebAppDetails(String url) {
    this.url = url;
  }

  public WebAppDetails url(String url) {
    this.url = url;
    return this;
  }

  /**
   * Application start URL.
   * @return url
   */
  @NotNull 
  @Schema(name = "url", description = "Application start URL.", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("url")
  public String getUrl() {
    return url;
  }

  public void setUrl(String url) {
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
    WebAppDetails webAppDetails = (WebAppDetails) o;
    return Objects.equals(this.url, webAppDetails.url);
  }

  @Override
  public int hashCode() {
    return Objects.hash(url);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class WebAppDetails {\n");
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

