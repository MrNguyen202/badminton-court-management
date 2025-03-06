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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.hero.dtos.AddressDTO;
import vn.edu.iuh.hero.dtos.CourtDTO;
import vn.edu.iuh.hero.enums.CourtStatus;
import vn.edu.iuh.hero.models.Address;
import vn.edu.iuh.hero.models.Court;
import vn.edu.iuh.hero.models.Image;
import vn.edu.iuh.hero.models.SubCourt;
import vn.edu.iuh.hero.services.impls.AddressServiceImpl;
import vn.edu.iuh.hero.services.impls.CourtServiceImpl;
import vn.edu.iuh.hero.services.impls.SubCourtServiceImpl;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/courts")
public class CourtController {
    @Autowired
    private CourtServiceImpl courtService;

    @Autowired
    private AddressServiceImpl addressService;

    @Autowired
    private SubCourtServiceImpl subCourtService;

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
    @PostMapping("/create-court")
    public ResponseEntity<?> createCourt(@RequestBody CourtDTO courtDTO) {
        try {
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
}
