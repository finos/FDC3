package com.fdc.appd;


import jakarta.annotation.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-11-10T19:40:14.622447+05:30[Asia/Kolkata]", comments = "Generator version: 7.8.0")
@RestController
@RequestMapping("${openapi.fDC3ApplicationDirectory.base-path:/}")
public class V2ApiController implements V2Api {

    private final V2ApiDelegate delegate;

    public V2ApiController(@Autowired(required = false) V2ApiDelegate delegate) {
        this.delegate = Optional.ofNullable(delegate).get();
    }

    @Override
    public V2ApiDelegate getDelegate() {
        return delegate;
    }

}
