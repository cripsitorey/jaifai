import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/ui/Layout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { username, password });
            const { access_token } = response.data;
            login(access_token);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout hideNav>
            <div className="flex flex-col justify-center min-h-[80vh] px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600">Jaifai</h1>
                    <p className="text-gray-500 mt-2">Ingresa a tu cuenta</p>
                </div>

                <Card className="p-6 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Ingresa tu usuario"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ingresa tu contraseña"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <Button type="submit" fullWidth disabled={loading}>
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </Button>

                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600">¿No tienes cuenta? Escanea el QR de tu casa.</p>
                        </div>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default LoginPage;
