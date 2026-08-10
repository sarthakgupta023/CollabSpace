# Step 1: Build the Maven application
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy dependency definition and source code
COPY pom.xml .
COPY src ./src

# Build the JAR package, skipping tests for faster deployment
RUN mvn clean package -DskipTests

# Step 2: Run the application with lightweight JDK runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the generated JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]

jdbc:postgresql://collab_editor_q7pu_user:nAD2xYzx2fbxxxxxZcg7DfIa1d2dQTjB@dpg-d9rk5r5bedkc73bu9a1g-a/collab_editor_q7pu