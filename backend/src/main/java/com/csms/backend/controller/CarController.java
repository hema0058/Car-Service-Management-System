package com.csms.backend.controller;

import com.csms.backend.entity.Car;
import com.csms.backend.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "*")
public class CarController {

    @Autowired
    private CarService carService;

    @PostMapping("/user/{userId}")
    public ResponseEntity<Car> addCar(@PathVariable Long userId, @RequestBody Car car) {
        return ResponseEntity.ok(carService.addCar(userId, car));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Car>> getCarsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(carService.getCarsByUserId(userId));
    }

    @GetMapping
    public ResponseEntity<List<Car>> getAllCars() {
        return ResponseEntity.ok(carService.getAllCars());
    }
}
