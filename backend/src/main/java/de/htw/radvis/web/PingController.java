package de.htw.radvis.web;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ping")
@CrossOrigin(origins = "http://localhost:4200")
public class PingController {

    @GetMapping
    public Map<String, Object> ping()
    {
        return Map.of("ok", true, "service", "mock-backend");
    }
}
