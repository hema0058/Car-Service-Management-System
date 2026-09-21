package com.csms.backend.service;

import com.csms.backend.entity.Car;
import com.csms.backend.entity.ServiceRequest;
import com.csms.backend.entity.User;
import com.csms.backend.repository.CarRepository;
import com.csms.backend.repository.ServiceRequestRepository;
import com.csms.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ServiceRequestService {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CarRepository carRepository;

    public ServiceRequest createServiceRequest(Long userId, Long carId, ServiceRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Car car = carRepository.findById(carId).orElseThrow(() -> new RuntimeException("Car not found"));

        if (!car.getUser().getId().equals(userId)) {
            throw new RuntimeException("Car does not belong to the user");
        }

        request.setUser(user);
        request.setCar(car);
        request.setRequestDate(LocalDate.now());
        request.setStatus("PENDING");

        return serviceRequestRepository.save(request);
    }

    public List<ServiceRequest> getRequestsByUserId(Long userId) {
        return serviceRequestRepository.findByUserId(userId);
    }

    public List<ServiceRequest> getAllRequests() {
        return serviceRequestRepository.findAll();
    }

    public ServiceRequest updateRequestStatus(Long requestId, String status) {
        ServiceRequest request = serviceRequestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(status);
        return serviceRequestRepository.save(request);
    }
}
