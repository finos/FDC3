package com.fdc.appd;

import com.fdc.appd.model.ApplicationSearchResponseV1;
import com.fdc.appd.model.ApplicationV1;
import jakarta.annotation.Generated;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.context.request.NativeWebRequest;

import java.util.Optional;

/**
 * A delegate to be called by the {@link V1ApiController}}.
 * Implement this interface with a {@link org.springframework.stereotype.Service} annotated class.
 */
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-11-10T19:40:14.622447+05:30[Asia/Kolkata]", comments = "Generator version: 7.8.0")
public interface V1ApiDelegate {

    default Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    /**
     * GET /v1/apps/{appId} : Retrieve an application definition
     *
     * @param appId  (required)
     * @return OK (status code 200)
     *         or Bad request. (status code 400)
     *         or Forbidden: Certificate authentication is not allowed for the requested user. (status code 403)
     *         or Server error, see response body for further details. (status code 500)
     * @deprecated
     * @see V1Api#v1AppsAppIdGet
     */
    @Deprecated
    default ResponseEntity<ApplicationV1> v1AppsAppIdGet(String appId) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"images\" : [ { \"url\" : \"https://openapi-generator.tech\" }, { \"url\" : \"https://openapi-generator.tech\" } ], \"intents\" : [ { \"customConfig\" : \"{}\", \"displayName\" : \"displayName\", \"name\" : \"name\", \"contexts\" : [ \"contexts\", \"contexts\" ] }, { \"customConfig\" : \"{}\", \"displayName\" : \"displayName\", \"name\" : \"name\", \"contexts\" : [ \"contexts\", \"contexts\" ] } ], \"contactEmail\" : \"contactEmail\", \"manifest\" : \"manifest\", \"tooltip\" : \"tooltip\", \"manifestType\" : \"manifestType\", \"description\" : \"description\", \"title\" : \"title\", \"icons\" : [ { \"icon\" : \"https://openapi-generator.tech\" }, { \"icon\" : \"https://openapi-generator.tech\" } ], \"version\" : \"version\", \"supportEmail\" : \"supportEmail\", \"customConfig\" : [ { \"name\" : \"name\", \"value\" : \"value\" }, { \"name\" : \"name\", \"value\" : \"value\" } ], \"appId\" : \"appId\", \"name\" : \"name\", \"publisher\" : \"publisher\" }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
                if (mediaType.isCompatibleWith(MediaType.valueOf("*/*"))) {
                    String exampleString = "{ \"code\" : 0, \"message\" : \"message\" }";
                    ApiUtil.setExampleResponse(request, "*/*", exampleString);
                    break;
                }
                if (mediaType.isCompatibleWith(MediaType.valueOf("*/*"))) {
                    String exampleString = "{ \"code\" : 0, \"message\" : \"message\" }";
                    ApiUtil.setExampleResponse(request, "*/*", exampleString);
                    break;
                }
                if (mediaType.isCompatibleWith(MediaType.valueOf("*/*"))) {
                    String exampleString = "{ \"code\" : 0, \"message\" : \"message\" }";
                    ApiUtil.setExampleResponse(request, "*/*", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    /**
     * POST /v1/apps : Create a new application definition
     *
     * @param applicationV1  (required)
     * @return OK (status code 200)
     *         or Bad request. (status code 400)
     *         or Forbidden: Certificate authentication is not allowed for the requested user. (status code 403)
     *         or Server error, see response body for further details. (status code 500)
     * @deprecated
     * @see V1Api#v1AppsPost
     */
    @Deprecated
    default ResponseEntity<ApplicationSearchResponseV1> v1AppsPost(ApplicationV1 applicationV1) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"message\" : \"message\", \"applications\" : [ { \"images\" : [ { \"url\" : \"https://openapi-generator.tech\" }, { \"url\" : \"https://openapi-generator.tech\" } ], \"intents\" : [ { \"customConfig\" : \"{}\", \"displayName\" : \"displayName\", \"name\" : \"name\", \"contexts\" : [ \"contexts\", \"contexts\" ] }, { \"customConfig\" : \"{}\", \"displayName\" : \"displayName\", \"name\" : \"name\", \"contexts\" : [ \"contexts\", \"contexts\" ] } ], \"contactEmail\" : \"contactEmail\", \"manifest\" : \"manifest\", \"tooltip\" : \"tooltip\", \"manifestType\" : \"manifestType\", \"description\" : \"description\", \"title\" : \"title\", \"icons\" : [ { \"icon\" : \"https://openapi-generator.tech\" }, { \"icon\" : \"https://openapi-generator.tech\" } ], \"version\" : \"version\", \"supportEmail\" : \"supportEmail\", \"customConfig\" : [ { \"name\" : \"name\", \"value\" : \"value\" }, { \"name\" : \"name\", \"value\" : \"value\" } ], \"appId\" : \"appId\", \"name\" : \"name\", \"publisher\" : \"publisher\" }, { \"images\" : [ { \"url\" : \"https://openapi-generator.tech\" }, { \"url\" : \"https://openapi-generator.tech\" } ], \"intents\" : [ { \"customConfig\" : \"{}\", \"displayName\" : \"displayName\", \"name\" : \"name\", \"contexts\" : [ \"contexts\", \"contexts\" ] }, { \"customConfig\" : \"{}\", \"displayName\" : \"displayName\", \"name\" : \"name\", \"contexts\" : [ \"contexts\", \"contexts\" ] } ], \"contactEmail\" : \"contactEmail\", \"manifest\" : \"manifest\", \"tooltip\" : \"tooltip\", \"manifestType\" : \"manifestType\", \"description\" : \"description\", \"title\" : \"title\", \"icons\" : [ { \"icon\" : \"https://openapi-generator.tech\" }, { \"icon\" : \"https://openapi-generator.tech\" } ], \"version\" : \"version\", \"supportEmail\" : \"supportEmail\", \"customConfig\" : [ { \"name\" : \"name\", \"value\" : \"value\" }, { \"name\" : \"name\", \"value\" : \"value\" } ], \"appId\" : \"appId\", \"name\" : \"name\", \"publisher\" : \"publisher\" } ] }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"code\" : 0, \"message\" : \"message\" }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"code\" : 0, \"message\" : \"message\" }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"code\" : 0, \"message\" : \"message\" }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    /**
     * GET /v1/apps/search : Retrieve a list of applications based on parameters provided.  Depending on implementation, parameter values should self describe search format and type (e.g. Regex)
     *
     * @param appId The unique application identifier located within a specific application directory instance.  (optional)
     * @param name The name of the application. The name should be unique within an FDC3 App Directory instance. The exception to the uniqueness constraint is that an App Directory can hold definitions for multiple versions of the same app. The same appName could occur in other directories. We are not currently specifying app name conventions in the document.  (optional)
     * @param version Version of the application. This allows multiple app versions to be defined using the same app name. This can be a triplet but can also include things like 1.2.5 (BETA) (optional)
     * @param title Optional title for the application, if missing use appName, typically used in a launcher UI. (optional)
     * @param tooltip Optional tooltip description e.g. for a launcher (optional)
     * @param description Description of the application. This will typically be a 1-2 paragraph style blurb about the application. Allow mark up language (optional)
     * @param intentName name of intent (optional)
     * @param intentDisplayName displayName of intent (optional)
     * @param intentContext search contexts list (optional)
     * @return OK (status code 200)
     *         or Bad request. (status code 400)
     *         or Forbidden: Certificate authentication is not allowed for the requested user. (status code 403)
     *         or Server error, see response body for further details. (status code 500)
     * @deprecated
     * @see V1Api#v1AppsSearchGet
     */
    @Deprecated
    default ResponseEntity<ApplicationSearchResponseV1> v1AppsSearchGet(String appId,
        String name,
        String version,
        String title,
        String tooltip,
        String description,
        String intentName,
        String intentDisplayName,
        String intentContext) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"message\" : \"message\", \"applications\" : [ { \"images\" : [ { \"url\" : \"https://openapi-generator.tech\" }, { \"url\" : \"https://openapi-generator.tech\" } ], \"intents\" : [ { \"customConfig\" : \"{}\", \"displayName\" : \"displayName\", \"name\" : \"name\", \"contexts\" : [ \"contexts\", \"contexts\" ] }, { \"customConfig\" : \"{}\", \"displayName\" : \"displayName\", \"name\" : \"name\", \"contexts\" : [ \"contexts\", \"contexts\" ] } ], \"contactEmail\" : \"contactEmail\", \"manifest\" : \"manifest\", \"tooltip\" : \"tooltip\", \"manifestType\" : \"manifestType\", \"description\" : \"description\", \"title\" : \"title\", \"icons\" : [ { \"icon\" : \"https://openapi-generator.tech\" }, { \"icon\" : \"https://openapi-generator.tech\" } ], \"version\" : \"version\", \"supportEmail\" : \"supportEmail\", \"customConfig\" : [ { \"name\" : \"name\", \"value\" : \"value\" }, { \"name\" : \"name\", \"value\" : \"value\" } ], \"appId\" : \"appId\", \"name\" : \"name\", \"publisher\" : \"publisher\" }, { \"images\" : [ { \"url\" : \"https://openapi-generator.tech\" }, { \"url\" : \"https://openapi-generator.tech\" } ], \"intents\" : [ { \"customConfig\" : \"{}\", \"displayName\" : \"displayName\", \"name\" : \"name\", \"contexts\" : [ \"contexts\", \"contexts\" ] }, { \"customConfig\" : \"{}\", \"displayName\" : \"displayName\", \"name\" : \"name\", \"contexts\" : [ \"contexts\", \"contexts\" ] } ], \"contactEmail\" : \"contactEmail\", \"manifest\" : \"manifest\", \"tooltip\" : \"tooltip\", \"manifestType\" : \"manifestType\", \"description\" : \"description\", \"title\" : \"title\", \"icons\" : [ { \"icon\" : \"https://openapi-generator.tech\" }, { \"icon\" : \"https://openapi-generator.tech\" } ], \"version\" : \"version\", \"supportEmail\" : \"supportEmail\", \"customConfig\" : [ { \"name\" : \"name\", \"value\" : \"value\" }, { \"name\" : \"name\", \"value\" : \"value\" } ], \"appId\" : \"appId\", \"name\" : \"name\", \"publisher\" : \"publisher\" } ] }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"code\" : 0, \"message\" : \"message\" }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"code\" : 0, \"message\" : \"message\" }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"code\" : 0, \"message\" : \"message\" }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

}
