package com.fdc.appd.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeName;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * InteropAppChannelsInner
 */

@JsonTypeName("Interop_appChannels_inner")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-11-10T19:40:14.622447+05:30[Asia/Kolkata]", comments = "Generator version: 7.8.0")
public class InteropAppChannelsInner {

  private String name;

  private String description;

  @Valid
  private List<String> broadcasts = new ArrayList<>();

  @Valid
  private List<String> listensFor = new ArrayList<>();

  public InteropAppChannelsInner() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public InteropAppChannelsInner(String name) {
    this.name = name;
  }

  public InteropAppChannelsInner name(String name) {
    this.name = name;
    return this;
  }

  /**
   * The name of the App Channel.
   * @return name
   */
  @NotNull 
  @Schema(name = "name", description = "The name of the App Channel.", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("name")
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public InteropAppChannelsInner description(String description) {
    this.description = description;
    return this;
  }

  /**
   * A description of how the channel is used.
   * @return description
   */
  
  @Schema(name = "description", description = "A description of how the channel is used.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("description")
  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public InteropAppChannelsInner broadcasts(List<String> broadcasts) {
    this.broadcasts = broadcasts;
    return this;
  }

  public InteropAppChannelsInner addBroadcastsItem(String broadcastsItem) {
    if (this.broadcasts == null) {
      this.broadcasts = new ArrayList<>();
    }
    this.broadcasts.add(broadcastsItem);
    return this;
  }

  /**
   * Context type names that are broadcast by the application on the channel.
   * @return broadcasts
   */
  
  @Schema(name = "broadcasts", description = "Context type names that are broadcast by the application on the channel.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("broadcasts")
  public List<String> getBroadcasts() {
    return broadcasts;
  }

  public void setBroadcasts(List<String> broadcasts) {
    this.broadcasts = broadcasts;
  }

  public InteropAppChannelsInner listensFor(List<String> listensFor) {
    this.listensFor = listensFor;
    return this;
  }

  public InteropAppChannelsInner addListensForItem(String listensForItem) {
    if (this.listensFor == null) {
      this.listensFor = new ArrayList<>();
    }
    this.listensFor.add(listensForItem);
    return this;
  }

  /**
   * Context type names that the application listens for on the channel.
   * @return listensFor
   */
  
  @Schema(name = "listensFor", description = "Context type names that the application listens for on the channel.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("listensFor")
  public List<String> getListensFor() {
    return listensFor;
  }

  public void setListensFor(List<String> listensFor) {
    this.listensFor = listensFor;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    InteropAppChannelsInner interopAppChannelsInner = (InteropAppChannelsInner) o;
    return Objects.equals(this.name, interopAppChannelsInner.name) &&
        Objects.equals(this.description, interopAppChannelsInner.description) &&
        Objects.equals(this.broadcasts, interopAppChannelsInner.broadcasts) &&
        Objects.equals(this.listensFor, interopAppChannelsInner.listensFor);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, description, broadcasts, listensFor);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class InteropAppChannelsInner {\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    broadcasts: ").append(toIndentedString(broadcasts)).append("\n");
    sb.append("    listensFor: ").append(toIndentedString(listensFor)).append("\n");
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

