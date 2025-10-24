package com.fdc.appd;


import jakarta.annotation.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Optional;

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2024-11-10T19:40:14.622447+05:30[Asia/Kolkata]", comments = "Generator version: 7.8.0")
@Controller
@RequestMapping("${openapi.fDC3ApplicationDirectory.base-path:/appd}")
public class V1ApiController implements V1Api {

    private final V1ApiDelegate delegate;

    public V1ApiController(@Autowired(required = false) V1ApiDelegate delegate) {
        this.delegate = Optional.ofNullable(delegate).orElse(new V1ApiDelegate() {});
    }

    @Override
    public V1ApiDelegate getDelegate() {
        return delegate;
    }

}
