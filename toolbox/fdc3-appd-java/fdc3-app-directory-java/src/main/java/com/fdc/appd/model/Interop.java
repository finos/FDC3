package com.fdc.appd.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Metadata that describes how the application uses FDC3 APIs. This metadata serves multiple purposes:  - It supports intent resolution by a desktop agent, by declaring what intents an app listens for. - It may be used, for example in an app catalog UI, to find apps that &#39;interoperate with&#39; other apps.  - It provides a standard location to document how the app interacts with user channels, app channels,    and intents, for use by other app developers and desktop assemblers. 
 */

@Schema(name = "Interop", description = "Metadata that describes how the application uses FDC3 APIs. This metadata serves multiple purposes:  - It supports intent resolution by a desktop agent, by declaring what intents an app listens for. - It may be used, for example in an app catalog UI, to find apps that 'interoperate with' other apps.  - It provides a standard location to document how the app interacts with user channels, app channels,    and intents, for use by other app developers and desktop assemblers. ")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-11-10T19:40:14.622447+05:30[Asia/Kolkata]", comments = "Generator version: 7.8.0")
public class Interop {

  private InteropIntents intents;

  private InteropUserChannels userChannels;

  @Valid
  private List<@Valid InteropAppChannelsInner> appChannels = new ArrayList<>();

  public Interop intents(InteropIntents intents) {
    this.intents = intents;
    return this;
  }

  /**
   * Get intents
   * @return intents
   */
  @Valid 
  @Schema(name = "intents", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("intents")
  public InteropIntents getIntents() {
    return intents;
  }

  public void setIntents(InteropIntents intents) {
    this.intents = intents;
  }

  public Interop userChannels(InteropUserChannels userChannels) {
    this.userChannels = userChannels;
    return this;
  }

  /**
   * Get userChannels
   * @return userChannels
   */
  @Valid 
  @Schema(name = "userChannels", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("userChannels")
  public InteropUserChannels getUserChannels() {
    return userChannels;
  }

  public void setUserChannels(InteropUserChannels userChannels) {
    this.userChannels = userChannels;
  }

  public Interop appChannels(List<@Valid InteropAppChannelsInner> appChannels) {
    this.appChannels = appChannels;
    return this;
  }

  public Interop addAppChannelsItem(InteropAppChannelsInner appChannelsItem) {
    if (this.appChannels == null) {
      this.appChannels = new ArrayList<>();
    }
    this.appChannels.add(appChannelsItem);
    return this;
  }

  /**
   * Describes the application's use of App Channels.  This metadata is not currently used by the desktop agent, but is provided to help find apps  that will interoperate with this app and to document API interactions for use by other app  developers. 
   * @return appChannels
   */
  @Valid 
  @Schema(name = "appChannels", description = "Describes the application's use of App Channels.  This metadata is not currently used by the desktop agent, but is provided to help find apps  that will interoperate with this app and to document API interactions for use by other app  developers. ", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("appChannels")
  public List<@Valid InteropAppChannelsInner> getAppChannels() {
    return appChannels;
  }

  public void setAppChannels(List<@Valid InteropAppChannelsInner> appChannels) {
    this.appChannels = appChannels;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Interop interop = (Interop) o;
    return Objects.equals(this.intents, interop.intents) &&
        Objects.equals(this.userChannels, interop.userChannels) &&
        Objects.equals(this.appChannels, interop.appChannels);
  }

  @Override
  public int hashCode() {
    return Objects.hash(intents, userChannels, appChannels);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Interop {\n");
    sb.append("    intents: ").append(toIndentedString(intents)).append("\n");
    sb.append("    userChannels: ").append(toIndentedString(userChannels)).append("\n");
    sb.append("    appChannels: ").append(toIndentedString(appChannels)).append("\n");
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

