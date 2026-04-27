"use client";

import { toast } from "sonner";
import { 
  useGetAdminUsersQuery,
  useUpdateUserRoleMutation
} from "@/store/apiSlice";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useState } from "react";

export default function AdminUsersPage() {
  const { data: users = [], isLoading: loading } = useGetAdminUsersQuery();
  const [updateRole] = useUpdateUserRoleMutation();

  const [confirmAction, setConfirmAction] = useState<{ userId: string; role: "customer" | "vendor" | "admin" } | null>(null);

  const handleRoleChange = async () => {
    if (!confirmAction) return;
    try {
      await updateRole({ userId: confirmAction.userId, role: confirmAction.role }).unwrap();
      toast.success(`User role updated to ${confirmAction.role}`);
    } catch (err: any) {
      toast.error(err?.data?.error || err?.data || "Failed to update role");
    } finally {
      setConfirmAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Registered Users</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : user.role === 'vendor' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
                  `}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {user.role !== 'admin' && (
                    <button onClick={() => setConfirmAction({ userId: user.id, role: "admin" })} className="text-purple-600 hover:text-purple-900 ml-4">Make Admin</button>
                  )}
                  {user.role !== 'vendor' && user.role !== 'admin' && (
                    <button onClick={() => setConfirmAction({ userId: user.id, role: "vendor" })} className="text-blue-600 hover:text-blue-900 ml-4">Make Vendor</button>
                  )}
                </td>
              </tr>
            ))}
            {loading && <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">Loading...</td></tr>}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleRoleChange}
        title="Change User Role"
        description={`Are you sure you want to promote this user to ${confirmAction?.role}? This will change their access level.`}
        confirmText="Update Role"
        isDestructive={false}
      />
    </div>
  );
}
