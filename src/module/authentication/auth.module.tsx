import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

export default function AuthModule() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Successfully signed in");
    } catch (error) {
      toast.error("Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Statusapp</h1>
      <p className="text-xl text-gray-500 mt-3 mb-10">
        A simple status page for your services
      </p>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Login to your account
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col gap-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
          <Button
            type="submit"
            className="w-full cursor-pointer"
            onClick={handleEmailSignIn}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in with Email"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
