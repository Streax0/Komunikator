CREATE TABLE IF NOT EXISTS `uczestnicy_pokoju` (
  `pokoj_id` int(11) NOT NULL,
  `uzytkownik_id` int(11) NOT NULL,
  `rola` enum('host','guest') NOT NULL,
  `dolaczono` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`pokoj_id`, `uzytkownik_id`),
  UNIQUE KEY `unikalna_rola_w_pokoju` (`pokoj_id`, `rola`),
  KEY `uzytkownik_id` (`uzytkownik_id`),
  CONSTRAINT `uczestnicy_pokoju_ibfk_1` FOREIGN KEY (`pokoj_id`) REFERENCES `pokoje` (`id`) ON DELETE CASCADE,
  CONSTRAINT `uczestnicy_pokoju_ibfk_2` FOREIGN KEY (`uzytkownik_id`) REFERENCES `uzytkownicy` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `sygnaly_p2p` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `pokoj_id` int(11) NOT NULL,
  `nadawca_id` int(11) NOT NULL,
  `odbiorca_id` int(11) NOT NULL,
  `typ` enum('offer','answer','ice') NOT NULL,
  `dane` longtext NOT NULL,
  `utworzono` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `odbiorca_sygnalu` (`pokoj_id`, `odbiorca_id`, `id`),
  CONSTRAINT `sygnaly_p2p_ibfk_1` FOREIGN KEY (`pokoj_id`) REFERENCES `pokoje` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sygnaly_p2p_ibfk_2` FOREIGN KEY (`nadawca_id`) REFERENCES `uzytkownicy` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sygnaly_p2p_ibfk_3` FOREIGN KEY (`odbiorca_id`) REFERENCES `uzytkownicy` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
