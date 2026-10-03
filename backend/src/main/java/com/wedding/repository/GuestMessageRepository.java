package com.wedding.repository;

import com.wedding.entity.GuestMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuestMessageRepository extends JpaRepository<GuestMessage, Long> {
    List<GuestMessage> findByWeddingSlugOrderByCreatedAtDesc(String weddingSlug);
}
