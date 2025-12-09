# Rent A Ride

Build the database on Myphpadmin by dropping in this SQL

CREATE DATABASE IF NOT EXISTS rentaride_db;
USE rentaride_db;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('renter', 'admin') DEFAULT 'renter',
    phone_number VARCHAR(20) DEFAULT NULL,
    drivers_license_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cars (
    car_id INT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(100) NOT NULL,
    make VARCHAR(100) NOT NULL,
    year YEAR,
    type VARCHAR(50) NOT NULL,
    daily_rate DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(255),
    description TEXT DEFAULT NULL,
    owner_id INT DEFAULT NULL
);

CREATE TABLE rentals (
    rental_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(20) DEFAULT 'onsite',
    proof_of_payment_url VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (car_id) REFERENCES cars(car_id)
);

INSERT INTO cars (make, model, year, type, daily_rate, image_url, description, owner_id) VALUES
('Toyota', 'Vios', 2021, 'Sedan', 1500.00, 'https://images.pexels.com/photos/32422135/pexels-photo-32422135.jpeg', 'Reliable city car', NULL),
('Ford', 'Territory', 2023, 'SUV', 3500.00, 'https://imgcdn.zigwheels.ph/large/gallery/exterior/7/2667/ford-territory-front-side-view-103864.jpg', 'Spacious SUV for families', NULL),
('Honda', 'Civic', 2020, 'Sedan', 2500.00, 'https://as2.ftcdn.net/v2/jpg/03/88/52/07/1000_F_388520760_udNlcy1XX4InVbgEgskMSBJAvf83EtTy.jpg', 'Sporty and comfortable', NULL),
('Mitsubishi', 'Mirage G4', 2019, 'Sedan', 1200.00, 'https://as1.ftcdn.net/v2/jpg/05/72/94/24/1000_F_572942479_AsWMIyhXQOy4llNyGEnkkcKmNoJkQS9d.jpg', 'Fuel efficient', NULL),
('Hyundai', 'Accent', 2022, 'Sedan', 1800.00, 'https://as1.ftcdn.net/v2/jpg/05/49/90/60/1000_F_549906099_LV4LE6FAiI3XC4muyEpNXnhXDHXDtsU1.jpg', 'Smooth ride', NULL),
('Nissan', 'Navara', 2023, 'Truck', 4000.00, 'https://as2.ftcdn.net/v2/jpg/03/90/89/79/1000_F_390897978_ecTAC0k6cf5MftQIQWIcetCqlolxvh4P.jpg', 'Heavy duty pickup', NULL),
('Suzuki', 'Ertiga', 2021, 'MPV', 2800.00, 'https://as2.ftcdn.net/v2/jpg/05/59/72/79/1000_F_559727998_WEZK0BxApNyV6kSYMgbQ9klMnR6l9s8U.jpg', '7-seater for groups', NULL),
('Kia', 'Picanto', 2018, 'Hatchback', 1000.00, 'https://as1.ftcdn.net/v2/jpg/17/67/55/62/1000_F_1767556235_vAgCl3uR9zMgUTsK0rkAorSGKk4sn4jm.jpg', 'Easy to park', NULL),
('Mazda', '3', 2022, 'Sedan', 3000.00, 'https://as1.ftcdn.net/v2/jpg/17/20/44/46/1000_F_1720444607_QcoJ2mCxcq7NxNxE5hN1A2UK0AcoxXAU.jpg', 'Premium interior', NULL),
('MG', 'ZS', 2023, 'SUV', 3200.00, 'https://as1.ftcdn.net/v2/jpg/04/39/27/26/1000_F_439272647_WX013C5bVH1tQlbyaB6sc5UlMtMlrEqE.jpg', 'Modern features', NULL);

INSERT INTO users (first_name, last_name, email, password_hash) VALUES
('John', 'Doe', 'john@example.com', '$2a$10$wTf2fS98fK/Y1vYvB.fK4O/d/gUeJ2bZ7pYj4gG7j4pT9wN.rW4zS'),
('Jane', 'Smith', 'jane@example.com', '$2a$10$wTf2fS98fK/Y1vYvB.fK4O/d/gUeJ2bZ7pYj4gG7j4pT9wN.rW4zS'),
('Mike', 'Brown', 'mike@example.com', '$2a$10$wTf2fS98fK/Y1vYvB.fK4O/d/gUeJ2bZ7pYj4gG7j4pT9wN.rW4zS'),
('Sarah', 'Lee', 'sarah@example.com', '$2a$10$wTf2fS98fK/Y1vYvB.fK4O/d/gUeJ2bZ7pYj4gG7j4pT9wN.rW4zS'),
('Chris', 'Wang', 'chris@example.com', '$2a$10$wTf2fS98fK/Y1vYvB.fK4O/d/gUeJ2bZ7pYj4gG7j4pT9wN.rW4zS'),
('Anna', 'Gomez', 'anna@example.com', '$2a$10$wTf2fS98fK/Y1vYvB.fK4O/d/gUeJ2bZ7pYj4gG7j4pT9wN.rW4zS'),
('Ben', 'Cruz', 'ben@example.com', '$2a$10$wTf2fS98fK/Y1vYvB.fK4O/d/gUeJ2bZ7pYj4gG7j4pT9wN.rW4zS'),
('Tanya', 'Lim', 'tanya@example.com', '$2a$10$wTf2fS98fK/Y1vYvB.fK4O/d/gUeJ2bZ7pYj4gG7j4pT9wN.rW4zS'),
('Paul', 'Reyes', 'paul@example.com', '$2a$10$wTf2fS98fK/Y1vYvB.fK4O/d/gUeJ2bZ7pYj4gG7j4pT9wN.rW4zS'),
('Gina', 'Diaz', 'gina@example.com', '$2a$10$wTf2fS98fK/Y1vYvB.fK4O/d/gUeJ2bZ7pYj4gG7j4pT9wN.rW4zS');

INSERT INTO rentals (user_id, car_id, start_date, end_date, total_cost, status) VALUES
(1, 1, '2025-12-05', '2025-12-07', 4500.00, 'active'),
(1, 2, '2025-11-20', '2025-11-25', 17500.00, 'completed'),
(2, 3, '2026-01-10', '2026-01-12', 5000.00, 'pending'),
(3, 4, '2025-12-01', '2025-12-01', 1200.00, 'completed'),
(4, 5, '2025-12-15', '2025-12-18', 5400.00, 'pending'),
(5, 6, '2025-10-01', '2025-10-07', 28000.00, 'completed'),
(6, 7, '2025-09-01', '2025-09-02', 5600.00, 'completed'),
(7, 8, '2025-08-01', '2025-08-05', 5000.00, 'completed'),
(8, 9, '2025-07-01', '2025-07-03', 9000.00, 'completed'),
(9, 10, '2025-06-01', '2025-06-02', 6400.00, 'completed');


