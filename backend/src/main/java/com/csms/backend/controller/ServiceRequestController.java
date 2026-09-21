package com.csms.backend.controller;

import com.csms.backend.entity.ServiceRequest;
import com.csms.backend.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service-requests")
@CrossOrigin(origins = "*")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @PostMapping("/user/{userId}/car/{carId}")
    public ResponseEntity<ServiceRequest> createServiceRequest(
            @PathVariable Long userId,
            @PathVariable Long carId,
            @RequestBody ServiceRequest request) {
        return ResponseEntity.ok(serviceRequestService.createServiceRequest(userId, carId, request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ServiceRequest>> getRequestsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(serviceRequestService.getRequestsByUserId(userId));
    }

    @GetMapping
    public ResponseEntity<List<ServiceRequest>> getAllRequests() {
        return ResponseEntity.ok(serviceRequestService.getAllRequests());
    }

    @PutMapping("/{requestId}/status")
    public ResponseEntity<ServiceRequest> updateRequestStatus(
            @PathVariable Long requestId,
            @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        return ResponseEntity.ok(serviceRequestService.updateRequestStatus(requestId, status));
    }
}
