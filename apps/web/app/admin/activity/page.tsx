import { Activity, User, FileText, Lock } from 'lucide-react';

export default function AdminActivityPage() {
    const logs = [
        { icon: User, color: 'bg-blue-100 text-blue-600', msg: 'New user registered: sarah@tech.co', time: '2 mins ago' },
        { icon: FileText, color: 'bg-indigo-100 text-indigo-600', msg: 'Document generated: "Food Delivery App"', time: '15 mins ago' },
        { icon: Lock, color: 'bg-yellow-100 text-yellow-600', msg: 'Failed login attempt from IP 192.168.1.1', time: '1 hour ago' },
        { icon: FileText, color: 'bg-indigo-100 text-indigo-600', msg: 'Document exported to PDF: project_x.pdf', time: '2 hours ago' },
        { icon: User, color: 'bg-green-100 text-green-600', msg: 'User upgraded to Pro Plan', time: '5 hours ago' },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">System Activity</h2>

            <div className="glass-panel p-8 rounded-2xl">
                <div className="relative pl-6 border-l-2 border-slate-200 space-y-8">
                    {logs.map((log, i) => (
                        <div key={i} className="relative">
                            <div className={`absolute -left-[33px] p-1.5 rounded-full border-4 border-white ${log.color}`}>
                                <log.icon className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-800">{log.msg}</p>
                                <p className="text-xs text-slate-400">{log.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
