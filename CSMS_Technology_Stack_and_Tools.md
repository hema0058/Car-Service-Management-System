# Car Service Management System (CSMS)
## Technology Stack & Tools Documentation

This document outlines the technologies, libraries, and tools used to build the Car Service Management System, along with an explanation of how they are utilized in the project.

---

### 1. Frontend Technologies (Client-Side)
The frontend is the visual part of the application that the user interacts with directly. It is built to be dynamic, responsive, and fast.

*   **React (v19)**: The core JavaScript library used to build the user interface. It uses a component-based architecture, allowing us to build reusable UI elements (like forms, tables, and buttons) and manage the application's state efficiently.
*   **Vite**: A modern, blazing-fast frontend build tool and development server. We use it instead of traditional tools (like Webpack or Create React App) because it provides instant server start times and Hot Module Replacement (HMR) for a smoother development experience.
*   **React Router DOM**: Handles client-side routing. It enables seamless navigation between different pages (such as the Login Page, User Dashboard, and Admin Dashboard) without requiring the browser to reload the page.
*   **Axios**: A promise-based HTTP client. We use Axios to send asynchronous REST API requests (GET, POST, PUT, DELETE) from our React components to our Spring Boot backend to fetch or submit data.
*   **React Toastify**: A library used to display elegant, non-blocking toast notifications. It provides immediate user feedback (e.g., "Login Successful" or "Service Request Submitted") in a visually pleasing way.
*   **React Icons**: Provides a comprehensive library of standard icons that are used throughout the application to enhance the UI.
*   **Vanilla CSS**: Used for all the styling. The project utilizes raw CSS to create a premium, dark-themed, and responsive design, implementing modern layout techniques like Flexbox and CSS Grid, along with hover effects and micro-animations.

---

### 2. Backend Technologies (Server-Side)
The backend acts as the brain of the application. It processes business logic, handles security, and communicates with the database.

*   **Java 17+**: The robust, object-oriented programming language used to write the backend logic.
*   **Spring Boot (v3+)**: The primary backend framework. Spring Boot drastically simplifies the setup of a production-ready REST API. It comes with an embedded Tomcat server, meaning we don't need to configure a separate web server to run our Java code.
*   **Spring Web**: A module within Spring Boot used to build the REST controllers. These controllers define our API endpoints (e.g., `/api/users/login`, `/api/services/add`) and handle incoming HTTP requests from the React frontend.
*   **Spring Data JPA & Hibernate**: Used for Object-Relational Mapping (ORM). Instead of writing raw SQL queries, JPA allows us to interact with the MySQL database using regular Java objects (Entities). Hibernate translates our Java code into the necessary SQL queries automatically.
*   **Maven**: The build automation and dependency management tool. It reads the `pom.xml` file to automatically download and link all the required Java libraries (like Spring Boot and MySQL drivers).

---

### 3. Database
The database is where all the application's persistent data is stored securely.

*   **MySQL**: A highly reliable Relational Database Management System (RDBMS). It is used to store all structured data in tables, including User credentials, Car details, and Service Requests. It enforces relationships between this data (e.g., linking a specific car to a specific user).

---

### 4. Development Tools
These are the tools installed on your system to help write, run, and manage the code.

*   **Node.js & npm**: Node.js provides the runtime to execute JavaScript outside the browser, while npm (Node Package Manager) is used to download and manage the frontend libraries listed in the `package.json` file.
*   **JDK (Java Development Kit)**: Required to compile and run the Java backend code.
*   **Integrated Development Environment (IDE)**: Tools like VS Code, IntelliJ IDEA, or Eclipse used for writing code, debugging, and managing project files.
*   **XAMPP / MySQL Workbench**: Tools used to host the local MySQL database server and visually inspect the tables and data.

---

### How Everything Works Together (The Architecture)
1.  **User Interaction**: The user interacts with the **React** UI in their browser (e.g., clicking a "Submit Request" button).
2.  **API Call**: The React frontend uses **Axios** to send an HTTP request containing the user's data to the backend.
3.  **Processing**: The **Spring Boot** backend receives this request at a specific Controller endpoint. It processes any necessary business logic.
4.  **Database Interaction**: The backend uses **Spring Data JPA** to save this new information into the **MySQL** database or retrieve existing information.
5.  **Response**: The backend sends a JSON response back to the frontend (e.g., indicating success).
6.  **UI Update**: The React frontend receives the response, updates the UI, and uses **React Toastify** to show a success message to the user.
