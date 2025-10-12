# Loading System Documentation

This document describes the loading system implementation for the EV Rental System web application.

## Overview

The loading system provides a beautiful, consistent loading experience across the application with:

- **Global Loading States**: Centralized loading state management using Zustand
- **Beautiful Animations**: Smooth, modern loading animations with Framer Motion
- **Multiple Loading Types**: Different loading states for various operations
- **Automatic Integration**: Seamless integration with authentication and page transitions

## Architecture

### 1. Loading Store (`src/stores/loading.store.ts`)

Centralized state management for all loading states:

```tsx
interface LoadingState {
  isPageLoading: boolean; // Page transitions
  isApiLoading: boolean; // API requests
  isAuthLoading: boolean; // Authentication operations
  loadingMessage: string | null;
  isAnyLoading: boolean; // Computed state
}
```

**Available Actions:**

- `setPageLoading(loading, message?)` - For page transitions
- `setApiLoading(loading, message?)` - For API requests
- `setAuthLoading(loading, message?)` - For authentication
- `clearAllLoading()` - Reset all loading states

### 2. Loading Components (`src/components/ui/loading.tsx`)

#### LoadingSpinner

Basic spinner component with multiple sizes:

```tsx
<LoadingSpinner size="md" /> // sm, md, lg, xl
```

#### Loading

Main loading component with text and overlay support:

```tsx
<Loading size="lg" text="Đang tải dữ liệu..." overlay={false} />
```

#### LoadingPage

Full-page loading component:

```tsx
<LoadingPage text="Đang tải trang..." />
```

#### LoadingButton

Button with integrated loading state:

```tsx
<LoadingButton loading={isLoading} onClick={handleClick}>
  {isLoading ? "Đang xử lý..." : "Xác nhận"}
</LoadingButton>
```

### 3. Global Loading Overlay (`src/components/global-loading-overlay.tsx`)

Automatically displays when any loading state is active:

- **Beautiful Design**: Circular logo with spinning ring
- **Smooth Animations**: Framer Motion transitions
- **Consistent Styling**: Matches the main page design
- **Auto Show/Hide**: Appears automatically based on loading states

### 4. Page Transition Hook (`src/hooks/use-page-loading.ts`)

Automatic page loading management:

```tsx
import { usePageLoading } from "@/hooks/use-page-loading";

function MyPage() {
  usePageLoading(); // Automatically manages page loading

  return <div>Page content</div>;
}
```

### 5. API with Loading Hook (`src/hooks/use-api-with-loading.ts`)

Simplified API calls with automatic loading:

```tsx
import { useCommonApi } from "@/hooks/use-api-with-loading";

function MyComponent() {
  const { fetchData, submitForm, updateData, deleteData } = useCommonApi();

  const loadData = () => fetchData("/api/data");
  const saveData = (data) => submitForm("/api/save", data);
  const editData = (id, data) => updateData(`/api/${id}`, data);
  const removeData = (id) => deleteData(`/api/${id}`);
}
```

### 6. Navigation with Loading Hook (`src/hooks/use-navigation-with-loading.ts`)

Navigation with automatic loading states:

```tsx
import { useNavigationWithLoading } from "@/hooks/use-navigation-with-loading";

function MyComponent() {
  const { navigateWithLoading, navigateBackWithLoading } =
    useNavigationWithLoading();

  const goToPage = () => navigateWithLoading("/new-page");
  const goBack = () => navigateBackWithLoading();
}
```

### 7. Loading Utilities (`src/utils/loading-utils.ts`)

Utility functions for easy loading management:

```tsx
import { withApiLoading, LoadingMessages } from "@/utils/loading-utils";

// Wrap any async function with loading
const result = await withApiLoading(
  () => fetch("/api/data").then((r) => r.json()),
  LoadingMessages.api.fetching
);
```

## Usage Guide

### 🚀 **Cách sử dụng đơn giản (Recommended)**

#### 1. API Calls với Loading tự động

```tsx
import { useCommonApi } from "@/hooks/use-api-with-loading";

function MyComponent() {
  const { fetchData, submitForm } = useCommonApi();
  const [data, setData] = useState([]);

  // Tự động có loading khi fetch data
  const loadUsers = async () => {
    try {
      const users = await fetchData(
        "/api/users",
        {},
        "Đang tải danh sách người dùng..."
      );
      setData(users);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Tự động có loading khi submit form
  const handleSubmit = async (formData) => {
    try {
      await submitForm("/api/users", formData, "Đang tạo người dùng mới...");
      alert("Thành công!");
    } catch (error) {
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <div>
      <button onClick={loadUsers}>Load Users</button>
      <button onClick={() => handleSubmit({ name: "John" })}>Submit</button>
    </div>
  );
}
```

#### 2. Navigation với Loading tự động

```tsx
import { useNavigationWithLoading } from "@/hooks/use-navigation-with-loading";

function MyComponent() {
  const { navigateWithLoading, navigateBackWithLoading } =
    useNavigationWithLoading();

  const goToProfile = () => {
    navigateWithLoading("/profile", "Đang chuyển đến trang cá nhân...");
  };

  const goBack = () => {
    navigateBackWithLoading("Đang quay lại trang trước...");
  };

  return (
    <div>
      <button onClick={goToProfile}>Go to Profile</button>
      <button onClick={goBack}>Go Back</button>
    </div>
  );
}
```

#### 3. Utility Functions (Siêu đơn giản)

```tsx
import {
  withApiLoading,
  withAuthLoading,
  LoadingMessages,
} from "@/utils/loading-utils";

function MyComponent() {
  const handleOperation = async () => {
    // Chỉ cần wrap function với withApiLoading
    await withApiLoading(
      async () => {
        // Your API call here
        const response = await fetch("/api/data");
        return response.json();
      },
      LoadingMessages.api.fetching // Hoặc custom message
    );
  };

  const handleAuth = async () => {
    await withAuthLoading(async () => {
      // Your auth operation here
      await loginAPI();
    }, LoadingMessages.auth.login);
  };

  return (
    <div>
      <button onClick={handleOperation}>Do Something</button>
      <button onClick={handleAuth}>Login</button>
    </div>
  );
}
```

### ⚡ **So sánh: Cách cũ vs Cách mới**

#### ❌ **Cách cũ (Phức tạp)**

```tsx
import { useApiLoading } from "@/stores/loading.store";

function MyComponent() {
  const { setApiLoading } = useApiLoading();
  const [data, setData] = useState([]);

  const fetchData = async () => {
    setApiLoading(true, "Đang tải dữ liệu...");
    try {
      const response = await fetch("/api/data");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setApiLoading(false);
    }
  };

  return <button onClick={fetchData}>Load Data</button>;
}
```

#### ✅ **Cách mới (Đơn giản)**

```tsx
import { useCommonApi } from "@/hooks/use-api-with-loading";

function MyComponent() {
  const { fetchData } = useCommonApi();
  const [data, setData] = useState([]);

  const loadData = async () => {
    try {
      const result = await fetchData("/api/data", {}, "Đang tải dữ liệu...");
      setData(result);
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={loadData}>Load Data</button>;
}
```

#### 🎯 **Hoặc siêu đơn giản với utilities**

```tsx
import { withApiLoading } from "@/utils/loading-utils";

function MyComponent() {
  const [data, setData] = useState([]);

  const loadData = async () => {
    try {
      const result = await withApiLoading(
        () => fetch("/api/data").then((r) => r.json()),
        "Đang tải dữ liệu..."
      );
      setData(result);
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={loadData}>Load Data</button>;
}
```

### 📚 **Cách sử dụng chi tiết (Advanced)**

### 1. Basic Loading Components

#### Simple Spinner

```tsx
import { LoadingSpinner } from "@/components/ui/loading";

function MyComponent() {
  return <LoadingSpinner size="lg" />;
}
```

#### Loading with Text

```tsx
import { Loading } from "@/components/ui/loading";

function DataLoader() {
  return <Loading size="md" text="Đang tải dữ liệu..." />;
}
```

#### Loading Button

```tsx
import { LoadingButton } from "@/components/ui/loading";

function SubmitButton({ isLoading, onSubmit }) {
  return (
    <LoadingButton loading={isLoading} onClick={onSubmit}>
      {isLoading ? "Đang xử lý..." : "Gửi"}
    </LoadingButton>
  );
}
```

### 2. Global Loading States

#### API Loading

```tsx
import { useApiLoading } from "@/stores/loading.store";

function DataFetcher() {
  const { setApiLoading } = useApiLoading();

  const fetchData = async () => {
    setApiLoading(true, "Đang tải dữ liệu...");
    try {
      const response = await fetch("/api/data");
      const data = await response.json();
      return data;
    } finally {
      setApiLoading(false);
    }
  };

  return <button onClick={fetchData}>Load Data</button>;
}
```

#### Page Loading

```tsx
import { usePageLoading } from "@/stores/loading.store";

function NavigationHandler() {
  const { setPageLoading } = usePageLoading();

  const navigateToPage = () => {
    setPageLoading(true, "Đang chuyển trang...");
    router.push("/new-page");
    setTimeout(() => setPageLoading(false), 1000);
  };

  return <button onClick={navigateToPage}>Go to Page</button>;
}
```

#### Authentication Loading

```tsx
import { useAuthLoading } from "@/stores/loading.store";

function LoginHandler() {
  const { setAuthLoading } = useAuthLoading();

  const handleLogin = async () => {
    setAuthLoading(true, "Đang đăng nhập...");
    try {
      await loginAPI(credentials);
    } finally {
      setAuthLoading(false);
    }
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

#### Logout with Loading and Redirect

```tsx
import { useLogout } from "@/hooks/use-logout";

function LogoutButton() {
  const { logout, isLoggingOut } = useLogout();

  return (
    <button onClick={logout} disabled={isLoggingOut}>
      {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
    </button>
  );
}
```

### 3. Automatic Integration

#### Authentication (Already Integrated)

The auth store automatically manages loading states:

```tsx
import { useAuth } from "@/stores/auth.store";

function LoginForm() {
  const { login, isLoading } = useAuth();

  // isLoading automatically triggers global loading overlay
  const handleLogin = async () => {
    await login(email, password);
  };

  return <LoadingButton loading={isLoading}>Đăng nhập</LoadingButton>;
}
```

#### Page Transitions (Already Integrated)

Automatic loading on route changes:

```tsx
import { usePageLoading } from "@/hooks/use-page-loading";

function MyPage() {
  usePageLoading(); // Automatically shows loading on route changes

  return <div>Page content</div>;
}
```

### 4. Real-world Examples

#### Form Submission

```tsx
"use client";
import { useState } from "react";
import { useApiLoading } from "@/stores/loading.store";
import { LoadingButton } from "@/components/ui/loading";

export function ContactForm() {
  const [formData, setFormData] = useState({});
  const { setApiLoading } = useApiLoading();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiLoading(true, "Đang gửi thông tin...");
    try {
      await submitForm(formData);
      alert("Gửi thành công!");
    } catch (error) {
      alert("Có lỗi xảy ra!");
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <LoadingButton type="submit" loading={false}>
        Gửi thông tin
      </LoadingButton>
    </form>
  );
}
```

#### Data Fetching Component

```tsx
"use client";
import { useEffect, useState } from "react";
import { useApiLoading } from "@/stores/loading.store";
import { Loading } from "@/components/ui/loading";

export function UserList() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setApiLoading } = useApiLoading();

  useEffect(() => {
    const fetchUsers = async () => {
      setApiLoading(true, "Đang tải danh sách người dùng...");
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setApiLoading(false);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [setApiLoading]);

  if (isLoading) {
    return <Loading size="lg" text="Đang tải dữ liệu..." />;
  }

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## Loading Messages

### Common Messages

```tsx
// API Loading
setApiLoading(true, "Đang gọi API...");
setApiLoading(true, "Đang tải dữ liệu...");
setApiLoading(true, "Đang xử lý...");
setApiLoading(true, "Đang lưu thông tin...");

// Page Loading
setPageLoading(true, "Đang chuyển trang...");
setPageLoading(true, "Đang tải trang mới...");
setPageLoading(true, "Đang chuyển hướng...");

// Auth Loading
setAuthLoading(true, "Đang đăng nhập...");
setAuthLoading(true, "Đang xác thực...");
setAuthLoading(true, "Đang tải thông tin người dùng...");
setAuthLoading(true, "Đang đăng xuất...");
```

## Best Practices

### 1. Always Clear Loading States

```tsx
const handleOperation = async () => {
  setApiLoading(true, "Đang xử lý...");
  try {
    await performOperation();
  } catch (error) {
    // Handle error
  } finally {
    setApiLoading(false); // Always clear loading state
  }
};
```

### 2. Use Appropriate Loading Types

- **API Loading**: For data fetching, form submissions
- **Page Loading**: For navigation, route changes
- **Auth Loading**: For login, logout, user info fetching

### 3. Provide Meaningful Messages

```tsx
// Good
setApiLoading(true, "Đang tải danh sách xe...");

// Bad
setApiLoading(true, "Loading...");
```

### 4. Use LoadingButton for Form Actions

```tsx
// Good
<LoadingButton loading={isSubmitting} type="submit">
  {isSubmitting ? "Đang gửi..." : "Gửi"}
</LoadingButton>

// Bad
<Button disabled={isSubmitting}>
  {isSubmitting ? "Đang gửi..." : "Gửi"}
</Button>
```

## Features

### Automatic Features

- **Global Overlay**: Automatically appears when any loading state is active
- **Smooth Transitions**: Framer Motion animations for smooth show/hide
- **Consistent Design**: Matches the application's design language
- **Responsive**: Works on all screen sizes

### Manual Control

- **Individual Loading States**: Control specific loading types
- **Custom Messages**: Provide context-specific loading messages
- **Component-Level Loading**: Use loading components directly in components

## Integration Points

### Already Integrated

- ✅ Authentication flow (login/logout/fetchUser)
- ✅ Page transitions (route changes)
- ✅ Global overlay (automatic display)
- ✅ Login form (LoadingButton)
- ✅ Logout with loading and redirect to login page

### Ready for Integration

- 🔄 API calls in components
- 🔄 Form submissions
- 🔄 Data fetching
- 🔄 File uploads
- 🔄 Any async operations

## Troubleshooting

### Loading Not Showing

1. Check if loading state is properly set to `true`
2. Verify the GlobalLoadingOverlay is included in layout
3. Ensure the loading store is properly imported

### Loading Not Clearing

1. Make sure to call the loading action with `false` in finally block
2. Check for unhandled errors that might prevent cleanup

### Performance Issues

1. Avoid setting loading states too frequently
2. Use appropriate loading types for different operations
3. Consider debouncing rapid state changes

## Examples in Codebase

### Authentication Integration

- `src/stores/auth.store.ts` - Auth loading integration
- `src/components/login-form.tsx` - LoadingButton usage
- `src/services/auth.service.ts` - API call handling

### Page Transitions

- `src/hooks/use-page-loading.ts` - Page loading hook
- `src/components/page-transition-wrapper.tsx` - Page wrapper

### Global Overlay

- `src/components/global-loading-overlay.tsx` - Main overlay component
- `src/app/layout.tsx` - Layout integration

This loading system provides a comprehensive, beautiful, and easy-to-use loading experience throughout the application.
