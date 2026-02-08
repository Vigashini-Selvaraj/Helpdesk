import React from "react";

export default function RecentComplaints() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Recent Complaints</h2>
          <button className="px-4 py-1.5 text-sm border rounded-full text-indigo-600 hover:bg-indigo-50">
            Live Updates
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-6 py-3">ID / DATE</th>
                <th className="text-left px-6 py-3">STUDENT</th>
                <th className="text-left px-6 py-3">ISSUE</th>
                <th className="text-left px-6 py-3">STATUS</th>
                <th className="text-left px-6 py-3">ACTION</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {/* Row 1 */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-semibold">C-1001</p>
                  <p className="text-xs text-gray-400">2023-10-25</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium">John Doe</p>
                  <p className="text-xs text-gray-400">Student</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium">Academics</p>
                  <p className="text-xs text-gray-500">
                    Missing grade for Physics midterm.
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select className="border rounded-lg px-3 py-1.5 text-sm">
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-semibold">C-1002</p>
                  <p className="text-xs text-gray-400">2023-10-20</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium">Jane Smith</p>
                  <p className="text-xs text-gray-400">Student</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium">Infrastructure</p>
                  <p className="text-xs text-gray-500">
                    Fan not working in Room 304.
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-600">
                    Resolved
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select className="border rounded-lg px-3 py-1.5 text-sm">
                    <option>Resolved</option>
                    <option>Pending</option>
                    <option>In Progress</option>
                  </select>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-semibold">C-1003</p>
                  <p className="text-xs text-gray-400">2023-10-24</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium">Mike Ross</p>
                  <p className="text-xs text-gray-400">Student</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium">Hostel</p>
                  <p className="text-xs text-gray-500">
                    Water leakage in bathroom.
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-600">
                    In Progress
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select className="border rounded-lg px-3 py-1.5 text-sm">
                    <option>In Progress</option>
                    <option>Pending</option>
                    <option>Resolved</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
