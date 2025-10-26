package de.htw.radvis.web;

import de.htw.radvis.domain.Issue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class IssueController {

    @GetMapping("/issues")
    public List<Issue> getIssues() {
        return List.of(Issue.values());
    }


    @GetMapping("/issue-labels")
    public List<IssueLabelDTO> getIssueLabels() {

        return Arrays.stream(Issue.values())
                .map(issue -> new IssueLabelDTO(issue.name(), issue.getLabel()))
                .collect(Collectors.toList());
    }
}
