/*
 * @ (#) CourtController.java    1.0    3/5/2025
 *
 *
 */

package vn.edu.iuh.hero.controllers;
/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 3/5/2025
 * @Version: 1.0
 *
 */

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.edu.iuh.hero.dtos.AddressDTO;
import vn.edu.iuh.hero.dtos.CourtDTO;
import vn.edu.iuh.hero.enums.CourtStatus;
import vn.edu.iuh.hero.models.Address;
import vn.edu.iuh.hero.models.Court;
import vn.edu.iuh.hero.models.Image;
import vn.edu.iuh.hero.models.SubCourt;
import vn.edu.iuh.hero.services.impls.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/courts")
public class CourtController {
    @Autowired
    private CourtServiceImpl courtService;

    @Autowired
    private AddressServiceImpl addressService;

    @Autowired
    private SubCourtServiceImpl subCourtService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private ImageService imageService;


    //Get all courts
    @GetMapping("/get-courts")
    public ResponseEntity<?> getAllCourts() {
        return ResponseEntity.ok(courtService.findAll());
    }

    //Get a court by id
    @GetMapping("/get-court/{id}")
    public ResponseEntity<?> getCourtById(@PathVariable Long id) {
        Optional<Court> court = courtService.findById(id);
        if (court.isPresent()) {
            return ResponseEntity.ok(court.get());
        } else {
            return ResponseEntity.badRequest().body("Court not found");
        }
    }

    //Create a new court
    @PostMapping(value = "/create-court", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> createCourt(@RequestPart("courtDTO") CourtDTO courtDTO,
                                         @RequestPart(value = "images", required = false) List<MultipartFile> imageFiles) {
        try {
            //Push images to cloudinary
            List<String> imageUrls = new ArrayList<>();
            if (imageFiles != null && !imageFiles.isEmpty()) {
                for (MultipartFile file : imageFiles) {
                    String imageUrl = cloudinaryService.uploadFile(file); // Upload ảnh lên Cloudinary
                    imageUrls.add(imageUrl);
                }
            }

            //Create a new address
            Address address = new Address();
            AddressDTO addressDTO = courtDTO.getAddress();
            if(addressDTO != null) {
                address.setProvince(addressDTO.getProvince());
                address.setDistrict(addressDTO.getDistrict());
                address.setWard(addressDTO.getWard());
                address.setSpecificAddress(addressDTO.getSpecificAddress());

                //Create a new court
                Court court = new Court();
                court.setName(courtDTO.getName());
                court.setPhone(courtDTO.getPhone());
                court.setDescription(courtDTO.getDescription());
                court.setNumberOfSubCourts(courtDTO.getNumberOfSubCourts());
                court.setStatus(CourtStatus.OPEN);
                court.setUserID(courtDTO.getUserID());
                court.setUtilities(courtDTO.getUtilities());
                court.setLinkWeb(courtDTO.getLinkWeb());
                court.setLinkMap(courtDTO.getLinkMap());
                court.setOpenTime(courtDTO.getOpenTime());
                court.setCloseTime(courtDTO.getCloseTime());
                court.setCreateDate(LocalDate.now());
                court.setAddress(addressService.save(address));

                //Save the court
                courtService.save(court);

                // Lưu ảnh vào bảng "images"
                for (String url : imageUrls) {
                    Image image = new Image();
                    image.setUrl(url);
                    image.setCourt(court);
                    imageService.save(image);
                }

                courtDTO.getSubCourts().forEach(subCourtDTO -> {
                    SubCourt subCourt = new SubCourt();
                    subCourt.setSubName(subCourtDTO.getSubName());
                    subCourt.setType(subCourtDTO.getType());
                    subCourt.setCourt(court);
                    subCourtService.save(subCourt);
                });
            }
            return ResponseEntity.ok("Create a new court successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/get-courts-user/{id}")
    public ResponseEntity<?> getCourtByUserId(@PathVariable Long id) {
        return ResponseEntity.ok(courtService.getCourtByUserID(id));
    }

    @GetMapping("/get-not-courts-user/{id}")
    public ResponseEntity<?> getNotCourtByUserId(@PathVariable Long id) {
        return ResponseEntity.ok(courtService.getNotApprovedCourts(id));
    }
}
