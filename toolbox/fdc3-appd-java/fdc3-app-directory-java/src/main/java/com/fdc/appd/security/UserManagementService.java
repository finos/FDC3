package com.fdc.appd.security;

public interface UserManagementService {

    default public boolean validateUser(String userName)  {
       return false;
    }
}
