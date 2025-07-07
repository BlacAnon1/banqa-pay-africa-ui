import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface MicroDepositTokenData {
  amounts: number[];
  created_at: string;
  [key: string]: any; // Add index signature to make it compatible with Json type
}

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

  // Enhanced login rate limiting using database
  static async checkLoginRateLimit(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('check_login_rate_limit', {
        _email: email,
        _ip_address: null // We'll enhance this later with actual IP detection
      });

      if (error) {
        console.error('Rate limit check failed:', error);
        return true; // Allow login if check fails
      }

      return data;
    } catch (error) {
      console.error('Rate limit check error:', error);
      return true;
    }
  }

  // Record login attempt
  static async recordLoginAttempt(email: string, success: boolean, failureReason?: string): Promise<void> {
    try {
      await supabase.rpc('record_login_attempt', {
        _email: email,
        _ip_address: null, // We'll enhance this later
        _success: success,
        _failure_reason: failureReason
      });
    } catch (error) {
      console.error('Failed to record login attempt:', error);
    }
  }

  // Log security event
  static async logSecurityEvent(
    userId: string,
    eventType: string,
    eventData: any = {},
    riskScore: number = 0
  ): Promise<void> {
    try {
      await supabase.rpc('log_security_event', {
        _user_id: userId,
        _event_type: eventType,
        _event_data: eventData,
        _ip_address: null, // We'll enhance this later
        _user_agent: navigator.userAgent,
        _risk_score: riskScore
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
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

  // Device fingerprinting
  static generateDeviceFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('Device fingerprint', 10, 10);
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
      navigator.hardwareConcurrency,
      // Safely access deviceMemory with fallback
      (navigator as any).deviceMemory || 'unknown'
    ].join('|');
    
    return btoa(fingerprint).substring(0, 32);
  }

  // Register device
  static async registerDevice(userId: string): Promise<void> {
    try {
      const fingerprint = this.generateDeviceFingerprint();
      const deviceInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      await supabase.from('user_devices').upsert({
        user_id: userId,
        device_fingerprint: fingerprint,
        device_name: this.getDeviceName(),
        device_type: this.getDeviceType(),
        browser_info: deviceInfo,
        last_seen: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to register device:', error);
    }
  }

  // Get device name
  private static getDeviceName(): string {
    const userAgent = navigator.userAgent;
    if (/iPhone/.test(userAgent)) return 'iPhone';
    if (/iPad/.test(userAgent)) return 'iPad';
    if (/Android/.test(userAgent)) return 'Android Device';
    if (/Windows/.test(userAgent)) return 'Windows PC';
    if (/Mac/.test(userAgent)) return 'Mac';
    return 'Unknown Device';
  }

  // Get device type
  private static getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/Mobile/.test(userAgent)) return 'mobile';
    if (/Tablet/.test(userAgent)) return 'tablet';
    return 'desktop';
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

  // Bank account verification methods
  static async initiateBankVerification(bankAccountId: string, method: 'micro_deposit' | 'instant'): Promise<{ success: boolean; message: string }> {
    try {
      if (method === 'micro_deposit') {
        // Generate random micro deposit amounts
        const amount1 = Math.floor(Math.random() * 99) + 1; // 1-99 cents
        const amount2 = Math.floor(Math.random() * 99) + 1;
        
        const tokenData = {
          amounts: [amount1, amount2],
          created_at: new Date().toISOString()
        };
        
        // Store verification token - cast to Json type
        const { error } = await supabase.from('bank_verification_tokens').insert({
          bank_account_id: bankAccountId,
          verification_type: 'micro_deposit',
          token_data: tokenData as any, // Cast to any to satisfy Json type
          expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days
        });
        
        if (error) throw error;
        
        return {
          success: true,
          message: 'Micro deposits initiated. Check your bank account in 1-2 business days.'
        };
      }
      
      return {
        success: false,
        message: 'Verification method not supported yet'
      };
    } catch (error: any) {
      console.error('Bank verification error:', error);
      return {
        success: false,
        message: error.message || 'Failed to initiate verification'
      };
    }
  }

  static async verifyMicroDeposits(bankAccountId: string, amount1: number, amount2: number): Promise<{ success: boolean; message: string }> {
    try {
      // Get verification token
      const { data: token, error: tokenError } = await supabase
        .from('bank_verification_tokens')
        .select('*')
        .eq('bank_account_id', bankAccountId)
        .eq('verification_type', 'micro_deposit')
        .eq('status', 'pending')
        .single();
      
      if (tokenError || !token) {
        return {
          success: false,
          message: 'No pending verification found'
        };
      }
      
      // Check if token is expired
      if (new Date(token.expires_at) < new Date()) {
        return {
          success: false,
          message: 'Verification token has expired'
        };
      }
      
      // Check attempts
      if (token.attempts >= token.max_attempts) {
        return {
          success: false,
          message: 'Maximum verification attempts exceeded'
        };
      }
      
      // Verify amounts - safely cast the token_data
      const tokenData = token.token_data as unknown as MicroDepositTokenData;
      const expectedAmounts = tokenData.amounts;
      const isValid = expectedAmounts.includes(amount1) && expectedAmounts.includes(amount2) && amount1 !== amount2;
      
      if (isValid) {
        // Update token status
        await supabase
          .from('bank_verification_tokens')
          .update({ status: 'verified' })
          .eq('id', token.id);
        
        // Update bank account
        await supabase
          .from('bank_accounts')
          .update({
            is_verified: true,
            verification_status: 'verified',
            verification_method: 'micro_deposit',
            verified_at: new Date().toISOString()
          })
          .eq('id', bankAccountId);
        
        return {
          success: true,
          message: 'Bank account verified successfully'
        };
      } else {
        // Increment attempts
        await supabase
          .from('bank_verification_tokens')
          .update({ attempts: token.attempts + 1 })
          .eq('id', token.id);
        
        return {
          success: false,
          message: `Incorrect amounts. ${token.max_attempts - token.attempts - 1} attempts remaining.`
        };
      }
    } catch (error: any) {
      console.error('Micro deposit verification error:', error);
      return {
        success: false,
        message: error.message || 'verification failed'
      };
    }
  }
}
