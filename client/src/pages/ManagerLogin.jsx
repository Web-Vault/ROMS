import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { UtensilsCrossed } from 'lucide-react';
import { toast } from 'sonner';

const ManagerLogin = () => {
  const navigate = useNavigate();
  const { loginManager } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const onLogin = () => {
    if (!email || !password) {
      toast.error('Enter email and password');
      return;
    }
    const ok = loginManager(email, password);
    if (ok) {
      toast.success('Login successful');
      navigate('/manager/dashboard', { replace: true });
    } else {
      toast.error('Invalid credentials');
    }
  };

  const sendReset = () => {
    if (!forgotEmail) {
      toast.error('Enter your email');
      return;
    }
    toast.success('Password reset link sent to email');
    setShowForgot(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background page-transition">
      <Card className="w-[90vw] max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-3">
            <UtensilsCrossed className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Manager Login</CardTitle>
          <p className="text-sm text-muted-foreground">Access the restaurant dashboard</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="manager@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
          </div>
          <div className="flex items-center justify-between">
            <Button className="bg-primary" onClick={onLogin}>Login</Button>
            <Button variant="ghost" onClick={() => setShowForgot(true)}>Forgot password?</Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showForgot} onOpenChange={setShowForgot}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Enter your email to receive reset instructions</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="forgot-email">Email</Label>
            <Input id="forgot-email" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="manager@example.com" />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForgot(false)}>Cancel</Button>
              <Button className="bg-primary" onClick={sendReset}>Send Link</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagerLogin;
