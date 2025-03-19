package vn.edu.iuh.fit.apigateway.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import vn.edu.iuh.fit.apigateway.auth.JwtAuthenticationFilter;

@Configuration
public class GatewayConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public GlobalFilter globalFilter() {
        return (exchange, chain) -> jwtAuthenticationFilter.filter(exchange, chain);
    }
}