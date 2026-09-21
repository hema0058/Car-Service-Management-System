# Car Service Management System (CSMS) - Complete Project Documentation

The Car Service Management System (CSMS) is a modern, full-stack application built to manage car maintenance requests, customers, and payments. It features a highly interactive, premium user interface designed without any external UI libraries (Zero New Libraries rule).

## 🏗️ Technical Stack
*   **Frontend**: React (Vite), React Router for navigation, Vanilla CSS (Glassmorphism & Neon themes).
*   **Backend**: Java Spring Boot, Spring Data JPA, RESTful APIs.
*   **Database**: MySQL.

---

## 👥 Roles & Access

The system is split into two distinct roles:

### 1. Customer (User)
The customer role is for everyday users who need to book services for their vehicles.
*   **Registration**: Requires a strong password (minimum 8 characters, uppercase, lowercase, and a number).
*   **Dashboard (`UserDashboard.jsx`)**: A visually stunning interface packed with premium features.

### 2. Administrator (Admin)
The admin role is for shop managers and mechanics.
*   **Seeding**: A default admin (`admin@csms.com` / `Admin@1234`) is automatically seeded into the database upon backend startup.
*   **Dashboard (`AdminDashboard.jsx`)**: A clean, data-driven dashboard focused on analytics and workflow management.

---

## ✨ Customer Dashboard Features

The Customer Dashboard is the centerpiece of the application, loaded with interactive, premium features:

### 1. "My Garage" & Car Registration
Customers can register multiple vehicles (Brand, Model, License Plate). The dashboard features a premium 3D glowing neon car graphic to enhance the visual appeal of the garage.

### 2. Voice-to-Text Service Requests 🎙️
*   **How it works**: Uses the native browser `Web Speech API` (`window.SpeechRecognition`).
*   **Feature**: Users can click a microphone icon and literally speak their service request (e.g., "I need an oil change"). The browser transcribes the speech and fills the input box automatically.

### 3. Live Cost Estimator 💡
*   **How it works**: React two-way data binding and string parsing.
*   **Feature**: As the user types (or speaks) a service, the system instantly analyzes the text. If it detects keywords like "brake", "oil", or "wash", it immediately pops up an estimated price range right below the input box.

### 4. Progress Tracker
*   **Feature**: A visual progress bar tracks the status of the service (Pending -> In Progress -> Completed), giving the customer peace of mind.

### 5. Secure Payment & Confetti Celebration 🎉
*   **How it works**: Pure CSS Animations (`@keyframes`) and React State.
*   **Feature**: Once an admin marks a service as `COMPLETED`, a "Pay Now" button appears. After simulating a successful payment, the system triggers a 4-second physical confetti rain animation across the screen.

### 6. Digital Receipts & Feedback
*   **Feature**: After payment, the user can view an official Digital Receipt containing the receipt number, service details, and total paid. They can also leave a 1 to 5-star rating for the service.

### 7. VIP Loyalty System 👑
*   **Feature**: In the Profile tab, the system automatically tracks how many services the user has completed and assigns them a Loyalty Tier (Bronze, Silver, Gold VIP) with corresponding CSS glowing crown badges.

### 8. 3D "Holographic" Mouse Tracking Cards 🧊
*   **How it works**: React `onMouseMove` events paired with CSS `transform: perspective()`.
*   **Feature**: As the customer moves their mouse over the glass cards on the dashboard, the cards physically tilt and track the cursor in 3D space, creating a holographic illusion.

---

## 🛠️ Admin Dashboard Features

The Admin Dashboard is built for efficiency and overview:

### 1. Analytics & Overview
*   Displays total registered customers, total pending service requests, and total estimated revenue based on completed services.

### 2. Auto-Polling System (Real-Time Updates) 🔄
*   **How it works**: React `useEffect`, `setInterval`, and `useRef`.
*   **Feature**: The dashboard checks the database every 10 seconds in the background. If a new request arrives while the admin is looking at the screen, a notification popup (Toast) alerts them instantly without needing a page refresh.

### 3. Service Workflow Management
*   Admins can view a table of all requests, filter them by status (Pending, In Progress, Completed), or use the search bar to find specific customers or cars.
*   They can seamlessly update the status of any job, which immediately updates the Customer's progress tracker and enables payment.

### 4. User Management
*   Admins can view all registered customers and edit their contact information directly from the dashboard.

---

## 🔒 Security & Quality of Life

### 1. Strong Password Enforcement
*   Implemented via Regex on both the Registration and Login pages. Passwords strictly require 8+ characters, mixed case, and a number, ensuring robust security.

### 2. Glassmorphism Design System
*   The entire UI is built on a custom CSS Glassmorphism design system (`index.css`), featuring backdrop blurs, semi-transparent borders, and animated gradient backgrounds that look stunning in both Dark and Light modes.

### 3. Light/Dark Mode Toggle
*   A native implementation that instantly flips CSS variables to provide a bright, clean interface or a dark, neon-accented interface across the whole application.
