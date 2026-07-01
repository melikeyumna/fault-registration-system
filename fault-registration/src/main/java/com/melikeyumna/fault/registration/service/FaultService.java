package com.melikeyumna.fault.registration.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.melikeyumna.fault.registration.model.Fault;
import com.melikeyumna.fault.registration.repository.FaultRepository;

@Service
public class FaultService {
    private final FaultRepository faultRepository;

    public FaultService(FaultRepository faultRepository) {
        this.faultRepository = faultRepository;
    }

    @CacheEvict(value = "faults", allEntries = true)
    public Fault saveFault(Fault fault) {
        if (fault.getStatus() == null || fault.getStatus().isEmpty()) {
            fault.setStatus("OPEN");
        }

        return faultRepository.save(fault);
    }

    @Cacheable("faults")
    public List<Fault> getAllFaults() {
        System.out.println("Fetching faults from database...");
        return faultRepository.findAll(Sort.by("id"));
    }

    public Fault getFaultById(Long id) {
        return faultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fault not found with id: " + id));
    }

    @CacheEvict(value = "faults", allEntries = true)
    public void deleteFault(Long id) {
        faultRepository.deleteById(id);
    }
}
