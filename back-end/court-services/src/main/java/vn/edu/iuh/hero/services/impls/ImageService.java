/*
 * @ (#) ImageService.java    1.0    3/10/2025
 *
 *
 */

package vn.edu.iuh.hero.services.impls;
/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 3/10/2025
 * @Version: 1.0
 *
 */

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.hero.models.Image;
import vn.edu.iuh.hero.repositories.ImageRepository;
import vn.edu.iuh.hero.services.IServices;

import java.util.Optional;

@Service
public class ImageService implements IServices<Image, Long> {

    @Autowired
    private ImageRepository imageRepository;

    @Override
    public Iterable<Image> findAll() {
        return null;
    }

    @Override
    public Optional<Image> findById(Long aLong) {
        return Optional.empty();
    }

    @Override
    public Image save(Image image) {
        return imageRepository.save(image);
    }

    @Override
    public Image delete(Long aLong) {
        return null;
    }

    @Override
    public Image update(Image image) {
        return null;
    }
}
