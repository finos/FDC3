package com.fdc.appd.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.io.IOException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito.*;
import org.mockito.MockitoAnnotations;

import com.fdc.appd.datasources.JsonDatasourceConfig;
import com.fdc.appd.model.Application;

public class V2ApplicationJsonReaderImplTest {

    @Mock
    JsonDatasourceConfig jsonDatasourceConfig;

    @InjectMocks
    private V2ApplicationJsonReaderImpl applicationJsonReaderImpl;

    @BeforeEach 
    public void setup() {
        MockitoAnnotations.openMocks(this); // Initialize mocks
        when(jsonDatasourceConfig.getPath()).thenReturn("test.local.v2.json");
    }
    @Test
    void testGetAllApplication() {
        try {
            assertEquals(4, applicationJsonReaderImpl.getAllApplication().getApplications().size());
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
    }

    

    @Test
    void testGetApplication() {
        try {
            Application app = applicationJsonReaderImpl.getApplication("ChannelsAppId");
            assertEquals("ChannelsApp", app.getName());
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }
      @Test
    void testGetApplicationFail() {
            RuntimeException exception= assertThrows(RuntimeException.class, ()->{
                Application app = applicationJsonReaderImpl.getApplication("randomApp");
                assertEquals("ChannelsApp", app.getName());
            });
            assertEquals("Application Not found with the given appId", exception.getMessage());
            
      
    }
}
