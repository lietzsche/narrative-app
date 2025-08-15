import AdminUploader from '../components/AdminUploader';

export default function AdminPage() {
    return (
        <div className="p-4 space-y-4">
            <h1 className="text-xl font-bold">Admin</h1>
            <AdminUploader />
        </div>
    );
}