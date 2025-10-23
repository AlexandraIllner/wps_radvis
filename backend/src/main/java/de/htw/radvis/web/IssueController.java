package de.htw.radvis.web;

import de.htw.radvis.domain.Issue;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping
@CrossOrigin(origins = "http://localhost:4200")
public class IssueController {

    @GetMapping("/api/issues")
    public List<Issue> getIssues() {
        return List.of(Issue.values());
    }
}
