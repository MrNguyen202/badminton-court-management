# Stage 1: Build the application using Gradle
FROM gradle:8.10.1-jdk17 AS build
WORKDIR /home/gradle/project

# Copy Gradle configuration files first to leverage caching
COPY --chown=gradle:gradle build.gradle settings.gradle gradlew ./
COPY --chown=gradle:gradle gradle ./gradle
COPY --chown=gradle:gradle src ./src

# Build the application, skipping tests
RUN gradle build -x test
RUN ls build/libs/ # Kiểm tra file JAR đã được tạo

# Stage 2: Run the application with JRE
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the specific JAR file
COPY --from=build /home/gradle/project/build/libs/court-services-0.0.1-SNAPSHOT.jar app.jar

# Expose the port for court-service
EXPOSE 8082

# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]