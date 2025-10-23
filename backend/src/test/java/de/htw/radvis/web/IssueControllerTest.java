package de.htw.radvis.web;

import de.htw.radvis.domain.Issue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(IssueController.class)
public class IssueControllerTest {

        @Autowired
        MockMvc mvc;

        @Test
        void getIssues_returnsAllEnumValues_asJsonArray() throws Exception {
            var expected = java.util.Arrays.stream(Issue.values())
                    .map(Enum::name)
                    .toArray(String[]::new);

            mvc.perform(get("/api/issues").accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$", hasSize(expected.length)))
                    .andExpect(jsonPath("$", containsInAnyOrder(expected)));
        }

        @Test
        void getIssues_includesCorsHeader_forLocalhost4200() throws Exception {
            mvc.perform(get("/api/issues")
                            .header("Origin", "http://localhost:4200"))
                    .andExpect(status().isOk())
                    .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:4200"));
        }
}
