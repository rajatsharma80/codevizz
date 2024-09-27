This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

Features:
1. Generate JUnit
2. Generate Html page
3. Generate Java code
4. Generate Sequence Diagrams

- Result can be copied, downloaded in html format.

Demo Usecase for Sequence Diagram option

There are 3 modules:
1. Bag
2. Checkout
3. Order Confirm
User adds item to bag and goes to checkout screen to review the order on checkout screen. After reviewing user places the order by clicking on place order button. As soon as the order is placed user is sent to order confirmation screen, displaying message "Order is placed".

- It uses mermaid js to generate the architecture diagrams like sequence diagram.

- Sample of Sequence Diagram instructions returned by OpenAI API

sequenceDiagram
    participant User
    participant Website
    participant ShoppingCart
    participant PaymentGateway
    User->>+Website: Browse Items
    Website-->>-User: Display Item List
    User->>+Website: View Item Details
    Website-->>-User: Display Item Details
    User->>+Website: Add Item to Cart
    Website->>+ShoppingCart: Add Item
    ShoppingCart-->>-Website: Item Added
    User->>+Website: Go to Shopping Cart
    Website->>+ShoppingCart: Get Cart Contents
    ShoppingCart-->>-Website: Cart Contents
    Website-->>-User: Display Cart
    User->>+Website: Proceed to Checkout
    Website-->>-User: Request Shipping and Billing Details
    User->>+Website: Provide Shipping and Billing Details
    Website->>+PaymentGateway: Process Payment
    PaymentGateway-->>-Website: Payment Confirmed
    Website->>+ShoppingCart: Place Order
    ShoppingCart-->>-Website: Order Placed
    Website-->>-User: Order Confirmation
