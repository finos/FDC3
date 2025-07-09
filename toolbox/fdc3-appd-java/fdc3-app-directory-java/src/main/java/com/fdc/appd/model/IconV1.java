package com.fdc.appd.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;

import java.net.URI;
import java.util.Objects;

/**
 * (Deprecated v1 API version) Icon holder
 */

@Schema(name = "IconV1", description = "(Deprecated v1 API version) Icon holder")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-11-10T19:40:14.622447+05:30[Asia/Kolkata]", comments = "Generator version: 7.8.0")
public class IconV1 {

  private URI icon;

  public IconV1 icon(URI icon) {
    this.icon = icon;
    return this;
  }

  /**
   * Icon URL
   * @return icon
   */
  @Valid 
  @Schema(name = "icon", description = "Icon URL", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("icon")
  public URI getIcon() {
    return icon;
  }

  public void setIcon(URI icon) {
    this.icon = icon;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    IconV1 iconV1 = (IconV1) o;
    return Objects.equals(this.icon, iconV1.icon);
  }

  @Override
  public int hashCode() {
    return Objects.hash(icon);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class IconV1 {\n");
    sb.append("    icon: ").append(toIndentedString(icon)).append("\n");
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

