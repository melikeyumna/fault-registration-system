package com.melikeyumna.fault.registration.controller;

import com.melikeyumna.fault.registration.model.AppUser;
import com.melikeyumna.fault.registration.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private static final String SESSION_USER_ID = "LOGGED_IN_USER_ID";
    private static final String SESSION_USER_FULL_NAME = "LOGGED_IN_USER_FULL_NAME";
    private static final String SESSION_USER_EMAIL = "LOGGED_IN_USER_EMAIL";

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AppUser user, HttpSession session) {
        try {
            AppUser savedUser = userService.register(user);
            saveUserToSession(session, savedUser);

            return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(
                    savedUser.getId(),
                    savedUser.getFullName(),
                    savedUser.getEmail(),
                    "Kayıt başarılı. Session oluşturuldu."
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpSession session) {
        try {
            AppUser user = userService.login(request.getEmail(), request.getPassword());
            saveUserToSession(session, user);

            return ResponseEntity.ok(new AuthResponse(
                    user.getId(),
                    user.getFullName(),
                    user.getEmail(),
                    "Giriş başarılı. Session oluşturuldu."
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        Long userId = (Long) session.getAttribute(SESSION_USER_ID);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Aktif session bulunamadı. Lütfen giriş yapın."));
        }

        return ResponseEntity.ok(new AuthResponse(
                userId,
                (String) session.getAttribute(SESSION_USER_FULL_NAME),
                (String) session.getAttribute(SESSION_USER_EMAIL),
                "Aktif session bulundu."
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(new MessageResponse("Çıkış yapıldı. Session sonlandırıldı."));
    }

    private void saveUserToSession(HttpSession session, AppUser user) {
        session.setAttribute(SESSION_USER_ID, user.getId());
        session.setAttribute(SESSION_USER_FULL_NAME, user.getFullName());
        session.setAttribute(SESSION_USER_EMAIL, user.getEmail());
    }

    static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public String getPassword() {
            return password;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    static class AuthResponse {
        private Long id;
        private String fullName;
        private String email;
        private String message;

        public AuthResponse(Long id, String fullName, String email, String message) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.message = message;
        }

        public Long getId() {
            return id;
        }

        public String getFullName() {
            return fullName;
        }

        public String getEmail() {
            return email;
        }

        public String getMessage() {
            return message;
        }
    }

    static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }

    static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}
