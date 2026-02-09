Maeve Le
maevele
Online

This is the start of the #file-sharing channel. 
Maeve Le — Yesterday at 3:12 PM
VITE_FIREBASE_API_KEY="AIzaSyAs_YRSLDnZJwip-ZlE-ZxCkzt8u1QjHyk",
VITE_FIREBASE_AUTH_DOMAIN="dermapop-9bb97.firebaseapp.com",
VITE_FIREBASE_PROJECT_ID="dermapop-9bb97",
VITE_FIREBASE_STORAGE_BUCKET="dermapop-9bb97.firebasestorage.app",
VITE_FIREBASE_MESSAGING_SENDER_ID="858081632098",
VITE_FIREBASE_APP_ID="1:858081632098:web:1d413ed3e6bccf30e7163b",
Roxanne — Yesterday at 4:30 PM
Image
Roxanne — Yesterday at 4:43 PM
i cant fix it. tried chatgpt and gemini and started from the beginning but nothing shows on that local webpage...
Maeve Le — Yesterday at 5:07 PM
@tailwind base;
@tailwind components;
@tailwind utilities;
Roxanne — Yesterday at 5:57 PM
Image
Image
Image
Roxanne — Yesterday at 6:17 PM
[#1A2B56]
@Maeve Le
[#F3ECE6]
background
@Maeve Le
Roxanne — Yesterday at 6:53 PM
You’re currently using Tailwind’s default font stack (system sans-serif).
Roxanne — Yesterday at 7:19 PM
Permission to maevelehi/DermaPop.git denied to xguo1001.
Maeve Le — Yesterday at 7:22 PM
https://github.com/maevelehi/DermaPop/invitations
Roxanne — Yesterday at 11:45 PM
https://developer.sephora.com/accounts/create.do
Roxanne — 1:33 AM
xiaoran20220722@gmail.com
Roxanne — 10:58 AM
https://devpost.com/software/1188640/joins/lwc0ZFiLnkmNWu4xHHfpKw
Roxanne — 11:48 AM
## Inspiration
Skincare is an important components of healthcare. Finding skincare products that actually work for individual skin concerns is overwhelming. Ingredient lists are long, marketing claims are confusing, and many people end up buying products that don’t truly address their needs. We wanted to build a tool that simplifies skincare decisions and effectively deal with skin problems by focusing on what really matters: skin type, specific concerns, and effective ingredients.

## What it does
Users select their skin type and common skin problems, and DermaPop filters products accordingly. Each product card clearly shows the product image, brand, active ingredient percentages, and price. When multiple concerns are selected, products are visually labeled to indicate which problem they target. Users can also favorite products and save them to a wishlist.

README.md
3 KB
﻿
## Inspiration
Skincare is an important components of healthcare. Finding skincare products that actually work for individual skin concerns is overwhelming. Ingredient lists are long, marketing claims are confusing, and many people end up buying products that don’t truly address their needs. We wanted to build a tool that simplifies skincare decisions and effectively deal with skin problems by focusing on what really matters: skin type, specific concerns, and effective ingredients.

## What it does
Users select their skin type and common skin problems, and DermaPop filters products accordingly. Each product card clearly shows the product image, brand, active ingredient percentages, and price. When multiple concerns are selected, products are visually labeled to indicate which problem they target. Users can also favorite products and save them to a wishlist.

## How we built it
We built DermaPop using:

• React + JavaScript
• Tailwind CSS
• Firebase Authentication
• Firestore Database
• React Router

The app follows a multi-step workflow:

Landing → Login/Signup → Skin Type → Skin Problems → Product Recommendations

Products are stored in Firestore and dynamically filtered based on:

• Skin type
• Selected problems
• Ingredient relevance

Favorites are saved locally and persist across sessions.

We designed the UI to resemble professional product cards while keeping interactions intuitive and minimal.

## Challenges we ran into
Finding open skincare APIs with ingredient percentages and pricing was extremely difficult. We had to manually structure product data and design our own recommendation logic.

We also faced challenges with:

• Designing multi-problem tagging logic
• Synchronizing frontend workflow with backend data

## Accomplishments that we're proud of
• Built a full end-to-end personalized skincare workflow
• Implemented dynamic filtering and product tagging
• Designed a clean, high-end UI
• Integrated Firebase authentication and database
• Created wishlist functionality
• Structured ingredient-based recommendation logic

## What we learned
We learned how to structure a real-world React app, integrate Firebase authentication and databases, manage application state across routes, and design UX flows that reflect real user needs. We also gained experience working collaboratively on a full-stack project under time constraints.

## What's next for DermaPop
Next, we plan to integrate real product APIs, expand our ingredient database, improve recommendation accuracy, and add advanced filters such as budget ranges and ingredient preferences. Long term, we hope to incorporate AI-powered skin analysis and personalized routines.
README.md
3 KB