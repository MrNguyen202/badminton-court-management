/*
 * @ (#) CourtDTO.java    1.0    2/27/2025
 *
 *
 */

package vn.edu.iuh.hero.dtos;
/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 2/27/2025
 * @Version: 1.0
 *
 */

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.plaf.multi.MultiFileChooserUI;
import java.time.LocalDate;
import java.util.List;

@Data
public class CourtDTO {
    private String name;
    private String phone;
    private String description;
    private int numberOfSubCourts;
    private String openTime;
    private String closeTime;
    private String utilities;
    private String linkWeb;
    private String linkMap;
    private Long userID;
    private List<SubCourtDTO> subCourts;
    private AddressDTO address;
    private List<String> imageFiles;
    private LocalDate createDate;

}
