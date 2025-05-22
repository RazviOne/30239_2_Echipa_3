package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.PostTagDTO;
import ro.tuc.ds2020.dtos.builders.PostTagBuilder;
import ro.tuc.ds2020.entities.Post;
import ro.tuc.ds2020.entities.PostTag;
import ro.tuc.ds2020.repositories.PostRepository;
import ro.tuc.ds2020.repositories.PostTagRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostTagService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PostTagService.class);
    private final PostTagRepository postTagRepository;
    private final PostRepository postRepository;

    @Autowired
    public PostTagService(PostTagRepository postTagRepository, PostRepository postRepository) {
        this.postTagRepository = postTagRepository;
        this.postRepository = postRepository;
    }

    public List<PostTagDTO> findPostTags() {
        List<PostTag> postTagList = postTagRepository.findAll();
        return postTagList.stream()
                .map(PostTagBuilder::toPostTagDTO)
                .collect(Collectors.toList());
    }

    public PostTagDTO findPostTagById(Integer idPostTag) {
        Optional<PostTag> prosumerOptional = postTagRepository.findById(idPostTag);

        if (!prosumerOptional.isPresent()) {
            LOGGER.error("PostTag with idPostTag {} was not found in db", idPostTag);
            throw new ResourceNotFoundException(PostTag.class.getSimpleName() + " with id: " + idPostTag);
        }
        return PostTagBuilder.toPostTagDTO(prosumerOptional.get());
    }

    public List<PostTagDTO> findPostTagByPostId(Integer idPost) {
        List<PostTagDTO> postTagDTOList = findPostTags();
        List<PostTagDTO> result = new ArrayList<>();

        for(PostTagDTO postTagDTO : postTagDTOList) {
            if(postTagDTO.getIdPost().equals(idPost)) {
                result.add(postTagDTO);
            }
        }

        return result;
    }

    public Integer insert(PostTagDTO postTagDTO) {
        PostTag postTag = PostTagBuilder.toEntity(postTagDTO);
        postTag = postTagRepository.save(postTag);
        LOGGER.debug("PostTag with idPostTag {} was inserted in db", postTag.getIdPostTag());
        return postTag.getIdPostTag();
    }

    public void update(PostTagDTO postTagDTO) {
        PostTag postTag = PostTagBuilder.toEntity(postTagDTO);
        postTag.setIdPostTag(postTagDTO.getIdPostTag());
        postTagRepository.save(postTag);
        LOGGER.debug("PostTag with idPostTag {} was updated in db", postTag.getIdPostTag());
    }

    public void delete(Integer idPostTag) {
        postTagRepository.deleteById(idPostTag);
    }

}
