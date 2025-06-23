package com.fdc.appd.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;

import java.net.URI;
import java.util.Objects;

/**
 * Icon holder
 */

@Schema(name = "Icon", description = "Icon holder")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-11-10T19:40:14.622447+05:30[Asia/Kolkata]", comments = "Generator version: 7.8.0")
public class Icon {

  private URI src;

  private String size;

  private String type;

  public Icon src(URI src) {
    this.src = src;
    return this;
  }

  /**
   * Icon URL
   * @return src
   */
  @Valid 
  @Schema(name = "src", description = "Icon URL", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("src")
  public URI getSrc() {
    return src;
  }

  public void setSrc(URI src) {
    this.src = src;
  }

  public Icon size(String size) {
    this.size = size;
    return this;
  }

  /**
   * Icon dimension formatted as `<height>x<width>`
   * @return size
   */
  
  @Schema(name = "size", description = "Icon dimension formatted as `<height>x<width>`", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("size")
  public String getSize() {
    return size;
  }

  public void setSize(String size) {
    this.size = size;
  }

  public Icon type(String type) {
    this.type = type;
    return this;
  }

  /**
   * Image media type. If not present the Desktop Agent may use the src file extension
   * @return type
   */
  
  @Schema(name = "type", description = "Image media type. If not present the Desktop Agent may use the src file extension", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("type")
  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Icon icon = (Icon) o;
    return Objects.equals(this.src, icon.src) &&
        Objects.equals(this.size, icon.size) &&
        Objects.equals(this.type, icon.type);
  }

  @Override
  public int hashCode() {
    return Objects.hash(src, size, type);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Icon {\n");
    sb.append("    src: ").append(toIndentedString(src)).append("\n");
    sb.append("    size: ").append(toIndentedString(size)).append("\n");
    sb.append("    type: ").append(toIndentedString(type)).append("\n");
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

