package com.fdc.appd;

import com.fdc.appd.model.AllApplicationsResponse;
import com.fdc.appd.model.Application;
import jakarta.annotation.Generated;
import org.springframework.http.ResponseEntity;

/**
 * A delegate to be called by the {@link V2ApiController}}.
 * Implement this interface with a {@link org.springframework.stereotype.Service} annotated class.
 */
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-11-10T19:40:14.622447+05:30[Asia/Kolkata]", comments = "Generator version: 7.8.0")
public interface V2ApiDelegate {




    /**
     * GET /v2/apps/{appId} : Retrieve an application definition
     *
     * @param appId  (required)
     * @return OK (status code 200)
     *         or Bad request. (status code 400)
     *         or Forbidden: Certificate authentication is not allowed for the requested user. (status code 403)
     *         or Server error, see response body for further details. (status code 500)
     * @see V2Api#v2AppsAppIdGet
     */
     default public ResponseEntity<Application> v2AppsAppIdGet(String appId, String authHeader){
         return ResponseEntity.internalServerError().build();
     } ;



    /**
     * GET /v2/apps : Retrieve all application definitions
     *
     * @return OK (status code 200)
     *         or Bad request. (status code 400)
     *         or Forbidden: Certificate authentication is not allowed for the requested user. (status code 403)
     *         or Server error, see response body for further details. (status code 500)
     * @see V2Api#v2AppsGet
     */
    default public ResponseEntity<AllApplicationsResponse> v2AppsGet( String authHeader){
        return ResponseEntity.internalServerError().build();
    } ;

}
