package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.PersonDTO;
import ro.tuc.ds2020.dtos.builders.PersonBuilder;
import ro.tuc.ds2020.entities.Person;
import ro.tuc.ds2020.repositories.PersonRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PersonService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PersonService.class);
    private final PersonRepository personRepository;

    @Autowired
    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public List<PersonDTO> findPersons() {
        List<Person> personList = personRepository.findAll();
        return personList.stream()
                .map(PersonBuilder::toPersonDTO)
                .collect(Collectors.toList());
    }

    public List<PersonDTO> findAdmins() {
        List<Person> personList = personRepository.findAdminUsers();
        return personList.stream()
                .map(PersonBuilder::toPersonDTO)
                .collect(Collectors.toList());
    }

    public PersonDTO findPersonById(Integer idPerson) {
        Optional<Person> prosumerOptional = personRepository.findById(idPerson);

        if (!prosumerOptional.isPresent()) {
            LOGGER.error("Person with idPerson {} was not found in db", idPerson);
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with idPerson: " + idPerson);
        }
        return PersonBuilder.toPersonDTO(prosumerOptional.get());
    }

    public Integer insert(PersonDTO personDTO) {
        Person person = PersonBuilder.toEntity(personDTO);
        person = personRepository.save(person);
        LOGGER.debug("Person with idPerson {} was inserted in db", person.getIdPerson());
        return person.getIdPerson();
    }

    public void update(PersonDTO personDTO) {
        Person person = PersonBuilder.toEntity(personDTO);
        person.setIdPerson(personDTO.getIdPerson());
        personRepository.save(person);
        LOGGER.debug("Person with idPerson {} was updated in db", person.getIdPerson());
    }

    public void delete(Integer idPerson){
        personRepository.deleteById(idPerson);
    }

    public PersonDTO authenticateUser(String username, String password) {
        Optional<Person> person = personRepository.findByUsername(username);

        if(person.isPresent()) {
            if(password.equals(person.get().getPassword())){
                return PersonBuilder.toPersonDTO(person.get());
            }
            else{
                return null;
            }
        }
        return null;
    }

    public void banUser(Integer idPerson){
        PersonDTO dto = findPersonById(idPerson);

        EmailService emailService = new EmailService();
        emailService.sendEmail(dto.getUsername());

        SMSService smsService = new SMSService();
        smsService.sendSMS();
    }
}