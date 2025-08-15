import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 text-center">
            <h1 className="text-3xl font-bold">Narrative App</h1>
            <p className="text-gray-600 max-w-md">
                Experience interactive stories crafted by you.
            </p>
            <div className="flex flex-col gap-2 w-full max-w-xs">
                <Link
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    to="/play"
                >
                    Start Playing
                </Link>
                <Link className="text-sm text-gray-500 hover:underline" to="/admin">
                    Admin
                </Link>
            </div>
        </div>
    );
}