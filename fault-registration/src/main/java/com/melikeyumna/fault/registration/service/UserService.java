package com.melikeyumna.fault.registration.service;

import com.melikeyumna.fault.registration.model.AppUser;
import com.melikeyumna.fault.registration.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AppUser register(AppUser user) {
        if (user.getFullName() == null || user.getFullName().trim().isEmpty()) {
            throw new RuntimeException("Ad soyad alanı boş bırakılamaz.");
        }

        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new RuntimeException("E-posta alanı boş bırakılamaz.");
        }

        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Şifre alanı boş bırakılamaz.");
        }

        String normalizedEmail = user.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new RuntimeException("Bu e-posta adresi zaten kayıtlı.");
        }

        user.setEmail(normalizedEmail);
        return userRepository.save(user);
    }

    public AppUser login(String email, String password) {
        String normalizedEmail = email.trim().toLowerCase();

        AppUser user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("E-posta veya şifre hatalı."));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("E-posta veya şifre hatalı.");
        }

        return user;
    }
}
