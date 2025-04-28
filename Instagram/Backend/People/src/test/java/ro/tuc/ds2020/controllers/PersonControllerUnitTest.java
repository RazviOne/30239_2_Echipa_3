package ro.tuc.ds2020.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import ro.tuc.ds2020.Ds2020TestConfig;
import ro.tuc.ds2020.dtos.PersonDTO;
import ro.tuc.ds2020.services.PersonService;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


public class PersonControllerUnitTest extends Ds2020TestConfig {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PersonService service;

    @Test
    public void insertPersonTest() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        PersonDTO personDTO = new PersonDTO("John", "johnutzu", "ciocanim", 0,
                false, false, "john.johnutzu@gmail.com", "0724917302",
                LocalDateTime.parse("2000-09-15T00:10:00", DateTimeFormatter.ISO_LOCAL_DATE_TIME), "Suplacu de Barcau");

        String personString = "{\n" +
                "    \"name\": \"Coroian Razvan\",\n" +
                "    \"username\": \"RazviOne\",\n" +
                "    \"password\": \"mechanicMaster\",\n" +
                "    \"userScore\": 100,\n" +
                "    \"isAdmin\": true,\n" +
                "    \"isBanned\": false,\n" +
                "    \"email\": \"razvan.coroian@gmail.com\",\n" +
                "    \"phoneNumber\": \"0345123426\",\n" +
                "    \"birthDate\": \"2000-09-15T00:10:00\",\n" +
                "    \"homeCity\": \"Cluj-Napoca\"\n" +
                "}";
        mockMvc.perform(post("/people")
                .content(personString)
                .contentType("application/json"))
                .andExpect(status().isCreated());
    }

    @Test
    public void insertPersonTestFailsDueToAge() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        PersonDTO personDTO = new PersonDTO("John", "johnutzu", "ciocanim", 0,
                false, false, "john.johnutzu@gmail.com", "0724917302",
                LocalDateTime.of(2000, 1, 1, 0, 0), "Suplacu de Barcau");

        String personString = "{\n" +
                "    \"name\": \"Coroian Razvan\",\n" +
                "    \"username\": \"RazviOne\",\n" +
                "    \"password\": \"mechanicMaster\",\n" +
                "    \"userScore\": 100,\n" +
                "    \"isAdmin\": true,\n" +
                "    \"isBanned\": false,\n" +
                "    \"email\": \"razvan.coroian@gmail.com\",\n" +
                "    \"phoneNumber\": \"0345123426\",\n" +
                "    \"birthDate\": \"2000-09-15T00:10:00\",\n" +
                "    \"homeCity\": \"Cluj-Napoca\"\n" +
                "}";

        mockMvc.perform(post("/people")
                .content(personString)
                .contentType("application/json"))
                .andExpect(status().isCreated());
    }

    @Test
    public void insertPersonTestFailsDueToNull() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        PersonDTO personDTO = new PersonDTO(null, "johnutzu", "ciocanim", 0,
                false, false, "john.johnutzu@gmail.com", "0724917302",
                LocalDateTime.of(2000, 1, 1, 0, 0), "Suplacu de Barcau");

        String personString = "{\n" +
                "    \"name\": null,\n" +
                "    \"username\": \"RazviOne\",\n" +
                "    \"password\": \"mechanicMaster\",\n" +
                "    \"userScore\": 100,\n" +
                "    \"isAdmin\": true,\n" +
                "    \"isBanned\": false,\n" +
                "    \"email\": \"razvan.coroian@gmail.com\",\n" +
                "    \"phoneNumber\": \"0345123426\",\n" +
                "    \"birthDate\": \"2000-09-15T00:10:00\",\n" +
                "    \"homeCity\": \"Cluj-Napoca\"\n" +
                "}";

        mockMvc.perform(post("/people")
                .content(personString)
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }

}
