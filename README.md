# Sociala

> **Your ideas deserve to be shared.**

Sociala is a full-stack social networking platform where users can create and share posts, interact with other users, follow people, receive notifications, and explore content.

The project is built with a **React frontend** and a **Django REST Framework backend**, using **PostgreSQL** for data storage.

---

## 📌 About the Project

Sociala is designed as a modern social networking platform with three main types of users:

* **User** — Can create posts, interact with content, follow users, and manage their profile, gets notification.
* **Admin** — Can manage reported content and moderate posts, users.

The application uses a REST API architecture where the React frontend communicates with the Django backend.

---

## ✨ Features

### 🔐 Authentication

* User registration
* User login
* Email verification
* Password reset
* JWT authentication
* HTTP-only cookies for JWT tokens
* Access and refresh token system
* Refresh token rotation
* Token blacklisting
* Role-based access
* Account deletion

### 👤 User Profiles

* Create profile
* Update profile
* Profile picture
* Cover image
* Full name
* Bio
* Location
* Date of birth
* User interests
* Followers count
* Following count
* Public profile viewing
* Profile setup status

### 📝 Posts

Users can:

* Create posts
* Edit their own posts
* Delete their own posts
* Add images to posts
* Add captions/content
* Choose post visibility
* View posts
* Like posts
* Unlike posts
* Comment on posts
* Reply to comments
* Share posts

### 👥 Follow System

Users can:

* Follow other users
* Unfollow users
* View followers
* View following
* Search users
* See whether they are already following another user
* View follower counts

### 🔄 Post Sharing

Users can:

* Share another user's post
* Add a caption when sharing
* View shared posts in the feed

Sociala combines normal posts and shares into the user's feed and sorts them by creation time.

### 🔔 Notifications

Users receive notifications for:

* Likes
* Comments
* Replies
* New followers

Users can:

* View notifications
* Check unread notification count
* Mark all notifications as read

### 🚨 Reporting & Moderation

Users can report posts for reasons such as:

* Spam
* Harassment or bullying
* Hate speech
* Nudity or sexual content
* Violence
* False information
* Other

Admins can:

* View reports
* Review reports
* Remove reported posts
* Resolve reports

### Admin Features

Admins can:

* View reported posts
* Search reports
* Filter reports
* Remove posts


---

# Tech Stack

## Frontend

| Technology      | Purpose                         |
| --------------- | ------------------------------- |
| React           | User interface                  |
| Vite            | Frontend development/build tool |
| React Router    | Client-side routing             |
| Redux Toolkit   | Global state management         |
| RTK Query       | API communication and caching   |
| React Hook Form | Form management                 |
| Zod             | Form validation                 |
| Tailwind CSS    | Styling                         |
| React Icons     | Icons                           |

## Backend

| Technology            | Purpose              |
| ---------------------- | -------------------- |
| Python                 | Programming language |
| Django                 | Backend framework    |
| Django REST Framework  | REST API             |
| SimpleJWT              | JWT authentication   |
| django-cors-headers    | CORS handling        |
| PostgreSQL             | Database             |

## Development Tools

* Git
* GitHub
* VS Code

---

# System Architecture

```text
                    ┌─────────────────────┐
                    │       Sociala       │
                    │   Social Platform   │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┴─────────────────┐
             │                                   │
             ▼                                   ▼
    ┌─────────────────┐                 ┌─────────────────┐
    │ React Frontend  │                 │ Django Backend  │
    │                 │  REST API       │                 │
    │ React + Vite    │ ◄─────────────► │ Django + DRF    │
    │ Redux Toolkit   │                 │ SimpleJWT       │
    │ RTK Query       │                 │                 │
    │ Tailwind CSS    │                 │                 │
    └─────────────────┘                 └────────┬────────┘
                                                 │
                                                 ▼
                                      ┌─────────────────────┐
                                      │     PostgreSQL      │
                                      │      Database       │
                                      └─────────────────────┘
```

---

# 📁 Project Structure

The project is separated into frontend and backend applications.

```text
Sociala/
│
├── Backend/
│   │
│   ├── apps/
│   │   │
│   │   ├── accounts/
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   ├── managers.py
│   │   │   ├── permissions.py
│   │   │   └── authentication.py
│   │   │
│   │   ├── follows/
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   │
│   │   ├── notifications/
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── services.py
│   │   │
│   │   ├── posts/
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── permissions.py
│   │   │   └── urls.py
│   │   │
│   │   ├── profiles/
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   │
│   │   ├── reports/
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── services.py
│   │   │   └── urls.py
│   │   │
│   │   └── shares/
│   │       ├── models.py
│   │       ├── serializers.py
│   │       └── views.py
│   │
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   ├── media/
│   ├── venv/
│   │
│   ├── .env
│   ├── manage.py
│   └── requirements.txt
│
│
└── Frontend/
    │
    ├── node_modules/
    ├── public/
    │
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── constants/
    │   ├── features/
    │   ├── layouts/
    │   ├── pages/
    │   ├── routes/
    │   ├── services/
    │   ├── validators/
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    │
    ├── .env
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── vercel.json
    └── vite.config.js
```

---

# 🗄️ Database Design

Sociala uses PostgreSQL as its relational database.

The major entities include:

```text
User
 │
 ├── Profile
 │      └── Interest
 │
 ├── Posts
 │      ├── PostImage
 │      ├── Comment
 │      │      └── Reply
 │      ├── Like
 │      └── Share
 │
 ├── Followers / Following
 │
 ├── Notifications
 │
 └── Reports
```

### Main Models

#### User

Stores authentication and account information.

```text
User
├── id
├── username
├── email
├── password
├── role
├── is_verified
├── is_active
├── created_at
└── updated_at
```

#### Profile

Stores additional information about a user.

```text
Profile
├── id
├── user
├── full_name
├── bio
├── profile_image
├── cover_image
├── location
├── date_of_birth
├── interests
└── is_setup
```

#### Post

Stores user-created posts.

```text
Post
├── user
├── content
├── visibility
├── is_removed
├── created_at
└── updated_at
```

#### PostImage

Stores images attached to posts.

```text
PostImage
├── post
├── image
├── order
└── created_at
```

#### Comment

Stores comments and replies.

```text
Comment
├── post
├── user
├── parent
├── content
├── created_at
└── updated_at
```

#### Like

Stores post likes.

```text
Like
├── user
├── post
└── created_at
```

#### Follow

Stores relationships between users.

```text
Follow
├── follower
├── following
└── created_at
```

#### Share

Stores posts shared by users.

```text
Share
├── user
├── post
├── caption
└── created_at
```

#### Notification

Stores user notifications.

```text
Notification
├── recipient
├── actor
├── verb
├── target_post
├── comment
├── message
├── is_read
└── created_at
```

#### Report

Stores reports submitted for posts.

```text
Report
├── reporter
├── post
├── reason
├── description
├── status
├── reviewed_by
├── created_at
└── reviewed_at
```

---

# 🔐 Authentication Flow

Sociala uses JWT authentication stored in **HTTP-only cookies**.

```text
User
 │
 │ Login
 ▼
React Frontend
 │
 │ POST /api/accounts/login/
 ▼
Django API
 │
 ├── Validate credentials
 │
 ├── Generate Access Token
 │
 └── Generate Refresh Token
 │
 ▼
HTTP-only Cookies
 │
 ▼
Authenticated Requests
 │
 │ access_token
 ▼
CookieJWTAuthentication
 │
 ├── Read cookie
 ├── Validate JWT
 └── Authenticate User
```

### Why HTTP-only cookies?

HTTP-only cookies prevent JavaScript from directly accessing the JWT tokens.

This helps reduce the risk of token exposure through client-side JavaScript.

---

# 👤 User Roles

Sociala has two application-level user states:
### User

Authenticated users can:

* Create posts
* Edit their posts
* Delete their posts
* Like posts
* Comment
* Reply
* Share posts
* Follow users
* Manage their profile
* Receive notifications
* Report posts

### Admin

Admins can:

* Review reports
* Remove posts
* Resolve reports
* Manage interests
* Perform moderation actions

---

# 📝 Post Visibility

Posts support three visibility options:

```text
Public
   │
   └── Anyone can view

Friends
   │
   └── Users who follow the author can view

Private
   │
   └── Only the author can view
```

The backend checks visibility before allowing users to retrieve or interact with posts.

---

# 📰 Feed System

Sociala's feed combines:

* Normal posts
* Shared posts

into a single feed.

```text
Post Table
     │
     │
     ├──────────────┐
     │              │
     ▼              ▼
 Normal Post      Share
                      │
                      ▼
                  Original Post
                      │
                      ▼
              Combined Feed
                      │
                      ▼
               Sort by Date
```

The feed is sorted using the creation time of the original post or share.

---

# 🔔 Notification System

Notifications are created through a reusable notification service.

Example:

```python
notify(
    recipient=post.user,
    actor=request.user,
    verb="like",
    target_post=post,
)
```

Supported notification types include:

```text
like
comment
reply
follow
share
report_warning
```

The system also prevents users from receiving notifications for actions they perform on themselves.

---

# 🚨 Report & Moderation System

Users can report posts.

A report can have one of the following statuses:

```text
pending
   │
   ├── reviewed
   │
   └── actioned
```

### `pending`

The report has not been reviewed.

### `reviewed`

The admin reviewed the report but did not remove the post.

### `actioned`

The admin reviewed the report and removed the post.

When a post is removed:

```text
Reported Post
     │
     ▼
is_removed = True
     │
     ├── Notify Post Owner
     │
     └── Resolve Other Pending Reports
```

---

# 🌐 API Structure

The backend follows REST API conventions.

Main API areas:

```text
/api/accounts/
/api/profiles/
/api/posts/
/api/follows/
/api/shares/
/api/notifications/
/api/reports/
```

Examples:

### Authentication

```text
POST /api/accounts/signup/
POST /api/accounts/login/
POST /api/accounts/logout/
POST /api/accounts/verify-email/
POST /api/accounts/password-reset/
```

### Profiles

```text
GET   /api/profiles/
GET   /api/profiles/me/
PATCH /api/profiles/me/
POST  /api/profiles/setup/
GET   /api/profiles/<user_id>/
GET   /api/profiles/interests/
```

### Posts

```text
GET    /api/posts/posts/
POST   /api/posts/posts/
GET    /api/posts/posts/<id>/
PATCH  /api/posts/posts/<id>/
DELETE /api/posts/posts/<id>/

POST   /api/posts/posts/<id>/like/
POST   /api/posts/posts/<id>/unlike/
GET    /api/posts/posts/<id>/comments/
```

### Follows

```text
GET  /api/follows/explore/
GET  /api/follows/<user_id>/followers/
GET  /api/follows/<user_id>/following/
POST /api/follows/<user_id>/follow/
POST /api/follows/<user_id>/unfollow/
```

### Shares

```text
GET    /api/shares/
POST   /api/shares/
DELETE /api/shares/<id>/
```

### Notifications

```text
GET  /api/notifications/
GET  /api/notifications/unread-count/
POST /api/notifications/<id>/read/
POST /api/notifications/read-all/
```

### Reports

```text
POST /api/reports/
GET  /api/reports/admin/
POST /api/reports/admin/<id>/resolve/
```

---
