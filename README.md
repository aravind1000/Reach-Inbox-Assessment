# ReachInbox.ai Frontend Task

This repository contains the implementation of the frontend task for the Associate - Frontend Engineer role at ReachInbox.ai. The project demonstrates my proficiency in ReactJS, Tailwind CSS, Axios, and API integration by implementing the required features as per the assignment instructions. This repository is currently under development.

## Table of Contents

- [Project Overview](#project-overview)
- [Screenshots](#screenshots)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Video Demonstration](#video-demonstration)
- [Contact](#contact)

## Project Overview

This project focuses on creating a functional web app that demonstrates key functionalities like login, data fetching, custom text editor, light and dark mode, and more.

## Screenshots

### Login-Page
![Login_Page](public/login-page.png)

### Signup-Page
![Signup_Page](public/signup-page.png)

### Google-Auth-Firebase-Page
![Google_Auth_Firebase](public/google-auth-firebase.png)

### Onebox-UI-Page
![Onebox UI](public/onebox-ui.png)

### Firebase-Logs-Page
![Firebase-logs](public/firebase-logs.png)

## Features

- **Login Page**: Users can log in using the provided design.
- **Onebox Screen**: Data is fetched and displayed in the onebox screen with API integration.
- **Keyboard Shortcuts**: Implemented shortcuts for user actions (`D` for delete, `R` for reply).
- **Custom Text Editor**: Added a custom button in the editor for `SAVE` and `Variables`.
- **Reply Functionality**: Users can reply to emails with the provided API.
- **Light and Dark Mode**: Toggle between light and dark themes.

## Setup Instructions

1. Clone the repository:
    ```bash
    git clone https://github.com/aravind1000/ReachInbox.ai-Assessment.git
    ```
2. Navigate to the project directory:
    ```bash
    cd ReachInbox.ai-Assessment
    ```
3. Install the necessary dependencies:
    ```bash
    npm install
    ```
4. Run the project locally:
    ```bash
    npm start
    ```
5. Open your browser and go to `http://localhost:3000`.

## Usage

- Login using the provided credentials.
- Navigate through the onebox screen to manage your emails.
- Use keyboard shortcuts (`D` to delete, `R` to reply) for efficient navigation.
- Customize your email using the custom text editor and send replies.
- Switch between light and dark modes using the toggle button.

## API Endpoints

The following API endpoints are used in this project:

- **GET /onebox/list**: Fetches the list of emails.
- **GET /onebox/:thread_id**: Fetches a specific email thread.
- **DELETE /onebox/:thread_id**: Deletes a specific email thread.
- **POST /reply/:thread_id**: Sends a reply to a specific email thread.

## Keyboard Shortcuts

- **D**: Deletes the selected email.
- **R**: Opens the reply box for the selected email.

## Video Demonstration

[Watch the video demonstration](https://www.loom.com/share/b7da964dca0048ae8d6ecfe2c10a442e?sid=5cbd7eb2-3a83-4b42-af64-9fd44bac038a) to see the app in action.

## Contact

If you have any questions or need further assistance, feel free to contact me at [Mail](mailto:aravind30052003@gmail.com).
