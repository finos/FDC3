package com.fdc.appd.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;

import java.net.URI;
import java.util.Objects;

/**
 * Images representing the app in common usage scenarios
 */

@Schema(name = "Screenshot", description = "Images representing the app in common usage scenarios")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-11-10T19:40:14.622447+05:30[Asia/Kolkata]", comments = "Generator version: 7.8.0")
public class Screenshot {

  private URI src;

  private String size;

  private String type;

  private String label;

  public Screenshot src(URI src) {
    this.src = src;
    return this;
  }

  /**
   * App Image URL
   * @return src
   */
  @Valid 
  @Schema(name = "src", description = "App Image URL", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("src")
  public URI getSrc() {
    return src;
  }

  public void setSrc(URI src) {
    this.src = src;
  }

  public Screenshot size(String size) {
    this.size = size;
    return this;
  }

  /**
   * Image dimension formatted as `<height>x<width>`
   * @return size
   */
  
  @Schema(name = "size", description = "Image dimension formatted as `<height>x<width>`", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("size")
  public String getSize() {
    return size;
  }

  public void setSize(String size) {
    this.size = size;
  }

  public Screenshot type(String type) {
    this.type = type;
    return this;
  }

  /**
   * Image media type. If not present the Desktop Agent may use the src file extension.
   * @return type
   */
  
  @Schema(name = "type", description = "Image media type. If not present the Desktop Agent may use the src file extension.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("type")
  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public Screenshot label(String label) {
    this.label = label;
    return this;
  }

  /**
   * Optional caption for the image
   * @return label
   */
  
  @Schema(name = "label", description = "Optional caption for the image", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("label")
  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Screenshot screenshot = (Screenshot) o;
    return Objects.equals(this.src, screenshot.src) &&
        Objects.equals(this.size, screenshot.size) &&
        Objects.equals(this.type, screenshot.type) &&
        Objects.equals(this.label, screenshot.label);
  }

  @Override
  public int hashCode() {
    return Objects.hash(src, size, type, label);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Screenshot {\n");
    sb.append("    src: ").append(toIndentedString(src)).append("\n");
    sb.append("    size: ").append(toIndentedString(size)).append("\n");
    sb.append("    type: ").append(toIndentedString(type)).append("\n");
    sb.append("    label: ").append(toIndentedString(label)).append("\n");
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

