import React from 'react';
import {
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react-native';
import { SignInScreen } from '../SignInScreen';

const mockToast = jest.fn();

jest.mock('../../../components/ToastHost', () => ({
  useToast: () => mockToast,
}));

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

const navigation = {
  goBack: jest.fn(),
  replace: jest.fn(),
} as any;

describe('sign-in user story', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionState.isBusy = false;
  });

  it('lets a user enter valid credentials and sign in', async () => {
    mockSessionState.signIn.mockResolvedValue(null);

    const screen = await render(
      <SignInScreen
        navigation={navigation}
        route={{} as any}
      />
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

    const button = screen.getByText('sign in →');

    fireEvent.press(button);

    await waitFor(() => {
      expect(mockSessionState.signIn).toHaveBeenCalledWith(
        'student@calpoly.edu',
        'password123'
      );

      expect(mockToast).toHaveBeenCalledWith('welcome back.');
    });
  });

  it('shows an error message when sign in fails', async () => {
    mockSessionState.signIn.mockResolvedValue(
      'invalid email or password'
    );

    const screen = await render(
      <SignInScreen
        navigation={navigation}
        route={{} as any}
      />
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
      expect(mockToast).toHaveBeenCalledWith(
        'invalid email or password'
      );
    });
  });
});