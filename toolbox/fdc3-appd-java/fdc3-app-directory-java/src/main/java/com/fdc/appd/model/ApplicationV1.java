package com.fdc.appd.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * (Deprecated v1 API version) Defines an application retrieved from an FDC3 App Directory, which can then be launched. Launching typically means running for a user on a desktop.  The details around &#39;launching&#39; including who or what might do it, and how the launch action is initiated are discussed elsewhere in the FDC3 App Directory spec. 
 */

@Schema(name = "ApplicationV1", description = "(Deprecated v1 API version) Defines an application retrieved from an FDC3 App Directory, which can then be launched. Launching typically means running for a user on a desktop.  The details around 'launching' including who or what might do it, and how the launch action is initiated are discussed elsewhere in the FDC3 App Directory spec. ")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-11-10T19:40:14.622447+05:30[Asia/Kolkata]", comments = "Generator version: 7.8.0")
public class ApplicationV1 {

  private String appId;

  private String name;

  private String manifest;

  private String manifestType;

  private String version;

  private String title;

  private String tooltip;

  private String description;

  @Valid
  private List<@Valid AppImageV1> images = new ArrayList<>();

  private String contactEmail;

  private String supportEmail;

  private String publisher;

  @Valid
  private List<@Valid IconV1> icons = new ArrayList<>();

  @Valid
  private List<@Valid NameValuePair> customConfig = new ArrayList<>();

  @Valid
  private List<@Valid IntentV1> intents = new ArrayList<>();

  public ApplicationV1() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public ApplicationV1(String appId, String name, String manifest, String manifestType) {
    this.appId = appId;
    this.name = name;
    this.manifest = manifest;
    this.manifestType = manifestType;
  }

  public ApplicationV1 appId(String appId) {
    this.appId = appId;
    return this;
  }

  /**
   * The unique application identifier located within a specific application directory instance. 
   * @return appId
   */
  @NotNull 
  @Schema(name = "appId", description = "The unique application identifier located within a specific application directory instance. ", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("appId")
  public String getAppId() {
    return appId;
  }

  public void setAppId(String appId) {
    this.appId = appId;
  }

  public ApplicationV1 name(String name) {
    this.name = name;
    return this;
  }

  /**
   * The name of the application. The name should be unique within an FDC3 App Directory instance. The exception to the uniqueness constraint is that an App Directory can hold definitions for multiple versions of the same app. The same appName could occur in other directories. We are not currently specifying app name conventions in the document. 
   * @return name
   */
  @NotNull 
  @Schema(name = "name", description = "The name of the application. The name should be unique within an FDC3 App Directory instance. The exception to the uniqueness constraint is that an App Directory can hold definitions for multiple versions of the same app. The same appName could occur in other directories. We are not currently specifying app name conventions in the document. ", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("name")
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public ApplicationV1 manifest(String manifest) {
    this.manifest = manifest;
    return this;
  }

  /**
   * URI or full JSON of the application manifest providing all details related to launch and use requirements as described by the vendor. The format of this manifest is vendor specific, but can be identified by the manifestType attribute. 
   * @return manifest
   */
  @NotNull 
  @Schema(name = "manifest", description = "URI or full JSON of the application manifest providing all details related to launch and use requirements as described by the vendor. The format of this manifest is vendor specific, but can be identified by the manifestType attribute. ", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("manifest")
  public String getManifest() {
    return manifest;
  }

  public void setManifest(String manifest) {
    this.manifest = manifest;
  }

  public ApplicationV1 manifestType(String manifestType) {
    this.manifestType = manifestType;
    return this;
  }

  /**
   * The manifest type which relates to the format and structure of the manifest content. The definition is based on the vendor specific format and definition outside of this specification. 
   * @return manifestType
   */
  @NotNull 
  @Schema(name = "manifestType", description = "The manifest type which relates to the format and structure of the manifest content. The definition is based on the vendor specific format and definition outside of this specification. ", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("manifestType")
  public String getManifestType() {
    return manifestType;
  }

  public void setManifestType(String manifestType) {
    this.manifestType = manifestType;
  }

  public ApplicationV1 version(String version) {
    this.version = version;
    return this;
  }

  /**
   * Version of the application. This allows multiple app versions to be defined using the same app name. This can be a triplet but can also include things like 1.2.5 (BETA)
   * @return version
   */
  
  @Schema(name = "version", description = "Version of the application. This allows multiple app versions to be defined using the same app name. This can be a triplet but can also include things like 1.2.5 (BETA)", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("version")
  public String getVersion() {
    return version;
  }

  public void setVersion(String version) {
    this.version = version;
  }

  public ApplicationV1 title(String title) {
    this.title = title;
    return this;
  }

  /**
   * Optional title for the application, if missing use appName, typically used in a launcher UI.
   * @return title
   */
  
  @Schema(name = "title", description = "Optional title for the application, if missing use appName, typically used in a launcher UI.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("title")
  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public ApplicationV1 tooltip(String tooltip) {
    this.tooltip = tooltip;
    return this;
  }

  /**
   * Optional tooltip description e.g. for a launcher
   * @return tooltip
   */
  
  @Schema(name = "tooltip", description = "Optional tooltip description e.g. for a launcher", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("tooltip")
  public String getTooltip() {
    return tooltip;
  }

  public void setTooltip(String tooltip) {
    this.tooltip = tooltip;
  }

  public ApplicationV1 description(String description) {
    this.description = description;
    return this;
  }

  /**
   * Description of the application. This will typically be a 1-2 paragraph style blurb about the application. Allow mark up language
   * @return description
   */
  
  @Schema(name = "description", description = "Description of the application. This will typically be a 1-2 paragraph style blurb about the application. Allow mark up language", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("description")
  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public ApplicationV1 images(List<@Valid AppImageV1> images) {
    this.images = images;
    return this;
  }

  public ApplicationV1 addImagesItem(AppImageV1 imagesItem) {
    if (this.images == null) {
      this.images = new ArrayList<>();
    }
    this.images.add(imagesItem);
    return this;
  }

  /**
   * Array of images to show the user when they are looking at app description. Each image can have an optional description/tooltip
   * @return images
   */
  @Valid 
  @Schema(name = "images", description = "Array of images to show the user when they are looking at app description. Each image can have an optional description/tooltip", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("images")
  public List<@Valid AppImageV1> getImages() {
    return images;
  }

  public void setImages(List<@Valid AppImageV1> images) {
    this.images = images;
  }

  public ApplicationV1 contactEmail(String contactEmail) {
    this.contactEmail = contactEmail;
    return this;
  }

  /**
   * Optional e-mail to receive queries about the application
   * @return contactEmail
   */
  @Email
  @Schema(name = "contactEmail", description = "Optional e-mail to receive queries about the application", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("contactEmail")
  public String getContactEmail() {
    return contactEmail;
  }

  public void setContactEmail(String contactEmail) {
    this.contactEmail = contactEmail;
  }

  public ApplicationV1 supportEmail(String supportEmail) {
    this.supportEmail = supportEmail;
    return this;
  }

  /**
   * Optional e-mail to receive support requests for the application
   * @return supportEmail
   */
  @Email
  @Schema(name = "supportEmail", description = "Optional e-mail to receive support requests for the application", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("supportEmail")
  public String getSupportEmail() {
    return supportEmail;
  }

  public void setSupportEmail(String supportEmail) {
    this.supportEmail = supportEmail;
  }

  public ApplicationV1 publisher(String publisher) {
    this.publisher = publisher;
    return this;
  }

  /**
   * The name of the company that owns the application. The publisher has control over their namespace/app/signature.
   * @return publisher
   */
  
  @Schema(name = "publisher", description = "The name of the company that owns the application. The publisher has control over their namespace/app/signature.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("publisher")
  public String getPublisher() {
    return publisher;
  }

  public void setPublisher(String publisher) {
    this.publisher = publisher;
  }

  public ApplicationV1 icons(List<@Valid IconV1> icons) {
    this.icons = icons;
    return this;
  }

  public ApplicationV1 addIconsItem(IconV1 iconsItem) {
    if (this.icons == null) {
      this.icons = new ArrayList<>();
    }
    this.icons.add(iconsItem);
    return this;
  }

  /**
   * Holds Icons used for the application, a Launcher may be able to use multiple Icon sizes or there may be a 'button' Icon
   * @return icons
   */
  @Valid 
  @Schema(name = "icons", description = "Holds Icons used for the application, a Launcher may be able to use multiple Icon sizes or there may be a 'button' Icon", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("icons")
  public List<@Valid IconV1> getIcons() {
    return icons;
  }

  public void setIcons(List<@Valid IconV1> icons) {
    this.icons = icons;
  }

  public ApplicationV1 customConfig(List<@Valid NameValuePair> customConfig) {
    this.customConfig = customConfig;
    return this;
  }

  public ApplicationV1 addCustomConfigItem(NameValuePair customConfigItem) {
    if (this.customConfig == null) {
      this.customConfig = new ArrayList<>();
    }
    this.customConfig.add(customConfigItem);
    return this;
  }

  /**
   * An optional set of name value pairs that can be used to deliver custom data from an App Directory to a launcher.
   * @return customConfig
   */
  @Valid 
  @Schema(name = "customConfig", description = "An optional set of name value pairs that can be used to deliver custom data from an App Directory to a launcher.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("customConfig")
  public List<@Valid NameValuePair> getCustomConfig() {
    return customConfig;
  }

  public void setCustomConfig(List<@Valid NameValuePair> customConfig) {
    this.customConfig = customConfig;
  }

  public ApplicationV1 intents(List<@Valid IntentV1> intents) {
    this.intents = intents;
    return this;
  }

  public ApplicationV1 addIntentsItem(IntentV1 intentsItem) {
    if (this.intents == null) {
      this.intents = new ArrayList<>();
    }
    this.intents.add(intentsItem);
    return this;
  }

  /**
   * The list of intents implemented by the application as defined by https://github.com/FDC3/Intents/blob/master/src/Intent.yaml 
   * @return intents
   */
  @Valid 
  @Schema(name = "intents", description = "The list of intents implemented by the application as defined by https://github.com/FDC3/Intents/blob/master/src/Intent.yaml ", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("intents")
  public List<@Valid IntentV1> getIntents() {
    return intents;
  }

  public void setIntents(List<@Valid IntentV1> intents) {
    this.intents = intents;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ApplicationV1 applicationV1 = (ApplicationV1) o;
    return Objects.equals(this.appId, applicationV1.appId) &&
        Objects.equals(this.name, applicationV1.name) &&
        Objects.equals(this.manifest, applicationV1.manifest) &&
        Objects.equals(this.manifestType, applicationV1.manifestType) &&
        Objects.equals(this.version, applicationV1.version) &&
        Objects.equals(this.title, applicationV1.title) &&
        Objects.equals(this.tooltip, applicationV1.tooltip) &&
        Objects.equals(this.description, applicationV1.description) &&
        Objects.equals(this.images, applicationV1.images) &&
        Objects.equals(this.contactEmail, applicationV1.contactEmail) &&
        Objects.equals(this.supportEmail, applicationV1.supportEmail) &&
        Objects.equals(this.publisher, applicationV1.publisher) &&
        Objects.equals(this.icons, applicationV1.icons) &&
        Objects.equals(this.customConfig, applicationV1.customConfig) &&
        Objects.equals(this.intents, applicationV1.intents);
  }

  @Override
  public int hashCode() {
    return Objects.hash(appId, name, manifest, manifestType, version, title, tooltip, description, images, contactEmail, supportEmail, publisher, icons, customConfig, intents);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ApplicationV1 {\n");
    sb.append("    appId: ").append(toIndentedString(appId)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    manifest: ").append(toIndentedString(manifest)).append("\n");
    sb.append("    manifestType: ").append(toIndentedString(manifestType)).append("\n");
    sb.append("    version: ").append(toIndentedString(version)).append("\n");
    sb.append("    title: ").append(toIndentedString(title)).append("\n");
    sb.append("    tooltip: ").append(toIndentedString(tooltip)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    images: ").append(toIndentedString(images)).append("\n");
    sb.append("    contactEmail: ").append(toIndentedString(contactEmail)).append("\n");
    sb.append("    supportEmail: ").append(toIndentedString(supportEmail)).append("\n");
    sb.append("    publisher: ").append(toIndentedString(publisher)).append("\n");
    sb.append("    icons: ").append(toIndentedString(icons)).append("\n");
    sb.append("    customConfig: ").append(toIndentedString(customConfig)).append("\n");
    sb.append("    intents: ").append(toIndentedString(intents)).append("\n");
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

