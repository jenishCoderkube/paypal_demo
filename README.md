# PayPal & Google Pay Demo

A modern React demo showcasing PayPal and Google Pay integration using the official PayPal JavaScript SDK.

## Features

- ✅ PayPal payment integration with official SDK
- ✅ Google Pay button (UI demo)
- ✅ Modern, responsive design
- ✅ Beautiful gradient background
- ✅ Order summary display
- ✅ Loading states and error handling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone or download this project
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## PayPal Setup

### For Production Use

1. **Get PayPal Client ID:**

   - Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
   - Create a PayPal Developer account
   - Create a new app to get your Client ID

2. **Update the Client ID:**
   - Open `src/App.jsx`
   - Replace `'test'` with your actual PayPal Client ID:
   ```javascript
   loadScript({
     "client-id": "YOUR_ACTUAL_CLIENT_ID_HERE", // Replace this
     currency: "USD",
     intent: "capture",
   });
   ```

### Test Mode

The demo currently uses `'test'` as the client ID, which will show PayPal buttons in test mode. For real payments, you must use a valid Client ID.

## Google Pay Integration

The Google Pay button is currently a UI demo. For full Google Pay integration, you would need to:

1. Implement the Google Pay API
2. Set up payment methods
3. Handle payment processing on your backend

## Project Structure

```
src/
├── App.jsx          # Main component with PayPal/Google Pay integration
├── App.css          # Modern styling with responsive design
└── main.jsx         # React entry point
```

## Key Components

### PayPal Integration

- Uses `@paypal/paypal-js` for SDK loading
- Implements PayPal Buttons with order creation and capture
- Handles payment success and error states

### Google Pay Button

- Custom styled button matching Google Pay design guidelines
- Placeholder for actual Google Pay API integration

### Styling

- Modern gradient background
- Glassmorphism design elements
- Responsive layout for all devices
- Smooth animations and hover effects

## Customization

### Changing Payment Amount

Update the amount in the `PayPalButton` component:

```javascript
<PayPalButton
  amount="21.98" // Change this value
  onApprove={handlePayPalPayment}
/>
```

### Styling

The CSS uses modern design principles with:

- CSS Grid and Flexbox for layout
- CSS Custom Properties for theming
- Responsive breakpoints
- Smooth transitions and animations

## Important Notes

1. **Client ID Security:** Never commit your actual PayPal Client ID to version control. Use environment variables in production.

2. **Environment Variables:** For production, create a `.env` file:

   ```
   VITE_PAYPAL_CLIENT_ID=your_client_id_here
   ```

3. **HTTPS Required:** PayPal requires HTTPS in production. Use a service like Vercel, Netlify, or your own SSL certificate.

4. **Backend Integration:** This demo handles frontend only. For production, you'll need a backend to:
   - Validate payments
   - Store order information
   - Handle webhooks

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

### PayPal Button Not Loading

- Check your internet connection
- Verify the Client ID is correct
- Check browser console for errors

### Google Pay Button Issues

- Google Pay requires HTTPS in production
- Some browsers may not support Google Pay

## License

This project is for demonstration purposes. Please ensure compliance with PayPal's and Google's terms of service for production use.

## Support

For PayPal integration issues:

- [PayPal Developer Documentation](https://developer.paypal.com/)
- [PayPal Support](https://www.paypal.com/support/)

For Google Pay integration:

- [Google Pay API Documentation](https://developers.google.com/pay/api)
