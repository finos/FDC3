package com.fdc.appd;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito.*;

import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.*;
import com.fdc.appd.model.*;
import com.fdc.appd.security.UserManagementService;
import com.fdc.appd.service.ApplicationReaderFactory;
import com.fdc.appd.service.V2ApplicationJsonReaderImpl;
import com.fdc.appd.service.V2ApplicationReader;


@ExtendWith(MockitoExtension.class)
public class V2ApiDelegateImplTests {


    @Mock
    UserManagementService userManagementService;

    @Mock
    ApplicationReaderFactory readerFactory;

    V2ApplicationReader applicationReader;

    @InjectMocks
    private V2ApiDelegateImpl v2ApiDelegateImpl;

       @BeforeEach // For JUnit 5
    // @Before // For JUnit 4
    public void setup() {
        MockitoAnnotations.openMocks(this); // Initialize mocks
        applicationReader = Mockito.mock(V2ApplicationJsonReaderImpl.class);
        
        when(readerFactory.createApplicationReader()).thenReturn(applicationReader);
        Mockito.when(userManagementService.validateUser(Mockito.anyString())).thenReturn(true);
    }

    String alice="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.As-48YMQrjkiEoPTj7COq9LoCEQsZn8IfCOPA0a-psI";

    @Test
    void testV2AppsAppIdGetSuccess() {
        
        Application application = applications().stream().filter(x -> x.getAppId().equals("APP_ID_1")).findFirst().get();
        try {
            Mockito.when(applicationReader.getApplication(Mockito.anyString())).thenReturn(application);
            ResponseEntity<Application> response = v2ApiDelegateImpl.v2AppsAppIdGet("APP_ID_1", alice);
            System.out.println(response);
            assertEquals("app1", response.getBody().getName());
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    @Test
    void testV2AppsAppIdGetFail() {
        
        assertThrows(RuntimeException.class, ()->{
            Mockito.when(applicationReader.getApplication(Mockito.anyString())).thenThrow(new IOException());
            ResponseEntity<Application> response = v2ApiDelegateImpl.v2AppsAppIdGet("APP_ID_2", alice);
            System.out.println(response);
            assertEquals("app1", response.getBody().getName());

        });
    }

    @Test
    void testV2AppsAppIdGetAppNotFound() {
        
        assertThrows(RuntimeException.class, ()->{
            Mockito.when(applicationReader.getApplication(Mockito.anyString())).thenThrow(new RuntimeException("Application Not found with the given appId\""));
            ResponseEntity<Application> response = v2ApiDelegateImpl.v2AppsAppIdGet("APP_ID_2", alice);
            System.out.println(response);
            assertEquals("app1", response.getBody().getName());

        });
    }

    @Test
    void testV2AppsGet() {

        try {
            AllApplicationsResponse allApplicationsResponse = new AllApplicationsResponse();
            allApplicationsResponse.applications(applications());
            Mockito.when(applicationReader.getAllApplication()).thenReturn(allApplicationsResponse);
            ResponseEntity<AllApplicationsResponse> response = v2ApiDelegateImpl.v2AppsGet(alice);
            System.out.println(response);
            assertEquals(applications().size(), response.getBody().getApplications().size());
        } catch (IOException e) {
           
           e.printStackTrace();
        }
        

    }

    private List<Application> applications(){
        Application application = new Application();
        application.setAppId("APP_ID_1");
        application.setName("app1");

        Application application2 = new Application();
        application2.setAppId("APP_ID_2");
        application2.setName("app2");
        List<Application> list = new LinkedList<>();
        list.add(application2);
        list.add(application);
        return list;
    }
}
