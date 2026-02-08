import { db } from "./firebase";
import { collection, addDoc, getDocs, limit, query } from "firebase/firestore";

const products = [

/* ================= OILY SKIN ================= */

{
  name: "The Ordinary Niacinamide 10% + Zinc 1%",
  brand: "The Ordinary",
  price: 6.6,
  skinTypes: ["oily"],
  problemIds: ["excessOil", "enlargedPores"],
  actives: { niacinamide: 10, zincPCA: 1 },
  ingredientsList: ["Water", "Niacinamide", "Zinc PCA", "Glycerin"],
  imageUrl: "/the-ordinary-niacinamide.webp"
},

{
  name: "The Ordinary Salicylic Acid 2% Solution",
  brand: "The Ordinary",
  price: 8.69,
  imageUrl: "/the-ordinary-salicylic.webp",
  skinTypes: ["oily"],
  problemIds: ["cloggedPores", "blackheads"],
  actives: { salicylicAcid: 2 },
  ingredientsList: ["Water", "Salicylic Acid", "Glycerin"]
},

{
  name: "The Ordinary Azelaic Acid Suspension 10%",
  brand: "The Ordinary",
  price: 15.8,
  imageUrl: "/the-ordinary-azelaic.webp",
  skinTypes: ["oily"],
  problemIds: ["frequentBreakouts"],
  actives: { azelaicAcid: 10 },
  ingredientsList: ["Azelaic Acid", "Water", "Dimethicone"]
},

{
  name: "Origins Charcoal Mask",
  brand: "Origins",
  price: 36,
  imageUrl: "/origins-charcoal-mask",
  skinTypes: ["oily"],
  problemIds: ["blackheads"],
  actives: { charcoal: 1 },
  ingredientsList: ["Charcoal", "Kaolin", "Water"]
},

{
  name: "Innisfree Green Tea Serum",
  brand: "Innisfree",
  price: 32,
  imageUrl: "/innisfree-green-tea",
  skinTypes: ["oily"],
  problemIds: ["shinyAppearance"],
  actives: { greenTeaExtract: 2 },
  ingredientsList: ["Green Tea Extract", "Water", "Glycerin"]
},

{
  name: "Topicals Faded Serum",
  brand: "Topicals",
  imageUrl: "/topicals-faded.jpg",
  price: 38,
  skinTypes: ["oily"],
  problemIds: ["postAcneMarks"],
  actives: { tranexamicAcid: 3 },
  ingredientsList: ["Tranexamic Acid", "Niacinamide", "Water"]
},

/* ================= MIXED SKIN ================= */

{
  name: "Glow Recipe Niacinamide Dew Drops",
  brand: "Glow Recipe",
  imageUrl: "/glow-recipe-dew-drops.webp",
  price: 50,
  skinTypes: ["mixed"],
  problemIds: ["oilyTzone"],
  actives: { niacinamide: 5 },
  ingredientsList: ["Niacinamide", "Water", "Glycerin"]
},

{
  name: "The Ordinary Hyaluronic Acid 2% + B5",
  brand: "The Ordinary",
  price: 8.9,
  imageUrl: "/the-ordinary-hyaluronic.webp",
  skinTypes: ["mixed", "dry"],
  problemIds: ["dryCheeks", "tightness"],
  actives: { hyaluronicAcid: 2 },
  ingredientsList: ["Hyaluronic Acid", "Panthenol", "Water"]
},

{
  name: "Paula’s Choice Zinc Booster",
  brand: "Paula's Choice",
  price: 49,
  imageUrl: "/paulas-choice-zinc.webp",
  skinTypes: ["mixed"],
  problemIds: ["enlargedPores"],
  actives: { zincPCA: 1 },
  ingredientsList: ["Zinc PCA", "Water"]
},

{
  name: "The Ordinary Alpha Arbutin 2%",
  brand: "The Ordinary",
  price: 10,
  imageUrl: "/the-ordinary-alpha-arbutin.webp",
  skinTypes: ["mixed"],
  problemIds: ["unevenTone"],
  actives: { alphaArbutin: 2 },
  ingredientsList: ["Alpha Arbutin", "Water"]
},

{
  name: "Sunday Riley Vitamin C Serum",
  brand: "Sunday Riley",
  price: 85,
  imageUrl: "/sunday-riley-vitamin-c.webp",
  skinTypes: ["mixed"],
  problemIds: ["dullness"],
  actives: { vitaminC: 15 },
  ingredientsList: ["Vitamin C", "Water"]
},

/* ================= DRY SKIN ================= */

{
  name: "CeraVe Moisturizing Cream",
  brand: "CeraVe",
  price: 18,
  imageUrl: "/cerave-moisturizing.jpg",
  skinTypes: ["dry"],
  problemIds: ["flaking", "barrierDamage"],
  actives: { glycerin: 5, ceramides: 3 },
  ingredientsList: ["Glycerin", "Ceramides", "Water"]
},

{
  name: "Drunk Elephant Protini Cream",
  brand: "Drunk Elephant",
  price: 68,
  imageUrl: "/drunk-elephant-protini.webp",
  skinTypes: ["dry"],
  problemIds: ["fineLines"],
  actives: { peptides: 2 },
  ingredientsList: ["Peptides", "Water"]
},

{
  name: "La Roche-Posay Cicaplast B5",
  brand: "La Roche-Posay",
  price: 15,
  imageUrl: "/lrp-cicaplast.webp",
  skinTypes: ["dry"],
  problemIds: ["irritation"],
  actives: { panthenol: 5 },
  ingredientsList: ["Panthenol", "Water"]
},

{
  name: "The Ordinary Lactic Acid 10%",
  brand: "The Ordinary",
  price: 7,
  imageUrl: "/the-ordinary-lactic.webp",
  skinTypes: ["dry"],
  problemIds: ["roughTexture"],
  actives: { lacticAcid: 10 },
  ingredientsList: ["Lactic Acid", "Water"]
}

];

// export default products;

export async function seedProductsIfEmpty() {
  const productsRef = collection(db, "products");

  // ✅ check if collection already has data
  const existingSnap = await getDocs(query(productsRef, limit(1)));
  if (!existingSnap.empty) {
    console.log("Seeding skipped: products already exist.");
    return;
  }

  for (const p of products) {
    await addDoc(productsRef, p);
  }

  console.log("DONE SEEDING");
}