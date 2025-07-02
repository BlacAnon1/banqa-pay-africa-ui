
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export class SecurityService {
  // Advanced password validation
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 12) {
      errors.push('Password must be at least 12 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password cannot contain repeated characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Email validation with advanced checks
  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }

  // Rate limiting for authentication attempts
  static checkRateLimit(action: string): boolean {
    const key = `${action}_attempts`;
    const attempts = JSON.parse(localStorage.getItem(key) || '[]');
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    
    // Filter attempts in the last 5 minutes
    const recentAttempts = attempts.filter((timestamp: number) => timestamp > fiveMinutesAgo);
    
    if (recentAttempts.length >= 5) {
      toast({
        title: "Too many attempts",
        description: "Please wait 5 minutes before trying again",
        variant: "destructive",
      });
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    localStorage.setItem(key, JSON.stringify(recentAttempts));
    
    return true;
  }

  // Secure session management
  static async validateSession(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return false;
      }
      
      // Check if session is near expiry (refresh if less than 5 minutes left)
      const expiresAt = session.expires_at * 1000;
      const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;
      
      if (expiresAt < fiveMinutesFromNow) {
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error('Session refresh failed:', refreshError);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }

  // Secure transaction validation
  static validateTransactionAmount(amount: number, balance: number): { isValid: boolean; error?: string } {
    if (amount <= 0) {
      return { isValid: false, error: 'Amount must be greater than zero' };
    }
    
    if (amount > balance) {
      return { isValid: false, error: 'Insufficient balance' };
    }
    
    // Check for suspicious large amounts (over 1 million)
    if (amount > 1000000) {
      return { isValid: false, error: 'Amount exceeds maximum transaction limit' };
    }
    
    return { isValid: true };
  }

  // Input sanitization
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential script tags
      .replace(/javascript:/gi, '') // Remove javascript protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .slice(0, 1000); // Limit length
  }

  // Generate secure reference numbers
  static generateSecureReference(prefix: string = 'TXN'): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 10);
    const secureRandom = crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
    
    return `${prefix}${timestamp}${randomPart}${secureRandom}`.toUpperCase();
  }

  // Detect suspicious activity patterns
  static detectSuspiciousActivity(transactions: any[]): boolean {
    if (transactions.length < 2) return false;
    
    const recentTransactions = transactions
      .filter(t => new Date(t.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    // Check for rapid successive transactions
    for (let i = 0; i < recentTransactions.length - 1; i++) {
      const current = new Date(recentTransactions[i].created_at).getTime();
      const next = new Date(recentTransactions[i + 1].created_at).getTime();
      
      if (current - next < 30000) { // Less than 30 seconds apart
        return true;
      }
    }
    
    // Check for unusual amount patterns
    const amounts = recentTransactions.map(t => t.amount);
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    
    for (const amount of amounts) {
      if (amount > avgAmount * 10) { // Amount is 10x the average
        return true;
      }
    }
    
    return false;
  }

  // Secure storage management
  static secureStore(key: string, data: any): void {
    try {
      const encrypted = btoa(JSON.stringify(data));
      sessionStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Secure storage error:', error);
    }
  }

  static secureRetrieve(key: string): any {
    try {
      const encrypted = sessionStorage.getItem(key);
      if (!encrypted) return null;
      
      return JSON.parse(atob(encrypted));
    } catch (error) {
      console.error('Secure retrieval error:', error);
      return null;
    }
  }

  // Clear sensitive data
  static clearSensitiveData(): void {
    // Clear session storage
    sessionStorage.clear();
    
    // Clear specific localStorage items that might contain sensitive data
    const sensitiveKeys = ['auth_token', 'user_session', 'transaction_cache'];
    sensitiveKeys.forEach(key => {
      localStorage.removeItem(key);
    });
  }
}
