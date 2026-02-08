
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
