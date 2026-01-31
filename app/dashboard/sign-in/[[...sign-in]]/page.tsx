import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
    return (
        <main className="auth-screen">
            <SignIn afterSignInUrl="/dashboard" redirectUrl="/dashboard" />
        </main>
    );
}
