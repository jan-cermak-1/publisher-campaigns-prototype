# Publisher Campaigns - React Prototype

Funkční prototyp Campaigns feature pro Emplifi Publisher podle Figma designu a specifikací.

## 🚀 Spuštění projektu

### Prerequisites

- Node.js 18+ 
- npm nebo yarn

### Instalace

```bash
npm install
```

### Spuštění (Development)

```bash
npm run dev
```

Toto spustí:
- Vite dev server na `http://localhost:5173`
- JSON Server API na `http://localhost:3001`

### Build

```bash
npm run build
```

### Preview buildu

```bash
npm run preview
```

## 📁 Struktura projektu

```
publisher-campaigns/
├── src/
│   ├── components/
│   │   ├── Calendar/       # Kalendář komponenty
│   │   ├── Campaign/       # Campaign modaly a formuláře
│   │   ├── Post/           # Post editor a selectory
│   │   ├── Table/          # Campaign tabulky
│   │   ├── Navigation/     # Sidebar a TopBar
│   │   ├── Notes/          # Notes komponenty
│   │   └── UI/             # Základní UI komponenty (Button, Input, atd.)
│   ├── pages/
│   │   ├── CalendarPage.tsx
│   │   ├── CampaignsPage.tsx
│   │   └── CreatePostPage.tsx
│   ├── store/              # Zustand stores
│   ├── styles/             # Soul Design System tokens a global styles
│   ├── types/              # TypeScript definice
│   └── mock/               # Mock data pro JSON Server
└── package.json
```

## 🎨 Soul Design System

Projekt využívá Soul Design System tokens:
- **Primární barva**: #4361EE (Emplifi modrá)
- **Typography**: System font stack s fallbacky
- **Spacing**: 4px grid systém
- **Border Radius**: 4px, 8px, 12px, 16px
- **Shadows**: Soft shadows pro depth

## ✨ Klíčové funkce

### 1. **Campaign Management**
- ✅ Vytváření kampaní (Quick Create + Full Detail)
- ✅ Editace kampaní s tab navigací (Setup, Brief, Posts, Analytics, Activity log)
- ✅ UTM template builder s variables a custom values
- ✅ Rich text editor pro Brief
- ✅ Status badges (RUNNING, IN PROGRESS, WAITING, DRAFT, NO ACTION)
- ✅ Color picker pro vizuální rozlišení
- ✅ Content labels management
- ✅ Date range a repeat options

### 2. **Calendar View**
- ✅ FullCalendar integrace
- ✅ Campaign row zobrazení
- ✅ Post cards s campaign indikátorem (barevný proužek)
- ✅ Filter bar (Month/Week/Day/Agenda views)
- ✅ Drag & drop support

### 3. **Post Creation**
- ✅ Multi-step flow (Campaign → Profiles → Editor)
- ✅ Campaign Selector s kategoriemi (RECENT, IN PROGRESS, SCHEDULED)
- ✅ Profile Selector s platform filtrem a search
- ✅ Post Editor s preview (Desktop/Mobile)
- ✅ Media upload area
- ✅ Character counter
- ✅ Schedule post funkce

### 4. **Campaigns Table**
- ✅ Sortování podle všech sloupců
- ✅ Filtering
- ✅ Bulk selection
- ✅ Quick detail view

### 5. **Notes**
- ✅ Quick create modal
- ✅ Date picker
- ✅ Repeat options (Daily, Weekly, Monthly)
- ✅ Shareability (Private/Shared)

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **State Management**: Zustand
- **Styling**: Styled Components
- **Calendar**: FullCalendar React
- **Mock API**: JSON Server
- **Date Handling**: date-fns

## 📊 Mock Data

Projekt obsahuje mock data v `src/mock/db.json`:
- 3 example campaigns
- 3 example posts  
- 5 example profiles
- 1 example note
- 2 UTM templates

## 🎯 User Flows

### Vytvoření Campaign
1. Kliknout na "Create" → "Campaign"
2. Vyplnit základní info (Quick Create)
3. Volitelně: otevřít "More options" pro detailní setup
4. Save

### Vytvoření Post
1. Kliknout na "Create" → "Post"
2. Vybrat campaign (nebo "No campaign")
3. Vybrat profiles (multi-select s filtry)
4. Napsat content, přidat media
5. Nastavit publish date
6. Save as Draft nebo Publish

### Editace Campaign
1. V Campaigns page kliknout na řádek
2. Otevře se full-screen detail modal
3. Navigace mezi taby (Setup, Brief, Posts, Analytics, Activity)
4. Změny se automaticky ukládají (on blur)

## 🔧 Development

### Přidání nové komponenty
```typescript
// src/components/MyComponent/MyComponent.tsx
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
`;

export const MyComponent: React.FC = () => {
  return <Container>Hello World</Container>;
};
```

### Přidání nového store
```typescript
// src/store/myStore.ts
import { create } from 'zustand';

interface MyState {
  data: string[];
  addData: (item: string) => void;
}

export const useMyStore = create<MyState>((set) => ({
  data: [],
  addData: (item) => set((state) => ({ 
    data: [...state.data, item] 
  })),
}));
```

## 📝 Co by bylo v produkčním MVP

1. **Backend API integrace** (místo JSON Server)
2. **Autentizace a autorizace**
3. **Real-time collaboration** (WebSockets)
4. **Media upload** (S3/CDN integrace)
5. **Analytics dashboard** (grafy, metriky)
6. **Activity log** (audit trail)
7. **Notifications** (toast messages)
8. **Permissions** (role-based access)
9. **Search** (global search)
10. **Exports** (CSV, PDF reports)

## 🐛 Known Limitations

- Mock data pouze v paměti (refresh = reset)
- FullCalendar CSS není plně přestylovaný
- Media upload je pouze placeholder
- Analytics a Activity log jsou placeholders
- Žádné unit/integration testy
- Chybí error retry logika
- Optimistic updates bez rollback

## 🎓 Poznámky pro designéra

Tento prototyp demonstruje:
- ✅ Component-based architekturu
- ✅ State management patterns
- ✅ Form handling a validation
- ✅ Modal/Dialog patterns
- ✅ Multi-step wizards
- ✅ Table sorting/filtering
- ✅ Calendar integrace
- ✅ Responsive layout (desktop-first)

Můžeš testovat:
- Vytvoření nové kampaně
- Editaci existující kampaně
- Vytvoření postu s/bez kampaně
- Filtrování v kalendáři
- Sorting v tabulce
- Vytvoření poznámky

## 📞 Support

Pro otázky nebo problémy vytvořte issue nebo kontaktujte autora.

---

**Built with ❤️ using Soul Design System**
