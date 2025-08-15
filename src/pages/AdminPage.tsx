import AdminUploader from '../components/AdminUploader';

export default function AdminPage() {
    return (
        <div className="p-4 space-y-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold text-center">Admin</h1>
            <AdminUploader />
        </div>
    );
}