package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.PersonDTO;
import ro.tuc.ds2020.services.PersonService;

import javax.validation.Valid;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@CrossOrigin
@RequestMapping(value = "/people")
public class PersonController {

    private final PersonService personService;

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping()
    public ResponseEntity<List<PersonDTO>> getPersons() {
        List<PersonDTO> dtos = personService.findPersons();
        for (PersonDTO dto : dtos) {
            Link personLink = linkTo(methodOn(PersonController.class)
                    .getPersonById(dto.getIdPerson())).withRel("personDetails");
            dto.add(personLink);
        }
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<Integer> insertPerson(@Valid @RequestBody PersonDTO personDTO) {
        Integer idPerson = personService.insert(personDTO);
        return new ResponseEntity<>(idPerson, HttpStatus.CREATED);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<PersonDTO> getPersonById(@PathVariable("id") Integer idPerson) {
        PersonDTO failedDto = new PersonDTO();
        failedDto.setIdPerson(-1);
        try {
            PersonDTO dto = personService.findPersonById(idPerson);
            return new ResponseEntity<>(dto, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(failedDto, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(value = "/authenticate/{username}/{password}")
    public ResponseEntity<PersonDTO> authenticateUser(@PathVariable("username") String username,
                                                      @PathVariable("password") String password) {
        PersonDTO failedDto = new PersonDTO();
        failedDto.setIdPerson(-1);
        try {
            PersonDTO dto = personService.authenticateUser(username, password);
            if(dto == null){
                return new ResponseEntity<>(failedDto, HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(dto, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(failedDto, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(value = "/{id}")
    public ResponseEntity<PersonDTO> updatePerson(@Valid @RequestBody PersonDTO personDTO,
                                                  @PathVariable("id") Integer idPerson){
        PersonDTO failedDto = new PersonDTO();
        failedDto.setIdPerson(-1);
        try {
            personService.findPersonById(idPerson);
            personDTO.setIdPerson(idPerson);
            personService.update(personDTO);
            return new ResponseEntity<>(personDTO, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(failedDto, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(value = "/admins")
    public ResponseEntity<List<PersonDTO>> getAdmins(){
        List<PersonDTO> dtos = personService.findAdmins();
        for (PersonDTO dto : dtos) {
            Link personLink = linkTo(methodOn(PersonController.class)
                    .getPersonById(dto.getIdPerson())).withRel("personDetails");
            dto.add(personLink);
        }
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<PersonDTO> deletePerson(@PathVariable("id") Integer idPerson) {
        PersonDTO failedDto = new PersonDTO();
        failedDto.setIdPerson(-1);
        try {
            PersonDTO dto = personService.findPersonById(idPerson);
            personService.delete(idPerson);

            // Database Syncronization
            try {
                // Delete all Posts from the deleted Person
                URL urlPosts = new URL("http://localhost:8081/posts/person/" + idPerson);
                HttpURLConnection connectionPosts = (HttpURLConnection) urlPosts.openConnection();
                connectionPosts.setRequestMethod("DELETE");
                System.out.print("Status: " + connectionPosts.getResponseCode() + "\n");
                connectionPosts.disconnect();
            } catch (Exception ignored) {}

            try {
                // Delete all Reactions from the deleted Person
                URL urlReactions = new URL("http://localhost:8082/reactions/person/" + idPerson);
                HttpURLConnection connectionReactions = (HttpURLConnection) urlReactions.openConnection();
                connectionReactions.setRequestMethod("DELETE");
                System.out.print("Status: " + connectionReactions.getResponseCode() + "\n");
                connectionReactions.disconnect();

                return new ResponseEntity<>(dto, HttpStatus.ACCEPTED);
            } catch (Exception e) {
                return new ResponseEntity<>(dto, HttpStatus.ACCEPTED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(failedDto, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(value = "/ban/{id}")
    public ResponseEntity<PersonDTO> banPersonById(@PathVariable("id") Integer idPerson) {
        PersonDTO failedDto = new PersonDTO();
        failedDto.setIdPerson(-1);
        try {
            PersonDTO dto = personService.findPersonById(idPerson);
            personService.banUser(idPerson);
            return new ResponseEntity<>(dto, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(failedDto, HttpStatus.NOT_FOUND);
        }
    }

}
