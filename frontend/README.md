# GOZEM web tracker
This Angular project demonstrates a secure web tracker setup with guards, interceptors, services, and secure routing.

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/nimondo/testfront.git
   cd testfront
   ```

2. Install dependencies and run the development server:
   ```bash
   npm install
   ng serve --open
   This will open the application in your default browser.
   ```

# Features

## Authentication Service (auth.service.ts)

- Handles user authentication logic.
- Modify the isAuthenticated method to implement your authentication logic.

## Auth Guard (auth.guard.ts)

- Protects routes from unauthorized access.
- Redirects to the login page if the user is not authenticated.

## Auth Interceptor (auth.interceptor.ts)

- Handles HTTP requests to include authentication tokens.
  -Modify as needed for your specific authentication mechanism.

## Secure Routing

- Utilizes Angular routing with guards to secure navigation.

## Track package

- Utilizes socket to update package status
