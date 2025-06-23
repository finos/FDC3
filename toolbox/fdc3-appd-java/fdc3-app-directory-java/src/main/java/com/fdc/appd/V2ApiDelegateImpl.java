package com.fdc.appd;

import com.fdc.appd.model.AllApplicationsResponse;
import com.fdc.appd.model.Application;
import com.fdc.appd.security.JwtUtil;
import com.fdc.appd.security.UserManagementService;
import com.fdc.appd.service.ApplicationReaderFactory;
import com.fdc.appd.service.V2ApplicationReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class V2ApiDelegateImpl implements V2ApiDelegate{


    @Autowired
    UserManagementService userManagementService;


    @Autowired
    ApplicationReaderFactory readerFactory;


    /**
     * GET /v2/apps/{appId} : Retrieve an application definition
     *
     * @param appId (required)
     * @return OK (status code 200)
     * or Bad request. (status code 400)
     * or Forbidden: Certificate authentication is not allowed for the requested user. (status code 403)
     * or Server error, see response body for further details. (status code 500)
     * @see V2Api#v2AppsAppIdGet
     */
    @Override
    public ResponseEntity<Application> v2AppsAppIdGet(String appId, String authHeader) {
        if(!userManagementService.validateUser(JwtUtil.getUser(authHeader)))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        V2ApplicationReader applicationReader = readerFactory.createApplicationReader();
        try {
            return ResponseEntity.ok(applicationReader.getApplication(appId));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * GET /v2/apps : Retrieve all application definitions
     *
     * @return OK (status code 200)
     * or Bad request. (status code 400)
     * or Forbidden: Certificate authentication is not allowed for the requested user. (status code 403)
     * or Server error, see response body for further details. (status code 500)
     * @see V2Api#v2AppsGet
     */
    @Override
    public ResponseEntity<AllApplicationsResponse> v2AppsGet(String authHeader) {
        if(!userManagementService.validateUser(JwtUtil.getUser(authHeader)))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        V2ApplicationReader applicationReader = readerFactory.createApplicationReader();
        try {
            AllApplicationsResponse allApplication = applicationReader.getAllApplication();
            allApplication.setMessage("Ok");
            ResponseEntity<AllApplicationsResponse> ok = ResponseEntity.ok(allApplication);
            return ok;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
