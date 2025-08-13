package com.fdc.appd.service;

import com.fdc.appd.model.AllApplicationsResponse;
import com.fdc.appd.model.Application;

import java.io.IOException;




public interface V2ApplicationReader {

    /**
     *
     * @param appId
     * @return com.fdc.appd.model.Application
     * @throws IOException
     */
    public Application getApplication(String appId) throws IOException;

    /**
     *
     * @return com.fdc.appd.model.AllApplicationsResponse
     * @throws IOException
     */
    public AllApplicationsResponse getAllApplication() throws IOException;
}
