/*
 * @ (#) FeedbackDTO.java    1.0    5/15/2025
 *
 *
 */

package vn.edu.iuh.hero.dtos;
/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 5/15/2025
 * @Version: 1.0
 *
 */

import lombok.Data;

import java.time.LocalDate;

@Data
public class FeedbackDTO {
    private String content;
    private int numberStar;
    private Long userId;
    private String userName;
    private Long courtId;
    private LocalDate date;
}
