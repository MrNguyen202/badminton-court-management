/*
 * @ (#) WebConfig.java    1.0    2/25/2025
 *
 *
 */

package vn.edu.iuh.hero.configs;
/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 2/25/2025
 * @Version: 1.0
 *
 */

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
//    @Bean
//    public WebMvcConfigurer corsConfigurer() {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/api/**")
//                        .allowedOrigins("http://localhost:3000")
//                        .allowedMethods("GET", "POST", "PUT", "DELETE")
//                        .allowedHeaders("*")
//                        .allowCredentials(true);
//            }
//        };
//    }
}
