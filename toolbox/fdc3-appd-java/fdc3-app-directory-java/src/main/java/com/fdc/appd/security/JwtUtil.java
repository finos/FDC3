package com.fdc.appd.security;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JwtUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);

    private static final String SECRET_KEY = "mIU3RoraRfc8TF3ScboaF8lcQF0nb5gb"; // Use a secure key in production!

    private static Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public static Optional<Claims> validateToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return Optional.of(claims);
        } catch (Exception e) {
            log.error("Invalid Tokenb", e);
            throw new RuntimeException("Invalid token");
        }
    }


    public static String getUser(String token){
        Optional<Claims> claims = validateToken(token.substring(7));
        Claims claim = claims.get();
        return String.valueOf(claim.get("name"));
    }
}
