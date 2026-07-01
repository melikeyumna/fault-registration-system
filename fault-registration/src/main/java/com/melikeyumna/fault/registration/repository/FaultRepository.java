package com.melikeyumna.fault.registration.repository;

import com.melikeyumna.fault.registration.model.Fault;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FaultRepository extends JpaRepository<Fault, Long> {
}
