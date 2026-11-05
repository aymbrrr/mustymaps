# Musty Maps

## TE6: Adding Access Control

Musty Maps uses Supabase Auth for authentication and Supabase/PostgreSQL for the backend and database. Supabase handles account creation, password authentication, session management, and access tokens.

### Sign-Up Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Expo Frontend
    participant Auth as Supabase Auth
    participant DB as Supabase Database

    User->>FE: Enter email and password
    FE->>Auth: signUp(email, password)
    Auth->>Auth: Create account and securely handle password
    Auth->>DB: Store user account
    Auth-->>FE: Return authentication response
    FE-->>User: Ask user to confirm email
