import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
    return (
        <main className="auth-screen">
            <SignUp afterSignUpUrl="/dashboard" redirectUrl="/dashboard" />
        </main>
    );
}
