import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential
} from 'firebase/auth'
import { auth } from './firebase-config'
import { FirebaseDatabase } from './firebase-database'

// Generate 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Auth service class
export class FirebaseAuthService {
  // Register new user
  static async register(email: string, password: string, name: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Create user with Firebase Auth
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update user profile
      await updateProfile(user, { displayName: name })

      // Save user to Firestore
      await FirebaseDatabase.addUser({
        email: email,
        name: name,
        is_email_verified: false,
        is_admin: false
      })

      // Send email verification
      await sendEmailVerification(user)

      return { success: true, user }
    } catch (error: any) {
      console.error('Registration error:', error)
      return { success: false, error: error.message }
    }
  }

  // Login user
  static async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Check if email is verified
      if (!user.emailVerified) {
        // Send verification email
        await sendEmailVerification(user)
        return { success: false, error: 'Please verify your email before logging in. A verification email has been sent.' }
      }

      return { success: true, user }
    } catch (error: any) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  // Logout user
  static async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error: any) {
      console.error('Logout error:', error)
      return { success: false, error: error.message }
    }
  }

  // Send password reset email
  static async sendPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (error: any) {
      console.error('Password reset error:', error)
      return { success: false, error: error.message }
    }
  }

  // Send email verification
  static async sendEmailVerification(): Promise<{ success: boolean; error?: string }> {
    try {
      const user = auth.currentUser
      if (!user) {
        return { success: false, error: 'No user logged in' }
      }

      await sendEmailVerification(user)
      return { success: true }
    } catch (error: any) {
      console.error('Email verification error:', error)
      return { success: false, error: error.message }
    }
  }

  // Get current user
  static getCurrentUser(): User | null {
    return auth.currentUser
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!auth.currentUser
  }

  // Check if user is admin
  static async isAdmin(): Promise<boolean> {
    try {
      const user = auth.currentUser
      if (!user) return false

      const userData = await FirebaseDatabase.getUserByEmail(user.email!)
      return userData?.is_admin || false
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }
}

// Custom OTP system for additional verification
export class OTPService {
  // Send OTP via email (using your existing email system)
  static async sendOTP(email: string, type: 'registration' | 'login' | 'password_reset', name?: string): Promise<{ success: boolean; otp?: string; error?: string }> {
    try {
      const otp = generateOTP()
      
      // Save OTP to Firestore
      await FirebaseDatabase.addEmailVerification({
        email,
        otp,
        type,
        expires_at: new Date(Date.now() + 10 * 60 * 1000) as any, // 10 minutes
        is_used: false
      })

      // Send email using your existing email system
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          otp: otp,
          type: type,
          name: name
        })
      })

      const result = await response.json()

      if (result.success) {
        return { success: true, otp }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error: any) {
      console.error('OTP sending error:', error)
      return { success: false, error: error.message }
    }
  }

  // Verify OTP
  static async verifyOTP(email: string, otp: string): Promise<{ success: boolean; error?: string }> {
    try {
      const verification = await FirebaseDatabase.getEmailVerification(email, otp)
      
      if (!verification) {
        return { success: false, error: 'Invalid or expired OTP' }
      }

      // Check if OTP is expired
      if (verification.expires_at.toDate() < new Date()) {
        return { success: false, error: 'OTP has expired' }
      }

      // Mark OTP as used
      await FirebaseDatabase.markEmailVerificationAsUsed(verification.id!)

      return { success: true }
    } catch (error: any) {
      console.error('OTP verification error:', error)
      return { success: false, error: error.message }
    }
  }
}
