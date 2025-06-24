import { UserCircle, MessageSquare } from 'lucide-react';

export default function QuestionCard({ question }) {
  return (
    <div className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 p-5 rounded-2xl border-l-4 border-blue-500 mb-6 cursor-pointer hover:scale-[1.02] transform">
      <h3 className="text-xl font-bold text-blue-700 mb-2">{question.title}</h3>
      <p className="text-gray-700 mb-3">{question.body.slice(0, 120)}...</p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <UserCircle className="w-5 h-5 text-blue-400" />
          <span>Asked by: <span className="font-medium text-gray-700">{question.username}</span></span>
        </div>
        <div className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
          <MessageSquare className="w-4 h-4" />
          <span className="underline">Answer</span>
        </div>
      </div>
    </div>
  );
}