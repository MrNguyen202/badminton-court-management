/*
 * @ (#) SubCourtScheduleDTO.java    1.0    3/5/2025
 *
 *
 */

package vn.edu.iuh.hero.dtos;

import lombok.Data;
import vn.edu.iuh.hero.enums.StatusSchedule;

import java.sql.Time;
import java.time.LocalDate;

/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 3/5/2025
 * @Version: 1.0
 *
 */
@Data
public class SubCourtScheduleDTO {
    private Long subCourtId;
    private Long scheduleId;
    private String subCourtName;
    private LocalDate date;
    private Time fromHour;
    private Time toHour;
    private double price;
    private String status;
}
