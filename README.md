# Community Management System

This project implements a Community Management System allowing users to perform various actions related to authentication, community viewing, creation, and moderation.

## Features

### Authentication Module
- **Signup:** Users can create an account using a valid name, email, and a strong password.
- **Signin:** Users can log in using valid credentials.

### Community Module
- **View Communities:** Users can access and view all available communities.
- **Create Community:** Users can create new communities.

### Moderation Module
- **View Community Members:** Users can view the list of members within a community.
- **Add Community Member:** Users with admin privileges can add new members to a community.
- **Remove Community Member:** Users with admin privileges can remove members from a community.

## Routes

### Authentication Routes
- `POST /user/signup`: Register a new user.
- `POST /user/login`: Log in a user.

### Community Routes
- `GET /communities`: Retrieve all communities.
- `POST /communities`: Create a new community.

### Moderation Routes
- `GET /communities/:communityId/members`: Get members of a specific community.
- `POST /communities/:communityId/members`: Add a member to a community.
- `DELETE /communities/:communityId/members/:memberId`: Remove a member from a community.

## Usage

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Run the application: `npm start`

Ensure to handle user authentication using a valid token obtained after login to access restricted endpoints.
