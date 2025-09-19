"""
Business: Система авторизации пользователей с JWT токенами
Args: event - dict с httpMethod, body, queryStringParameters
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с токенами или ошибками авторизации
"""

import json
import hashlib
import hmac
import base64
import time
import os
from typing import Dict, Any, Optional

def create_token(payload: Dict[str, Any], secret: str) -> str:
    """Создание JWT токена"""
    header = {"alg": "HS256", "typ": "JWT"}
    
    # Кодируем header и payload
    encoded_header = base64.urlsafe_b64encode(
        json.dumps(header, separators=(',', ':')).encode()
    ).decode().rstrip('=')
    
    encoded_payload = base64.urlsafe_b64encode(
        json.dumps(payload, separators=(',', ':')).encode()
    ).decode().rstrip('=')
    
    # Создаем подпись
    message = f"{encoded_header}.{encoded_payload}"
    signature = hmac.new(
        secret.encode(),
        message.encode(),
        hashlib.sha256
    ).digest()
    
    encoded_signature = base64.urlsafe_b64encode(signature).decode().rstrip('=')
    
    return f"{encoded_header}.{encoded_payload}.{encoded_signature}"

def hash_password(password: str) -> str:
    """Хеширование пароля"""
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    body_str: str = event.get('body', '{}')
    query_params: Dict[str, str] = event.get('queryStringParameters', {}) or {}
    
    jwt_secret: str = os.environ.get('JWT_SECRET', 'default-secret-key')
    
    # Обработка CORS OPTIONS запроса
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        if method == 'POST':
            path: str = query_params.get('path', 'login')
            
            if path == 'register':
                register_data = json.loads(body_str)
                
                email: str = register_data.get('email', '')
                username: str = register_data.get('username', '')
                password: str = register_data.get('password', '')
                
                if not email or not username or not password:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({
                            'error': 'Email, username and password are required'
                        })
                    }
                
                # Создаем нового пользователя (в реальном приложении - запись в БД)
                new_user = {
                    'id': hash(email) % 10000,  # Простая генерация ID
                    'email': email,
                    'username': username,
                    'created_at': time.strftime('%Y-%m-%d %H:%M:%S')
                }
                
                # Создаем JWT токен
                token_payload = {
                    'userId': new_user['id'],
                    'email': new_user['email'],
                    'username': new_user['username'],
                    'exp': int(time.time()) + (24 * 60 * 60)  # 24 часа
                }
                
                token = create_token(token_payload, jwt_secret)
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'message': 'User registered successfully',
                        'user': new_user,
                        'token': token
                    })
                }
            
            elif path == 'login':
                login_data = json.loads(body_str)
                
                email: str = login_data.get('email', '')
                password: str = login_data.get('password', '')
                
                if not email or not password:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({
                            'error': 'Email and password are required'
                        })
                    }
                
                # Эмуляция проверки пользователя (в реальном приложении - запрос к БД)
                user = {
                    'id': hash(email) % 10000,
                    'email': email,
                    'username': email.split('@')[0]
                }
                
                # Создаем JWT токен
                token_payload = {
                    'userId': user['id'],
                    'email': user['email'],
                    'username': user['username'],
                    'exp': int(time.time()) + (24 * 60 * 60)  # 24 часа
                }
                
                token = create_token(token_payload, jwt_secret)
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'message': 'Login successful',
                        'user': user,
                        'token': token
                    })
                }
        
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Endpoint not found'})
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid JSON format'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Internal server error',
                'details': str(e)
            })
        }