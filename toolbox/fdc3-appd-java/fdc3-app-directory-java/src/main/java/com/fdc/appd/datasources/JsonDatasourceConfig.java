package com.fdc.appd.datasources;


import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;


/**
 * This is the main configuration holder for the application details JSON file .
 * The <fdc.appd.appJson> value should be included in the application properties.</Path>
 */
@Component
@ConfigurationProperties("fdc.appd.app-json")
public class JsonDatasourceConfig {

    public String path ;

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}
