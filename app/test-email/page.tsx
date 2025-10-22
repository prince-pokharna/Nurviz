"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TestEmailPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailConfig, setEmailConfig] = useState<any>(null)
  const [testResult, setTestResult] = useState<any>(null)
  const { toast } = useToast()

  const checkEmailConfig = async () => {
    try {
      const response = await fetch('/api/test-email')
      const data = await response.json()
      setEmailConfig(data)
    } catch (error) {
      console.error('Error checking email config:', error)
    }
  }

  const sendTestEmail = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          testType: 'registration'
        })
      })

      const data = await response.json()
      setTestResult(data)

      if (data.success) {
        toast({
          title: "Test email sent!",
          description: `Check ${email} for the OTP code: ${data.otp}`,
        })
      } else {
        toast({
          title: "Failed to send email",
          description: data.error || "Please check your email configuration.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-light via-white to-theme-light/30 p-4">
      <div className="max-w-4xl mx-auto py-16">
        <div className="text-center mb-8">
          <Mail className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold gradient-text font-playfair mb-2">Email Configuration Test</h1>
          <p className="text-gray-600">Test your email setup for OTP verification</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email Configuration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Email Configuration</span>
              </CardTitle>
              <CardDescription>
                Check if your email credentials are properly configured
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={checkEmailConfig} className="w-full">
                Check Configuration
              </Button>

              {emailConfig && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant={emailConfig.configured ? "default" : "destructive"}>
                      {emailConfig.configured ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Configured
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Not Configured
                        </>
                      )}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>EMAIL_USER:</span>
                      <Badge variant={emailConfig.emailConfig.hasEmailUser ? "default" : "destructive"}>
                        {emailConfig.emailConfig.hasEmailUser ? "Set" : "Missing"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>EMAIL_PASS:</span>
                      <Badge variant={emailConfig.emailConfig.hasEmailPass ? "default" : "destructive"}>
                        {emailConfig.emailConfig.hasEmailPass ? "Set" : "Missing"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>EMAIL_FROM:</span>
                      <Badge variant={emailConfig.emailConfig.hasEmailFrom ? "default" : "destructive"}>
                        {emailConfig.emailConfig.hasEmailFrom ? "Set" : "Missing"}
                      </Badge>
                    </div>
                  </div>

                  {!emailConfig.configured && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-yellow-800">Setup Required</p>
                          <p className="text-yellow-700 mt-1">
                            Missing variables: {emailConfig.missingVariables.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {emailConfig.instructions && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Setup Instructions:</h4>
                      <ol className="text-sm text-blue-700 space-y-1">
                        {Object.entries(emailConfig.instructions).map(([key, value]) => (
                          <li key={key} className="flex items-start space-x-2">
                            <span className="font-medium">{key.replace('step', 'Step ')}:</span>
                            <span>{value as string}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Email Sending */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Send Test Email</span>
              </CardTitle>
              <CardDescription>
                Send a test OTP email to verify your setup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-email">Email Address</Label>
                <Input
                  id="test-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@example.com"
                />
              </div>

              <Button 
                onClick={sendTestEmail} 
                disabled={isLoading || !email}
                className="w-full"
              >
                {isLoading ? "Sending..." : "Send Test Email"}
              </Button>

              {testResult && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Result:</span>
                    <Badge variant={testResult.success ? "default" : "destructive"}>
                      {testResult.success ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Success
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Failed
                        </>
                      )}
                    </Badge>
                  </div>

                  {testResult.success && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Test OTP:</strong> {testResult.otp}
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        Check your email at {testResult.email}
                      </p>
                    </div>
                  )}

                  {!testResult.success && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800 font-medium">
                        {testResult.error}
                      </p>
                      {testResult.details && (
                        <p className="text-sm text-red-700 mt-1">
                          {testResult.details}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Setup Guide */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Setup Guide</CardTitle>
            <CardDescription>
              Follow these steps to configure email for your Nurvi Jewel app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">For Gmail (Recommended):</h4>
                <ol className="text-sm space-y-2">
                  <li>1. Enable 2-Factor Authentication on Gmail</li>
                  <li>2. Generate App Password (16 characters)</li>
                  <li>3. Add to Vercel Environment Variables:</li>
                  <li className="ml-4">• EMAIL_USER = your-gmail@gmail.com</li>
                  <li className="ml-4">• EMAIL_PASS = your-app-password</li>
                  <li className="ml-4">• EMAIL_FROM = Nurvi Jewel &lt;your-gmail@gmail.com&gt;</li>
                  <li>4. Redeploy your project</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium mb-3">For Outlook:</h4>
                <ol className="text-sm space-y-2">
                  <li>1. Use your Outlook email and password</li>
                  <li>2. Add to Vercel Environment Variables:</li>
                  <li className="ml-4">• EMAIL_USER = your-email@outlook.com</li>
                  <li className="ml-4">• EMAIL_PASS = your-password</li>
                  <li className="ml-4">• EMAIL_FROM = Nurvi Jewel &lt;your-email@outlook.com&gt;</li>
                  <li>3. Redeploy your project</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
