# Testing

Musty Maps uses automated testing at multiple levels to verify application behavior and reduce regressions.

## Testing Tools

The frontend test suite uses:

- Jest as the main test runner.
- jest-expo for the Expo and React Native Jest environment.
- React Native Testing Library for user-interface tests.
- TypeScript type checking with `tsc --noEmit`.

## Installing Dependencies

From the frontend directory:

    cd packages/frontend
    npm install

## Running Tests

From the root of the repository:

    npm test

Tests can also be run directly from the frontend workspace:

    cd packages/frontend
    npm test

To run the TypeScript checker:

    cd packages/frontend
    npm run typecheck

## Unit Testing

Unit tests verify individual pieces of application logic in isolation.

The unit tests currently cover validation logic and busyness formatting logic.

Validation tests include:

- Accepting passwords with at least 8 characters.
- Rejecting passwords shorter than 8 characters.
- Accepting Cal Poly email addresses.
- Rejecting non-Cal Poly email addresses.

Busyness tests include:

- Mapping low occupancy to the lowest busyness level.
- Mapping high occupancy to the highest busyness level.
- Formatting morning hours.
- Formatting afternoon hours.

These tests are located in:

    packages/frontend/src/lib/__tests__/validation.test.ts
    packages/frontend/src/domain/__tests__/busyness.test.ts

## System Testing

System tests verify multiple application components working together.

The rating system tests use the in-memory backend and exercise the rating repository together with profile data.

The tests verify that:

- A submitted rating is stored and can later be retrieved from the user's ratings.
- Submitting a second rating for the same location replaces the previous rating instead of creating a duplicate.

These tests are located in:

    packages/frontend/src/data/__tests__/ratingSystem.test.ts

The in-memory backend allows these tests to run without connecting to the live Supabase database.

## UI Testing

UI tests use React Native Testing Library to interact with the app through visible controls.

The sign-in user story is covered by two tests:

- A user enters a valid Cal Poly email and password, submits the form, and receives a welcome message after a successful login.
- A user enters credentials that fail authentication and receives the returned error message.

These tests are located in:

    packages/frontend/src/screens/auth/__tests__/SignInScreen.test.tsx

The authentication store is mocked in these tests so the tests remain deterministic and do not require a live Supabase account.

## Test-Driven Development

A password-validation improvement was implemented using the Red-Green-Refactor workflow.

### Requirement

The sign-up flow requires passwords to contain at least 8 characters. The rule was previously checked directly inside the sign-up screen. The goal was to create one reusable validation rule that could be tested independently and used by the UI.

### Red

Tests were written first for a new `validate.isValidPassword` function.

The tests expected:

- `12345678` to be accepted.
- `1234567` to be rejected.

The initial test run failed because `validate.isValidPassword` did not exist:

    TypeError: validate.isValidPassword is not a function

This confirmed that the test failed before the feature was implemented.

### Green

The smallest implementation needed to make the tests pass was added to `validation.ts`:

    isValidPassword: (input: string): boolean => input.length >= 8,

After this change, both password-validation tests passed.

### Refactor

The sign-up screen originally contained its own password-length check.

The screen was refactored to use:

    validate.isValidPassword(password)

instead of duplicating the eight-character rule inside the component.

The unit tests continued to pass after the refactor, and the project also passed TypeScript type checking.

## Test Data and Environment

The unit tests do not require external services.

The system tests use the application's in-memory backend and seeded application data.

The UI tests mock authentication behavior rather than contacting Supabase.

Running the real application still requires the normal Expo and Supabase environment configuration described in the project setup documentation.

## Known Limitations

The current automated tests do not directly test the live Supabase database or authentication service.

The UI tests are React Native component-level tests rather than full device-level end-to-end tests.

Future testing could add:

- Supabase integration tests using a dedicated test environment.
- Additional UI tests for rating locations.
- UI tests for account creation and verification.
- End-to-end tests on an Android or iOS simulator.