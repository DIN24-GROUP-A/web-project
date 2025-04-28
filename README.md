# Reinforcement Editor

**Course:** Web Programming Project  
**Group:** Group A  
**Members:**

- [Gleb Bulygin](https://github.com/gllbhh)
- [Alicja Williams](https://github.com/alaWilliams)
- [Hammad Atif](https://github.com/h7mmxd)

---

## Project Overview

The **Modular Reinforcement Editor** is a web-based application designed to assist civil engineers and students in modeling and validating concrete reinforcement layouts. It allows users to:

- Design concrete cross-sections by adding rebars (reinforcement bars) via a drag-and-drop interface.
- Adjust cross-section dimensions and rebar properties interactively.
- Automatically calculate and verify minimal reinforcement requirements according to selected material grades.
- Provide feedback.

The project combines **Node.js** backend services with a **vanilla JavaScript** frontend using **HTML5 Canvas** for drawing and editing reinforcement layouts.

The project was deployed at Digital Ocean

---

## Deployment

The project is deployed on a **DigitalOcean Droplet** and can be accessed here:

🔗 [http://167.172.176.169/](http://167.172.176.169/)

## Features

### Frontend

- **Canvas Drawing:** Add, move, copy (Ctrl+Click), and delete rebars.
- **Rebar Table:** Edit X, Y coordinates and diameter values directly.
- **Cross-section Dimensioning:** Adjust section width and height dynamically.
- **Minimal Reinforcement Check:** Instant feedback if the current layout satisfies minimal reinforcement criteria based on selected concrete and steel grades.
- **Responsive Layout:** Usable across different screen sizes, with a dark mode option.

### Backend

- **User Authentication:** Secure registration and login functionality using JWT tokens.
- **Database:** MySQL database storing users, and feedbacks
- **Admin Dashboard:** Admin users can manage feedbacks and promote or remove users.
- **Feedback System:** Users can submit bug reports or general feedback to improve the application.

---

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** JWT, bcrypt for password hashing
- **Other Tools:**
  - Canvas API for rendering the reinforcement drawings
  - MVC (Model, View, Controller) architecture for backend logic organization

---

## Project Structure

```
.
├── .gitignore
├── README.md
├── app.js
├── client.rest
├── controllers
│   ├── auth.js
│   └── controllers.js
├── db
│   ├── index.js
│   └── schema.sql
├── frontend
│   ├── css
│   │   └── style.css
│   └── js
│       ├── canvas.js
│       ├── canvasActions.js
│       ├── data.js
│       ├── main.js
│       ├── minimalReinforcement.js
│       └── rebarTable.js
├── middleware
│   └── authMiddleware.js
├── models
│   ├── calculationModel.js
│   ├── favoriteModel.js
│   ├── feedbackModel.js
│   └── userModel.js
├── package-lock.json
├── package.json
├── routes
│   ├── auth.js
│   └── pages.js
├── test.php
├── views
│   ├── canvas.hbs
│   ├── dashboard.hbs
│   ├── feedback.hbs
│   ├── index.hbs
│   ├── layouts
│   │   └── main.hbs
│   ├── login.hbs
│   ├── partials
│   │   └── navbar.hbs
│   └── register.hbs

```

---

## How to Run Locally

1. **Clone the repository**

```bash
git clone https://github.com/DIN24-GROUP-A/[your-repo-name].git
cd [your-repo-name]
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure Environment Variables**

Create a `.env` file based on the following template:

```env
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=yourpassword
DATABASE=modular_reinforcement_db
PORT=3306
JWT_SECRET=yourjwtsecret
```

4. **Create database and tables**

Download, install and run [XAMPP](https://www.apachefriends.org/)
Go to [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/)

Use file ./db/schema.sql as a template to create tables.

5. **Run the Server**

Open XAMPP tool, start Apache and MySQL.

Navigate to the project folder in Terminal and run:

```bash
npm start
```

6. **Access the Application**

Open your browser and navigate to:

```
http://localhost:3000
```

---

## Screenshots

![Alt Text](/SCREENSHOTS/canvas.png)
Figure 1. Reinforcment Calculator page

![Alt Text](/SCREENSHOTS/admin_dashboard.png)
Figure 2. Admin Dashboard

---

## Future Improvements

- Fix the calculator
- Add more calculations
- Add export options (e.g., download reinforcement layouts as images or JSON).
- Enhance UI with libraries like React or Vue.js.
- Add role-based access control for more advanced user management.

---

## License

This project is created for educational purposes for the Web Programming Project course at OAMK and is licensed under the [MIT License](LICENSE).

© 2025 Gleb Bulygin, Alicja Williams, Hammad Atif
