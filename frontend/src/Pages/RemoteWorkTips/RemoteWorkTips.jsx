import React, { useState } from 'react';
import { Clock, Target, Users, Brain, Heart, Zap } from 'lucide-react';

const RemoteWorkTips = () => {
  const [activeCategory, setActiveCategory] = useState('productivity');

  const categories = [
    { id: 'productivity', name: 'Productivity', icon: Target },
    { id: 'wellness', name: 'Wellness', icon: Heart },
    { id: 'collaboration', name: 'Collaboration', icon: Users },
    { id: 'focus', name: 'Focus', icon: Brain },
    { id: 'energy', name: 'Energy', icon: Zap },
    { id: 'time', name: 'Time Management', icon: Clock }
  ];

  const tips = {
    productivity: [
      {
        title: 'Create a Dedicated Workspace',
        description: 'Set up a specific area for work, even in shared spaces. This helps your brain associate the space with productivity.',
        actionItems: [
          'Choose a quiet corner or book a private workspace',
          'Keep your workspace organized and clutter-free',
          'Invest in ergonomic furniture and good lighting',
          'Personalize your space with plants or motivational items'
        ]
      },
      {
        title: 'Establish a Routine',
        description: 'Consistency is key to maintaining productivity when working remotely or in flexible spaces.',
        actionItems: [
          'Start work at the same time each day',
          'Create a morning routine to get into work mode',
          'Take regular breaks using the Pomodoro Technique',
          'End your workday with a shutdown ritual'
        ]
      },
      {
        title: 'Use the Right Tools',
        description: 'Leverage technology to stay organized and efficient in any workspace environment.',
        actionItems: [
          'Use project management tools like Trello or Asana',
          'Set up cloud storage for easy file access',
          'Invest in noise-canceling headphones',
          'Use time-tracking apps to monitor productivity'
        ]
      }
    ],
    wellness: [
      {
        title: 'Maintain Work-Life Balance',
        description: 'Set clear boundaries between work and personal time, especially in flexible work environments.',
        actionItems: [
          'Set specific work hours and stick to them',
          'Create physical separation between work and relaxation',
          'Take regular breaks to avoid burnout',
          'Practice saying no to excessive work demands'
        ]
      },
      {
        title: 'Stay Physically Active',
        description: 'Regular movement is crucial for both physical and mental health when working in sedentary environments.',
        actionItems: [
          'Take walking meetings when possible',
          'Use standing desks or take standing breaks',
          'Do desk exercises throughout the day',
          'Choose workspaces with gym access or nearby parks'
        ]
      },
      {
        title: 'Prioritize Mental Health',
        description: 'Remote and flexible work can be isolating. Take proactive steps to maintain mental wellness.',
        actionItems: [
          'Schedule regular social interactions',
          'Practice mindfulness or meditation',
          'Seek professional help when needed',
          'Join co-working communities for social connection'
        ]
      }
    ],
    collaboration: [
      {
        title: 'Master Virtual Communication',
        description: 'Effective communication is crucial when working with distributed teams or in shared spaces.',
        actionItems: [
          'Use video calls for important discussions',
          'Be clear and concise in written communication',
          'Set communication expectations with your team',
          'Use collaborative tools like Slack or Microsoft Teams'
        ]
      },
      {
        title: 'Build Strong Relationships',
        description: 'Maintain and build professional relationships even when not in a traditional office.',
        actionItems: [
          'Schedule regular one-on-ones with colleagues',
          'Participate in virtual team building activities',
          'Attend networking events in co-working spaces',
          'Be proactive in reaching out to team members'
        ]
      }
    ],
    focus: [
      {
        title: 'Minimize Distractions',
        description: 'Create an environment that supports deep work and concentration.',
        actionItems: [
          'Use website blockers during focused work time',
          'Turn off non-essential notifications',
          'Choose quiet areas or use noise-canceling headphones',
          'Communicate your focus time to others'
        ]
      },
      {
        title: 'Practice Deep Work',
        description: 'Develop the ability to focus on cognitively demanding tasks for extended periods.',
        actionItems: [
          'Block out 2-4 hour chunks for deep work',
          'Start with shorter focus sessions and build up',
          'Choose your most challenging tasks for peak energy times',
          'Create rituals that signal the start of deep work'
        ]
      }
    ],
    energy: [
      {
        title: 'Manage Your Energy Levels',
        description: 'Work with your natural energy rhythms to maximize productivity and well-being.',
        actionItems: [
          'Identify your peak energy hours',
          'Schedule important tasks during high-energy times',
          'Take breaks before you feel tired',
          'Use natural light to regulate your circadian rhythm'
        ]
      },
      {
        title: 'Fuel Your Body Right',
        description: 'Proper nutrition and hydration are essential for sustained energy and focus.',
        actionItems: [
          'Eat regular, balanced meals',
          'Stay hydrated throughout the day',
          'Limit caffeine and sugar crashes',
          'Choose workspaces with healthy food options'
        ]
      }
    ],
    time: [
      {
        title: 'Master Time Blocking',
        description: 'Allocate specific time slots for different types of work to improve efficiency.',
        actionItems: [
          'Block time for deep work, meetings, and admin tasks',
          'Use calendar apps to visualize your schedule',
          'Include buffer time between activities',
          'Protect your most productive hours'
        ]
      },
      {
        title: 'Eliminate Time Wasters',
        description: 'Identify and reduce activities that drain your time without adding value.',
        actionItems: [
          'Track how you spend your time for a week',
          'Identify patterns and time drains',
          'Automate repetitive tasks where possible',
          'Learn to delegate or say no to non-essential requests'
        ]
      }
    ]
  };

  const activeIcon = categories.find(cat => cat.id === activeCategory)?.icon;
  const ActiveIcon = activeIcon;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Remote Work Tips & Best Practices
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Master the art of remote and flexible work with proven strategies for productivity, 
            wellness, and success in any workspace environment.
          </p>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Tips Content */}
        <div className="mb-12">
          <div className="flex items-center mb-8">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <ActiveIcon className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {categories.find(cat => cat.id === activeCategory)?.name} Tips
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {tips[activeCategory].map((tip, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{tip.title}</h3>
                <p className="text-gray-600 mb-6">{tip.description}</p>
                
                <h4 className="font-semibold text-gray-900 mb-3">Action Items:</h4>
                <ul className="space-y-2">
                  {tip.actionItems.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <div className="bg-purple-100 rounded-full p-1 mr-3 mt-1">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Quick Daily Reminders
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Start Strong</h3>
              <p className="text-gray-600 text-sm">Begin each day with your most important task</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Take Breaks</h3>
              <p className="text-gray-600 text-sm">Step away from your desk every 90 minutes</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Stay Connected</h3>
              <p className="text-gray-600 text-sm">Reach out to colleagues and maintain relationships</p>
            </div>
          </div>
        </div>

        {/* Workspace Recommendations */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Choosing the Right Workspace for Remote Work
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">For Deep Focus Work:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Private offices or quiet zones</li>
                <li>• Minimal foot traffic areas</li>
                <li>• Good lighting and ergonomic setup</li>
                <li>• Reliable, fast internet connection</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Collaborative Work:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Open co-working areas</li>
                <li>• Meeting rooms with AV equipment</li>
                <li>• Spaces with networking opportunities</li>
                <li>• Coffee areas for informal discussions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-purple-700 rounded-lg text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Remote Work?</h2>
          <p className="text-purple-100 mb-6">
            Find the perfect workspace that supports your productivity and well-being.
          </p>
          <a
            href="/"
            className="bg-white text-purple-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Explore Workspaces
          </a>
        </div>
      </div>
    </div>
  );
};

export default RemoteWorkTips;
