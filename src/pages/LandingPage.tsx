import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-2xl font-bold">Narrative App</h1>
            <Link className="px-4 py-2 bg-blue-500 text-white rounded" to="/play">Start</Link>
            <Link className="text-sm text-gray-500" to="/admin">Admin</Link>
        </div>
    );
}