# Social media template

## Overview
For ease of review, the application has been deployed at [https://npkhang-socials.vercel.app](https://npkhang-socials.vercel.app). If you'd like to explore the development code in more detail, please refer to the [Setup](#Setup) section.

## Tech stacks used
- **Programming languages:** Typescript, JavaScript
- **Frameworks:** NextJS, ReactJS, TailwindCSS
- **UI components libraries:** MaterialUI, FontAwesomeIcon
- **Requests handling:** axios
- **Testing:** vitest
- **State management:** zustand
- **Authentication:** Clerk

## Setup
1. Change the name of **.env.example** to **.env.local**. This is necessary for the environment variables referenced within the application to function correctly.

2. This application uses Clerk for authentication, which requires external setup. To enable Clerk, you need to create your own credentials by visiting the Clerk dashboard at [Clerk](https://dashboard.clerk.com) and following the instructions to set up your authentication system. 

3. Install the necessary dependencies
```bash
npm install
```

4. Run the application on a development server
```bash
npm run dev
```
Access **http://localhost:3000** on your browser to view the application.