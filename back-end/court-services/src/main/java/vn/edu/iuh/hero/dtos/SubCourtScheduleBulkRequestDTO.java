/*
 * @ (#) SubCourtScheduleBulkRequestDTO.java    1.0    5/22/2025
 *
 *
 */

package vn.edu.iuh.hero.dtos;
/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 5/22/2025
 * @Version: 1.0
 *
 */

import lombok.Data;

import java.util.List;

@Data
public class SubCourtScheduleBulkRequestDTO {
    private List<SubCourtScheduleRequestDTO> schedules;
}
