# PetServiceApp

**PetServiceApp** is a full-stack native application developed as part of my thesis project. It is built using React Native for the frontend, Node.js with Express for the backend, and MongoDB Atlas for the database. The application is designed to help users find service providers for their pets, while also offering users the opportunity to become service providers and earn money through the platform.

This repository contains the complete code for the project along with all the instructions needed to set up, run, and customize the application. This version is sanitized for public release—sensitive data has been replaced with placeholders.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
  - [Replacing Sensitive Data](#replacing-sensitive-data)
- [Running the Project](#running-the-project)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication:** Secure sign in and sign up functionality.
- **Service Advertisements:** Users can create public service ads, allowing available service providers to view and respond with offers.
- **Dual Role Functionality:** Users can register as service providers to earn money, as well as use the platform to find pet services.
- **In-App Chat System:** Enables direct communication between users and service providers.
- **Review System:** Allows users to review service providers, ensuring quality and trust.
- **Deal Making:** Facilitates direct negotiation and deal finalization between users and service providers.
- **Full-Stack Architecture:** Combines a React Native frontend, a Node.js/Express backend, and MongoDB Atlas for robust data management.

*Note: This version of the app is still under development and is not production-ready. Some functionalities may be incomplete and security measures need further refinement.*

## Prerequisites

- **Node.js** and **npm/yarn**
- **Git:** For version control.
- **Expo CLI:** For running the frontend (install via `npm install -g expo-cli` or use `npx expo` commands)
- [Any other dependencies specific to your project]
## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/YourUsername/PetApp_Project.git
   cd PetApp_Project
Install Dependencies:

For the main project (which may include both frontend and backend dependencies):

npm install
# or
yarn install
Configuration
Environment Variables
Sensitive data such as database credentials and JWT secrets are stored in environment variables. Before running the project, create a local .env file by copying the provided sample file.

Copy the Sample Environment File:

cp .env.sample .env
Edit the .env File:

Open the .env file and update the placeholders:

DB_URI=YOUR_DATABASE_URI_HERE
JWT_SECRET=YOUR_SECRET_KEY_HERE
# Add other environment variables as needed
Replacing Sensitive Data
Ensure that your project code references environment variables rather than hard-coded values. For example, in your configuration file (e.g., config.js):

// config.js
module.exports = {
  dbUri: process.env.DB_URI,          // Use environment variable for the database URI
  jwtSecret: process.env.JWT_SECRET     // Use environment variable for JWT secret
};
Any files containing real credentials (e.g., your local .env) should be added to .gitignore to prevent accidental publication.

Running the Project
Frontend
The frontend is built using Expo. To run the frontend application, execute:

npx expo start
This command will start the Expo development server and provide instructions for launching the app on a mobile device or emulator.

Backend
To run the backend server locally, use the following command:

npm run server-dev
This command will start your local server, which is used for backend operations. Make sure your environment variables are correctly set so that the backend connects to the appropriate services.

Contributing
Contributions are welcome! If you’d like to contribute:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Make your changes.
Submit a pull request with a clear description of your changes.