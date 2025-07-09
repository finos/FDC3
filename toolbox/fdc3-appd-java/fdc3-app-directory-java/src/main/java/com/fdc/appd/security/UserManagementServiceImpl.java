package com.fdc.appd.security;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Objects;

@Service
public class UserManagementServiceImpl implements UserManagementService {


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
            System.out.println("Error in loading Users DB");
        }
    }
}
