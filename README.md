# Online Menu - Professional Restaurant Interface

A modern, responsive restaurant menu interface built with Next.js, featuring hierarchical navigation and intuitive user experience.

## 🎯 Key Features

### ✨ Enhanced Navigation
- **Hierarchical Structure**: Main categories (Food, Beverages, Desserts, Tobacco) with organized subcategories
- **Navigation Arrows**: Left/right arrows on category sliders for clear sliding indication
- **Smart Visibility**: Arrows appear/disappear based on scroll position
- **Breadcrumb Navigation**: Clear path showing current category location

### 🎨 Professional Design
- Clean, modern interface with gradient backgrounds
- Smooth animations and hover effects
- Responsive design for all screen sizes
- Touch-friendly navigation for mobile devices

### 🍽️ Menu Structure
```
Food 🍽️
├── Appetizers
├── Main Courses
└── Side Dishes

Beverages 🥤
├── Hot Drinks
├── Cold Drinks
└── Wines & Spirits

Desserts 🍰
├── Cakes & Pastries
└── Frozen Treats

Tobacco 🚬
├── Cigarettes
├── Premium Cigars
└── Smoking Accessories
```

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ 
- npm or yarn

### Installation & Running
```bash
# Navigate to project directory
cd "C:\Users\Mr. Ahmad\Desktop\Online menu"

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

The application will be available at:
- **Primary**: http://localhost:3000
- **Fallback**: http://localhost:3001 (if 3000 is in use)

## 📁 Project Structure

```
components/
├── MainCategoryNav.js      # Top-level category navigation
├── SubcategorySlider.js    # Second-level navigation with arrows
├── CategorySlider.js       # Enhanced category slider
├── MenuHeader.js          # Restaurant header
├── MenuCategory.js        # Category display
├── MenuItem.js           # Individual menu items
└── ...

data/
└── menuData.js           # Hierarchical menu data structure

pages/
├── index.js             # Main application page
└── _app.js             # Next.js app configuration

styles/
├── globals.css         # Global styles and animations
└── ...

services/
└── menuService.js      # Data fetching and transformation
```

## 🎛️ Navigation Features

### Main Category Navigation
- Visual icons for each main category
- Gradient background with professional styling
- Active state highlighting with scale animation
- Automatic subcategory selection

### Subcategory Slider
- Horizontal scrolling with navigation arrows
- Smooth scroll behavior (200px increments)
- Arrow visibility based on scroll position
- Touch-friendly for mobile devices

### Smart State Management
- Automatic subcategory selection when changing main categories
- Breadcrumb trail showing current navigation path
- Persistent navigation state throughout session

## 🎨 Design Highlights

### Color Scheme
- Primary accent: Professional blue gradient
- Background: Clean light gray (#fafafa)
- Text: High contrast for accessibility
- Hover states: Subtle interactive feedback

### Animations
- Smooth category transitions (300ms duration)
- Scale hover effects (1.02x and 1.05x)
- Navigation arrow hover animations
- Professional scroll behavior

### Responsive Design
- Mobile-first approach
- Touch-optimized button sizes
- Horizontal scrolling for categories
- Adaptive layout for all screen sizes

## 📱 Mobile Optimization

- Touch-friendly navigation buttons
- Smooth horizontal scrolling
- Optimized tap targets (44px minimum)
- Gesture-friendly interactions
- No horizontal page scrolling

## 🔧 Technical Features

### Performance
- Optimized React components
- Efficient state management
- Lazy loading preparation
- Smooth 60fps animations

### Accessibility
- Keyboard navigation support
- ARIA labels for screen readers
- High contrast ratios
- Focus management

### Data Integration
- Firebase Firestore backend
- Real-time data synchronization
- Secure admin authentication
- CSV fallback support

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement approach

## 🛠️ Development

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Data Management
- Firebase Firestore for real-time data storage
- CSV import capability (fallback)
- Admin dashboard for menu management
- Real-time synchronization across devices

## 📊 Menu Data Structure

```javascript
{
  restaurant: {
    name: "Restaurant Name",
    description: "Description",
    location: "Location"
  },
  mainCategories: [
    {
      id: "category-id",
      name: "Category Name", 
      icon: "🍽️",
      subcategories: [
        {
          id: "subcategory-id",
          name: "Subcategory Name",
          items: [/* menu items */]
        }
      ]
    }
  ]
}
```

## 🎯 User Experience Flow

1. **Landing**: User sees main categories with icons
2. **Selection**: Click main category (Food, Beverages, etc.)
3. **Navigation**: Scroll through subcategories using arrows
4. **Browsing**: View menu items in selected subcategory
5. **Context**: Always see current location via breadcrumbs

## 🔄 Future Enhancements

- Search functionality
- Favorites system
- Price filtering
- Dietary restriction filters
- Multi-language support
- Dark mode theme

---

**Built with ❤️ using Next.js, React, and Tailwind CSS**