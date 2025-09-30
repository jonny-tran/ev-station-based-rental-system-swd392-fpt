"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X } from "lucide-react";

interface RenterInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface RenterInfoPanelProps {
  renterInfo: RenterInfo;
  onInfoChange: (info: RenterInfo) => void;
}

export function RenterInfoPanel({
  renterInfo,
  onInfoChange,
}: RenterInfoPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState<RenterInfo>(renterInfo);

  const handleSave = () => {
    onInfoChange(editedInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInfo(renterInfo);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof RenterInfo, value: string) => {
    setEditedInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Thông tin Renter</CardTitle>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Lưu
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Họ và tên</Label>
          <Input
            id="fullName"
            value={isEditing ? editedInfo.fullName : renterInfo.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            disabled={!isEditing}
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={isEditing ? editedInfo.email : renterInfo.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={!isEditing}
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Số điện thoại</Label>
          <Input
            id="phoneNumber"
            value={isEditing ? editedInfo.phoneNumber : renterInfo.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            disabled={!isEditing}
            className="bg-gray-50"
          />
        </div>

        {!isEditing && (
          <div className="pt-2 text-xs text-gray-500">
            <p>• Click &quot;Chỉnh sửa&quot; để thay đổi thông tin</p>
            <p>• Thông tin này sẽ được sử dụng để gửi thông báo ký hợp đồng</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
