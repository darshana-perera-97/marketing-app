import { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function ContentCalendar({ navigate, onLogout }) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const scheduledContent = [
    { day: 5, title: 'Product Launch Post', platform: 'Instagram', color: 'bg-pink-500' },
    { day: 5, title: 'Email Campaign', platform: 'Email', color: 'bg-blue-500' },
    { day: 8, title: 'Facebook Ad', platform: 'Facebook', color: 'bg-blue-600' },
    { day: 12, title: 'LinkedIn Article', platform: 'LinkedIn', color: 'bg-blue-700' },
    { day: 15, title: 'Newsletter', platform: 'Email', color: 'bg-blue-500' },
    { day: 18, title: 'Twitter Thread', platform: 'Twitter', color: 'bg-sky-500' },
    { day: 22, title: 'Instagram Story', platform: 'Instagram', color: 'bg-pink-500' },
    { day: 25, title: 'Google Ad Campaign', platform: 'Google', color: 'bg-green-600' },
    { day: 28, title: 'Blog Post Promotion', platform: 'LinkedIn', color: 'bg-blue-700' },
  ];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getContentForDay = (day) => {
    return scheduledContent.filter(content => content.day === day);
  };

  const renderCalendar = () => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const content = getContentForDay(day);
      days.push(
        <div key={day} className="h-24 border border-gray-200 p-2">
          <div className="text-sm font-medium text-gray-700 mb-1">{day}</div>
          <div className="space-y-1">
            {content.map((item, idx) => (
              <div key={idx} className={`${item.color} text-white text-xs p-1 rounded truncate`} title={item.title}>
                {item.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-0">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center font-semibold text-gray-700 border-b border-gray-200">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  return (
    <AppLayout navigate={navigate} onLogout={onLogout} activePage="content-calendar">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Content Calendar</h1>
            <p className="text-gray-600">Plan and schedule your marketing content</p>
          </div>
          <Button className="bg-[#0A2540] hover:bg-[#0A2540]/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Content
          </Button>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-pink-500"></div>
              <span className="text-sm text-gray-700">Instagram</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-600"></div>
              <span className="text-sm text-gray-700">Facebook</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-sky-500"></div>
              <span className="text-sm text-gray-700">Twitter</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-700"></div>
              <span className="text-sm text-gray-700">LinkedIn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-sm text-gray-700">Email</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-600"></div>
              <span className="text-sm text-gray-700">Google</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#0A2540]">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {renderCalendar()}
        </Card>
      </div>
    </AppLayout>
  );
}

