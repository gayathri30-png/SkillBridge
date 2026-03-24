# Database Schema Report

**Database Name**: `skillbridge`
**Total Tables**: 15

This document provides a detailed definition of all tables in the database, including column names, data types, keys, and constraints.

---

## Table: `ai_insights`

| Column Name | Data Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `int` | NO | **PRI** | NULL | auto_increment |
| `user_id` | `int` | NO | **MUL** | NULL |  |
| `type` | `enum('portfolio','skill_gap','proposal_advice','career_path')` | NO |  | NULL |  |
| `content` | `json` | NO |  | NULL |  |
| `score` | `int` | YES |  | `0` |  |
| `job_id` | `int` | YES | **MUL** | NULL |  |
| `created_at` | `timestamp` | YES |  | `CURRENT_TIMESTAMP` | DEFAULT_GENERATED |

<details>
<summary>View Create Statement SQL</summary>

```sql
CREATE TABLE `ai_insights` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `type` enum('portfolio','skill_gap','proposal_advice','career_path') NOT NULL,
  `content` json NOT NULL,
  `score` int DEFAULT '0',
  `job_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `job_id` (`job_id`),
  CONSTRAINT `ai_insights_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ai_insights_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```
</details>

---

## Table: `ai_proposals`

| Column Name | Data Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `int` | NO | **PRI** | NULL | auto_increment |
| `user_id` | `int` | NO | **MUL** | NULL |  |
| `job_id` | `int` | YES | **MUL** | NULL |  |
| `job_title` | `varchar(255)` | YES |  | NULL |  |
| `company` | `varchar(255)` | YES |  | NULL |  |
| `proposal_text` | `text` | YES |  | NULL |  |
| `tone` | `varchar(50)` | YES |  | NULL |  |
| `length` | `varchar(50)` | YES |  | NULL |  |
| `created_at` | `timestamp` | YES |  | `CURRENT_TIMESTAMP` | DEFAULT_GENERATED |
| `used_count` | `int` | YES |  | `0` |  |

<details>
<summary>View Create Statement SQL</summary>

```sql
CREATE TABLE `ai_proposals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `job_id` int DEFAULT NULL,
  `job_title` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `proposal_text` text,
  `tone` varchar(50) DEFAULT NULL,
  `length` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `used_count` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `job_id` (`job_id`),
  CONSTRAINT `ai_proposals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ai_proposals_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```
</details>

---

## Table: `ai_recommendations`

| Column Name | Data Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `int` | NO | **PRI** | NULL | auto_increment |
| `user_id` | `int` | NO | **MUL** | NULL |  |
| `recommendation_type` | `enum('portfolio','skill','job')` | NO |  | NULL |  |
| `recommendation_text` | `text` | YES |  | NULL |  |
| `priority` | `enum('high','medium','low')` | YES |  | `medium` |  |
| `is_completed` | `tinyint(1)` | YES |  | `0` |  |
| `created_at` | `timestamp` | YES |  | `CURRENT_TIMESTAMP` | DEFAULT_GENERATED |

<details>
<summary>View Create Statement SQL</summary>

```sql
CREATE TABLE `ai_recommendations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `recommendation_type` enum('portfolio','skill','job') NOT NULL,
  `recommendation_text` text,
  `priority` enum('high','medium','low') DEFAULT 'medium',
  `is_completed` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `ai_recommendations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```
</details>

---

## Table: `applications`

| Column Name | Data Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `int` | NO | **PRI** | NULL | auto_increment |
| `job_id` | `int` | YES | **MUL** | NULL |  |
| `student_id` | `int` | YES | **MUL** | NULL |  |
| `proposal` | `text` | NO |  | NULL |  |
| `ai_match_score` | `decimal(5,2)` | YES |  | `0.00` |  |
| `status` | `enum('pending','accepted','rejected','hired')` | YES |  | `pending` |  |
| `created_at` | `timestamp` | YES |  | `CURRENT_TIMESTAMP` | DEFAULT_GENERATED |
| `hired_at` | `timestamp` | YES |  | NULL |  |
| `start_date` | `date` | YES |  | NULL |  |
| `salary` | `varchar(255)` | YES |  | NULL |  |
| `contract_type` | `enum('Full-time','Part-time','Contract','Internship')` | YES |  | `Full-time` |  |
| `offer_letter` | `text` | YES |  | NULL |  |
| `additional_notes` | `text` | YES |  | NULL |  |
| `is_offer_accepted` | `tinyint(1)` | YES |  | `0` |  |
| `is_offer_declined` | `tinyint(1)` | YES |  | `0` |  |
| `offer_accepted_at` | `timestamp` | YES |  | NULL |  |
| `offer_declined_at` | `timestamp` | YES |  | NULL |  |

<details>
<summary>View Create Statement SQL</summary>

```sql
CREATE TABLE `applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_id` int DEFAULT NULL,
  `student_id` int DEFAULT NULL,
  `proposal` text NOT NULL,
  `ai_match_score` decimal(5,2) DEFAULT '0.00',
  `status` enum('pending','accepted','rejected','hired') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `hired_at` timestamp NULL DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `salary` varchar(255) DEFAULT NULL,
  `contract_type` enum('Full-time','Part-time','Contract','Internship') DEFAULT 'Full-time',
  `offer_letter` text,
  `additional_notes` text,
  `is_offer_accepted` tinyint(1) DEFAULT '0',
  `is_offer_declined` tinyint(1) DEFAULT '0',
  `offer_accepted_at` timestamp NULL DEFAULT NULL,
  `offer_declined_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `job_id` (`job_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`),
  CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```
</details>

---

## Table: `chat_rooms`

| Column Name | Data Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `int` | NO | **PRI** | NULL | auto_increment |
| `room_id` | `varchar(255)` | NO | **UNI** | NULL |  |
| `application_id` | `int` | NO | **MUL** | NULL |  |
| `student_id` | `int` | NO | **MUL** | NULL |  |
| `recruiter_id` | `int` | NO | **MUL** | NULL |  |
| `job_title` | `varchar(255)` | YES |  | `` |  |
| `student_name` | `varchar(255)` | YES |  | `` |  |
| `recruiter_name` | `varchar(255)` | YES |  | `` |  |
| `last_message` | `text` | YES |  | NULL |  |
| `last_message_at` | `timestamp` | YES |  | NULL |  |
| `created_at` | `timestamp` | YES |  | `CURRENT_TIMESTAMP` | DEFAULT_GENERATED |

<details>
<summary>View Create Statement SQL</summary>

```sql
CREATE TABLE `chat_rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` varchar(255) NOT NULL,
  `application_id` int NOT NULL,
  `student_id` int NOT NULL,
  `recruiter_id` int NOT NULL,
  `job_title` varchar(255) DEFAULT '',
  `student_name` varchar(255) DEFAULT '',
  `recruiter_name` varchar(255) DEFAULT '',
  `last_message` text,
  `last_message_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `room_id` (`room_id`),
  KEY `idx_student` (`student_id`),
  KEY `idx_recruiter` (`recruiter_id`),
  KEY `idx_application` (`application_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```
</details>

---

## Table: `job_skills`

| Column Name | Data Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `int` | NO | **PRI** | NULL | auto_increment |
| `job_id` | `int` | YES | **MUL** | NULL |  |
| `skill_id` | `int` | YES | **MUL** | NULL |  |

<details>
<summary>View Create Statement SQL</summary>

```sql
CREATE TABLE `job_skills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_id` int DEFAULT NULL,
  `skill_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `job_id` (`job_id`),
  KEY `skill_id` (`skill_id`),
  CONSTRAINT `job_skills_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `job_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```
</details>

---

## Table: `jobs`

| Column Name | Data Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `int` | NO | **PRI** | NULL | auto_increment |
| `title` | `varchar(255)` | NO |  | NULL |  |
| `description` | `text` | NO |  | NULL |  |
| `job_type` | `enum('full-time','part-time','contract','internship','freelance')` | NO |  | NULL |  |
| `budget` | `decimal(10,2)` | NO |  | NULL |  |
| `duration` | `varchar(100)` | YES |  | NULL |  |
| `location` | `varchar(100)` | YES |  | `Remote` |  |
| `experience_level` | `enum('entry','intermediate','senior','executive')` | NO |  | NULL |  |
| `posted_by` | `int` | YES | **MUL** | NULL |  |
| `status` | `enum('open','closed')` | YES |  | `open` |  |
| `created_at` | `timestamp` | YES |  | `CURRENT_TIMESTAMP` | DEFAULT_GENERATED |

<details>
<summary>View Create Statement SQL</summary>

```sql
CREATE TABLE `jobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `job_type` enum('full-time','part-time','contract','internship','freelance') NOT NULL,
  `budget` decimal(10,2) NOT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT 'Remote',
  `experience_level` enum('entry','intermediate','senior','executive') NOT NULL,
  `posted_by` int DEFAULT NULL,
  `status` enum('open','closed') DEFAULT 'open',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `posted_by` (`posted_by`),
  CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```
</details>

---

## Table: `messages`

| Column Name | Data Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `int` | NO | **PRI** | NULL | auto_increment |
| `room_id` | `varchar(255)` | NO |  | NULL |  |
| `sender_id` | `int` | NO |  | NULL |  |
| `receiver_id` | `int` | NO |  | NULL |  |
| `message` | `text` | NO |  | NULL |  |
| `created_at` | `timestamp` | YES |  | `CURRENT_TIMESTAMP` | DEFAULT_GENERATED |

<details>
<summary>View Create Statement SQL</summary>

```sql
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` varchar(255) NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```
</details>

---

## Table: `notifications`

| Column Name | Data Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `int` | NO | **PRI** | NULL | auto_increment |
| `user_id` | `int` | NO | **MUL** | NULL |  |
| `type` | `varchar(50)` | NO |  | NULL |  |
| `target_id` | `int` | YES |  | NULL |  |
| `message` | `text` | NO |  | NULL |  |
| `is_read` | `tinyint(1)` | YES |  | `0` |  |
| `created_at` | `timestamp` | YES |  | `CURRENT_TIMESTAMP` | DEFAULT_GENERATED |

<details>
<summary>View Create Statement SQL</summary>

```sql
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `type` varchar(50) NOT NULL,
  `target_id` int DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```
</details>

---

## Table: `reviews`

| Column Name | Data Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `int` | NO | **PRI** | NULL | auto_increment |
| `student_id` | `int` | NO | **MUL** | NULL |  |
| `recruiter_id` | `int` | NO | **MUL** | NULL |  |
| `rating` | `int` | NO |  | NULL |  |
| `comment` | `text` | YES |  | NULL |  |
| `created_at` | `timestamp` | YES |  | `CURRENT_TIMESTAMP` | DEFAULT_GENERATED |

<details>
<summary>View Create Statement SQL</summary>

```sql
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `recruiter_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `recruiter_id` (`recruiter_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`recruiter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```
</details>

---

## Table: `saved_jobs`

| Column Name | Data Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `int` | NO | **PRI** | NULL | auto_increment |
| `user_id` | `int` | NO | **MUL** | NULL |  |
| `job_id` | `int` | NO | **MUL** | NULL |  |
| `created_at` | `timestamp` | YES |  | `CURRENT_TIMESTAMP` | DEFAULT_GENERATED |

<details>
<summary>View Create Statement SQL</summary>

```sql
CREATE TABLE `saved_jobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `job_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_save` (`user_id`,`job_id`),
  KEY `job_id` (`job_id`),
  CONSTRAINT `saved_jobs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `saved_jobs_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```
</details>

---

## Table: `skill_gap_analysis`

| Column Name | Data Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `int` | NO | **PRI** | NULL | auto_increment |
| `user_id` | `int` | NO | **MUL** | NULL |  |
| `job_title` | `varchar(255)` | YES |  | NULL |  |
| `match_percentage` | `int` | YES |  | NULL |  |
| `matched_skills` | `json` | YES |  | NULL |  |
| `missing_skills` | `json` | YES |  | NULL |  |
| `created_at` | `timestamp` | YES |  | `CURRENT_TIMESTAMP` | DEFAULT_GENERATED |

<details>
<summary>View Create Statement SQL</summary>

```sql
CREATE TABLE `skill_gap_analysis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `job_title` varchar(255) DEFAULT NULL,
  `match_percentage` int DEFAULT NULL,
  `matched_skills` json DEFAULT NULL,
  `missing_skills` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `skill_gap_analysis_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```
</details>

---

## Table: `skills`

| Column Name | Data Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `int` | NO | **PRI** | NULL | auto_increment |
| `name` | `varchar(100)` | NO | **UNI** | NULL |  |

<details>
<summary>View Create Statement SQL</summary>

```sql
CREATE TABLE `skills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `skill_name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```
</details>

---

## Table: `user_skills`

| Column Name | Data Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `int` | NO | **PRI** | NULL | auto_increment |
| `user_id` | `int` | NO | **MUL** | NULL |  |
| `skill_id` | `int` | NO | **MUL** | NULL |  |
| `proficiency` | `enum('Beginner','Intermediate','Advanced')` | YES |  | `Beginner` |  |
| `endorsements` | `int` | YES |  | `0` |  |
| `years_of_experience` | `int` | YES |  | `0` |  |

<details>
<summary>View Create Statement SQL</summary>

```sql
CREATE TABLE `user_skills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `skill_id` int NOT NULL,
  `proficiency` enum('Beginner','Intermediate','Advanced') DEFAULT 'Beginner',
  `endorsements` int DEFAULT '0',
  `years_of_experience` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `skill_id` (`skill_id`),
  CONSTRAINT `user_skills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```
</details>

---

## Table: `users`

| Column Name | Data Type | Null | Key | Default | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `int` | NO | **PRI** | NULL | auto_increment |
| `name` | `varchar(100)` | YES |  | NULL |  |
| `email` | `varchar(100)` | YES |  | NULL |  |
| `password` | `varchar(255)` | YES |  | NULL |  |
| `role` | `enum('student','recruiter','admin')` | YES |  | `student` |  |
| `reset_password_token` | `varchar(255)` | YES |  | NULL |  |
| `reset_password_expires` | `datetime` | YES |  | NULL |  |
| `github_url` | `text` | YES |  | NULL |  |
| `resume_url` | `text` | YES |  | NULL |  |
| `is_verified` | `tinyint(1)` | YES |  | `0` |  |
| `created_at` | `timestamp` | YES |  | `CURRENT_TIMESTAMP` | DEFAULT_GENERATED |
| `bio` | `text` | YES |  | NULL |  |
| `phone` | `varchar(20)` | YES |  | NULL |  |
| `location` | `varchar(255)` | YES |  | NULL |  |
| `avatar` | `varchar(255)` | YES |  | NULL |  |
| `linkedin_url` | `varchar(255)` | YES |  | NULL |  |
| `company_name` | `varchar(255)` | YES |  | NULL |  |
| `company_bio` | `text` | YES |  | NULL |  |
| `headline` | `varchar(255)` | YES |  | `` |  |

<details>
<summary>View Create Statement SQL</summary>

```sql
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('student','recruiter','admin') DEFAULT 'student',
  `reset_password_token` varchar(255) DEFAULT NULL,
  `reset_password_expires` datetime DEFAULT NULL,
  `github_url` text,
  `resume_url` text,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `bio` text,
  `phone` varchar(20) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `company_bio` text,
  `headline` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1025 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```
</details>

---

