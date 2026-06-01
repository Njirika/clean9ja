import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { CheckCircle2, Clock, Star } from 'lucide-react';
import { Seo } from '../components/seo/Seo';
import { SITE_URL } from '../lib/siteContent';

interface Testimonial {
  content: string;
  author: string;
  role: string;
}

interface ServiceData {
  title: string;
  description: string;
  image: string;
  features: string[];
  price: string;
  whyBest: string;
  diyVsClean: {
    diy: string;
    cleanNaija: string;
    why: string;
  };
  testimonials: Testimonial[];
}

const ALL_SERVICES: Record<string, ServiceData> = {
  "full-building-face-lift": {
    title: "Full Building Face-lift",
    description: "Give your home a complete exterior overhaul with our high-pressure restoration cleaning.",
    image: "/images/service-home.jpg",
    features: ["Exterior Wall Scrubbing", "Mold Removal", "Window Detail", "Gutter Polish"],
    price: "From ₦45,000",
    whyBest: "CleanNaija uses advanced technology that reaches into pores. We use surface-safe detergents that protect paint while stripping carbon and mold.",
    diyVsClean: {
      diy: "Garden hose takes hours and only removes surface dust.",
      cleanNaija: "Specialized equipment removes deep stains safely and fast.",
      why: "DIY often leads to zebra striping or accidental paint damage."
    },
    testimonials: [
      { content: "I thought I needed to repaint my entire house which was quoted for over ₦1.2m. CleanNaija's Face-lift service made the original paint look like it was applied yesterday. The mold on the fence and the carbon stains from the generator are completely gone. Saved me a fortune!", author: "Mrs. Olamide Balogun", role: "Homeowner, Ikoyi" },
      { content: "The level of detail during the face-lift was outstanding. They didn't just blast water; they manually scrubbed the stubborn spots and even detailed the window tracks. My house is now the brightest on the street. Truly a professional outfit.", author: "Engr. Tunde", role: "Resident, Lekki" },
      { content: "Excellent coordination. They arrived with their own water supply and a heavy-duty machine that I haven't seen with local contractors. The safety harness they wore while cleaning the upper floors gave me peace of mind. Highly recommended.", author: "Alhaja Sikirat", role: "Property Owner, Surulere" },
      { content: "CleanNaija transformed my commercial building. We had deep grime from years of Lagos traffic pollution. One weekend session and the building looks brand new. Our tenants are impressed!", author: "Mr. Kunle", role: "Facility Mgr, Ikeja" }
    ]
  },
  "interlock-driveway-shine": {
    title: "Interlock & Driveway Shine",
    description: "Transform your compound's stones and driveways. We remove oil spills, weeds, and deep dirt.",
    image: "/images/service-roof.jpg",
    features: ["Oil Stain Treatment", "Pressure Washing", "Re-sanding", "Sealant"],
    price: "From ₦25,000",
    whyBest: "Leaders in stone restoration. We treat oil with industrial degreasers and ensure structural stability through re-sanding.",
    diyVsClean: {
      diy: "Scrubbing rarely touches oil stains or deep-rooted moss.",
      cleanNaija: "High-PSI equipment blasts away 100% of grime instantly.",
      why: "Manual scrubbing spreads oil stains instead of removing them."
    },
    testimonials: [
      { content: "The oil leaks from my old SUV were making my interlocks look terrible. I tried different detergents but nothing worked. CleanNaija used a specialized degreaser that lifted the oil completely. My compound looks pristine now.", author: "Mr. Chukwuma Obi", role: "Estate Resident, Lekki" },
      { content: "I never thought my stones could look this white again. The moss between the stones was out of control, but they blasted everything out and even re-sanded the joints. It looks like a luxury hotel entrance.", author: "Mrs. Nneka", role: "Homeowner, VGC" },
      { content: "They removed weeds that kept coming back no matter how much we pulled them. The treatment they applied after washing has kept the driveway clean for 6 months and counting. Best cleaning investment so far.", author: "Capt. Ibrahim", role: "Resident, Abuja" },
      { content: "Fast, efficient, and they cleaned up the mess they made during the process. Usually, when people wash interlocks, the whole street gets muddy, but CleanNaija managed the runoff perfectly.", author: "Ms. Funmi", role: "Property Manager, Lagos" }
    ]
  },
  "roof-parapet-washing": {
    title: "Roof & Parapet Washing",
    description: "Professional roof cleaning to remove moss and streaks safely.",
    image: "/images/service-roof.jpg",
    features: ["Safety Harness", "Non-Abrasive", "Gutter Wash", "Algae Prevention"],
    price: "From ₦40,000",
    whyBest: "Technicians trained in high-altitude safety. Soft-wash techniques won't crack tiles or damage parapets.",
    diyVsClean: {
      diy: "Climbing a ladder with a bucket is dangerous and inefficient.",
      cleanNaija: "Professional safety rigs and telescopic cleaners ensure a 100% clean finish.",
      why: "Falling is a critical risk. Professional equipment ensures safety and results."
    },
    testimonials: [
      { content: "The roof went from a dirty black to its original vibrant red in just a few hours. I sat downstairs and watched them work with professional safety rigs. No drama, just results. My neighbors are already asking for their number.", author: "Alhaji Musa", role: "Property Manager, Abuja" },
      { content: "No more leaking parapets! During the cleaning, they identified some cracks that we fixed early. The water now flows perfectly through the channels they cleared. A very thorough preventive maintenance service.", author: "Arch. Jude", role: "Consultant, Ikeja" },
      { content: "The safety standards they followed were impressive. I was worried about workers falling, but they used harnesses and proper ladders. They respected my property and didn't break a single tile. Exceptional.", author: "Mrs. Adeyemi", role: "Homeowner, Ikoyi" },
      { content: "CleanNaija roof wash saved our school building. The mold was making the place look abandoned. Now it looks fresh and welcoming for the students. Worth every kobo of the cost.", author: "Mr. Benson", role: "School Admin, PH" }
    ]
  },
  "low-pressure-soft-wash": {
    title: "Low-Pressure Soft Wash",
    description: "Ideal for delicate surfaces. Specialized chemicals lift dirt gently.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2959213?auto=format&fit=crop&q=80&w=1200",
    features: ["Safe for Paint", "Eco Chemicals", "Sanitization", "Gentle Rinse"],
    price: "From ₦20,000",
    whyBest: "Pioneered the Soft Wash method in Nigeria. Chemical-led approach dissolves dirt without physical force.",
    diyVsClean: {
      diy: "High pressure from a standard machine can chip expensive paint or wood.",
      cleanNaija: "Safe breakdown of grime without physical asset damage.",
      why: "Preserving assets is as important as cleaning them. Soft washing is smarter."
    },
    testimonials: [
      { content: "I was worried about the pressure on my wooden pergola, but their soft wash technique was perfect. No splinters, no peeling paint, just deep cleanliness. The wood looks rich and treated. Great tech!", author: "Engr. David", role: "Villa Owner, Victoria Island" },
      { content: "Perfect for my expensive painted exterior. I've had issues before with pressure washers stripping the paint, but CleanNaija's chemical application was gentle yet removed all the stains. Very satisfied.", author: "Ms. Joy", role: "Artist, Yaba" },
      { content: "The eco-friendly chemicals they used didn't harm my garden plants at all. I was skeptical at first, but the results speak for themselves. The walls are sparkling white and my flowers are fine.", author: "Mrs. Okafor", role: "Garden Enthusiast, Enugu" },
      { content: "Finally found a service that understands different surface needs. They used high pressure for the concrete but soft wash for the siding and windows. This is the expertise we need in Nigeria.", author: "Chief Williams", role: "Business Owner, Lagos" }
    ]
  },
  "annual-estate-power-wash": {
    title: "Annual Estate Power Wash",
    description: "Yearly maintenance for large properties to keep compounds in pristine condition.",
    image: "/images/service-home.jpg",
    features: ["Compound Wash", "Fence & Gate", "Security Post", "Common Areas"],
    price: "From ₦150,000",
    whyBest: "We deploy a 'Rapid Force' team to clean entire facilities in 48 hours or less, minimizing disruption.",
    diyVsClean: {
      diy: "Maintenance staff lack the machinery for large scale deep cleaning.",
      cleanNaija: "Machinery covers 1,000sqm in the time a person does 50sqm.",
      why: "Speed and scale are critical for large properties."
    },
    testimonials: [
      { content: "The residents were amazed at the transformation of our estate common areas. CleanNaija came with a massive team and heavy equipment. They finished the whole place in two days. Truly professional grade.", author: "Chief Emeka", role: "Magodo Estate Chair" },
      { content: "Our facility maintenance used to take weeks and was never this clean. CleanNaija's annual wash is now a fixed item in our budget. It keeps the property value high and the residents happy. Top notch!", author: "Mr. Segun", role: "Facility Head, Lekki" },
      { content: "Value for money. They even cleaned the security posts and the complex drainage system. The entire environment feels premium and healthy again. A very reliable corporate partner.", author: "Mrs. Bello", role: "Resident, Abuja" },
      { content: "The coordination with our internal security was seamless. They worked through the night to ensure the entrance was ready for morning traffic. High level of discipline in their staff.", author: "Alhaji Gidado", role: "Estate Manager, Kano" }
    ]
  },
  "fence-stonework-washing": {
    title: "Fence & Stonework Washing",
    description: "Restore your perimeter from Nigerian dust and humidity stains.",
    image: "https://images.unsplash.com/photo-1590059132213-f9361664188b?auto=format&fit=crop&q=80&w=1200",
    features: ["Stone Polish", "Brick Deep Clean", "Gate Polish", "Boundary Wall"],
    price: "From ₦15,000",
    whyBest: "Specialized masonry cleaners penetrate deep to lift stubborn Nigerian dust stains that soap misses.",
    diyVsClean: {
      diy: "Laundry soap leaves residue and doesn't remove moss.",
      cleanNaija: "pH-balanced stone cleaners restore natural masonry color.",
      why: "Incorrect chemicals can permanently discolor natural stone."
    },
    testimonials: [
      { content: "Our stone wall was covered in years of Lagos dust and green algae. CleanNaija's stone treatment restored the original bright color I thought was gone forever. It's like a brand new fence.", author: "Tunde Williams", role: "Surulere" },
      { content: "They removed the black streaks from our perimeter walls easily. The staff were very respectful of my privacy and worked very quietly. The finish is very even, no striping at all. Excellent work.", author: "Ms. Ada", role: "Homeowner, Ajah" },
      { content: "The gate polishing they did as part of the service is a great touch. Most people just wash, but they ensured the metalwork was shining too. It makes a huge difference to the overall look.", author: "Mr. Ifeanyi", role: "Resident, PH" },
      { content: "Quick and very neat. They protected my lawn while washing the stone path. No chemicals spilled on my plants, just pure cleanliness on the stones. Very impressive and careful team.", author: "Mrs. Kazeem", role: "Homeowner, Ibadan" }
    ]
  },
  "veranda-deck-care": {
    title: "Veranda & Deck Care",
    description: "Sanitize and polish outdoor relaxation areas to perfection.",
    image: "https://images.unsplash.com/photo-1595505335904-74c0a525d6b4?auto=format&fit=crop&q=80&w=1200",
    features: ["Wood Treatment", "Tile Scrubbing", "Railings", "Furniture Polish"],
    price: "From ₦10,000",
    whyBest: "Our service applies a protective 'Shine Layer' that repels dust and water, keeping areas usable for longer in Nigeria's dust.",
    diyVsClean: {
      diy: "Mops just move dust around in outdoor spaces.",
      cleanNaija: "High-flow rinsing and vacuum extraction actually removes dust.",
      why: "True cleanliness in dust requires industrial extraction."
    },
    testimonials: [
      { content: "Finally I can sit on my balcony without getting dusty clothes. The 'dust-repellent' layer they mentioned actually works. Even after a minor harmattan dust, a simple wipe and it was clean again.", author: "Simi Ade", role: "Yaba" },
      { content: "The tiles in my veranda are glowing. They used a specialized scrubber that got into the grout lines. It's now my favorite place to have my morning coffee. CleanNaija is really different.", author: "Mr. Abayomi", role: "Resident, Ikeja" },
      { content: "They even cleaned the outdoor furniture and the ceiling fans on the porch. I didn't have to ask, they just saw it needed doing and did it. Exceptional attention to detail for the price.", author: "Ms. Zara", role: "Designer, Lagos" },
      { content: "Reliable and fast. I booked them for a Friday evening prep, and they were done before my guests arrived. The veranda looked spectacular under the evening lights. Highly recommend.", author: "Mr. Daniel", role: "Homeowner, Lekki" }
    ]
  },
  "gutter-de-clogging": {
    title: "Gutter De-clogging",
    description: "Essential maintenance to prevent flooding and roof damage with debris removal.",
    image: "/images/service-roof.jpg",
    features: ["Debris Removal", "Downspout Clear", "Flow Test", "Leak Audit"],
    price: "From ₦8,000",
    whyBest: "We flush downspouts and check for structural leaks, providing photo evidence of a clear path.",
    diyVsClean: {
      diy: "Hand cleaning is slow, messy, and misses deep blockages.",
      cleanNaija: "Gutter vacuums and high-pressure flushers for total clear.",
      why: "Hidden blockages are the #1 cause of roof leaks."
    },
    testimonials: [
      { content: "No more flooding in my yard since they cleared it. They removed bags of sand and plastic that I didn't even know were up there. My roof pipes flow perfectly now. Worth every kobo during the rains.", author: "John Doe", role: "Port Harcourt" },
      { content: "Professional team. They used a camera to show me the inside of the gutters before and after. I was shocked at the blockage! Now I feel safe whenever the clouds gather. Great peace of mind.", author: "Engr. Sam", role: "Property Owner, VI" },
      { content: "The best gutter service I've ever used in Lagos. They didn't just dump the dirt on my compound; they bagged it and took it away. Very neat and professional process from start to finish.", author: "Mrs. Janet", role: "Resident, Gbagada" },
      { content: "Quick and efficient. No more stagnant water on my roof that was attracting mosquitoes. They even identified a small crack in the gutter that I fixed before it caused a major leak inside.", author: "Mr. Kola", role: "Homeowner, Ikeja" }
    ]
  },
  "drainage-gutter-wash": {
    title: "Drainage & Gutter Wash",
    description: "Deep clean of gutters and drains to prevent odors and pests.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200",
    features: ["Inside Scrub", "Flushing", "Sanitization", "Pest Repellent"],
    price: "From ₦12,000",
    whyBest: "Sanitize using safe disinfectants that kill mosquito larvae and remove foul odors common in urban areas.",
    diyVsClean: {
      diy: "Scooping mud is only half the job; bacteria remains.",
      cleanNaija: "Sanitize and deodorize entire systems for health.",
      why: "Odor control requires professional-grade sanitizers."
    },
    testimonials: [
      { content: "The smell from our open drain was gone instantly. They flushed it with some specialized sanitizer that made the whole area smell fresh. My family can finally use the front yard comfortably.", author: "Mrs. Eze", role: "Enugu" },
      { content: "The drainage looks cleaner than the day it was built. They even scrubbed the sides to remove the slime. No more mosquitoes breeding in our compound. A truly essential health service for Lagos.", author: "Mr. Ahmed", role: "Resident, Kaduna" },
      { content: "They removed everything blocking the flow, including hardened concrete from a previous renovation. Very clean job and very hard working team. I will be using them every quarter now.", author: "Ms. Bola", role: "Business Owner, Lagos" },
      { content: "Highly professional service. They managed the water runoff perfectly so it didn't flood my neighbor's yard. They have specialized tools that local guys just don't have. Very satisfied.", author: "Alhaji Saliu", role: "Resident, Abuja" }
    ]
  },
  "home-maintenance-review": {
    title: "Home Maintenance Review",
    description: "Inspection to identify issues before they become expensive repairs.",
    image: "/images/service-home.jpg",
    features: ["Integrity Check", "Leak Audit", "Mildew Check", "Action Plan"],
    price: "From ₦15,000",
    whyBest: "Maintenance pros act as 'Detectives,' finding leaks and cracks that save millions in repairs.",
    diyVsClean: {
      diy: "Most homeowners only notice problems when ceilings leak.",
      cleanNaija: "Find issues before they manifest as visible damage.",
      why: "Professional eyes know where to look. We prevent disasters."
    },
    testimonials: [
      { content: "Found a small leak I never would have seen. Archive Segun told me it would have collapsed my POP ceiling in a few months. Saved me at least ₦200k in repairs. This service is a lifesaver.", author: "Arch. Segun", role: "Ibadan" },
      { content: "Detailed report helped us plan our renovations perfectly. They even checked the electrical panels for dust and the AC drains for blockages. It's a complete health check for your house. Brilliant!", author: "Mrs. Fatima", role: "Homeowner, Abuja" },
      { content: "The pros know their stuff. Very informative session where they explained what signs to look for. I feel more confident about my property's condition now. Every landlord should do this.", author: "Engr. Chris", role: "Resident, PH" },
      { content: "A must-have service for every luxury property owner. It's like having a project manager for your home maintenance. They found issues my regular maintenance guy missed completely.", author: "Chief Mike", role: "Business Owner, Lagos" }
    ]
  },
  "festive-decor-installation": {
    title: "Festive Decor Installation",
    description: "Professional holiday light setups. Safe, neat, and stunning.",
    image: "/images/service-specialty.jpg",
    features: ["Custom Plan", "Power Management", "Removal", "Equipment"],
    price: "From ₦35,000",
    whyBest: "Installers use weather-proof lighting and ensure balanced electrical loads for safety. No tangled wires.",
    diyVsClean: {
      diy: "Tangled wires and unstable ladders lead to accidents.",
      cleanNaija: "Neat, professional, and electrically safe installations.",
      why: "Electrical fires are real risks. We ensure safety first."
    },
    testimonials: [
      { content: "House looked like a wonderland. The installation was so neat that you couldn't see any wires during the day. The lights stayed on even during heavy rain. Neat and fast takedown too.", author: "Adeleke Family", role: "Banana Island" },
      { content: "The lighting design was so creative. My kids loved it and we were the talk of the neighborhood. They handled the power supply perfectly with no trips on our inverter. Very smart team.", author: "Ms. Sandra", role: "Resident, Lekki" },
      { content: "Zero stress. They handled everything from setup to removal in January. I didn't have to lift a finger or climb a single ladder. Worth every kobo for the joy it brought my family.", author: "Mr. Obi", role: "Homeowner, VGC" },
      { content: "Very high safety standards. I was worried about the load on our generator, but they did a proper load balance calculation. I felt comfortable and safe with their professional approach.", author: "Mrs. Shola", role: "Resident, Surulere" }
    ]
  },
  "standard-home-shine": {
    title: "Standard Home Shine",
    description: "Regular cleaning for a healthy environment weekly or bi-weekly.",
    image: "/images/service-home.jpg",
    features: ["Mopping", "Dusting", "Bathroom", "Kitchen Counter"],
    price: "From ₦15,000",
    whyBest: "Trained in cross-contamination prevention using premium products for a clinical-level standard.",
    diyVsClean: {
      diy: "Domestic help often lacks formal sanitation training.",
      cleanNaija: "Certified hygiene experts with high-quality equipment.",
      why: "True sanitation prevents illness. We provide medical-level standards."
    },
    testimonials: [
      { content: "The only service in Lagos that is consistently on time and thorough. My floors have never been this clean without me having to shout or supervise. They just know what to do and they do it well.", author: "Dr. Amaka", role: "Lekki" },
      { content: "The staff are so respectful and professional. I trust them completely in my home even when I'm at work. The house always smells amazing when I return. Best cleaning outfit in Lagos.", author: "Mr. Gabriel", role: "Resident, Yaba" },
      { content: "My kitchen counters have never been this clean. They even polished the stainless steel appliances. It's the small touches that make CleanNaija different from the random people I used to hire.", author: "Ms. Ife", role: "Homeowner, Magodo" },
      { content: "Reliable weekly cleaning. I don't have to monitor them at all. They bring their own vacuum and specialized mops. It's a proper high-tech cleaning service for a modern home.", author: "Mrs. Peters", role: "Exec, Lagos" }
    ]
  },
  "deep-restoration-clean": {
    title: "Deep Restoration Clean",
    description: "Intensive sanitization for total renewal of your living space.",
    image: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=1200",
    features: ["Cabinets", "Wall Spots", "Degreasing", "Upholstery"],
    price: "From ₦35,000",
    whyBest: "Multi-person crews with specialized steamers and industrial degreasers remove all biological buildup.",
    diyVsClean: {
      diy: "Getting into cabinets and scrubbing walls takes days.",
      cleanNaija: "One-day operation using professional grade tools.",
      why: "Deep cleaning requires chemicals not found in supermarkets."
    },
    testimonials: [
      { content: "CleanNaija restored my mess of a rental to pristine condition in 8 hours. The previous tenants left grease on the kitchen walls and mold in the shower. I thought I'd have to renovate, but they saved it!", author: "Mr. Festus", role: "Landlord, Gbagada" },
      { content: "The team was like a specialized army. They arrived with steam machines and scrubbers. Every corner of my house is now clinical. I feel so much safer and happier in my space now. Incredible result.", author: "Ms. Kemi", role: "Entrepreneur, Ikeja" },
      { content: "Everything smells and looks brand new. They even cleaned the window screens and the AC vents. Amazing value for money when you consider the amount of work they did in one day.", author: "Mr. Chinedu", role: "Homeowner, PH" },
      { content: "Highly thorough. They even cleaned behind the fridge and under the beds. My allergies have completely disappeared since they did the deep restoration. This is more than just cleaning; it's health care.", author: "Mrs. Amina", role: "Resident, Abuja" }
    ]
  },
  "professional-fumigation": {
    title: "Professional Fumigation",
    description: " Pest control using NAFDAC-approved, low-toxicity formulas.",
    image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=1200",
    features: ["Safe Chemicals", "Indoor/Outdoor", "Larvaciding", "Baiting"],
    price: "From ₦25,000",
    whyBest: "Eliminate nests while keeping families safe from toxins. find breeding grounds and end them.",
    diyVsClean: {
      diy: "Shop sprays only kill the bugs you see.",
      cleanNaija: "Eliminate nests and provide long-lasting barriers.",
      why: "Control requires professional knowledge of insect biology."
    },
    testimonials: [
      { content: "No more cockroaches! The team was very professional and explained the safety precautions before they started. The smell was gone in two hours and the results have lasted for months. Best in the business.", author: "Bisi A.", role: "Ikeja" },
      { content: "Finally a service that actually kills the mosquitoes. We used to struggle every night, but since CleanNaija treated the compound and the drains, we've had peaceful sleep. It's worth every kobo.", author: "Mr. Okoro", role: "Resident, Lekki" },
      { content: "Safe for my pets. That was my biggest concern, but they used a pet-friendly formula that worked perfectly. I didn't see any residue and my dogs were fine. Very professional and careful service.", author: "Ms. Linda", role: "Homeowner, VI" },
      { content: "Effective and fast. Highly recommended pest control. They found a massive termite nest under our porch that we never would have seen. They saved our wooden structures from total destruction.", author: "Alhaji Usman", role: "Resident, Kano" }
    ]
  },
  "corporate-fleet-maintenance": {
    title: "Corporate Fleet Maintenance",
    description: "On-site fleet washing for buses and cars to protect your image.",
    image: "/images/service-fleet.jpg",
    features: ["On-site Mobile", "Bulk Discount", "Eco Soap", "Detail Shine"],
    price: "Custom Quote",
    whyBest: "Mobile units come to your yard during off-hours, ensuring brand is sparkling every morning.",
    diyVsClean: {
      diy: "Drivers washing vans leads to poor quality and wasted time.",
      cleanNaija: "Professional finishes that preserve vehicle paint.",
      why: "Outsourcing saves staff costs and ensures superior image."
    },
    testimonials: [
      { content: "On-site service is convenient and our fleet always looks clean. They come to our yard every Sunday night, and on Monday morning, all 20 vans are ready to represent our brand with pride. Exceptional service.", author: "Logistics Manager", role: "Top E-commerce Brand" },
      { content: "Great management of our 50+ staff buses. Very efficient team that doesn't waste water. The 'eco-shine' soap they use makes the buses look new without damaging the branding stickers. A reliable partner.", author: "Operations Head", role: "Corporate Firm" },
      { content: "Consistent quality across all our locations in Nigeria. Whether in Lagos or Port Harcourt, the CleanNaija standard is the same. Their reporting system with photos is great for our records.", author: "Supply Chain Lead", role: "FMCG Company" },
      { content: "Affordable and reliable fleet maintenance partner. We saved a lot on staff overtime costs because we no longer have to manage the cleaning internally. They just get the job done without supervision.", author: "CEO", role: "Delivery Startup" }
    ]
  },
  "office-workspace-hygiene": {
    title: "Office & Workspace Hygiene",
    description: "Tailored janitorial services focusing on productivity and health.",
    image: "/images/service-office.jpg",
    features: ["IT Dusting", "Buffing", "Sanitized Restrooms", "Glass"],
    price: "From ₦50,000",
    whyBest: "Understand corporate etiquette. Use hospital-grade disinfectants on high-touch surfaces discreetly.",
    diyVsClean: {
      diy: "Standard cleaners often miss keyboards and handles.",
      cleanNaija: "Sanitize high-touch points to reduce sick days.",
      why: "Workplace hygiene is a health strategy."
    },
    testimonials: [
      { content: "Staff noticed immediately. The office feels fresh and the restrooms are finally clinical-standard. The team is very discreet and doesn't disturb our work. This is exactly what we were looking for.", author: "Operations Lead", role: "Fintech Hub" },
      { content: "Their night shift team is a game changer for us. We arrive at a perfect office every morning. The attention to IT equipment cleaning is particularly impressive. They really know how to handle electronics.", author: "Admin Manager", role: "Law Firm, VI" },
      { content: "Professional, vetted, and very reliable staff. We've tried many agencies, but CleanNaija's supervision is what makes the difference. There's always a manager checking the quality of work. Highly recommended.", author: "HR Director", role: "Tech Company, Lagos" },
      { content: "Best office cleaning service we've used in years. They helped reduce the dust and the 'stale air' smell we used to have. The carpet restoration they did last month was also spectacular. Five stars!", author: "Chief Ops", role: "Bank Branch" }
    ]
  },
  "restaurant-eatery-cleaning": {
    title: "Restaurant & Eatery Cleaning",
    description: "Food-grade sanitization ensuring NAFDAC compliance for kitchens.",
    image: "https://images.unsplash.com/photo-1550966841-396ad886fe5c?auto=format&fit=crop&q=80&w=1200",
    features: ["Hood Degrease", "Floor Polishing", "Sanitization", "Pest Control"],
    price: "Custom Quote",
    whyBest: "Crews trained in health requirements. Provide 'Certificate of Sanitization' after every clean.",
    diyVsClean: {
      diy: "Staff are tired after shifts and skip deep-cleaning.",
      cleanNaija: "Night-crews tackle heavy grime while team rests.",
      why: "Industrial degreasers safely remove commercial grease."
    },
    testimonials: [
      { content: "Passed our latest health inspection with flying colors. The deep clean of the grease traps and the hood was exceptional. No more oily smells in the dining area. CleanNaija is our secret health weapon.", author: "Executive Chef", role: "Bistro in VI" },
      { content: "The kitchen is sparkling before our morning prep starts. They work through the night with high-pressure steamers that remove grime from under the heavy stoves. Our staff are much happier working in a clean space.", author: "Manager", role: "Fast Food Chain" },
      { content: "Great attention to hood cleaning and grease removal. They even provided a report on the condition of our extraction fans. Very helpful for our maintenance planning. A truly professional food-industry service.", author: "Owner", role: "Gourmet Kitchen" },
      { content: "Reliable sanitization that keeps our customers safe. We've had zero pest issues since we started the CleanNaija integrated cleaning and fumigation plan. They understand the food business perfectly.", author: "Director", role: "Restaurant Group" }
    ]
  },
  "shop-front-signage-shine": {
    title: "Shop Front & Signage Shine",
    description: "Attract customers with streak-free glass and sparkling entryways.",
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=1200",
    features: ["Glass Polish", "Signage Dusting", "Entrance Mat", "Pressure Wash"],
    price: "From ₦20,000",
    whyBest: "De-ionized water ensures inviting entrances that boost your brand trust.",
    diyVsClean: {
      diy: "Wiping with newspaper leaves streaks visible in sun.",
      cleanNaija: "Professional squeegee ensures perfect clarity.",
      why: "A professional storefront increases foot traffic."
    },
    testimonials: [
      { content: "Store looks so much more inviting. The signage clean was particularly impressive—they removed years of bird droppings and dust that we couldn't reach. Our brand identity is finally clear again.", author: "Store Manager", role: "Luxury Retailer" },
      { content: "We noticed more customers stopping by after the clean. The glass is so clear that people think it's open space! It makes our window displays look 10x better. CleanNaija really knows their glass work.", author: "Brand Manager", role: "Boutique, VI" },
      { content: "Streak-free glass every time. We used to struggle with workers leaving soap marks, but CleanNaija's de-ionized water system is a game changer. The entrance looks world-class now. Excellent work.", author: "Sales Lead", role: "Showroom, Lagos" },
      { content: "Highly recommend for anyone in high-end retail. They are quick, efficient, and they don't block the pavement for too long. A very considerate and professional team that respects our business hours.", author: "Ms. Cynthia", role: "Business Owner" }
    ]
  },
  "reception-lobby-detail": {
    title: "Reception & Lobby Detail",
    description: "Ensuring reception reflects excellence through high-gloss maintenance.",
    image: "https://images.unsplash.com/photo-1600585154526-990dce462151?auto=format&fit=crop&q=80&w=1200",
    features: ["Floor Honing", "Furniture Polish", "Art Care", "Sanitization"],
    price: "From ₦30,000",
    whyBest: "Specialize in expensive marble and art, maintaining 5-star feels for visitors.",
    diyVsClean: {
      diy: "Standard mopping leads to dull marble over time.",
      cleanNaija: "High-speed buffing and specialized cleaners maintain shine.",
      why: "Expensive stone requires technical care to prevent dulling."
    },
    testimonials: [
      { content: "Marble is glowing again! Our lobby has never looked better. Visitors often comment on how clean and bright the place feels. It really elevates our brand from the moment you step in. Brilliant service.", author: "Admin Manager", role: "Corporate HQ" },
      { content: "Impressive attention to art pieces and high-end furniture. They don't just 'wipe' everything; they use the right polish for wood, leather, and metal. The lobby looks like it was just professionally staged.", author: "Facilities Lead", role: "Oil & Gas Firm" },
      { content: "The lobby reflects our professional standards perfectly now. The glass entrance and the marble floors are flawless. It gives our clients confidence in our attention to detail as a firm. Great job, CleanNaija!", author: "MD", role: "Investment Bank" },
      { content: "Quick and discreet service during off-hours. They managed to restore the shine to our high-traffic zones without any downtime for our receptionists. A very smooth and professional operation.", author: "Concierge", role: "Luxury Plaza" }
    ]
  },
  "estate-block-maintenance": {
    title: "Estate & Block Maintenance",
    description: "Managed cleaning for common areas with consistent high standards.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200",
    features: ["Mopping", "Stairwells", "Security Post", "Waste Audit"],
    price: "Custom Quote",
    whyBest: "Unified cleaning standard with dedicated supervisors and resident portal.",
    diyVsClean: {
      diy: "Hiring individual cleaners leads to inconsistent quality.",
      cleanNaija: "Managed service that increases property value.",
      why: "Consistency is key to luxury property maintenance."
    },
    testimonials: [
      { content: "Property value improved since CleanNaija took over the maintenance. The stairwells and the parking lots are always clean. Their supervisor is very proactive and fixes issues before residents even notice them.", author: "Developer", role: "Lekki Phase 1" },
      { content: "Finally, a company that actually mops the stairwells properly. No more dust in the corners or smelly elevators. The residents feel they are getting true value for their service charge now. Thank you!", author: "Resident", role: "Luxury Apartment" },
      { content: "Professional management that residents actually trust. Their staff are always in uniform and carry proper ID. It makes the estate feel more secure and organized. A very high-end cleaning management service.", author: "Estate Chairman", role: "VGC" },
      { content: "Efficient waste handling and common area mopping. They managed to clear the backlog of dirt in the drainage system that was causing issues during the rain. The whole block feels fresh and maintained.", author: "Facility Mgr", role: "Abuja Heights" }
    ]
  },
  "community-area-care": {
    title: "Community Area Care",
    description: "Sanitization for facilities like gyms and pool decks.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200",
    features: ["Gym Wipe-down", "Clubhouse Detail", "Pool Wash", "Changing Rooms"],
    price: "From ₦50,000",
    whyBest: "Disinfectants designed for high-perspiration areas and non-slip treatments.",
    diyVsClean: {
      diy: "Standard cleaners often ignore deep gym sanitization.",
      cleanNaija: "Ensure shared spaces are safe hotspots for health.",
      why: "Health safety in shared spaces is specialized."
    },
    testimonials: [
      { content: "Gym feels cleaner and safer to use. The equipment isn't sticky anymore and the changing rooms smell like a spa. Our community members have noticed the difference and are using the facilities more often.", author: "Resident Association", role: "Premium Estate" },
      { content: "The pool deck is finally algae-free and safe for kids. We used to have slips all the time, but CleanNaija's treatment removed the slime without damaging the stones. It looks and feels much safer now.", author: "Mother", role: "Estate Resident" },
      { content: "Clubhouse is ready for events anytime. They do a deep restore after every party, ensuring the next resident gets a perfect space. Their reliability makes our event planning so much easier. Five stars!", author: "Manager", role: "Social Club" },
      { content: "Deep sanitization of changing rooms was our top priority and CleanNaija delivered. No more mildew smells or damp corners. They really know how to handle high-moisture environments. Great service.", author: "Gym Owner", role: "Lagos Hub" }
    ]
  },
  "elderly-home-sanitization": {
    title: "Elderly Home Sanitization",
    description: "Medical-grade cleaning focusing on disinfection and allergens.",
    image: "/images/service-hospital.jpg",
    features: ["HEPA Vacuum", "Bio-Sanitization", "Odor-free", "Protocol"],
    price: "Custom Quote",
    whyBest: "Protocol uses non-toxic products and HEPA filtration to protect lungs.",
    diyVsClean: {
      diy: "Standard cleaners use products unsafe for seniors.",
      cleanNaija: "Medical-first approach for clinical disinfection.",
      why: "Protecting vulnerable populations requires knowledge."
    },
    testimonials: [
      { content: "The care and attention given to our facility was outstanding. They used non-toxic products that didn't affect our residents' breathing. The air feels cleaner and the whole home is much brighter. Truly professional.", author: "Facility Director", role: "Lagos Senior Home" },
      { content: "Staff are so gentle and thorough in sensitive areas. They followed our infection control protocols perfectly. We've seen a decrease in flu cases since we started the deep sanitization schedule with CleanNaija.", author: "Nurse", role: "Care Facility" },
      { content: "The air quality improved noticeably after the clean. No more 'old building' smell. My father says he sleeps better now. It's heartening to see a company that truly cares about the health of the elderly.", author: "Relative", role: "Resident's Family" },
      { content: "Best clinical-grade service for non-hospital facilities. They understand cross-contamination better than any other agency we've worked with. The supervision was constant and very helpful. Top class!", author: "Director", role: "Abuja Care" }
    ]
  },
  "hotel-resort-maintenance": {
    title: "Hotel & Resort Maintenance",
    description: "Hospitality-standard restoration for carpets and kitchens.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200",
    features: ["Linen", "Turn-down Prep", "Poolside", "Kitchen Deep"],
    price: "Custom Quote",
    whyBest: "White Glove extension of your team, handling heavy restoration.",
    diyVsClean: {
      diy: "In-house teams lack equipment for deep restoration.",
      cleanNaija: "Industrial-grade restoration that saves on replacement.",
      why: "Restoration keeps assets looking new for longer."
    },
    testimonials: [
      { content: "Deep cleaning was top-notch. Guests noticed. The carpets in our lobby look like they were just installed. CleanNaija handled the work during our quietest hours with zero disruption. A perfect hotel partner.", author: "General Manager", role: "Resort in Calabar" },
      { content: "Carpet restoration saved us from total replacement. We were about to spend millions on new flooring, but CleanNaija's extraction system brought the color back. Incredible ROI for our boutique hotel.", author: "Hotel Owner", role: "Boutique Hotel" },
      { content: "Excellent coordination with our in-house staff. They trained our team on how to maintain the finish they created. Very generous with their knowledge and very professional in their delivery. Five stars.", author: "Housekeeping Head", role: "5-Star Hotel" },
      { content: "Professional results that match our luxury standards. Their deep clean of the poolside area was particularly impressive—no more slippery stones. Our guests can now lounge in total safety and comfort.", author: "MD", role: "Hospitality Group" }
    ]
  },
  "post-build-cleanup": {
    title: "Post-Build Cleanup",
    description: "Converting construction sites into habitable, move-in ready spaces.",
    image: "/images/service-construction.jpg",
    features: ["Debris", "Cement Stains", "Fine Dust", "Window Polish"],
    price: "From ₦100,000",
    whyBest: "Remove every trace of dust even from inside electrical sockets.",
    diyVsClean: {
      diy: "Laborers often scratch expensive finishes removing cement.",
      cleanNaija: "Specialized chemical looseners preserve finishes.",
      why: "New investment requires technical cleaning."
    },
    testimonials: [
      { content: "Owners were blown away. The house was spotless and smelled fresh. Not a single trace of construction dust on the POP or inside the cabinets. CleanNaija is the standard for post-construction handover.", author: "Principal Architect", role: "Design Firm" },
      { content: "They removed cement stains from our imported tiles that I thought were permanent. The 'maiguard' had tried but almost scratched the surface. CleanNaija's chemical treatment was magic. Truly saved the project.", author: "Project Mgr", role: "Real Estate" },
      { content: "Move-in ready in record time. I handed them the keys to a dusty site and 24 hours later, the owner was moving in with their white sofa. No issues, no complaints. A very reliable completion partner.", author: "Owner", role: "Luxury Villa" },
      { content: "Detail cleaning at its best. They even vacuumed the inside of the light fixtures and cleaned the window tracks. The level of care is what sets them apart from regular laborers. Highly recommended for Lekki builds.", author: "Contractor", role: "Ibeju-Lekki" }
    ]
  },
  "arena-sports-complex-care": {
    title: "Arena & Sports Complex Care",
    description: "Bulk waste and high-speed pressure washing for stadiums.",
    image: "https://images.unsplash.com/photo-1540747913346-19e3adca174f?auto=format&fit=crop&q=80&w=1200",
    features: ["Litter", "Floor Wash", "Restroom Bulk", "Vendor Area"],
    price: "Custom Quote",
    whyBest: "Manpower Engine to clean stadiums in record time with supervised teams.",
    diyVsClean: {
      diy: "Cleaning stadiums with small teams takes days.",
      cleanNaija: "Scale and speed needed for massive facilities.",
      why: "Speed is critical for event venues."
    },
    testimonials: [
      { content: "Incredible coordination. Spotless in 12 hours after a 50,000 person concert. They had teams in every sector working simultaneously. The arena was ready for the morning game with zero issues. Amazing speed!", author: "Event Director", role: "Eko Convention Center" },
      { content: "Massive seating areas were cleared and sanitized quickly. They used high-speed blowers and washers that I haven't seen elsewhere. Their bulk waste management is top notch. A very disciplined outfit.", author: "Admin", role: "Stadium Hub" },
      { content: "They handled the post-festival mess perfectly. Not a single plastic bottle left. The sanitization of the restrooms was a huge win for us—no lingering smells the next day. A truly corporate scale cleaner.", author: "Promoter", role: "Music Festival" },
      { content: "Reliable bulk waste management and cleaning. They provided clear documentation of the waste disposal and the areas cleaned. Very easy to work with and very professional in their approach to safety.", author: "Ops Head", role: "Sports Authority" }
    ]
  },
  "sports-court-restoration": {
    title: "Sports Court Restoration",
    description: "Restoring 'grip' and beauty to courts through detergency.",
    image: "https://images.unsplash.com/photo-1562920618-af1f5f02f0be?auto=format&fit=crop&q=80&w=1200",
    features: ["Slip-Removal", "Marking Prep", "Scrubbing", "Drainage"],
    price: "From ₦75,000",
    whyBest: "Controlled-pressure cleaners remove algae without damaging finishes.",
    diyVsClean: {
      diy: "Standard pressure washing can tear up court surfaces.",
      cleanNaija: "Even safe finish with specialized non-slip agents.",
      why: "Preserving surface integrity is critical for play."
    },
    testimonials: [
      { content: "No more slipping! Court feels brand new and the color is vibrant again. The grip on the tennis court is much improved, according to our members. CleanNaija's process is really effective. Best in Ikoyi.", author: "Club Secretary", role: "Ikoyi Club" },
      { content: "The grip on the basketball court is much improved. They removed the deep-seated dust that was making the surface hazardous. It looks like it was just resurfaced. Great value for our private academy.", author: "Coach", role: "Sports Academy" },
      { content: "Removed years of moss in one session. Amazing. I was worried about the acrylic paint peeling, but they used the right pressure and the right chemicals. The court is sparkling and safe for my grandkids.", author: "Ms. Chichi", role: "Private Owner" },
      { content: "Professional resurfacing prep work. We hired them to clean before we repainted, and the surface was so clean that the paint bonded perfectly. Their equipment is clearly specialized for sports surfaces.", author: "Contractor", role: "Tennis Center" }
    ]
  },
  "plaza-mall-management": {
    title: "Plaza & Mall Management",
    description: "Active management for retail spaces ensuring a 'Clean Always'.",
    image: "/images/service-office.jpg",
    features: ["Restroom Monitoring", "Food Court", "Parking", "Emergency"],
    price: "Custom Quote",
    whyBest: "Active Management ensures peak performance when traffic is highest.",
    diyVsClean: {
      diy: "Unmanaged staff often slack off during busy hours.",
      cleanNaija: "Uniformed teams respond in seconds with walkie-talkies.",
      why: "Mall cleaning requires constant presence."
    },
    testimonials: [
      { content: "Mall looked clean even during the December rush. Highly recommended management service. Their staff are visible and helpful, and any spills are cleaned up in seconds. Truly world-class mall hygiene.", author: "Mall Manager", role: "Jabi Lake Mall" },
      { content: "Food court sanitization is consistent and thorough. We've seen a lot of happy customers commenting on how clean the tables are. CleanNaija's supervisor is always on site checking the standards. Great job.", author: "Vendor", role: "Food Plaza" },
      { content: "Quick response to spills in high traffic areas. Their team uses walkie-talkies to coordinate, which is very impressive. It ensures a 5-star experience for our shoppers throughout the day. Very professional.", author: "Customer", role: "Mall Visitor" },
      { content: "Best mall cleaning partner in Nigeria. They manage the waste, the restrooms, and the common areas with total transparency. Their monthly reports are detailed and very useful for our management board.", author: "Asset Manager", role: "Real Estate Fund" }
    ]
  },
  "public-building-cleaning": {
    title: "Public Building Cleaning",
    description: "Vetted cleaning for sensitive public institutions.",
    image: "/images/service-office.jpg",
    features: ["Auditorium", "Staff Office", "Public Restroom", "Grounds"],
    price: "Custom Quote",
    whyBest: "Provide transparency and safety compliance certificates required.",
    diyVsClean: {
      diy: "Public sector cleaning often lacks equipment.",
      cleanNaija: "Professional management and industrial accountability.",
      why: "Documentation is as important as cleaning."
    },
    testimonials: [
      { content: "The cathedral auditorium is always sparkling and fresh for every service. They handle the massive space with such ease. Their staff are respectful and follow our guidelines perfectly. A very reliable partner.", author: "Church Admin", role: "Lagos Cathedral" },
      { content: "Detailed reports and professional staff. Very reliable. They managed the cleanup of our government complex with total transparency. The environmental safety compliance they provided was essential for us.", author: "Govt Admin", role: "Public Sector" },
      { content: "They manage our school facility with great care. The classrooms are sanitized daily and the playground is always litter-free. It's a weight off our minds as educators to have such a professional cleaning team.", author: "Principal", role: "Intl School" },
      { content: "Clean and sanitized staff offices throughout the year. No more dust on files or smelly restrooms. Their team is very thorough and always shows up as scheduled. Best public sector cleaning experience yet.", author: "Secretary", role: "Govt Agency" }
    ]
  },
  "corporate-festive-decor": {
    title: "Corporate Festive Decor",
    description: "Logistics for branded holiday lighting setups at HQs.",
    image: "/images/service-specialty.jpg",
    features: ["Aerial Lighting", "Branded Decor", "Safe Power", "Takedown"],
    price: "Custom Quote",
    whyBest: "Handle engineering and safety protocols for festive campaigns.",
    diyVsClean: {
      diy: "Internal staff setups look amateur and create hazards.",
      cleanNaija: "High-impact professional displays with certification.",
      why: "Your corporate image is on the line."
    },
    testimonials: [
      { content: "Head office was the most photographed building on the street in VI. The branding was perfect and the lighting design was world-class. It really boosted our brand presence during the festive season. Great job!", author: "Marketing Director", role: "Commercial Bank" },
      { content: "Stunning Eid decor that residents absolutely loved. The setup was safe, neat, and very creative. They really understood our brand colors and integrated them perfectly into the lights. Truly professional.", author: "Mall Mgr", role: "Plaza Hub" },
      { content: "Safe and quick setup for our end-of-year event. I was worried about the timeline, but CleanNaija's engineering team worked fast. The result was a magical atmosphere that our staff will never forget.", author: "HR Mgr", role: "Corporate Firm" },
      { content: "Professional lighting that boosted our brand presence and foot traffic. We saw a noticeable increase in visitors during the holiday. The takedown in January was also very neat and timely. Five stars!", author: "CEO", role: "Retail Group" }
    ]
  }
};

export function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? ALL_SERVICES[slug] : null;

  if (!service) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <Seo title="Service Not Found" description="The cleaning service you're looking for doesn't exist. Browse all CleanNaija services." path={`/services/${slug || ''}`} noindex />
        <h1 className="text-4xl font-black text-primary mb-4 uppercase tracking-tighter">SERVICE NOT FOUND</h1>
        <p className="text-gray-500 mb-8 font-bold uppercase tracking-widest text-xs">The service you're looking for doesn't exist.</p>
        <Link to="/"><Button className="bg-primary text-white px-10 py-4 rounded-none uppercase font-black tracking-widest">Back to Home</Button></Link>
      </div>
    );
  }

  const serviceImage = service.image.startsWith('http') ? service.image : `${SITE_URL}${service.image}`;

  return (
    <div className="min-h-screen bg-white font-sans">
      <Seo
        title={`${service.title} in Nigeria`}
        description={`${service.description} ${service.price}. Book a NIN-verified, insured CleanNaija team with a 100% satisfaction guarantee.`}
        path={`/services/${slug}`}
        image={serviceImage}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          description: service.description,
          image: serviceImage,
          serviceType: service.title,
          areaServed: { '@type': 'Country', name: 'Nigeria' },
          provider: { '@type': 'Organization', name: 'CleanNaija', url: SITE_URL },
          offers: { '@type': 'Offer', priceCurrency: 'NGN', description: service.price },
        }}
      />
      {/* Hero Section */}
      <section className="relative h-[65vh] min-h-[550px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center bg-accent-gold text-primary px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-white/20">
              🛡️ Official CleanNaija Pro Service
            </div>
            <h1 className="text-6xl md:text-8xl font-heading font-black text-white uppercase tracking-tighter leading-[0.85] mb-8">
              {service.title}
            </h1>
            <p className="text-xl text-white/80 font-bold uppercase tracking-widest leading-relaxed mb-12 max-w-2xl">
              {service.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/book" className="w-full sm:w-auto">
                <Button className="w-full bg-accent-orange text-white font-black uppercase tracking-[0.2em] px-12 py-6 text-lg rounded-none shadow-[0_20px_50px_rgba(255,87,34,0.3)] transition-all transform hover:-translate-y-1">
                  Book This Service
                </Button>
              </Link>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Direct Pro Support</span>
                <a href="tel:0800-CLEAN-9JA" className="text-2xl font-black text-white hover:text-accent-gold transition-colors flex items-center">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mr-3"><Clock className="w-4 h-4 text-accent-gold" /></div>
                  0800-CLEAN-9JA
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Are The Best Section */}
      <section className="py-24 bg-white border-b border-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div className="space-y-16">
              <div>
                <div className="inline-flex items-center text-accent-gold font-black text-[10px] uppercase tracking-[0.3em] mb-4">The Standard of Excellence</div>
                <h2 className="text-4xl font-black text-primary uppercase tracking-tighter mb-10">Why We are the #1 Provider</h2>
                <p className="text-lg text-gray-600 font-medium leading-relaxed mb-10 border-l-4 border-accent-gold pl-6">
                  {service.whyBest}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-start space-x-4 group">
                      <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0 shadow-sm">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-black text-primary uppercase tracking-widest text-[11px] block mb-1">{feature}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Guaranteed Standard</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DIY Comparison Section */}
              <div className="bg-secondary p-12 rounded-none relative overflow-hidden shadow-inner border-t-8 border-primary">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
                <h3 className="text-2xl font-black text-primary uppercase tracking-tighter mb-8 relative z-10">DIY vs. CleanNaija Pro</h3>
                <div className="space-y-10 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 bg-white/50 border-l-4 border-gray-300 shadow-sm">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Homeowner/DIY Attempt</h4>
                       <p className="text-sm text-gray-600 font-medium leading-relaxed italic">"{service.diyVsClean.diy}"</p>
                    </div>
                    <div className="p-8 bg-primary text-white border-l-4 border-accent-gold shadow-2xl">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-gold mb-3">CleanNaija Professional</h4>
                       <p className="text-sm text-white/90 font-medium leading-relaxed italic">"{service.diyVsClean.cleanNaija}"</p>
                    </div>
                  </div>
                  <div className="p-10 bg-accent-gold text-primary font-black uppercase tracking-tighter text-center shadow-lg transform -rotate-1">
                    🎯 THE VERDICT: {service.diyVsClean.why}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-12 lg:sticky lg:top-32">
               <div className="bg-primary p-12 text-white shadow-2xl relative overflow-hidden border-b-8 border-accent-gold">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                 <div className="relative z-10">
                   <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Service Pricing</h3>
                   <p className="text-accent-gold font-black uppercase tracking-[0.3em] text-[10px] mb-10">No Hidden Nigerian Fees</p>
                   <div className="text-7xl font-black tracking-tighter mb-4 font-heading">{service.price}</div>
                   <p className="text-white/60 font-bold uppercase tracking-widest text-[10px] mb-12 border-t border-white/10 pt-6">We provide fixed-price quotes. The price you see is what you pay—guaranteed.</p>
                   <Link to="/book" className="block">
                     <Button className="w-full bg-accent-orange text-white font-black uppercase tracking-widest py-6 rounded-none shadow-2xl hover:bg-white hover:text-accent-orange transition-all transform hover:scale-[1.02]">
                       Start Your Booking
                     </Button>
                   </Link>
                 </div>
               </div>

               <div className="bg-secondary/30 p-10 border border-gray-100">
                 <h4 className="font-black text-primary uppercase tracking-widest text-[10px] mb-8">Serving Your Area</h4>
                 <div className="grid grid-cols-2 gap-4">
                   {['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Enugu'].map(city => (
                     <div key={city} className="flex items-center space-x-3 group cursor-pointer">
                       <div className="w-2 h-2 bg-accent-gold rounded-full group-hover:scale-150 transition-transform"></div>
                       <span className="text-[11px] font-black uppercase text-primary tracking-widest group-hover:text-accent-gold transition-colors">{city}</span>
                     </div>
                   ))}
                 </div>
                 <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Nationwide Network of 5,000+ Cleaners</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Detailed Service Testimonials */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-gold/5 rounded-full -mr-64 -mt-64 blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full -ml-64 -mb-64 blur-[120px]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 text-accent-gold">Customer Veracity</h2>
            <p className="text-white/50 font-black uppercase tracking-[0.3em] text-[10px]">What Our Clients Say About This Service</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {service.testimonials.map((t, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm p-10 border border-white/10 hover:bg-white/10 transition-all group relative">
                 <div className="flex space-x-1 mb-8">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-accent-gold fill-current" />)}
                </div>
                <p className="text-lg text-white font-medium italic leading-relaxed mb-10 group-hover:text-white relative z-10">
                  "{t.content}"
                </p>
                <div className="flex items-center space-x-4 relative z-10">
                  <div className="w-14 h-14 bg-white p-1 rounded-full overflow-hidden border-2 border-accent-gold shadow-2xl">
                    <img src={`https://i.pravatar.cc/150?u=${slug}-${i}`} alt={t.author} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div>
                    <div className="text-white font-black uppercase tracking-widest text-xs mb-0.5">{t.author}</div>
                    <div className="text-accent-gold font-black uppercase tracking-widest text-[9px] opacity-70">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 bg-white">
         <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl font-black text-primary uppercase tracking-tighter mb-8 leading-none">Ready for the <br /> CleanNaija Experience?</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-12">Spotless. Guaranteed. Nationwide.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link to="/book">
                 <Button className="bg-primary text-white font-black uppercase tracking-widest px-16 py-6 text-lg rounded-none shadow-2xl hover:bg-accent-orange transition-all">Book This Service Now</Button>
               </Link>
               <Link to="/contact">
                 <Button variant="outline" className="border-4 border-primary text-primary font-black uppercase tracking-widest px-16 py-6 text-lg rounded-none hover:bg-primary hover:text-white transition-all">Contact Sales</Button>
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
