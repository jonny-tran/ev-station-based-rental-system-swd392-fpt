"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Tiêu đề chính */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Test Cài Đặt shadcn/ui Components
          </h1>
          <p className="text-lg text-gray-600">
            Kiểm tra tất cả các components shadcn/ui đã được cài đặt và hoạt
            động
          </p>
        </div>

        {/* Test Button Components */}
        <Card>
          <CardHeader>
            <CardTitle>Button Components Test</CardTitle>
            <CardDescription>
              Các loại button với variants khác nhau
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button>Default Button</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Form Components */}
        <Card>
          <CardHeader>
            <CardTitle>Form Components Test</CardTitle>
            <CardDescription>Input, Label và các form elements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="notifications" />
                <Label htmlFor="notifications">Nhận thông báo</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms">Tôi đồng ý với điều khoản sử dụng</Label>
              </div>

              <RadioGroup defaultValue="option1" className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option1" id="option1" />
                  <Label htmlFor="option1">Tùy chọn 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option2" id="option2" />
                  <Label htmlFor="option2">Tùy chọn 2</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Test Display Components */}
        <Card>
          <CardHeader>
            <CardTitle>Display Components Test</CardTitle>
            <CardDescription>
              Badge, Avatar, Progress và các components hiển thị
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Badges:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3">Avatars:</h4>
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="Avatar"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>VN</AvatarFallback>
                </Avatar>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3">Progress:</h4>
              <div className="space-y-2">
                <Progress value={33} className="w-full" />
                <Progress value={66} className="w-full" />
                <Progress value={88} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Alert Components */}
        <div className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Thành công!</AlertTitle>
            <AlertDescription>
              Alert component hoạt động bình thường.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Lỗi!</AlertTitle>
            <AlertDescription>
              Đây là một thông báo lỗi để test Alert component.
            </AlertDescription>
          </Alert>
        </div>

        {/* Test Tabs Component */}
        <Card>
          <CardHeader>
            <CardTitle>Tabs Component Test</CardTitle>
            <CardDescription>Kiểm tra Tabs navigation</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="account">Tài khoản</TabsTrigger>
                <TabsTrigger value="password">Mật khẩu</TabsTrigger>
                <TabsTrigger value="settings">Cài đặt</TabsTrigger>
              </TabsList>
              <TabsContent value="account" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên</Label>
                  <Input id="name" defaultValue="Nguyễn Văn A" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <Input id="username" defaultValue="@nguyenvana" />
                </div>
              </TabsContent>
              <TabsContent value="password" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Mật khẩu hiện tại</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">Mật khẩu mới</Label>
                  <Input id="new" type="password" />
                </div>
              </TabsContent>
              <TabsContent value="settings" className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing">Marketing emails</Label>
                  <Switch id="marketing" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="social">Social notifications</Label>
                  <Switch id="social" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Status Message */}
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>✅ shadcn/ui Components Test Hoàn Thành!</AlertTitle>
          <AlertDescription>
            Tất cả các components shadcn/ui đã được test và hoạt động tốt. Bao
            gồm: Button, Card, Input, Label, Tabs, Badge, Alert, Avatar,
            Progress, Switch, Checkbox, RadioGroup, và Separator.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
