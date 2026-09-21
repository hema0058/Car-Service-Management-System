package com.csms.backend;

import com.csms.backend.entity.User;
import com.csms.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Optional;

@SpringBootApplication
public class CsmsBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CsmsBackendApplication.class, args);
	}

	@Bean
	CommandLineRunner run(UserRepository userRepository) {
		return args -> {
			Optional<User> existingAdmin = userRepository.findByEmail("admin@csms.com");
			if (existingAdmin.isEmpty()) {
				User admin = new User();
				admin.setName("System Admin");
				admin.setEmail("admin@csms.com");
				admin.setPassword("Admin@1234");
				admin.setPhone("0000000000");
				admin.setRole("ADMIN");
				userRepository.save(admin);
				System.out.println("====== DEFAULT ADMIN CREATED: admin@csms.com / Admin@1234 ======");
			}
		};
	}
}
