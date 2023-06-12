package com.familyexpensetracker.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONObject;

import java.util.Map;
import java.util.HashMap;
import java.util.logging.Logger;

@Service
public class ForecastService {
    @Value("${forecast.service.url}")
    private String forecastServiceUrl;

    public String forecastExpenses(Long familyId, String targetDate) {
        RestTemplate restTemplate = new RestTemplate();

        // Set the headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create the request body as a JSONObject
        JSONObject json = new JSONObject();
        json.put("familyId", familyId.toString());
        json.put("targetDate", targetDate);

        // Create the request entity
        HttpEntity<String> request = new HttpEntity<>(json.toString(), headers);

        // Make the request and get the response
        ResponseEntity<String> responseEntity = restTemplate.postForEntity(forecastServiceUrl + "/forecast", request, String.class);

        // Log the JSON response
        Logger.getLogger("ForecastService").info("JSON response: " + responseEntity.getBody());

        return responseEntity.getBody();
    }
}
