import { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface ContentCalendarProps {
  navigate: (page: string) => void;
  onLogout: () => void;
}

export default function ContentCalendar({ navigate, onLogout }: ContentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // January 2025

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

  const getContentForDay = (day: number) => {
    return scheduledContent.filter(content => content.day === day);
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

        {/* Legend */}
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

        {/* Calendar */}
        <Card className="p-6">
          {/* Calendar Header */}
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

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-700 py-2">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="min-h-[120px] bg-gray-50 rounded-lg"></div>
            ))}

            {/* Calendar days */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const content = getContentForDay(day);
              const isToday = day === 15; // Mock today as 15th

              return (
                <div
                  key={day}
                  className={`min-h-[120px] p-2 rounded-lg border-2 ${
                    isToday ? 'border-[#3B82F6] bg-blue-50' : 'border-gray-200 bg-white'
                  } hover:border-[#3B82F6] transition-colors cursor-pointer`}
                >
                  <div className={`text-sm font-semibold mb-2 ${isToday ? 'text-[#3B82F6]' : 'text-gray-700'}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {content.map((item, idx) => (
                      <div
                        key={idx}
                        className={`${item.color} text-white text-xs p-1.5 rounded truncate`}
                        title={item.title}
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Upcoming Content */}
        <Card className="p-6 mt-6">
          <h3 className="text-xl font-semibold text-[#0A2540] mb-4">Upcoming This Week</h3>
          <div className="space-y-3">
            {scheduledContent.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600">{monthNames[currentDate.getMonth()]} {item.day}, {currentDate.getFullYear()}</p>
                  </div>
                </div>
                <Badge variant="outline">{item.platform}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
