/*
 * @ (#) CourtController.java    1.0    2/24/2025
 *
 *
 */

package vn.edu.iuh.hero.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.hero.dtos.AddressDTO;
import vn.edu.iuh.hero.dtos.CourtDTO;
import vn.edu.iuh.hero.enums.CourtStatus;
import vn.edu.iuh.hero.models.Address;
import vn.edu.iuh.hero.models.Court;
import vn.edu.iuh.hero.services.impls.AddressServiceImpl;
import vn.edu.iuh.hero.services.impls.CourtServiceImpl;

import java.util.Optional;

/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 2/24/2025
 * @Version: 1.0
 *
 */
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/courts")
public class CourtController {
    @Autowired
    private CourtServiceImpl courtService;

    @Autowired
    private AddressServiceImpl addressService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllCourts() {
        return ResponseEntity.ok(courtService.findAll());
    }

    @PostMapping("/create")
    public ResponseEntity<Court> createCourt(@RequestBody Court court) {
        return ResponseEntity.ok(courtService.save(court));
    }

    @PutMapping("/update")
    public ResponseEntity<Court> updateCourt(@RequestBody Court court) {
        return ResponseEntity.ok(courtService.save(court));
    }

    @GetMapping("/owner/{id}")
    public ResponseEntity<?> getCourtById(@PathVariable Long id) {
        return ResponseEntity.ok(courtService.getCourtByUserID(id));
    }

    @PostMapping("/createCourt")
    public ResponseEntity<?> createCourt(@RequestBody CourtDTO courtDTO) {
        try {
            // 1. Lấy address từ DTO
            Address address = new Address();
            AddressDTO addressDTO = courtDTO.getAddress();

            if (addressDTO != null) {
                address.setProvince(addressDTO.getProvince());
                address.setDistrict(addressDTO.getDistrict());
                address.setWard(addressDTO.getWard());
                address.setSpecificAddress(addressDTO.getSpecificAddress());

                // 3. Lấy thông tin từ DTO
                Court court = new Court();
                court.setName(courtDTO.getName());
                court.setPhone(courtDTO.getPhone());
                court.setNumberOfCourts(courtDTO.getNumberOfCourts());
                court.setOpenTime(courtDTO.getOpenTime());
                court.setCloseTime(courtDTO.getCloseTime());
                court.setUtilities(courtDTO.getUtilities());
                court.setDescription(courtDTO.getDescription());
                court.setLinkWeb(courtDTO.getWebsiteLink());
                court.setLinkMap(courtDTO.getMapLink());
                court.setUserID(courtDTO.getUserID());
                court.setStatus(CourtStatus.OPEN);
                court.setAddress(addressService.save(address));
                return ResponseEntity.ok(courtService.save(court));
            }else {
                return ResponseEntity.badRequest().body("Create court failed");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Create court failed");
        }
    }
}
