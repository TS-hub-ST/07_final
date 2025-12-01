CREATE DATABASE IF NOT EXISTS last_dit312;
USE last_dit312;

CREATE TABLE `movie` (
  `id` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `detail` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `coverimage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` double NOT NULL,
  `release_year` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `movie` (`id`, `name`, `detail`, `coverimage`, `rating`, `release_year`) VALUES
(1, 'Inception', 'A mind-bending sci-fi thriller about dreams within dreams.', 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg', 8.8, 2010),
(2, 'Interstellar', 'A space epic exploring love, gravity, and the survival of humanity.', 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg', 8.6, 2014),
(3, 'The Dark Knight', 'Batman faces the Joker in this gritty psychological crime thriller.', 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 9.0, 2008),
(4, 'La La Land', 'A romantic musical about dreams and relationships in Los Angeles.', 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg', 8.0, 2016),
(5, 'Parasite', 'A darkly comic thriller about class struggle between two families.', 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', 8.6, 2019),
(6, 'Avatar', 'A marine on an alien planet becomes part of a native tribe and fights for their survival.', 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg', 7.9, 2009),
(7, 'Titanic', 'A tragic love story set aboard the ill-fated RMS Titanic.', 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg', 7.9, 1997),
(8, 'Joker', 'A psychological character study of Arthur Fleck’s descent into madness.', 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', 8.4, 2019),
(9, 'The Matrix', 'A hacker learns the truth about reality and becomes a threat to AI overlords.', 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', 8.7, 1999),
(10, 'Forrest Gump', 'The life journey of a simple man with a big heart, filled with historic moments.', 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/saHP97rTPS5eLmrLQEcANmKrsFl.jpg', 8.8, 1994),
(11, 'The Shawshank Redemption', 'Two imprisoned men bond over years and find hope through friendship.', 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/6xKCYgH16UzM8P3V0l7I3Vflw6f.jpg', 9.3, 1994),
(12, 'Spirited Away', 'A young girl enters a magical world ruled by spirits and strange creatures.', 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', 8.6, 2001);

ALTER TABLE `movie`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `movie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
