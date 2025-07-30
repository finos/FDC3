package com.fdc.appd.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * ApplicationSearchResponseV1
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-11-10T19:40:14.622447+05:30[Asia/Kolkata]", comments = "Generator version: 7.8.0")
public class ApplicationSearchResponseV1 {

  @Valid
  private List<@Valid ApplicationV1> applications = new ArrayList<>();

  private String message;

  public ApplicationSearchResponseV1 applications(List<@Valid ApplicationV1> applications) {
    this.applications = applications;
    return this;
  }

  public ApplicationSearchResponseV1 addApplicationsItem(ApplicationV1 applicationsItem) {
    if (this.applications == null) {
      this.applications = new ArrayList<>();
    }
    this.applications.add(applicationsItem);
    return this;
  }

  /**
   * List of applications 
   * @return applications
   */
  @Valid 
  @Schema(name = "applications", description = "List of applications ", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("applications")
  public List<@Valid ApplicationV1> getApplications() {
    return applications;
  }

  public void setApplications(List<@Valid ApplicationV1> applications) {
    this.applications = applications;
  }

  public ApplicationSearchResponseV1 message(String message) {
    this.message = message;
    return this;
  }

  /**
   * Response message providing status of query 
   * @return message
   */
  
  @Schema(name = "message", description = "Response message providing status of query ", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("message")
  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ApplicationSearchResponseV1 applicationSearchResponseV1 = (ApplicationSearchResponseV1) o;
    return Objects.equals(this.applications, applicationSearchResponseV1.applications) &&
        Objects.equals(this.message, applicationSearchResponseV1.message);
  }

  @Override
  public int hashCode() {
    return Objects.hash(applications, message);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ApplicationSearchResponseV1 {\n");
    sb.append("    applications: ").append(toIndentedString(applications)).append("\n");
    sb.append("    message: ").append(toIndentedString(message)).append("\n");
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

