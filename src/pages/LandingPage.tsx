import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-start min-h-screen px-4 pt-24 text-center bg-gradient-to-b from-white to-gray-100">
            <div className="flex flex-col items-center gap-6 w-full max-w-md">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">Narrative App</h1>
                <p className="text-gray-600">
                    Experience interactive stories crafted by you.
                </p>
                <div className="flex flex-col gap-2 w-full max-w-xs">
                    <Link
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
                        to="/play"
                    >
                        Start Playing
                    </Link>
                    <Link className="text-sm text-gray-500 hover:underline" to="/admin">
                        Admin
                    </Link>
                </div>
            </div>
        </div>
    );
}