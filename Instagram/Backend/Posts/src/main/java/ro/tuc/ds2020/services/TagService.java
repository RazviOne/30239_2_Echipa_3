package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.TagDTO;
import ro.tuc.ds2020.dtos.builders.TagBuilder;
import ro.tuc.ds2020.entities.Tag;
import ro.tuc.ds2020.repositories.TagRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TagService {

    private static final Logger LOGGER = LoggerFactory.getLogger(TagService.class);
    private final TagRepository tagRepository;

    @Autowired
    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public List<TagDTO> findTags() {
        List<Tag> tagList = tagRepository.findAll();
        return tagList.stream()
                .map(TagBuilder::toTagDTO)
                .collect(Collectors.toList());
    }

    public TagDTO findTagById(Integer idTag) {
        Optional<Tag> prosumerOptional = tagRepository.findById(idTag);

        if (!prosumerOptional.isPresent()) {
            LOGGER.error("Tag with idTag {} was not found in db", idTag);
            throw new ResourceNotFoundException(Tag.class.getSimpleName() + " with id: " + idTag);
        }
        return TagBuilder.toTagDTO(prosumerOptional.get());
    }

    public TagDTO findTagByName(String name) {
        List<TagDTO> tags = findTags();
        for (TagDTO tag : tags) {
            if (tag.getName().equals(name)) {
                return tag;
            }
        }

        throw new ResourceNotFoundException(Tag.class.getSimpleName() + " with name: " + name);
    }

    public Integer insert(TagDTO tagDTO) {
        Tag tag = TagBuilder.toEntity(tagDTO);
        tag = tagRepository.save(tag);
        LOGGER.debug("Tag with idTag {} was inserted in db", tag.getIdTag());
        return tag.getIdTag();
    }

    public void update(TagDTO tagDTO) {
        Tag tag = TagBuilder.toEntity(tagDTO);
        tag.setIdTag(tagDTO.getIdTag());
        tagRepository.save(tag);
        LOGGER.debug("Tag with idTag {} was updated in db", tag.getIdTag());
    }

    public void delete(Integer idTag) {
        tagRepository.deleteById(idTag);
    }

}
