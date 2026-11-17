Markdown
# TicketFlow 📋

A full-stack MERN Project & Ticket Management System featuring a highly interactive Kanban board, threaded comments, and secure user authentication. Built to streamline team workflows and task tracking.



## ✨ Features

* **Secure Authentication:** JWT-based user login and registration with strict server-side validation (bcrypt password hashing, regex name validation).
* **Project Workspaces:** Create, manage, and delete isolated project environments.
* **Interactive Kanban Board:** Drag-and-drop ticket management using `@hello-pangea/dnd` for optimistic UI updates.
* **Task Management:** Create tickets with titles, descriptions, and priority levels (High, Medium, Low).
* **Real-time Filtering:** Instant, client-side filtering of Kanban tickets by search keywords and priority.
* **Threaded Comments:** Dedicated ticket details modal for team collaboration and discussion.
* **Profile Management:** Secure endpoint for updating user credentials.
* **Responsive Design:** A premium Emerald & Slate UI built completely with Tailwind CSS.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS
* @hello-pangea/dnd (Drag and Drop)
* Axios

**Backend:**
* Node.js & Express.js (ES Modules)
* MongoDB (Mongoose ORM)
* JSON Web Tokens (JWT)
* bcryptjs
