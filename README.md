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
```

### Sign-In Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Expo Frontend
    participant Auth as Supabase Auth
    participant DB as Supabase Database

    User->>FE: Enter email and password
    FE->>Auth: signInWithPassword(email, password)
    Auth->>DB: Find existing user
    Auth->>Auth: Verify submitted password

    alt Valid credentials
        Auth-->>FE: Return session and access token
        FE->>FE: Persist session on client
        FE-->>User: Open authenticated app
    else Invalid credentials
        Auth-->>FE: Authentication error
        FE-->>User: Display sign-in error
    end
```

### Protected Report Submission

```mermaid
sequenceDiagram
    actor User
    participant FE as Expo Frontend
    participant API as Supabase API
    participant DB as PostgreSQL + RLS

    User->>FE: Submit crowd report
    FE->>FE: Check authenticated user

    alt User is signed in
        FE->>API: Insert report using authenticated session
        API->>DB: INSERT into reports
        DB->>DB: Check Row Level Security policy

        alt auth.uid() = user_id
            DB-->>API: Insert succeeds
            API-->>FE: Success
            FE-->>User: Report submitted
        else Unauthorized
            DB-->>API: Reject request
            API-->>FE: Authorization error
            FE-->>User: Display error
        end
    else User is not signed in
        FE-->>User: You need to be signed in to report
    end
```
