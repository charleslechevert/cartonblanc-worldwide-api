--
-- PostgreSQL database dump
--

-- Dumped from database version 12.12 (Ubuntu 12.12-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.6 (Ubuntu 12.6-0ubuntu0.20.04.1)

-- Started on 2023-09-15 12:11:59 CEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16556)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--





SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 206 (class 1259 OID 16618)
-- Name: penalty; Type: TABLE; Schema: public; Owner: cartonblanc
--


CREATE TABLE public.team (
    id integer PRIMARY KEY,
    full_name text NOT NULL,
    short_name text NOT NULL,
    admin_password text NOT NULL,
    target text NOT NULL,
    active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone,
    sentence text
);


ALTER TABLE public.team OWNER TO cbww;



--
-- TOC entry 205 (class 1259 OID 16603)
-- Name: player; Type: TABLE; Schema: public; Owner: cartonblanc
--

CREATE TABLE public.player (
    id integer PRIMARY KEY,
    fname text NOT NULL,
    lname text NOT NULL,
    pseudo text NOT NULL,
    email text NOT NULL,
    active boolean NOT NULL,
    team_id integer NOT NULL REFERENCES public.team(id),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone
);


ALTER TABLE public.player OWNER TO cbww;


DROP TABLE IF EXISTS public.penalty;
CREATE TABLE public.penalty (
    id integer PRIMARY KEY,
    type text NOT NULL,
    amount integer NOT NULL,
    active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone
);


ALTER TABLE public.penalty OWNER TO cbww;


--
-- TOC entry 207 (class 1259 OID 16651)
-- Name: register; Type: TABLE; Schema: public; Owner: cartonblanc
--

CREATE TABLE public.register (
    id integer PRIMARY KEY,
    date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    paid_status boolean NOT NULL,
    active boolean NOT NULL,
    penalty_id integer NOT NULL REFERENCES public.penalty(id), 
    player_id integer NOT NULL REFERENCES public.player(id),
    descr text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone
);


ALTER TABLE public.register OWNER TO cbww;

--
-- TOC entry 204 (class 1259 OID 16593)
-- Name: team; Type: TABLE; Schema: public; Owner: cartonblanc
--


ALTER TABLE public.team OWNER TO cbww;

--
-- TOC entry 3040 (class 0 OID 16618)
-- Dependencies: 206
-- Data for Name: penalty; Type: TABLE DATA; Schema: public; Owner: cartonblanc
--



--
-- TOC entry 3038 (class 0 OID 16593)
-- Dependencies: 204
-- Data for Name: team; Type: TABLE DATA; Schema: public; Owner: cartonblanc
--

INSERT INTO public.team (id, full_name, short_name, admin_password, target, active, created_at, updated_at, sentence) 
VALUES 
(12071998, 'Pleubian', 'ASPP', '$2a$12$noEheEIR.50m9AFEQKy6E.TRuto98p9jN3GTW90oAGUCwyy8Gao/i', 'Grosse teuf au printemps! Qui dit mieux?', TRUE, '2022-12-03 17:25:58.693429+01', '2023-01-09 13:41:41.89+01', 'Bonne semaine à tous, sauf ceux qui loupent des faces à faces à la dernière seconde🟡🟢');



--
-- TOC entry 3039 (class 0 OID 16603)
-- Dependencies: 205
-- Data for Name: player; Type: TABLE DATA; Schema: public; Owner: cartonblanc
--

INSERT INTO public.player (id, fname, lname, pseudo, email, active, team_id, created_at, updated_at) VALUES
(1, 'Charles', 'Le Chevert', 'Carlito', 'charles.lechevert@essca.eu', 't', 12071998, '2022-11-10 09:05:10.003+01', '2022-11-10 09:05:10.003+01'),
(2, 'Mael', 'Talabaron', 'Talab', 'mael.talab@outlook.fr', 't', 12071998, '2022-11-10 10:59:37.018+01', '2022-11-11 11:46:12.418+01'),
(3, 'Kévin', 'Le Moullec', 'KLM9', 'kevin@lemoullec.fr', 't', 12071998, '2022-11-12 10:46:21.147+01', '2022-11-12 10:46:21.147+01'),
(4, 'Pierre-Marie', 'Thépaut', 'PM', 'pm@thepaut.fr', 't', 12071998, '2022-11-12 10:46:48.97+01', '2022-11-12 10:46:48.97+01'),
(5, 'Romain', 'Le Carreres', 'Rom1', 'rom@carreres.fr', 't', 12071998, '2022-11-12 10:47:08.343+01', '2022-11-12 10:47:08.343+01'),
(6, 'Thomas', 'Quérou', 'Quérou', 'thomas@querou.fr', 't', 12071998, '2022-11-12 10:47:36.738+01', '2022-11-12 10:47:36.738+01'),
(7, 'Amaury', 'Guillou', 'Amau', 'Amaury@Guillou.fr', 't', 12071998, '2022-11-12 10:48:12.359+01', '2022-11-12 10:48:12.359+01'),
(8, 'Thomas', 'Le Chevanton', 'Chevanton', 'Thomas@Chevanton.fr', 't', 12071998, '2022-11-12 10:48:36.262+01', '2022-11-12 10:48:36.262+01'),
(9, 'Clément', 'Deboise', 'Deboise', 'Clément@Deboise.fr', 't', 12071998, '2022-11-12 10:49:09.789+01', '2022-11-12 10:49:09.789+01'),
(10, 'Lucas', 'Gauthier', 'Loucasss', 'Lucas@Gauthier.fr', 't', 12071998, '2022-11-12 10:49:26.968+01', '2022-11-12 10:49:26.968+01'),
(11, 'Tommy', 'Perrin', 'Pippo', 'tommy@Perrin.fr', 't', 12071998, '2022-11-12 10:50:12.308+01', '2022-11-12 10:50:12.308+01'),
(12, 'Yann', 'Guillou', 'Yannou', 'Yann@guillou.fr', 't', 12071998, '2022-11-12 10:50:40.219+01', '2022-11-12 10:50:40.219+01'),
(13, 'Christophe', 'Guillou', 'Tof', 'christophe@guillou.fr', 't', 12071998, '2022-11-12 10:50:57.055+01', '2022-11-12 10:50:57.055+01'),
(14, 'Basile', 'Gachon', 'El capitano', 'Basile@gachon.fr', 't', 12071998, '2022-11-12 10:51:23.165+01', '2022-11-12 10:51:23.165+01'),
(15, 'Marius', 'Guillou', 'Darius', 'marius@guillou.fr', 't', 12071998, '2022-11-12 10:51:54.497+01', '2022-11-12 10:51:54.497+01'),
(16, 'Tom', 'Raoul', 'Petit Tom', 'tom@raoul.fr', 't', 12071998, '2022-11-12 10:52:15.804+01', '2022-11-12 10:52:15.804+01'),
(17, 'Anthony', 'Laurent', 'La boulette', 'anthony@laurent.fr', 't', 12071998, '2022-11-12 10:53:02.216+01', '2022-11-12 10:53:02.216+01'),
(18, 'Hervé', 'Probst', 'Hervé', 'hervé@probst.fr', 't', 12071998, '2022-11-12 10:53:42.678+01', '2022-11-12 10:53:42.678+01'),
(19, 'Gurvan', 'L hostis', 'L Hostis', 'gurvan@lhostis.fr', 't', 12071998, '2022-11-12 10:54:19.483+01', '2022-11-12 10:54:19.483+01'),
(20, 'Amaury', 'Bougeard', 'Amaury B', 'amaury@bougeard.fr', 't', 12071998, '2022-11-12 10:55:33.024+01', '2022-11-12 10:55:33.024+01'),
(21, 'Stevan', 'Gicquel', 'Stéphane', 'stevan@gicquel.fr', 't', 12071998, '2022-11-12 10:56:24.863+01', '2022-11-12 10:56:24.863+01'),
(22, 'Julien', 'Malledan', 'Petit Ju', 'julien@malledan.fr', 't', 12071998, '2022-11-12 10:56:48.554+01', '2022-11-12 10:56:48.554+01'),
(23, 'Martin', 'Bodiou', 'Martin', 'martin@bodiou.fr', 't', 12071998, '2022-11-12 10:57:18.419+01', '2022-11-12 10:57:18.419+01'),
(24, 'Baptiste', 'Perrot', 'Bapt', 'baptiste@perrot.fr', 't', 12071998, '2022-11-12 10:57:35.583+01', '2022-11-12 10:57:35.583+01'),
(25, 'Yohan', 'Gouronnec', 'Pedro Miguel ou le Prez', 'pedro@gouronec.fr', 't', 12071998, '2022-11-12 10:58:47.281+01', '2022-11-12 10:58:47.281+01'),
(26, 'Florent', 'Guillemet', 'Flo', 'flo@guillemet.fr', 't', 12071998, '2022-11-12 10:59:34.278+01', '2022-11-12 10:59:34.278+01'),
(27, 'Gurvan', 'Gicquel', 'Mini GIcquel', 'gurvan@gicquel.fr', 't', 12071998, '2022-11-12 10:59:59.737+01', '2022-11-12 10:59:59.737+01'),
(28, 'Lilian', 'Mouhty', 'Lilian', 'lilian@mouthy.fr', 't', 12071998, '2022-11-12 11:00:17.782+01', '2022-11-12 11:00:17.782+01'),
(29, 'Cyprien', 'Mouthy', 'Cyprien', 'cyprien@mouthy.fr', 't', 12071998, '2022-11-12 11:01:28.244+01', '2022-11-12 11:01:28.244+01'),
(30, 'Mathys', 'Olliver', 'Mathys', 'Mathys@ollivier.fr', 't', 12071998, '2022-11-12 11:01:50.341+01', '2022-11-12 11:01:50.341+01'),
(31, 'Mewenn', 'Corbani', 'Mewenn', 'Mewenn@corbani.fr', 't', 12071998, '2022-11-12 11:04:09.4+01', '2022-11-12 11:04:09.4+01'),
(32, 'Tristan', 'Davy', 'Le protégé du Capio', 'tristan@davy.fr', 't', 12071998, '2022-11-15 20:31:14.137+01', '2022-11-15 20:31:14.137+01'),
(33, 'Florian', 'Le Quellec', 'Coach B', 'florian@lequellec.fr', 't', 12071998, '2022-11-16 18:10:10.273+01', '2022-11-16 18:10:10.273+01'),
(34, 'Angel', 'Husson', 'Di Mario', 'Angel@husson.fr', 't', 12071998, '2022-11-16 18:40:59.507+01', '2022-11-16 18:40:59.507+01'),
(35, 'Jérôme', 'Le Carreres', 'Le gourou de la A', 'jeje@carreres.fr', 't', 12071998, '2022-11-16 18:40:59.507+01', '2022-11-16 18:40:59.507+01'),
(36, 'Lionel', 'Le Callannec', 'Le complice du Gourou', 'lionel@lec.fr', 't', 12071998, '2022-11-16 18:40:59.507+01', '2022-11-16 18:40:59.507+01'),
(37, 'Charles', 'Le Chevert', 'dddddddd', 'charles.lechevert@essca.eu', 'f', 12071998, '2022-12-03 22:03:51.436+01', '2022-12-03 22:04:01.432+01'),
(38, 'Loic', 'Davy', 'Loic', 'Loic@hotmail.fr', 't', 12071998, '2023-01-20 21:45:53.482+01', '2023-01-20 21:45:53.482+01'),
(39, 'Raphaël', 'Tepo', 'Raph la marmule', 'Rr@ffg.fr', 't', 12071998, '2023-02-12 19:29:34.825+01', '2023-02-12 19:29:34.825+01'),
(40, 'Alain', 'Malledan', 'Coach Alain', 'Alainma@yahoo.fr', 't', 12071998, '2023-04-28 10:13:33.094+02', '2023-04-28 10:13:33.094+02'),
(41, 'Sam', 'FAY', 'Fils Fay', 'Sam.fay@gmail.com', 't', 12071998, '2023-06-04 12:28:33.212+02', '2023-06-04 12:28:33.212+02');


INSERT INTO public.penalty (id, type, amount, active, created_at, updated_at) VALUES
(1, 'Carton jaune', 10, 't', '2022-11-15 19:30:49.247+01', '2022-11-15 19:30:49.247+01'),
(2, 'Carton blanc', 10, 't', '2022-11-15 19:30:55.959+01', '2022-11-15 19:30:55.959+01'),
(3, 'Carton rouge', 20, 't', '2022-11-15 19:31:02.999+01', '2022-11-15 19:31:02.999+01'),
(4, 'Retard', 2, 't', '2022-11-15 19:31:08.466+01', '2022-11-15 19:31:08.466+01'),
(5, 'Téléphone sonne dans les vestiaires', 2, 't', '2022-11-15 19:31:30.426+01', '2022-11-15 19:31:30.426+01'),
(6, 'Pénalty raté', 10, 't', '2022-11-15 19:31:36.938+01', '2022-11-15 19:31:36.938+01'),
(7, 'Oubli de matériel', 2, 't', '2022-11-15 19:31:52.674+01', '2022-11-15 19:31:52.674+01'),
(8, 'But contre son camp', 10, 't', '2022-11-15 19:31:59.77+01', '2022-11-15 19:31:59.77+01'),
(9, 'Photo dans le journal en noir et blanc', 5, 't', '2022-11-15 19:32:08.159+01', '2022-11-15 19:32:08.159+01'),
(10, 'Photo dans le journal en couleur', 10, 't', '2022-11-15 19:32:23.306+01', '2022-11-15 19:32:23.306+01'),
(11, 'Nommé dans le journal', 2, 't', '2022-11-15 20:38:52.725+01', '2022-11-15 20:38:52.725+01'),
(12, 'Rentrer chez soi avec le matériel du club', 5, 't', '2022-11-15 20:39:00.319+01', '2022-11-15 20:39:00.319+01'),
(13, 'Survêtement oublié le jour du match', 1, 'f', '2022-11-15 20:39:17.434+01', '2022-12-03 19:59:15.103+01'),
(14, 'Survêtement oublié le jour du match', 1, 't', '2022-12-03 19:59:28.961+01', '2022-12-03 19:59:28.961+01');



--
-- TOC entry 3041 (class 0 OID 16651)
-- Dependencies: 207
-- Data for Name: register; Type: TABLE DATA; Schema: public; Owner: cartonblanc
--

COPY public.register (id, date, paid_status, active, penalty_id, player_id, descr, created_at, updated_at) 
FROM '/home/student/Bureau/html/api/scripts/register_data_old.txt' DELIMITER E'\t' CSV;


