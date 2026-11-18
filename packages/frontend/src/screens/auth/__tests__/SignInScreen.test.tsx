import React from 'react';
import {
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react-native';
import { SignInScreen } from '../SignInScreen';

jest.mock('../../../components/ToastHost', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const ToastContext = React.createContext(() => {});

  return {
    ToastHost: ({ children }: { children: React.ReactNode }) => {
      const [message, setMessage] = React.useState(null as string | null);

      return (
        <ToastContext.Provider value={setMessage}>
          {children}
          {message ? <Text>{message}</Text> : null}
        </ToastContext.Provider>
      );
    },

    useToast: () => React.useContext(ToastContext),
  };
});

jest.mock('../../../components/Icons', () => ({
  EyeIcon: () => null,
  EyeOffIcon: () => null,
  ChevronLeftIcon: () => null,
}));

type MockSessionState = {
  signIn: jest.Mock;
  requestPasswordReset: jest.Mock;
  isBusy: boolean;
};

const mockSessionState: MockSessionState = {
  signIn: jest.fn(),
  requestPasswordReset: jest.fn(),
  isBusy: false,
};

jest.mock('../../../stores/sessionStore', () => ({
  useSessionStore: (selector: (state: MockSessionState) => unknown) =>
    selector(mockSessionState),
}));

const { ToastHost } = jest.requireMock('../../../components/ToastHost');

const navigation = {
  goBack: jest.fn(),
  replace: jest.fn(),
} as any;

describe('sign-in user story', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionState.isBusy = false;
  });

  it('lets a user sign in and shows a welcome message', async () => {
    mockSessionState.signIn.mockResolvedValue(null);

    const screen = await render(
      <ToastHost>
        <SignInScreen
          navigation={navigation}
          route={{} as any}
        />
      </ToastHost>
    );

    const email = screen.getByPlaceholderText('you@calpoly.edu');
    const password = screen.getByPlaceholderText('your password');

    fireEvent.changeText(email, 'student@calpoly.edu');

    await waitFor(() => {
      expect(email.props.value).toBe('student@calpoly.edu');
    });

    fireEvent.changeText(password, 'password123');

    await waitFor(() => {
      expect(password.props.value).toBe('password123');
    });

    fireEvent.press(screen.getByText('sign in →'));

    await waitFor(() => {
      expect(
        screen.getByText('welcome back.')
      ).toBeTruthy();
    });
  });

  it('shows an error message when sign in fails', async () => {
    mockSessionState.signIn.mockResolvedValue(
      'invalid email or password'
    );

    const screen = await render(
      <ToastHost>
        <SignInScreen
          navigation={navigation}
          route={{} as any}
        />
      </ToastHost>
    );

    const email = screen.getByPlaceholderText('you@calpoly.edu');
    const password = screen.getByPlaceholderText('your password');

    fireEvent.changeText(email, 'student@calpoly.edu');

    await waitFor(() => {
      expect(email.props.value).toBe('student@calpoly.edu');
    });

    fireEvent.changeText(password, 'wrongpassword');

    await waitFor(() => {
      expect(password.props.value).toBe('wrongpassword');
    });

    fireEvent.press(screen.getByText('sign in →'));

    await waitFor(() => {
      expect(
        screen.getByText('invalid email or password')
      ).toBeTruthy();
    });
  });
});