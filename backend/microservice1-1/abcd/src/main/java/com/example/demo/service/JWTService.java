package com.example.demo.service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Users;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JWTService {
//	@Autowired
//	JWTService jwt;
	public String generateJwt(Map<String,String> u1, String role) {
		String key="kdgijgtihjd,nbawe*thn%123455467869023vdfbhnumi,iu,sdfhurf";
				SecretKey skey=Keys.hmacShaKeyFor(key.getBytes());
				Map<String, String> claim =new HashMap<>();
				claim.put("un", u1.get("username"));
				claim.put("role", role);
				return Jwts.builder()
				.claims(claim)
				.issuedAt(new Date())
				.setExpiration(new Date(new Date().getTime() + 86400000))
				.signWith(skey)
				.compact();
				
	}
	public Map<String, String> validateJWT(String token)throws Exception{
		String key="kdgijgtihjd,nbawe*thn%123455467869023vdfbhnumi,iu,sdfhurf";
		SecretKey skey=Keys.hmacShaKeyFor(key.getBytes());
		Map<String, String> pjwt=new HashMap<>();
		Claims claim =Jwts.parser()
		.verifyWith(skey)
		.build()
		.parseSignedClaims(token)
		.getPayload();
		
		if(claim==null || claim.getExpiration().before(new Date())) {
			throw new Exception("Token invalid");
		}
	pjwt.put("username", claim.get("un").toString());
	pjwt.put("role", claim.get("role").toString());
	return pjwt;
	
		
	}

}
