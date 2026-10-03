package com.wedding.controller;

import com.wedding.entity.GuestMessage;
import com.wedding.repository.GuestMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/weddings")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class WeddingController {

    private final GuestMessageRepository guestMessageRepository;

    @GetMapping("/{slug}")
    public ResponseEntity<Map<String, Object>> getWeddingDetails(@PathVariable String slug) {
        Map<String, Object> data = new HashMap<>();
        data.put("slug", slug);
        data.put("brideName", "Bùi Thu Thủy");
        data.put("groomName", "Trần Hiếu");
        data.put("weddingDate", "2026-10-18T18:00:00");
        data.put("location", "GIA ĐÌNH NHÀ GÁI - Thôn Chí Cường, Nam Cường, Hưng Yên");
        return ResponseEntity.ok(data);
    }

    @GetMapping("/{slug}/messages")
    public ResponseEntity<List<GuestMessage>> getMessages(@PathVariable String slug) {
        List<GuestMessage> messages = guestMessageRepository.findByWeddingSlugOrderByCreatedAtDesc(slug);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{slug}/messages")
    public ResponseEntity<GuestMessage> createMessage(
            @PathVariable String slug,
            @RequestBody GuestMessage request) {
        request.setWeddingSlug(slug);
        GuestMessage saved = guestMessageRepository.save(request);
        return ResponseEntity.ok(saved);
    }
}
