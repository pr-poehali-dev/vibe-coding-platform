import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Project {
  id: string;
  name: string;
  status: 'active' | 'building' | 'deployed';
  lastUpdate: Date;
}

const VibeCoding = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Привет! Я Юра, твой ИИ-ассистент для создания кода. Опиши что хочешь создать, и я сгенерирую рабочий фронтенд и бэкенд.',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [currentProject, setCurrentProject] = useState<Project>({
    id: '1',
    name: 'Новый проект',
    status: 'active',
    lastUpdate: new Date()
  });

  const [codePreview, setCodePreview] = useState(`// Сгенерированный код появится здесь
import React from 'react';

const MyComponent = () => {
  return (
    <div className="p-6">
      <h1>Привет, мир!</h1>
    </div>
  );
};

export default MyComponent;`);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Симуляция ответа ИИ
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Отличная идея! Начинаю генерацию кода... 🚀\n\nСоздам компонент с современным дизайном и всей необходимой функциональностью.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Обновляем код
      setCodePreview(`// Обновленный код на основе вашего запроса
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const ${newMessage.includes('кнопка') ? 'ButtonComponent' : 'NewComponent'} = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        ${newMessage.includes('счетчик') ? 'Счетчик' : 'Компонент'}
      </h2>
      <Button 
        onClick={() => setCount(count + 1)}
        className="bg-primary hover:bg-primary/90"
      >
        Кликов: {count}
      </Button>
    </div>
  );
};

export default ${newMessage.includes('кнопка') ? 'ButtonComponent' : 'NewComponent'};`);
    }, 1500);
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'building': return 'bg-yellow-500';
      case 'deployed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'building': return 'Сборка';
      case 'deployed': return 'Развернут';
      default: return 'Неизвестно';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="Code" className="text-primary" size={32} />
              <h1 className="text-2xl font-bold text-secondary">VIBE-CODING</h1>
            </div>
            <Badge variant="outline" className="text-xs">
              v1.0
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Icon name="Github" size={16} className="mr-2" />
              GitHub
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="Settings" size={16} />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Chat Panel */}
        <div className="w-1/2 flex flex-col bg-white border-r border-gray-200">
          {/* Project Status */}
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-secondary">{currentProject.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Последнее обновление: {currentProject.lastUpdate.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(currentProject.status)}`} />
                <span className="text-sm font-medium">{getStatusText(currentProject.status)}</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-secondary'
                  }`}
                >
                  {message.sender === 'ai' && (
                    <div className="flex items-center mb-2">
                      <Icon name="Brain" size={16} className="mr-2 text-primary" />
                      <span className="text-xs font-medium text-primary">ИИ Ассистент</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Опишите что хотите создать..."
                className="flex-1 font-inter"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                <Icon name="Send" size={16} />
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>💡 Попробуйте: "Создай форму авторизации" или "Добавь счетчик кликов"</span>
              <div className="flex items-center space-x-2">
                <Icon name="Zap" size={12} />
                <span>Agent Mode</span>
              </div>
            </div>
          </div>
        </div>

        {/* Code Preview Panel */}
        <div className="w-1/2 flex flex-col">
          {/* Code Header */}
          <div className="p-4 bg-secondary text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="FileCode" size={20} />
              <h3 className="font-semibold">Предварительный просмотр кода</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-secondary">
                <Icon name="Copy" size={14} className="mr-2" />
                Копировать
              </Button>
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-secondary">
                <Icon name="Download" size={14} className="mr-2" />
                Скачать
              </Button>
            </div>
          </div>

          {/* Code Content */}
          <div className="flex-1 bg-gray-900 text-green-400 font-source-code text-sm overflow-auto">
            <pre className="p-6 whitespace-pre-wrap">
              <code>{codePreview}</code>
            </pre>
          </div>

          {/* Code Footer */}
          <div className="p-3 bg-gray-800 text-gray-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span>TypeScript React</span>
              <span>•</span>
              <span>42 строки</span>
              <span>•</span>
              <span>Готов к использованию</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Код синхронизирован</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibeCoding;