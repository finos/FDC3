package com.fdc.appd.security;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Objects;

@Service
public class UserManagementServiceImpl implements UserManagementService {

    private static final Logger log = LoggerFactory.getLogger(UserManagementServiceImpl.class);

    HashMap<String , String > userDb ;
    @Override
    public boolean validateUser(String userName) {
        if(Objects.isNull(userDb))
            initializeUserDb();
        return userDb.containsKey(userName);
    }

    private void initializeUserDb()  {
        this.userDb=new HashMap<>();
        ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json().build();
        ClassPathResource resource = new ClassPathResource("user_db.json");

        try {
            userDb= objectMapper.readValue(resource.getInputStream(), new TypeReference<HashMap<String,String>>() {});
        } catch (IOException e) {
            log.error("Error in loading the database", e);
        }
    }
}
