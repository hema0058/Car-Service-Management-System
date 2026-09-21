package com.csms.backend.service;

import com.csms.backend.entity.Car;
import com.csms.backend.entity.User;
import com.csms.backend.repository.CarRepository;
import com.csms.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private UserRepository userRepository;

    public Car addCar(Long userId, Car car) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        car.setUser(user);
        return carRepository.save(car);
    }

    public List<Car> getCarsByUserId(Long userId) {
        return carRepository.findByUserId(userId);
    }

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }
}
