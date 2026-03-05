-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: skillbridge
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ai_insights`
--

DROP TABLE IF EXISTS `ai_insights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_insights`
--

LOCK TABLES `ai_insights` WRITE;
/*!40000 ALTER TABLE `ai_insights` DISABLE KEYS */;
/*!40000 ALTER TABLE `ai_insights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ai_proposals`
--

DROP TABLE IF EXISTS `ai_proposals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_proposals`
--

LOCK TABLES `ai_proposals` WRITE;
/*!40000 ALTER TABLE `ai_proposals` DISABLE KEYS */;
INSERT INTO `ai_proposals` VALUES (3,41,9,'Backend Developer','Test Recruiter','Dear Hiring Manager,\n\nPlease accept this application for the Backend Developer position at Test Recruiter. My professional trajectory, including my experience with various innovative technical initiatives, aligns closely with the core responsibilities outlined in your description of Node.js + MySQL required... \n\nAs a dedicated professional with a strong foundation in technical problem-solving..., I am committed to delivering high-quality results that support Test Recruiter\'s mission. I look forward to discussing how my background can best serve your requirements.\n\nSincerely,\nGayathri','Professional','Short','2026-02-27 08:04:38',0),(5,41,8,'Frontend Developer','Kumar','Dear Hiring Manager,\n\nPlease accept this application for the Frontend Developer position at Kumar. My professional trajectory, including my experience with various innovative technical initiatives, aligns closely with the core responsibilities outlined in your description of We are looking for a Frontend Developer to build responsive and user-friendly web interfaces using R... \n\nAs a dedicated professional with a strong foundation in technical problem-solving..., I am committed to delivering high-quality results that support Kumar\'s mission. I look forward to discussing how my background can best serve your requirements.\n\nSincerely,\nGayathri','Professional','Long','2026-02-27 08:05:11',0),(9,41,7,'UI/UX Designer','Gayathri','Dear Hiring Manager,\n\nPlease accept this application for the UI/UX Designer position at Gayathri. My professional trajectory, including my experience with various innovative technical initiatives, aligns closely with the core responsibilities outlined in your description of Design user-centric interfaces... \n\nAs a dedicated professional with a strong foundation in technical problem-solving..., I am committed to delivering high-quality results that support Gayathri\'s mission. I look forward to discussing how my background can best serve your requirements.\n\nSincerely,\nGayathri','Professional','Medium','2026-02-28 09:29:53',0);
/*!40000 ALTER TABLE `ai_proposals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ai_recommendations`
--

DROP TABLE IF EXISTS `ai_recommendations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_recommendations`
--

LOCK TABLES `ai_recommendations` WRITE;
/*!40000 ALTER TABLE `ai_recommendations` DISABLE KEYS */;
INSERT INTO `ai_recommendations` VALUES (1,41,'skill','Learn React to improve your match for Frontend Developer by 17%.','medium',0,'2026-02-26 16:13:13'),(2,41,'skill','Learn React to improve your match for Frontend Developer by 11%.','medium',0,'2026-02-26 16:13:13'),(3,41,'skill','Learn React to improve your match for UI/UX Designer by 16%.','medium',0,'2026-02-28 09:28:35'),(4,41,'skill','Learn React to improve your match for UI/UX Designer by 12%.','medium',0,'2026-02-28 09:28:35'),(5,41,'skill','Learn React to improve your match for UI/UX Designer by 7%.','medium',0,'2026-02-28 09:49:48'),(6,41,'skill','Learn React to improve your match for UI/UX Designer by 12%.','medium',0,'2026-02-28 09:49:48'),(7,999,'skill','Learn React to improve your match for Frontend Developer by 16%.','medium',0,'2026-02-28 15:44:58'),(8,41,'skill','Learn React to improve your match for Frontend Developer by 8%.','medium',0,'2026-02-28 15:50:04'),(9,41,'skill','Learn React to improve your match for Full Stack Developer by 12%.','medium',0,'2026-02-28 15:50:57'),(10,41,'skill','Learn React to improve your match for Full Stack Developer by 11%.','medium',0,'2026-02-28 15:54:16'),(11,41,'skill','Learn React to improve your match for Frontend Developer by 11%.','medium',0,'2026-02-28 15:54:19'),(12,41,'skill','Learn React to improve your match for Full Stack Developer by 14%.','medium',0,'2026-02-28 15:54:21'),(13,41,'skill','Learn React to improve your match for Full Stack Developer by 5%.','medium',0,'2026-02-28 17:51:35'),(14,41,'skill','Learn React to improve your match for Frontend Developer by 13%.','medium',0,'2026-02-28 17:51:41'),(15,41,'skill','Learn React to improve your match for Full Stack Developer by 18%.','medium',0,'2026-02-28 17:55:20'),(16,41,'skill','Learn React to improve your match for Frontend Developer by 11%.','medium',0,'2026-02-28 17:55:22'),(17,41,'skill','Learn React to improve your match for Backend Developer by 13%.','medium',0,'2026-02-28 17:55:24'),(18,41,'skill','Learn React to improve your match for Backend Developer by 6%.','medium',0,'2026-02-28 18:27:46'),(19,41,'skill','Learn React to improve your match for Backend Developer by 18%.','medium',0,'2026-02-28 18:27:46'),(20,41,'skill','Learn React to improve your match for Backend Developer by 16%.','medium',0,'2026-02-28 18:54:52'),(21,41,'skill','Learn React to improve your match for Backend Developer by 10%.','medium',0,'2026-02-28 18:54:53'),(22,41,'skill','Learn React to improve your match for Backend Developer by 11%.','medium',0,'2026-02-28 19:18:56'),(23,41,'skill','Learn React to improve your match for Backend Developer by 9%.','medium',0,'2026-02-28 19:18:57'),(24,41,'skill','Learn React to improve your match for Backend Developer by 15%.','medium',0,'2026-03-01 12:42:09'),(25,41,'skill','Learn React to improve your match for UI/UX Designer by 18%.','medium',0,'2026-03-01 12:42:15'),(26,41,'skill','Learn React to improve your match for Backend Developer by 18%.','medium',0,'2026-03-01 12:42:16'),(27,41,'skill','Learn React to improve your match for UI/UX Designer by 20%.','medium',0,'2026-03-01 12:42:21'),(28,41,'skill','Learn React to improve your match for Backend Developer by 18%.','medium',0,'2026-03-01 12:42:22'),(29,41,'skill','Learn React to improve your match for Product Manager by 12%.','medium',0,'2026-03-01 12:42:24'),(30,41,'skill','Learn React to improve your match for Frontend Developer by 15%.','medium',0,'2026-03-01 12:42:26'),(31,41,'skill','Learn React to improve your match for Backend Developer by 18%.','medium',0,'2026-03-01 12:42:30'),(32,41,'skill','Learn React to improve your match for UI/UX Designer by 18%.','medium',0,'2026-03-01 13:38:54'),(33,41,'skill','Learn React to improve your match for UI/UX Designer by 18%.','medium',0,'2026-03-01 13:38:59');
/*!40000 ALTER TABLE `ai_recommendations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (2,8,46,'I am a strong fit for this role',0.00,'pending','2026-01-17 18:20:43',NULL,NULL,NULL,'Full-time',NULL,NULL,0,0,NULL,NULL),(3,9,46,'I have strong skills matching this role',55.56,'pending','2026-01-21 14:13:20',NULL,NULL,NULL,'Full-time',NULL,NULL,0,0,NULL,NULL),(4,8,49,'I am a Frontend Developer skilled in HTML, CSS, JavaScript, and React.js, focused on building responsive and user-friendly web interfaces. I convert UI designs into clean, maintainable code and ensure cross-browser compatibility and performance. I can integrate APIs, fix UI issues efficiently, and deliver reliable frontend solutions on time. I am ready to contribute to real-world projects and grow through practical development work.',5.56,'pending','2026-02-09 16:28:12',NULL,NULL,NULL,'Full-time',NULL,NULL,0,0,NULL,NULL),(5,9,41,'Dear Hiring Manager,\n\nPlease accept this application for the Backend Developer position at Test Recruiter. My professional trajectory, including my experience with various innovative technical initiatives, aligns closely with the core responsibilities outlined in your description of Node.js + MySQL required... \n\nAs a dedicated professional with a strong foundation in technical problem-solving..., I am committed to delivering high-quality results that support Test Recruiter\'s mission. I look forward to discussing how my background can best serve your requirements.\n\nSincerely,\nGayathri',11.11,'pending','2026-02-26 05:23:44',NULL,NULL,NULL,'Full-time',NULL,NULL,0,0,NULL,NULL),(6,8,41,'Dear Hiring Manager,\n\nPlease accept this application for the Frontend Developer position at Kumar. My professional trajectory, including my experience with various innovative technical initiatives, aligns closely with the core responsibilities outlined in your description of We are looking for a Frontend Developer to build responsive and user-friendly web interfaces using R... \n\nAs a dedicated professional with a strong foundation in technical problem-solving..., I am committed to delivering high-quality results that support Kumar\'s mission. I look forward to discussing how my background can best serve your requirements.\n\nSincerely,\nGayathri',16.67,'pending','2026-02-27 08:05:32',NULL,NULL,NULL,'Full-time',NULL,NULL,0,0,NULL,NULL),(7,7,41,'Dear Hiring Manager,\n\nPlease accept this application for the UI/UX Designer position at Gayathri. My professional trajectory, including my experience with various innovative technical initiatives, aligns closely with the core responsibilities outlined in your description of Design user-centric interfaces... \n\nAs a dedicated professional with a strong foundation in technical problem-solving..., I am committed to delivering high-quality results that support Gayathri\'s mission. I look forward to discussing how my background can best serve your requirements.\n\nSincerely,\nGayathri',11.11,'pending','2026-02-28 09:30:01',NULL,NULL,NULL,'Full-time',NULL,NULL,0,0,NULL,NULL);
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_rooms`
--

DROP TABLE IF EXISTS `chat_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_rooms`
--

LOCK TABLES `chat_rooms` WRITE;
/*!40000 ALTER TABLE `chat_rooms` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_skills`
--

DROP TABLE IF EXISTS `job_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_skills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_id` int DEFAULT NULL,
  `skill_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `job_id` (`job_id`),
  KEY `skill_id` (`skill_id`),
  CONSTRAINT `job_skills_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `job_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_skills`
--

LOCK TABLES `job_skills` WRITE;
/*!40000 ALTER TABLE `job_skills` DISABLE KEYS */;
INSERT INTO `job_skills` VALUES (4,7,1),(5,7,2),(6,7,3),(8,8,7),(9,8,1),(10,8,2),(11,9,1),(12,9,2),(13,9,3),(16,8,1),(17,8,2),(18,8,3),(28,13,6),(29,13,7),(30,13,1),(31,13,14),(32,13,2),(33,13,16),(34,12,20),(35,12,8),(36,12,30);
/*!40000 ALTER TABLE `job_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (7,'UI/UX Designer','Design user-centric interfaces','full-time',20000.00,'3 months','Remote','entry',41,'open','2025-12-15 13:18:00'),(8,'Frontend Developer','We are looking for a Frontend Developer to build responsive and user-friendly web interfaces using React. The role involves collaborating with designers and backend developers to deliver high-quality features.\n','full-time',25000.00,'6 months','Remote','entry',42,'open','2025-12-15 13:28:56'),(9,'Backend Developer','Node.js + MySQL required','full-time',60000.00,'6 months','Remote','intermediate',47,'open','2026-01-17 17:39:37'),(12,'Senior AI Engineer Internship','We are looking for a talented AI Engineer to help us build next-generation machine learning models for our educational platform.','internship',45.00,'6 months','San Francisco, CA (Remote)','intermediate',54,'open','2026-03-01 17:02:04'),(13,'Frontend Developer','We are looking for a skilled and motivated developer to join our team. In this role, you will be responsible for building and maintaining web applications, collaborating with cross-functional teams, and delivering high-quality software solutions. The ideal candidate is passionate about technology, detail-oriented, and eager to work in a fast-paced environment.','internship',5000.00,'3 months','Tirunelveli','intermediate',54,'open','2026-03-01 17:26:11');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` varchar(255) NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,47,'application',9,'New application for Backend Developer',0,'2026-02-26 05:23:44'),(2,42,'application',8,'New application for Frontend Developer',0,'2026-02-27 08:05:33'),(3,41,'application',7,'New application for UI/UX Designer',1,'2026-02-28 09:30:01'),(4,41,'job_match',10,'New job match: Senior AI Engineer Internship matches your skills!',0,'2026-03-01 16:05:12'),(5,42,'job_match',10,'New job match: Senior AI Engineer Internship matches your skills!',0,'2026-03-01 16:05:12'),(6,46,'job_match',10,'New job match: Senior AI Engineer Internship matches your skills!',0,'2026-03-01 16:05:12'),(7,41,'job_match',11,'New job match: Senior AI Engineer Internship matches your skills!',0,'2026-03-01 16:06:56'),(8,42,'job_match',11,'New job match: Senior AI Engineer Internship matches your skills!',0,'2026-03-01 16:06:56'),(9,46,'job_match',11,'New job match: Senior AI Engineer Internship matches your skills!',0,'2026-03-01 16:06:56'),(10,41,'job_match',12,'New job match: Senior AI Engineer Internship matches your skills!',0,'2026-03-01 17:02:04'),(11,46,'job_match',12,'New job match: Senior AI Engineer Internship matches your skills!',0,'2026-03-01 17:02:04'),(12,42,'job_match',12,'New job match: Senior AI Engineer Internship matches your skills!',0,'2026-03-01 17:02:04'),(13,41,'job_match',13,'New job match: Frontend Developer matches your skills!',0,'2026-03-01 17:26:11'),(14,42,'job_match',13,'New job match: Frontend Developer matches your skills!',0,'2026-03-01 17:26:11'),(15,46,'job_match',13,'New job match: Frontend Developer matches your skills!',0,'2026-03-01 17:26:11'),(16,45,'job_match',13,'New job match: Frontend Developer matches your skills!',0,'2026-03-01 17:26:11'),(17,49,'job_match',13,'New job match: Frontend Developer matches your skills!',0,'2026-03-01 17:26:11');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfolio_analysis`
--

DROP TABLE IF EXISTS `portfolio_analysis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfolio_analysis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `overall_score` int DEFAULT NULL,
  `project_count` int DEFAULT NULL,
  `project_scores` json DEFAULT NULL,
  `suggestions` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `portfolio_analysis_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolio_analysis`
--

LOCK TABLES `portfolio_analysis` WRITE;
/*!40000 ALTER TABLE `portfolio_analysis` DISABLE KEYS */;
/*!40000 ALTER TABLE `portfolio_analysis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfolio_items`
--

DROP TABLE IF EXISTS `portfolio_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfolio_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `type` enum('project','certificate') DEFAULT 'project',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `technologies` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `portfolio_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolio_items`
--

LOCK TABLES `portfolio_items` WRITE;
/*!40000 ALTER TABLE `portfolio_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `portfolio_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saved_jobs`
--

DROP TABLE IF EXISTS `saved_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_jobs`
--

LOCK TABLES `saved_jobs` WRITE;
/*!40000 ALTER TABLE `saved_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `saved_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skill_gap_analysis`
--

DROP TABLE IF EXISTS `skill_gap_analysis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skill_gap_analysis`
--

LOCK TABLES `skill_gap_analysis` WRITE;
/*!40000 ALTER TABLE `skill_gap_analysis` DISABLE KEYS */;
INSERT INTO `skill_gap_analysis` VALUES (1,41,'Frontend Developer',50,'[\"CSS\", \"JavaScript\", \"JavaScript\"]','[\"React\", \"React\", \"Node.js\"]','2026-02-26 16:13:13'),(2,41,'Frontend Developer',50,'[\"CSS\", \"JavaScript\", \"JavaScript\"]','[\"React\", \"React\", \"Node.js\"]','2026-02-26 16:13:13'),(3,41,'UI/UX Designer',33,'[\"JavaScript\"]','[\"React\", \"Node.js\"]','2026-02-28 09:28:35'),(4,41,'UI/UX Designer',33,'[\"JavaScript\"]','[\"React\", \"Node.js\"]','2026-02-28 09:28:35'),(5,41,'UI/UX Designer',33,'[\"JavaScript\"]','[\"React\", \"Node.js\"]','2026-02-28 09:49:48'),(6,41,'UI/UX Designer',33,'[\"JavaScript\"]','[\"React\", \"Node.js\"]','2026-02-28 09:49:48'),(8,999,'Frontend Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-02-28 15:44:58'),(9,41,'Frontend Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-02-28 15:50:04'),(10,41,'Full Stack Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-02-28 15:50:57'),(11,41,'Full Stack Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-02-28 15:54:16'),(12,41,'Frontend Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-02-28 15:54:19'),(13,41,'Full Stack Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-02-28 15:54:21'),(14,41,'Full Stack Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-02-28 17:51:35'),(15,41,'Frontend Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-02-28 17:51:41'),(16,41,'Full Stack Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-02-28 17:55:20'),(17,41,'Frontend Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-02-28 17:55:22'),(18,41,'Backend Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-02-28 17:55:24'),(19,41,'Backend Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-02-28 18:27:46'),(20,41,'Backend Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-02-28 18:27:46'),(21,41,'Backend Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-02-28 18:54:52'),(22,41,'Backend Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-02-28 18:54:53'),(23,41,'Backend Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-02-28 19:18:56'),(24,41,'Backend Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-02-28 19:18:56'),(25,41,'Backend Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-03-01 12:42:09'),(26,41,'UI/UX Designer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-03-01 12:42:15'),(27,41,'Backend Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-03-01 12:42:16'),(28,41,'UI/UX Designer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-03-01 12:42:21'),(29,41,'Backend Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-03-01 12:42:22'),(30,41,'Product Manager',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-03-01 12:42:24'),(31,41,'Frontend Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-03-01 12:42:26'),(32,41,'Backend Developer',0,'[]','[\"React\", \"TypeScript\", \"Tailwind CSS\", \"Node.js\"]','2026-03-01 12:42:30'),(33,41,'UI/UX Designer',33,'[\"JavaScript\"]','[\"React\", \"Node.js\"]','2026-03-01 13:38:54'),(34,41,'UI/UX Designer',33,'[\"JavaScript\"]','[\"React\", \"Node.js\"]','2026-03-01 13:38:59');
/*!40000 ALTER TABLE `skill_gap_analysis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `skill_name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES (16,'Angular'),(18,'AWS'),(24,'C#'),(23,'C++'),(7,'CSS'),(21,'Data Analysis'),(17,'Docker'),(10,'Express.js'),(30,'Firebase'),(27,'Flutter'),(11,'Git'),(12,'GitHub'),(29,'GraphQL'),(6,'HTML'),(5,'Java'),(1,'JavaScript'),(26,'Kotlin'),(20,'Machine Learning'),(9,'MongoDB'),(8,'MySQL'),(3,'Node.js'),(22,'PHP'),(4,'Python'),(2,'React'),(28,'React Native'),(13,'REST APIs'),(25,'Swift'),(14,'TypeScript'),(19,'UI/UX Design'),(15,'Vue.js');
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_skills`
--

DROP TABLE IF EXISTS `user_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_skills`
--

LOCK TABLES `user_skills` WRITE;
/*!40000 ALTER TABLE `user_skills` DISABLE KEYS */;
INSERT INTO `user_skills` VALUES (2,41,6,'Beginner',0,0),(3,41,1,'Beginner',0,0),(4,41,22,'Beginner',0,0),(5,42,19,'Advanced',0,0),(6,42,2,'Advanced',0,0),(7,42,3,'Advanced',0,0),(8,45,16,'Beginner',0,0),(9,45,5,'Beginner',0,0),(11,46,1,'Advanced',0,0),(12,46,3,'Intermediate',0,0),(13,49,23,'Beginner',0,0),(14,49,6,'Beginner',0,0),(15,49,7,'Beginner',0,0),(16,41,4,'Beginner',0,0),(17,41,10,'Beginner',0,0),(18,41,8,'Beginner',0,0),(19,41,7,'Beginner',0,0),(20,41,5,'Beginner',0,2);
/*!40000 ALTER TABLE `user_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('student','recruiter','admin') DEFAULT 'student',
  `reset_password_token` varchar(255) DEFAULT NULL,
  `reset_password_expires` datetime DEFAULT NULL,
  `portfolio_url` text,
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (41,'Gayathri','gayathri2005@gmail.com','$2b$10$GKjCX1dAU4924VC.2K.aOuimGDIHHFqYh2NqgDvGmD/ud73SyT6gG','student',NULL,NULL,'','','/uploads/1772040434317-52993564.pdf',0,'2026-02-24 17:33:50','','1234567890','Tirunelveli',NULL,'',NULL,NULL),(42,'Kumar','kumar@gmail.com','$2b$10$YCtjb87kaUQ.LImOJbv/V.bZnYLX27HdNd.0ZqcZqj16YBOZoRmiy','recruiter',NULL,NULL,NULL,NULL,NULL,0,'2026-02-24 17:33:50',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(43,'First Test User','test1@email.com','$2b$10$v2pjZdJnylLgAkIrFhiZCec1XgUF3TGgdj0JVN8e3StE.JtYrICqy','student',NULL,NULL,NULL,NULL,NULL,0,'2026-02-24 17:33:50',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(44,'Ultimate Test','ultimate@test.com','$2b$10$HessJW9AphKJODsQOhqNZeFDNlepSvo/U4OMwEm4ChkHHstncoY1K','student',NULL,NULL,NULL,NULL,NULL,0,'2026-02-24 17:33:50',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(45,'Nithra','nithu@gmail.com','$2b$10$IiQ1GMFgnFWVYfpRtIeCF.DrSqQN95NX5ClUujnSGPpTR28A4i0Ji','recruiter',NULL,NULL,NULL,NULL,NULL,0,'2026-02-24 17:33:50',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(46,'Test Student','student1@test.com','$2b$10$fEISl3X8q6h4c91pV1tbi.C15kq/yekLg9OHZ9pqNLzWw2jWyALie','student',NULL,NULL,NULL,NULL,NULL,0,'2026-02-24 17:33:50',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(47,'Test Recruiter','recruiter1@test.com','$2b$10$tNCCG022XAb0o/cQqKmbue1d5jSrV5.8i7Peim05Y5wRBhZ6qTrp.','recruiter',NULL,NULL,NULL,NULL,NULL,0,'2026-02-24 17:33:50',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(48,'Test Student','teststudent@example.com','$2b$10$RGI8Rx.nVStuHs2UyFkdYe6aaHE95inUN8jAMahidm.fjzutRFwMS','student',NULL,NULL,NULL,NULL,NULL,0,'2026-02-24 17:33:50',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(49,'Demo','demo1@gmail.com','$2b$10$VkL6NCQy3AXDhrERpUoqDu90WMWmX48q85Bws0dqdDkgEZ4stGuU.','student',NULL,NULL,NULL,NULL,NULL,0,'2026-02-24 17:33:50',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(50,'demo2','demo2@gmail.com','$2b$10$AGV2xrr1WX6n5Llu4.tN6ujQ7/wCdJVTAJ9mo4bNza5UXnuEhqNZ.','recruiter',NULL,NULL,NULL,NULL,NULL,0,'2026-02-24 17:33:50',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(51,'Gayathri','gayathri2005@gmail.com','$2b$10$GgACLP2uWdM.voF0mRkbweHWMNyeTm6Zuv8Dnuf/Aqxw2lQkBGowe','recruiter',NULL,NULL,NULL,NULL,NULL,0,'2026-02-24 17:33:50',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(52,'demo2','demo2@gmail.com','$2b$10$A03SncOWUKbkxxqyC3gqJucLvzvfHBpT9iJmYyOMLrpZHxX1SDoAq','student',NULL,NULL,NULL,NULL,NULL,0,'2026-02-24 17:33:50',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(53,'gayathri','gayathri2005@gmail.com','$2b$10$sEPuDvTrNCSj/kBCNdaS3OzLZ.4QCBfKlZ/vITYI.F6D5z2ThkQ9C','recruiter',NULL,NULL,NULL,NULL,NULL,0,'2026-02-24 17:33:50',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(54,'Gayu','gayathri.akshaya2005@gmail.com','$2b$10$.3ZolNKaQd9wze5Cs6B3s.BihsUVTkGJPSFnYA2uwUf0GSMF0HORC','recruiter','j4j3tmx1addok49z4z89k','2026-02-24 10:34:11','','','',0,'2026-02-24 17:33:50','','','Tirunelveli',NULL,'',NULL,NULL),(55,'Google User','google@example.com','social-auth-placeholder','student',NULL,NULL,NULL,NULL,NULL,0,'2026-02-24 17:33:50',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(56,'gayathri','gayathri.akshaya2005@gmail.com','$2b$10$4O/SV8qzG0SfV76XuIcigOc2OqD.YmN.46JWORHZ5OWmMalMsXbT.','student',NULL,NULL,NULL,NULL,NULL,0,'2026-02-24 17:33:50',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(57,'Super Admin','admin@skillbridge.com','$2b$10$N9Yep8CKjWgXnyN7IVdDMeHp22Qk20H3LG1wVLArMv/fvsHG.H1ly','admin',NULL,NULL,NULL,NULL,NULL,1,'2026-02-24 17:33:50',NULL,NULL,NULL,NULL,NULL,'SkillBridge Global','Leading the future of AI-powered talent acquisition and skill bridging for the next generation of developers.'),(999,'TestUser','test@test.com','pass','student',NULL,NULL,NULL,NULL,NULL,0,'2026-02-28 15:44:58',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-02 21:42:44
