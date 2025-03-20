//package vn.edu.iuh.fit.apigateway.auth;
//
//import org.springframework.cloud.gateway.filter.GatewayFilter;
//import org.springframework.cloud.gateway.filter.GatewayFilterChain;
//import org.springframework.cloud.gateway.filter.GlobalFilter;
//import org.springframework.core.Ordered;
//import org.springframework.stereotype.Component;
//import org.springframework.web.server.ServerWebExchange;
//import reactor.core.publisher.Mono;
//
//@Component
//public class RemoveCorsHeadersFilter implements GlobalFilter, Ordered {
//
//    @Override
//    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
//        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
//            // Xóa header Access-Control-Allow-Origin từ response của backend
//            exchange.getResponse().getHeaders().remove("Access-Control-Allow-Origin");
//        }));
//    }
//
//    @Override
//    public int getOrder() {
//        return -1; // Chạy trước khi Gateway thêm header CORS
//    }
//}