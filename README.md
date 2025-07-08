2025-05-12

# BoltNext - AI-Powered Full Stack Web App Generator

BoltNext is a cutting-edge application that allows you to build full-stack web applications using the power of AI. By simply chatting with the AI.

This project is a Next.js-based reimagining of [bolt](https://github.com/stackblitz/bolt.new), which was originally built using Vite and Remix. BoltNext aims to provide a similar experience with the benefits of Next.js and tailwind, such as server-side rendering and improved performance.

## Features

*   **AI-Powered Code Generation:** Chat with the AI to describe your desired application, and BoltNext will generate the necessary code.
*   **Mobile Responsive:** Allow use of bolt on various screen sizes.
*   **Full-Stack Development:** Build complete web applications, including frontend and backend components.
*   **Multiple AI Provider Support:** Choose from various AI providers like Anthropic, Google, and TogetherAI.
*   **Interactive Chat Interface:** A user-friendly chat interface for interacting with the AI.
*   **Customizable Sidebar:** A sidebar for navigation, model selection, and managing chat history.
*   **Real-time Updates:** The application auto-updates as you make changes.

## Screenshot

![Application Screenshot](/public/screenshot.png)

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/) or [bun](https://bun.sh/)

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    ```
2.  Navigate to the project directory:

    ```bash
    cd <project_directory>
    ```
3.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

### Running the Application

1.  Start the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```
2.  Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Project Structure

*   `app/`: Contains the main application logic, including pages and layouts.
*   `components/`: Contains reusable UI components and some main application logic.
*   `lib/`: Contains utility functions, stores, and other shared logic.
*   `persistance/`: Contains database related logic.
*   `public/`: Contains static assets like fonts and images.

## Key Components

*   **`app/layout.tsx`:** (startLine: 1, endLine: 49) The root layout of the application, including the sidebar and main content area.
*   **`app/page.tsx`:** (startLine: 1, endLine: 21) The main page of the application, which includes the chat interface.
*   **`components/sidebar/app-sidebar.tsx`:** (startLine: 1, endLine: 314) The main sidebar component, responsible for navigation and model selection.
*   **`components/chat/BaseChat.tsx`:** The main chat interface component.
*   **`components/chat/ProviderSelector.tsx`:** (startLine: 1, endLine: 80) Component for selecting the AI provider.
*   **`components/sidebar/nav-main.tsx`:** (startLine: 1, endLine: 35) Component for rendering the main navigation items.
*   **`components/sidebar/nav-projects.tsx`:** (startLine: 1, endLine: 26) Component for rendering the project navigation items.
*   **`components/chat/ChatIntro.tsx`:** (startLine: 6, endLine: 65) Component for the intro screen.

## Environment Variables

The application uses environment variables for configuration. Create a `.env.local` file in the root directory and add your environment variables.

**Note:** The `.gitignore` file is configured to track `.env.example` and ignore all other `.env*` files.

## To Do

*   **Error Auto-Fix:** Implement automatic error detection and correction in the generated code.
*   **Version Control:** ✅ Enhanced the GitHub integration to include version control features.
*   **Deployment:** Add the deployment process with more options and better automation.
*   **Supabase Integration:** Integrate Supabase for database management for both app and user and user authentication.
*   **Auto-Scroll Fix:** Resolve issues with auto-scrolling in the chat interface.
*   **Shell Bugs:** Address any bugs or inconsistencies in the shell/terminal component.
*   **More:** Add more features and improvements based on user feedback and development goals.

## Acknowledgements

This project draws inspiration from and is a Next.js implementation of [bolt](https://github.com/stackblitz/bolt.new), originally developed using Vite and Remix. I also acknowledge and appreciate the contributions of [StackBlitz](https://stackblitz.com/), whose innovative platform has greatly influenced the development of this project.

## Learn More

*   [Next.js Documentation](https://nextjs.org/docs)
*   [Learn Next.js](https://nextjs.org/learn)
*   [Next.js GitHub Repository](https://github.com/vercel/next.js)

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.
