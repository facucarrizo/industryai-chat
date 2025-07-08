# **App Name**: IndustryAI Chat

## Core Features:

- Chatbot UI: Embeddable Chatbot UI: A customizable chatbot interface for integration into websites.
- Config Tool: Configuration Management: Use Google Sheets or Firestore to configure the chatbot's behavior, including OpenAI system prompts, service choices, business email, and FAQ sheet details. Ensure it uses a 'tool' pattern so the system decides if it is useful in some situations
- FAQ Search: FAQ Retrieval: Search a specified Google Sheet for question/answer matches to user queries.
- GPT-4 Integration: AI-Powered Responses: If no FAQ match is found, the query is passed to OpenAI's GPT-4, using a system prompt tailored to the specific industry.
- Lead Detection Tool: Lead Detection: Detect lead intent from user inputs based on keywords and intent classification using an AI 'tool'.
- Lead Capture: Lead Capture: Collect user information (name, phone, email, service of interest) upon lead detection.
- Lead Notifications: Notifications & Storage: Store lead data in Firestore and send email notifications to a configured business email address when new leads are captured.

## Style Guidelines:

- Primary color: Deep Blue (#3F51B5) to inspire confidence and reliability.
- Background color: Light Gray (#ECEFF1), providing a clean and professional backdrop.
- Accent color: Teal (#009688) for calls to action and highlighting important information.
- Body and headline font: 'Inter', a grotesque-style sans-serif, providing a modern and objective look suitable for both headlines and body text.
- Use clean, professional icons to represent various services and actions within the chatbot interface.
- Maintain a clean and intuitive layout with a clear separation between user input and chatbot responses.
- Implement subtle animations to provide feedback during loading or transitioning between states, ensuring a smooth user experience.