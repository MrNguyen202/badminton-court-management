/*
 * @ (#) ScheduleDTO.java    1.0    3/3/2025
 *
 *
 */

package vn.edu.iuh.hero.dtos;
/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 3/3/2025
 * @Version: 1.0
 *
 */

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import vn.edu.iuh.hero.enums.StatusSchedule;

import java.sql.Time;
import java.time.LocalDate;

@Data
public class ScheduleDTO {
    private Long courtId;
    private Time toHour;
    private Time fromHour;
    private LocalDate date;
    private double price;
    private int indexCourt;
    private StatusSchedule status;
}
