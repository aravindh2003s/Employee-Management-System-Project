package com.hrms.ems.repository;

import com.hrms.ems.model.Notification;
import com.hrms.ems.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    List<Notification> findByUserAndIsReadFalse(User user);
    // Find global notifications
    List<Notification> findByUserIsNullOrderByCreatedAtDesc();
}
