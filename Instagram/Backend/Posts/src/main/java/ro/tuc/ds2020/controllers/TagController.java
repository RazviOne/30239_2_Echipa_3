package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.PostTagDTO;
import ro.tuc.ds2020.dtos.TagDTO;
import ro.tuc.ds2020.services.PostTagService;
import ro.tuc.ds2020.services.TagService;

import javax.validation.Valid;
import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/tags")
@CrossOrigin
public class TagController {

    private final TagService tagService;
    private final PostTagService postTagService;

    @Autowired
    public TagController(TagService tagService, PostTagService postTagService) {
        this.tagService = tagService;
        this.postTagService = postTagService;
    }

    @GetMapping
    public ResponseEntity<List<TagDTO>> getTags() {
        List<TagDTO> dtos = tagService.findTags();
        for (TagDTO dto : dtos) {
            Link tagLink = linkTo(methodOn(TagController.class)
                    .getTagById(dto.getIdTag())).withRel("tagDetails");
            dto.add(tagLink);
        }
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Integer> insertTag(@Valid @RequestBody TagDTO tagDTO) {
        Integer idTag = tagService.insert(tagDTO);
        return new ResponseEntity<>(idTag, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TagDTO> getTagById(@PathVariable("id") Integer idTag) {
        TagDTO failedDto = new TagDTO();
        failedDto.setIdTag(-1);
        try {
            TagDTO dto = tagService.findTagById(idTag);
            return new ResponseEntity<>(dto, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(failedDto, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<TagDTO> getTagByName(@PathVariable("name") String name) {
        TagDTO failedDto = new TagDTO();
        failedDto.setIdTag(-1);
        try {
            TagDTO dto = tagService.findTagByName("#" + name);
            return new ResponseEntity<>(dto, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(failedDto, HttpStatus.OK);
        }
    }

    @PostMapping("/{id}")
    public ResponseEntity<TagDTO> updateTag(@Valid @RequestBody TagDTO tagDTO,
                                            @PathVariable("id") Integer idTag) {
        TagDTO failedDto = new TagDTO();
        failedDto.setIdTag(-1);
        try {
            tagService.findTagById(idTag);
            tagDTO.setIdTag(idTag);
            tagService.update(tagDTO);
            return new ResponseEntity<>(tagDTO, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(failedDto, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<TagDTO> deleteTag(@PathVariable("id") Integer idTag) {
        TagDTO failedDto = new TagDTO();
        failedDto.setIdTag(-1);
        try {
            TagDTO dto = tagService.findTagById(idTag);
            tagService.delete(idTag);

            try {
                // Database Syncronization
                // Delete all PostTags that contain the deleted Tag
                List<PostTagDTO> postTagDTOList =  postTagService.findPostTags();
                for (PostTagDTO postTagDTO : postTagDTOList) {
                    if(postTagDTO.getIdTag().equals(idTag)) {
                        postTagService.delete(postTagDTO.getIdPostTag());
                    }
                }

                return new ResponseEntity<>(dto, HttpStatus.ACCEPTED);
            } catch (Exception e) {
                return new ResponseEntity<>(dto, HttpStatus.ACCEPTED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(failedDto, HttpStatus.NOT_FOUND);
        }
    }

}