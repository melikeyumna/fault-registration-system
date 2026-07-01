package com.melikeyumna.fault.registration.controller;

import java.util.List;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.melikeyumna.fault.registration.model.Fault;
import com.melikeyumna.fault.registration.service.FaultService;

@RestController
@RequestMapping("/faults")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class FaultController {

    private static final String SESSION_USER_ID = "LOGGED_IN_USER_ID";

    private final FaultService faultService;

    public FaultController(FaultService faultService) {
        this.faultService = faultService;
    }

    @GetMapping
    public List<Fault> getFaults(HttpSession session) {
        checkSession(session);
        return faultService.getAllFaults();
    }

    @PostMapping
    public Fault createFault(@RequestBody Fault fault, HttpSession session) {
        checkSession(session);
        return faultService.saveFault(fault);
    }

    @GetMapping("/{id}")
    public Fault getFaultById(@PathVariable Long id, HttpSession session) {
        checkSession(session);
        return faultService.getFaultById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteFault(@PathVariable Long id, HttpSession session) {
        checkSession(session);
        faultService.deleteFault(id);
    }

    @PutMapping("/{id}")
    public Fault updateFault(@PathVariable Long id,
                             @RequestBody Fault updatedFault,
                             HttpSession session) {
        checkSession(session);

        Fault fault = faultService.getFaultById(id);

        fault.setTitle(updatedFault.getTitle());
        fault.setDescription(updatedFault.getDescription());
        fault.setStatus(updatedFault.getStatus());
        fault.setReportedBy(updatedFault.getReportedBy());

        return faultService.saveFault(fault);
    }

    private void checkSession(HttpSession session) {
        if (session.getAttribute(SESSION_USER_ID) == null) {
            throw new UnauthorizedException("Bu işlem için giriş yapmalısınız.");
        }
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    static class UnauthorizedException extends RuntimeException {
        public UnauthorizedException(String message) {
            super(message);
        }
    }
}
