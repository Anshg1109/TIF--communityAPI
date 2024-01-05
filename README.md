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

# Project Routes

This document provides details about the API routes available in this project.

## User Routes

### Sign Up
- **Route:** `POST /v1/auth/signup`
- **Description:** Create a new user account.
- **Required Body Parameters:** `name`, `email`, `password`

### Sign In
- **Route:** `POST /v1/auth/signin`
- **Description:** Authenticate and sign in a user.
- **Required Body Parameters:** `email`, `password`

### Get User Details
- **Route:** `GET /v1/auth/me`
- **Description:** Retrieve details of the authenticated user.
- **Authentication Required:** Yes

## Community Routes

### Create Community
- **Route:** `POST /v1/community`
- **Description:** Create a new community.
- **Required Body Parameters:** `name`
- **Authentication Required:** Yes

### Get All Communities
- **Route:** `GET /v1/community`
- **Description:** Retrieve all communities.

### Get Community Members
- **Route:** `GET /v1/community/:id/members`
- **Description:** Retrieve members of a specific community by ID.

### Get Owned Communities
- **Route:** `GET /v1/community/me/owner`
- **Description:** Retrieve communities owned by the authenticated user.
- **Authentication Required:** Yes

### Get Joined Communities
- **Route:** `GET /v1/community/me/member`
- **Description:** Retrieve communities joined by the authenticated user.
- **Authentication Required:** Yes

## Role Routes

### Create Role
- **Route:** `POST /v1/role`
- **Description:** Create a new role.
- **Required Body Parameters:** `name`

### Get All Roles
- **Route:** `GET /v1/role`
- **Description:** Retrieve all roles.

## Member Routes

### Add Member to Community
- **Route:** `POST /v1/member`
- **Description:** Add a member to a community.
- **Authentication Required:** Yes

### Remove Member from Community
- **Route:** `DELETE /v1/member/:id`
- **Description:** Remove a member from a community by ID.
- **Authentication Required:** Yes
## Usage

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Run the application: `npm start`

Ensure to handle user authentication using a valid token obtained after login to access restricted endpoints.
