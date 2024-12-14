import React,{useEffect,useRef} from "react";
import { useNavigate } from 'react-router-dom';
import petcare from "../assets/petcare.jpg";
import gardening from "../assets/gardening.jpg";
import coding from "../assets/coding.jpg";
import art from "../assets/art.jpg";
import Wellness from "../assets/Wellness.jpg";
import cooking from "../assets/cooking.jpg";
import autocare from "../assets/autocare.jpg";
import Home from "../assets/Home.jpg";
import gsap from "gsap";
import HomeAppliances from "../assets/HomeAppliances.jpg";
import Electronics from "../assets/Electronics.jpg";
import Plumbing from "../assets/Plumbing.jpg";
import Carpentry from "../assets/Carpentry.jpg";

import Composting from "../assets/Composting.jpg";
import GardenMaintain from "../assets/GardenMaintain.jpg";
import LawnCare from "../assets/LawnCare.jpg";
import PlantPropagation from "../assets/PlantPropagation.jpg";

import Interior from "../assets/Interior.jpg";
import FurnitureAssembly from "../assets/FurnitureAssembly.jpg";
import KitchenUpgrades from "../assets/KitchenUpgrades.jpg";
import Outdoor from "../assets/Outdoor.jpg";

import PetGrooming from "../assets/PetGrooming.jpg";
import PetHealth from "../assets/PetHealth.jpg";
import PetNutrition from "../assets/PetNutrition.jpg";
import PetExercise from "../assets/PetExercise.jpg";

import SubjectTutor from "../assets/Subject-Tutor.jpg";
import TestTutor from "../assets/TestTutor.jpg";
import ResearchTutor from "../assets/ResearchTutor.jpg";
import SoftSkill from "../assets/SoftSkill.jpg";

import Drawing from "../assets/Drawing.jpg";
import Pottery from "../assets/Pottery.jpg";
import Sewing from "../assets/Sewing.jpg";
import Crafting from "../assets/Crafting.jpg";

import Fitness from "../assets/Fitness.jpg";
import MentalHealth from "../assets/MentalHealth.jpg";
import Diet from "../assets/Diet.jpg";
import Lifestyle from "../assets/Lifestyle.jpg";

import Vegetarian from "../assets/Vegetarian.jpg";
import Dessert from "../assets/Dessert.jpg";
import Alternative from "../assets/Alternative.jpg";
import LowCalorie from "../assets/LowCalorie.jpg";

const categories = [
  {
    title: "DIY Repairs",
    image: autocare,
    icon: "🛞",
    subcategories : [
      { title: "Home Appliances", image: HomeAppliances,icon:"🛋️" },
      { title: "Electronics", image: Electronics,icon:"📱" },
      { title: "Plumbing", image: Plumbing ,icon:"🚰"},
      { title: "Carpentry", image: Carpentry,icon:"🪚" }
    ]
  },
  {
    title: "Gardening",
    image: gardening,
    icon: "🌳",
    subcategories : [
      { title: "Composting & Waste Management", image: Composting,icon:"♻️" },
      { title: "Garden Maintenance", image: GardenMaintain,icon:"🧑‍🌾"},
      { title: "Lawn Care", image: LawnCare,icon:"🪴"},
      { title: "Plant Propagation", image:PlantPropagation,icon:"🌾"}
    ]
  },
  {
    title: "Pet Care",
    image: petcare,
    icon: "🐶",
    subcategories : [
      { title: "Pet Grooming", image: PetGrooming,icon:"🐕"},
      { title: "Pet Health Care", image: PetHealth,icon:"💉"},
      { title: "Pet Nutrition", image: PetNutrition,icon:"🥣"},
      { title: "Pet Monitoring & Exercise", image:PetExercise,icon:"🐾"}
    ]
  },
  {
    title: "Home Improvement",
    image: Home,
    icon: "🏠",
    subcategories : [
      { title: "Interior Remodeling", image: Interior,icon:"🖼️"},
      { title: "Furniture Assembly & Repair", image: FurnitureAssembly,icon:"🪑"},
      { title: "Kitchen Upgrades", image: KitchenUpgrades,icon:"🍽️"},
      { title: "Outdoor Improvements", image:Outdoor,icon:"🚜"}
    ]
  },
  {
    title: "Study Assistance",
    image: coding,
    icon: "💻",
    subcategories : [
      { title: "Subject-Specific Tutoring", image:SubjectTutor,icon:"🧑‍🏫"},
      { title: "Test Preparation", image: TestTutor,icon:"📝"},
      { title: "Research Assistance", image: ResearchTutor,icon:"📚"},
      { title: "Soft Skills", image:SoftSkill,icon:"🗣️"}
    ]
  },
  {
    title: "Creative Arts & Crafts",
    image: art,
    icon: "🎨",
    subcategories : [
      { title: "Drawing, Sketching & Painting", image: Drawing,icon:"🎨"},
      { title: "Sculpting, Modeling & Pottery", image: Pottery,icon:"🏺"},
      { title: "Textile Arts & Sewing", image: Sewing,icon:"🧵"},
      { title: "Paper Crafts", image: Crafting,icon:"📜"}
    ]
  },
  {
    title: "Health & Wellness",
    image: Wellness,
    icon: "🧘",
    subcategories : [
      { title: "Fitness and Exercise", image: Fitness,icon:"🏋️‍♀️"},
      { title: "Mental Health & Well-Being", image: MentalHealth,icon:"💆‍♀️"},
      { title: "Nutrition and Diet", image: Diet,icon:"🥦"},
      { title: "Healthy Lifestyle Coaching", image:Lifestyle,icon:"🍹"}
    ]
  },
  {
    title: "Cooking & Baking",
    image: cooking,
    icon: "🍴",
    subcategories : [
      { title: "Vegetarian and Vegan Cooking", image:Vegetarian,icon:"🥕"},
      { title: "Beverage or Dessert Making", image: Dessert,icon:"🧁"},
      { title: "Cooking with Alternative Ingredients", image: Alternative,icon:"🥑"},
      { title: "Healthy and Low-Calorie Cooking", image:LowCalorie,icon:"🥗"}
    ]
  },
];

const Categories = () => {
  const navigateTo = useNavigate();
  const categoryRefs = useRef([]);

  const handleCategoryClick = (categoryTitle,categoryParts) => {
    navigateTo('/subcategory', { state: { categoryTitle,categoryParts } });
  };

  useEffect(() => {
    gsap.set(categoryRefs.current, {
        opacity: 0,
        x:-100,
    });
    gsap.to(categoryRefs.current, {  
    opacity: 1,
    x:0,
    duration: 1.5,
    stagger: 0.2,
    ease: 'power3.out',
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 relative">
     
      <div className="flex items-center justify-center mb-8 relative">
        <h2 className="text-2xl font-bold text-center">Popular Categories</h2>

        <button className="absolute right-0 px-4 py-2 border border-black rounded-md text-black hover:bg-gray-100 flex items-center space-x-2">
          <span className="text-lg">View All</span> {/* Set text size for consistency */}
          <span className="text-lg font-bold">{'\u203A'}</span> {/* Match the size of the arrow to the text */}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            ref={(el) => (categoryRefs.current[index] = el)} 
            className="rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
            onClick={() => handleCategoryClick(category.title,category.subcategories)}
          >
            <div className="relative">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-40 object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-white rounded-full w-12 h-12 flex items-center justify-center mx-auto -mb-6 shadow-md">
                <span className="text-2xl">{category.icon}</span>
              </div>
            </div>
            <div className="pt-8 pb-4 text-center">
              <h3 className="font-medium text-lg">{category.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>

    
  );
};

export default Categories;