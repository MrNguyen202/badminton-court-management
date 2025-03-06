/*
 * @ (#) SubCourtDTO.java    1.0    3/5/2025
 *
 *
 */

package vn.edu.iuh.hero.dtos;
/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 3/5/2025
 * @Version: 1.0
 *
 */

import lombok.Data;
import vn.edu.iuh.hero.enums.TypeSubCourt;

@Data
public class SubCourtDTO {
    private String subName;
    private TypeSubCourt type;
}
