import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any, token: string) => void;
}

interface AuthFormData {
  email: string;
  username: string;
  password: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginData, setLoginData] = useState<Omit<AuthFormData, 'username'>>({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState<AuthFormData>({
    email: '',
    username: '',
    password: ''
  });

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      setError('Заполните все поля');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://functions.poehali.dev/ddb1f3a8-f565-4db0-b04e-037bdd3e5d21?path=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onLogin(result.user, result.token);
        onClose();
        setLoginData({ email: '', password: '' });
      } else {
        setError(result.error || 'Ошибка авторизации');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerData.email || !registerData.username || !registerData.password) {
      setError('Заполните все поля');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://functions.poehali.dev/ddb1f3a8-f565-4db0-b04e-037bdd3e5d21?path=register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onLogin(result.user, result.token);
        onClose();
        setRegisterData({ email: '', username: '', password: '' });
      } else {
        setError(result.error || 'Ошибка регистрации');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-secondary">
            <Icon name="Lock" size={20} />
            <span>Авторизация</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="your@email.com"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Пароль</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                disabled={isLoading}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <Button 
              onClick={handleLogin} 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Вход...
                </>
              ) : (
                <>
                  <Icon name="LogIn" size={16} className="mr-2" />
                  Войти
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="your@email.com"
                value={registerData.email}
                onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-username">Имя пользователя</Label>
              <Input
                id="register-username"
                type="text"
                placeholder="username"
                value={registerData.username}
                onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password">Пароль</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="••••••••"
                value={registerData.password}
                onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                disabled={isLoading}
                onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <Button 
              onClick={handleRegister} 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Регистрация...
                </>
              ) : (
                <>
                  <Icon name="UserPlus" size={16} className="mr-2" />
                  Зарегистрироваться
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>

        <div className="text-xs text-muted-foreground text-center">
          Демо-версия: любые данные будут приняты для входа
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;