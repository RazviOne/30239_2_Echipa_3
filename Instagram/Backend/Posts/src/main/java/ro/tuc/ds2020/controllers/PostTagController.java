package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.PostTagDTO;
import ro.tuc.ds2020.services.PostTagService;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/postTags")
@CrossOrigin
public class PostTagController {

    private final PostTagService postTagService;

    @Autowired
    public PostTagController(PostTagService postTagService) {
        this.postTagService = postTagService;
    }

    @GetMapping
    public ResponseEntity<List<PostTagDTO>> getPostTags() {
        List<PostTagDTO> dtos = postTagService.findPostTags();
        for (PostTagDTO dto : dtos) {
            Link postTagLink = linkTo(methodOn(PostTagController.class)
                    .getPostTagById(dto.getIdPostTag())).withRel("postTagDetails");
            dto.add(postTagLink);
        }
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Integer> insertPostTag(@Valid @RequestBody PostTagDTO postTagDTO) {
        Integer idPostTag = postTagService.insert(postTagDTO);
        return new ResponseEntity<>(idPostTag, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostTagDTO> getPostTagById(@PathVariable("id") Integer idPostTag) {
        PostTagDTO failedDto = new PostTagDTO();
        failedDto.setIdPostTag(-1);
        try {
            PostTagDTO dto = postTagService.findPostTagById(idPostTag);
            return new ResponseEntity<>(dto, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(failedDto, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/post/{id}")
    public ResponseEntity<List<PostTagDTO>> getPostTagByPostId(@PathVariable("id") Integer idPost) {
        List<PostTagDTO> failedDto = new ArrayList<>();
        try {
            List<PostTagDTO> dto = postTagService.findPostTagByPostId(idPost);
            return new ResponseEntity<>(dto, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(failedDto, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{id}")
    public ResponseEntity<PostTagDTO> updatePostTag(@Valid @RequestBody PostTagDTO postTagDTO,
                                                    @PathVariable("id") Integer idPostTag) {
        PostTagDTO failedDto = new PostTagDTO();
        failedDto.setIdPostTag(-1);
        try {
            postTagService.findPostTagById(idPostTag);
            postTagDTO.setIdPostTag(idPostTag);
            postTagService.update(postTagDTO);
            return new ResponseEntity<>(postTagDTO, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(failedDto, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<PostTagDTO> deletePostTag(@PathVariable("id") Integer idPostTag) {
        PostTagDTO failedDto = new PostTagDTO();
        failedDto.setIdPostTag(-1);
        try {
            PostTagDTO dto = postTagService.findPostTagById(idPostTag);
            postTagService.delete(idPostTag);
            return new ResponseEntity<>(dto, HttpStatus.ACCEPTED);
        } catch (Exception e) {
            return new ResponseEntity<>(failedDto, HttpStatus.NOT_FOUND);
        }
    }

}