/**
 * Real auth, backed by Supabase.
 *
 * Satisfies the same AuthGateway port as the in-memory scaffold, so swapping
 * it in is a composition change — no screen or store touches Supabase directly.
 *
 * Sign-up relies on a 6-digit email token to match the design's code screen.
 * That requires the project's "Confirm signup" email template to send
 * {{ .Token }} rather than the default {{ .ConfirmationURL }} magic link.
 */
import { AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthGateway } from '../domain/ports';

/**
 * Supabase returns technical English; the app speaks lowercase. Anything
 * unmapped falls through so we never swallow an unexpected failure.
 */
function friendly(error: AuthError): Error {
  const message = error.message.toLowerCase();
  if (message.includes('invalid login credentials')) {
    return new Error('that email and password don’t match.');
  }
  if (message.includes('email not confirmed')) {
    return new Error('confirm your email first — check your inbox.');
  }
  if (message.includes('user already registered')) {
    return new Error('that email already has an account. try signing in.');
  }
  if (message.includes('token has expired') || message.includes('invalid token')) {
    return new Error('that code expired. tap resend code.');
  }
  if (message.includes('for security purposes') || message.includes('rate limit')) {
    return new Error('slow down a sec, then try again.');
  }
  // Supabase's built-in email service only delivers to project team members and
  // allows 2 messages an hour. Both failures are a mail setup problem, not a
  // user mistake, so say so rather than blaming the address.
  if (message.includes('not authorized') || message.includes('error sending')) {
    return new Error('we can’t send email yet — set up custom smtp in supabase.');
  }
  return new Error(error.message);
}

export class SupabaseAuthGateway implements AuthGateway {
  async signIn(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw friendly(error);
  }

  async signUp(email: string, password: string): Promise<{ needsVerification: boolean }> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw friendly(error);
    // A session here means the project auto-confirms, so there is no code to enter.
    return { needsVerification: data.session === null };
  }

  async verifyCode(email: string, code: string): Promise<void> {
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'signup' });
    if (error) throw friendly(error);
  }

  async resendCode(email: string): Promise<void> {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) throw friendly(error);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw friendly(error);
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw friendly(error);
  }

  /**
   * Deleting a user requires the service-role key, which must never ship in the
   * app. This needs a Supabase edge function (or a security-definer RPC) that
   * deletes the caller's own account; until that exists we fail loudly rather
   * than pretending it worked. In-app deletion is an App Store requirement.
   */
  async deleteAccount(): Promise<void> {
    throw new Error('account deletion isn’t wired up yet.');
  }
}
