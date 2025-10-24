# Messages Dynamic Routing Implementation

## 📁 File Structure

```
src/app/messages/
├── layout.tsx              # Wraps all /messages routes (shows mobile bar)
├── page.tsx               # Main /messages route (no chat selected)
└── [id]/
    ├── layout.tsx         # Wraps /messages/[id] (hides mobile bar)
    └── page.tsx          # Dynamic /messages/123 route (shows chat)
```

## 🎯 Responsive Behavior

### **Scenario 1: `/messages` (No Selected Chat)**

#### Desktop (≥1024px - lg):

```
[LeftSidebar] | [ConversationsList 400px] | [WelcomeScreen] | [Empty]
```

- Shows conversations list + welcome screen side by side
- Mobile bar: Hidden ✅

#### Tablet (768px - 1023px - md):

```
[LeftSidebar] | [ConversationsList Full Width]
```

- Only shows conversations list
- Welcome screen: Hidden (no space)
- Mobile bar: Hidden ✅

#### Mobile (<768px):

```
[ConversationsList Full Width]
[Mobile Bottom Bar]
```

- Only shows conversations list
- Mobile bar: Shown ✅
- Left sidebar: Hidden

---

### **Scenario 2: `/messages/123` (Chat Selected)**

#### Desktop (≥1024px - lg):

```
[LeftSidebar] | [ConversationsList 400px] | [ChatWindow 600px max] | [Empty]
```

- Shows all three: sidebar + list + chat
- Back button: Hidden
- Mobile bar: Hidden ✅

#### Tablet/Mobile (<1024px):

```
[ChatWindow 600px max centered]
[Back Button at top]
```

- Only shows chat window (full focus)
- Conversations list: Hidden
- Back button: Visible (navigates to /messages)
- Mobile bar: Hidden ✅

---

## 🔄 Navigation Flow

```
User on /messages
│
├─ Clicks conversation "John"
│  └─→ Navigates to /messages/123
│     └─→ Shows ChatWindow with ID 123
│        └─→ On mobile: Shows back button
│
└─ On mobile: Clicks back button
   └─→ Navigates to /messages
      └─→ Shows ConversationsList only
```

---

## 🛠️ Key Implementation Details

### 1. **LayoutWrapper Enhancement**

Added `hideMobileBar` prop to control mobile bottom bar visibility:

```tsx
<LayoutWrapper showRightSidebar={false} hideMobileBar={true}>
```

### 2. **Dynamic Route: `/messages/[id]/page.tsx`**

- Uses Next.js dynamic routing with `[id]` folder
- Gets conversation ID from URL params
- Shows back button on mobile/tablet
- ChatWindow centered with max 600px width

### 3. **MessagesLayout (Main Page)**

- Checks if current path is `/messages`
- Handles navigation to dynamic routes
- Conditionally renders ConversationsList and WelcomeScreen

### 4. **Responsive Classes**

- `hidden lg:block` - Hidden on mobile, visible on desktop
- `hidden md:flex` - Hidden on small screens, visible on medium+
- `max-w-[600px]` - Limits chat window width
- `pt-16 lg:pt-0` - Adds padding for back button on mobile

---

## 📱 Breakpoints Used

| Breakpoint | Width  | Behavior                      |
| ---------- | ------ | ----------------------------- |
| `sm`       | 640px  | Shows left sidebar icons      |
| `md`       | 768px  | Shows welcome screen          |
| `lg`       | 1024px | Shows all panels side-by-side |
| `xl`       | 1280px | Full layout with labels       |

---

## ✅ Testing Checklist

- [ ] On `/messages`, desktop shows list + welcome side-by-side
- [ ] On `/messages`, tablet shows only list
- [ ] On `/messages`, mobile shows list + mobile bar
- [ ] Click conversation navigates to `/messages/[id]`
- [ ] On `/messages/[id]`, desktop shows list + chat
- [ ] On `/messages/[id]`, mobile shows only chat + back button
- [ ] Back button navigates to `/messages`
- [ ] Mobile bar hidden when viewing individual chat
- [ ] Mobile bar shown on main messages page

---

## 🎨 Layout Visual Summary

### Desktop View (`/messages`)

```
┌──────┬──────────────┬────────────────┬───────┐
│ Left │ Conversations│  Welcome       │ Empty │
│ Bar  │ List (400px) │  Screen        │ Space │
└──────┴──────────────┴────────────────┴───────┘
```

### Desktop View (`/messages/123`)

```
┌──────┬──────────────┬──────────────┬───────┐
│ Left │ Conversations│  Chat Window │ Empty │
│ Bar  │ List (400px) │  (600px max) │ Space │
└──────┴──────────────┴──────────────┴───────┘
```

### Mobile View (`/messages`)

```
┌────────────────────────┐
│  Conversations List    │
│  (Full Width)          │
│                        │
└────────────────────────┘
┌────────────────────────┐
│   Mobile Bottom Bar    │
└────────────────────────┘
```

### Mobile View (`/messages/123`)

```
┌────────────────────────┐
│ ← Messages (Back Btn)  │
├────────────────────────┤
│  Chat Window           │
│  (600px max, centered) │
│                        │
└────────────────────────┘
```

---

## 🚀 Next Steps

1. Connect to real data API
2. Add message sending functionality
3. Implement real-time updates (WebSocket)
4. Add new message creation flow
5. Add message search functionality
6. Add typing indicators
7. Add read receipts
