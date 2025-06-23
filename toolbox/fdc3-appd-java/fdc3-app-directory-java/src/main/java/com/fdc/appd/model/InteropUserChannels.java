package com.fdc.appd.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeName;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Describes the application&#39;s use of context types on User Channels.  This metadata is not currently used by the desktop agent, but is provided to help find apps that will interoperate with this app and to document API interactions for use by other app developers. 
 */

@Schema(name = "Interop_userChannels", description = "Describes the application's use of context types on User Channels.  This metadata is not currently used by the desktop agent, but is provided to help find apps that will interoperate with this app and to document API interactions for use by other app developers. ")
@JsonTypeName("Interop_userChannels")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-11-10T19:40:14.622447+05:30[Asia/Kolkata]", comments = "Generator version: 7.8.0")
public class InteropUserChannels {

  @Valid
  private List<String> broadcasts = new ArrayList<>();

  @Valid
  private List<String> listensFor = new ArrayList<>();

  public InteropUserChannels broadcasts(List<String> broadcasts) {
    this.broadcasts = broadcasts;
    return this;
  }

  public InteropUserChannels addBroadcastsItem(String broadcastsItem) {
    if (this.broadcasts == null) {
      this.broadcasts = new ArrayList<>();
    }
    this.broadcasts.add(broadcastsItem);
    return this;
  }

  /**
   * Context type names that are broadcast by the application.
   * @return broadcasts
   */
  
  @Schema(name = "broadcasts", description = "Context type names that are broadcast by the application.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("broadcasts")
  public List<String> getBroadcasts() {
    return broadcasts;
  }

  public void setBroadcasts(List<String> broadcasts) {
    this.broadcasts = broadcasts;
  }

  public InteropUserChannels listensFor(List<String> listensFor) {
    this.listensFor = listensFor;
    return this;
  }

  public InteropUserChannels addListensForItem(String listensForItem) {
    if (this.listensFor == null) {
      this.listensFor = new ArrayList<>();
    }
    this.listensFor.add(listensForItem);
    return this;
  }

  /**
   * Context type names that the application listens for.
   * @return listensFor
   */
  
  @Schema(name = "listensFor", description = "Context type names that the application listens for.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
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
    InteropUserChannels interopUserChannels = (InteropUserChannels) o;
    return Objects.equals(this.broadcasts, interopUserChannels.broadcasts) &&
        Objects.equals(this.listensFor, interopUserChannels.listensFor);
  }

  @Override
  public int hashCode() {
    return Objects.hash(broadcasts, listensFor);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class InteropUserChannels {\n");
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

