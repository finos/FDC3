package com.fdc.appd.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;

import java.net.URI;
import java.util.*;

/**
 * BaseApplication
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-11-10T19:40:14.622447+05:30[Asia/Kolkata]", comments = "Generator version: 7.8.0")
public class BaseApplication {

  private String appId;

  private String name;

  private Type type;

  private LaunchDetails details;

  private String version;

  private String title;

  private String tooltip;

  private String lang;

  private String description;

  @Valid
  private List<String> categories = new ArrayList<>();

  @Valid
  private List<@Valid Icon> icons = new ArrayList<>();

  @Valid
  private List<@Valid Screenshot> screenshots = new ArrayList<>();

  private String contactEmail;

  private String supportEmail;

  private URI moreInfo;

  private String publisher;

  @Valid
  private List<@Valid NameValuePair> customConfig = new ArrayList<>();

  @Valid
  private Map<String, HostManifestsValue> hostManifests = new HashMap<>();

  private Interop interop;

  public BaseApplication appId(String appId) {
    this.appId = appId;
    return this;
  }

  /**
   * The unique application identifier located within a specific application directory instance. 
   * @return appId
   */
  
  @Schema(name = "appId", description = "The unique application identifier located within a specific application directory instance. ", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("appId")
  public String getAppId() {
    return appId;
  }

  public void setAppId(String appId) {
    this.appId = appId;
  }

  public BaseApplication name(String name) {
    this.name = name;
    return this;
  }

  /**
   * The name of the application. The name should be unique within an FDC3 App Directory instance. The exception to the uniqueness constraint is that an App Directory can hold definitions for multiple versions of the same app. The same appName could occur in other directories. We are not currently specifying app name conventions in the document. 
   * @return name
   */
  
  @Schema(name = "name", description = "The name of the application. The name should be unique within an FDC3 App Directory instance. The exception to the uniqueness constraint is that an App Directory can hold definitions for multiple versions of the same app. The same appName could occur in other directories. We are not currently specifying app name conventions in the document. ", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("name")
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public BaseApplication type(Type type) {
    this.type = type;
    return this;
  }

  /**
   * Get type
   * @return type
   */
  @Valid 
  @Schema(name = "type", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("type")
  public Type getType() {
    return type;
  }

  public void setType(Type type) {
    this.type = type;
  }

  public BaseApplication details(LaunchDetails details) {
    this.details = details;
    return this;
  }

  /**
   * Get details
   * @return details
   */
  @Valid 
  @Schema(name = "details", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("details")
  public LaunchDetails getDetails() {
    return details;
  }

  public void setDetails(LaunchDetails details) {
    this.details = details;
  }

  public BaseApplication version(String version) {
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

  public BaseApplication title(String title) {
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

  public BaseApplication tooltip(String tooltip) {
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

  public BaseApplication lang(String lang) {
    this.lang = lang;
    return this;
  }

  /**
   * A language tag that specifies the primary language of both the application and its AppD entry, as defined by IETF RFC 5646.
   * @return lang
   */
  @Pattern(regexp = "^[a-z]{2}(-[a-zA-Z0-9]{2,8}){0,1}$") 
  @Schema(name = "lang", description = "A language tag that specifies the primary language of both the application and its AppD entry, as defined by IETF RFC 5646.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("lang")
  public String getLang() {
    return lang;
  }

  public void setLang(String lang) {
    this.lang = lang;
  }

  public BaseApplication description(String description) {
    this.description = description;
    return this;
  }

  /**
   * Description of the application. This will typically be a 1-2 paragraph style blurb about the application. 
   * @return description
   */
  
  @Schema(name = "description", description = "Description of the application. This will typically be a 1-2 paragraph style blurb about the application. ", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("description")
  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public BaseApplication categories(List<String> categories) {
    this.categories = categories;
    return this;
  }

  public BaseApplication addCategoriesItem(String categoriesItem) {
    if (this.categories == null) {
      this.categories = new ArrayList<>();
    }
    this.categories.add(categoriesItem);
    return this;
  }

  /**
   * An array of string categories that describe the application.  These are meant as a hint to catalogs or stores listing FDC3-enabled  apps and it is expected that these will make a best effort to find  appropriate categories (or category) under which to list the app.  AppD record authors are encouraged to use lower-case and, where  possible, to select categories from the following list:  - allocations - analytics - charts - chat - communication - compliance - crm - developer tools - events - execution management - file sharing - market data - news - networking - office apps - order management - other - portfolio management - presentation - pricing - productivity - research - risk - screen sharing - security - spreadsheet - trade cost analysis - trading system - training - travel - video - visualisation - weather 
   * @return categories
   */
  
  @Schema(name = "categories", description = "An array of string categories that describe the application.  These are meant as a hint to catalogs or stores listing FDC3-enabled  apps and it is expected that these will make a best effort to find  appropriate categories (or category) under which to list the app.  AppD record authors are encouraged to use lower-case and, where  possible, to select categories from the following list:  - allocations - analytics - charts - chat - communication - compliance - crm - developer tools - events - execution management - file sharing - market data - news - networking - office apps - order management - other - portfolio management - presentation - pricing - productivity - research - risk - screen sharing - security - spreadsheet - trade cost analysis - trading system - training - travel - video - visualisation - weather ", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("categories")
  public List<String> getCategories() {
    return categories;
  }

  public void setCategories(List<String> categories) {
    this.categories = categories;
  }

  public BaseApplication icons(List<@Valid Icon> icons) {
    this.icons = icons;
    return this;
  }

  public BaseApplication addIconsItem(Icon iconsItem) {
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
  public List<@Valid Icon> getIcons() {
    return icons;
  }

  public void setIcons(List<@Valid Icon> icons) {
    this.icons = icons;
  }

  public BaseApplication screenshots(List<@Valid Screenshot> screenshots) {
    this.screenshots = screenshots;
    return this;
  }

  public BaseApplication addScreenshotsItem(Screenshot screenshotsItem) {
    if (this.screenshots == null) {
      this.screenshots = new ArrayList<>();
    }
    this.screenshots.add(screenshotsItem);
    return this;
  }

  /**
   * Array of images to show the user when they are looking at app description. Each image can have an optional description/tooltip
   * @return screenshots
   */
  @Valid 
  @Schema(name = "screenshots", description = "Array of images to show the user when they are looking at app description. Each image can have an optional description/tooltip", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("screenshots")
  public List<@Valid Screenshot> getScreenshots() {
    return screenshots;
  }

  public void setScreenshots(List<@Valid Screenshot> screenshots) {
    this.screenshots = screenshots;
  }

  public BaseApplication contactEmail(String contactEmail) {
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

  public BaseApplication supportEmail(String supportEmail) {
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

  public BaseApplication moreInfo(URI moreInfo) {
    this.moreInfo = moreInfo;
    return this;
  }

  /**
   * Optional URL that provides more infomation about the application
   * @return moreInfo
   */
  @Valid 
  @Schema(name = "moreInfo", description = "Optional URL that provides more infomation about the application", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("moreInfo")
  public URI getMoreInfo() {
    return moreInfo;
  }

  public void setMoreInfo(URI moreInfo) {
    this.moreInfo = moreInfo;
  }

  public BaseApplication publisher(String publisher) {
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

  public BaseApplication customConfig(List<@Valid NameValuePair> customConfig) {
    this.customConfig = customConfig;
    return this;
  }

  public BaseApplication addCustomConfigItem(NameValuePair customConfigItem) {
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

  public BaseApplication hostManifests(Map<String, HostManifestsValue> hostManifests) {
    this.hostManifests = hostManifests;
    return this;
  }

  public BaseApplication putHostManifestsItem(String key, HostManifestsValue hostManifestsItem) {
    if (this.hostManifests == null) {
      this.hostManifests = new HashMap<>();
    }
    this.hostManifests.put(key, hostManifestsItem);
    return this;
  }

  /**
   * A mapping from host name to a host-specific application manifest object or URI from which that manifest can be retrieved. The manifest should provide details required to launch and use the application within the specified host. The manifest _MAY_ duplicate or  override information provided in the `details` field.
   * @return hostManifests
   */
  @Valid 
  @Schema(name = "hostManifests", description = "A mapping from host name to a host-specific application manifest object or URI from which that manifest can be retrieved. The manifest should provide details required to launch and use the application within the specified host. The manifest _MAY_ duplicate or  override information provided in the `details` field.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("hostManifests")
  public Map<String, HostManifestsValue> getHostManifests() {
    return hostManifests;
  }

  public void setHostManifests(Map<String, HostManifestsValue> hostManifests) {
    this.hostManifests = hostManifests;
  }

  public BaseApplication interop(Interop interop) {
    this.interop = interop;
    return this;
  }

  /**
   * Get interop
   * @return interop
   */
  @Valid 
  @Schema(name = "interop", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("interop")
  public Interop getInterop() {
    return interop;
  }

  public void setInterop(Interop interop) {
    this.interop = interop;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    BaseApplication baseApplication = (BaseApplication) o;
    return Objects.equals(this.appId, baseApplication.appId) &&
        Objects.equals(this.name, baseApplication.name) &&
        Objects.equals(this.type, baseApplication.type) &&
        Objects.equals(this.details, baseApplication.details) &&
        Objects.equals(this.version, baseApplication.version) &&
        Objects.equals(this.title, baseApplication.title) &&
        Objects.equals(this.tooltip, baseApplication.tooltip) &&
        Objects.equals(this.lang, baseApplication.lang) &&
        Objects.equals(this.description, baseApplication.description) &&
        Objects.equals(this.categories, baseApplication.categories) &&
        Objects.equals(this.icons, baseApplication.icons) &&
        Objects.equals(this.screenshots, baseApplication.screenshots) &&
        Objects.equals(this.contactEmail, baseApplication.contactEmail) &&
        Objects.equals(this.supportEmail, baseApplication.supportEmail) &&
        Objects.equals(this.moreInfo, baseApplication.moreInfo) &&
        Objects.equals(this.publisher, baseApplication.publisher) &&
        Objects.equals(this.customConfig, baseApplication.customConfig) &&
        Objects.equals(this.hostManifests, baseApplication.hostManifests) &&
        Objects.equals(this.interop, baseApplication.interop);
  }

  @Override
  public int hashCode() {
    return Objects.hash(appId, name, type, details, version, title, tooltip, lang, description, categories, icons, screenshots, contactEmail, supportEmail, moreInfo, publisher, customConfig, hostManifests, interop);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class BaseApplication {\n");
    sb.append("    appId: ").append(toIndentedString(appId)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    type: ").append(toIndentedString(type)).append("\n");
    sb.append("    details: ").append(toIndentedString(details)).append("\n");
    sb.append("    version: ").append(toIndentedString(version)).append("\n");
    sb.append("    title: ").append(toIndentedString(title)).append("\n");
    sb.append("    tooltip: ").append(toIndentedString(tooltip)).append("\n");
    sb.append("    lang: ").append(toIndentedString(lang)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    categories: ").append(toIndentedString(categories)).append("\n");
    sb.append("    icons: ").append(toIndentedString(icons)).append("\n");
    sb.append("    screenshots: ").append(toIndentedString(screenshots)).append("\n");
    sb.append("    contactEmail: ").append(toIndentedString(contactEmail)).append("\n");
    sb.append("    supportEmail: ").append(toIndentedString(supportEmail)).append("\n");
    sb.append("    moreInfo: ").append(toIndentedString(moreInfo)).append("\n");
    sb.append("    publisher: ").append(toIndentedString(publisher)).append("\n");
    sb.append("    customConfig: ").append(toIndentedString(customConfig)).append("\n");
    sb.append("    hostManifests: ").append(toIndentedString(hostManifests)).append("\n");
    sb.append("    interop: ").append(toIndentedString(interop)).append("\n");
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

