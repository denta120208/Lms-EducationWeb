# SMK Metland Cileungsi Website

This is a modern, responsive website for SMK Metland Cileungsi built with React and TypeScript. The design is based on and improved from the original SMK Metland website (https://smkmetland.net/ppdb/).

## 🎨 Design Features

- **Modern and Responsive**: Fully responsive design that looks great on all devices
- **Improved UX**: Better navigation with dropdown menus and mobile hamburger menu
- **Enhanced Visual Design**: Improved color scheme, typography, and spacing
- **Performance Optimized**: Optimized for fast loading and smooth interactions

## 🖼️ Image Replacement Guide

The website uses several images that can be easily replaced. Here's where each image is located and how to replace them:

### Required Images

#### 1. **Logo Image** (`/public/logo.png`)
- **Current Usage**: Main logo in header and footer
- **Recommended Size**: 40px height (width auto-scales)
- **Format**: PNG with transparent background
- **Location**: Used in header and footer
- **Replacement**: Replace `/public/logo.png` with your school logo

#### 2. **Hero Background Image** (`/public/lomba.png`)
- **Current Usage**: Large background image in hero section
- **Recommended Size**: 1920x1080px or larger
- **Format**: JPG or PNG
- **Location**: Hero section background
- **Description**: Should show students or school activities
- **Replacement**: Replace `/public/lomba.png` with a high-quality image of your school or students

#### 3. **Social Media Icons** (Using SVG assets)
The following SVG icons are available in `/Fe/src/assets/`:
- `IG.svg` - Instagram icon
- `TikTok.svg` - TikTok icon  
- `WA.svg` - WhatsApp icon
- `YT.svg` - YouTube icon
- `FB.svg` - Facebook icon

**To use these icons**: Import them in the component and replace the current placeholder icons.

#### 4. **Partner/Industry Logos**
- **Current Status**: Using placeholder logo.png for all partners
- **Location**: Partnership section
- **Recommended Size**: 150px x 80px
- **Format**: PNG with transparent background or JPG
- **Replacement Instructions**:
  1. Add partner logo images to `/public/partners/` folder
  2. Update the partnership section in `index.tsx` to use actual partner logos
  3. Replace the placeholder logo.png references with actual partner image paths

### How to Replace Images

1. **For Public Images** (logo.png, lomba.png):
   ```bash
   # Place your new images in the public folder
   cp your-new-logo.png Fe/public/logo.png
   cp your-hero-image.jpg Fe/public/lomba.png
   ```

2. **For SVG Icons**:
   ```tsx
   // Import the SVG icons in your component
   import InstagramIcon from '../assets/IG.svg';
   import WhatsAppIcon from '../assets/WA.svg';
   
   // Use them in JSX
   <img src={InstagramIcon} alt="Instagram" />
   ```

3. **For Partner Logos**:
   ```tsx
   // Create a partners directory and update the partnership section
   <img src="/partners/partner1-logo.png" alt="Partner 1" />
   <img src="/partners/partner2-logo.png" alt="Partner 2" />
   ```

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   cd Fe
   npm install
   ```

2. **Replace Images** (see guide above)

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## 📱 Responsive Design

The website is fully responsive and includes:

- **Mobile Navigation**: Hamburger menu with dropdown support
- **Responsive Typography**: Text sizes adjust for mobile devices
- **Flexible Layouts**: Grid layouts that adapt to screen size
- **Touch-Friendly**: All interactive elements are optimized for touch

## 🎯 Improvements Over Original

This redesigned website offers several improvements over the original SMK Metland website:

1. **Better Navigation**: Cleaner dropdown menus with better organization
2. **Improved Mobile Experience**: Dedicated mobile navigation and responsive design
3. **Enhanced Visual Hierarchy**: Better use of typography and spacing
4. **Modern UI Components**: Updated buttons, cards, and interactive elements
5. **Better Performance**: Optimized code and assets for faster loading
6. **Improved Accessibility**: Better contrast ratios and keyboard navigation

## 📞 Contact Information

The website includes accurate contact information for SMK Metland Cileungsi:

- **Address**: Jl. Kota Taman Metropolitan, Cileungsi Kidul, Kec. Cileungsi, Kabupaten Bogor, Jawa Barat 16820
- **Phone**: (021) 82496976
- **WhatsApp**: +6281293395500
- **Website**: www.smkmetland.net

## 🔧 Technical Details

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Inline styles with responsive design
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📝 Customization

To customize the website for your needs:

1. **Colors**: Update the color scheme in the styles object
2. **Content**: Modify text content in the JSX
3. **Images**: Follow the image replacement guide above
4. **Programs**: Update the program information in the programs section
5. **Contact Info**: Update contact details in the footer

This website provides a solid foundation for any vocational school looking to establish a modern web presence.