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

import java.util.List;

@Data
public class CourtDTO {
    private String name;
    private String phone;
    private AddressDTO address;
    private int numberOfCourts;
    private String openTime;
    private String closeTime;
    private String utilities;
    private String description;
    private String websiteLink;
    private String mapLink;
    private Long userID;
    private List<String> images;
    private String status;
}
