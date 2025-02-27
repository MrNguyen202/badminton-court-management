/*
 * @ (#) AddressDTO.java    1.0    2/27/2025
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

import lombok.Data;

@Data
public class AddressDTO {
    private String province;
    private String district;
    private String ward;
    private String specificAddress;
}
