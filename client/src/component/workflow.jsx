import React, {useEffect,useRef} from 'react';
import gsap from 'gsap';
import image1 from '../assets/workflow1.jpg';
import image2 from '../assets/workflow2.jpg';
import image3 from '../assets/workflow3.jpg';

const HowItWorks = () => {
  const cardsRef = useRef([]);
  const headingRef = useRef(null); 
  const cards = [
    {
      title: 'SKILL ADVISOR',
      description: 'Turn your skills into opportunities. Browse tasks in your area and get started!',
      image: image1, 
    },
    {
      title: 'SKILL SEEKERS',
      description: 'Have a task at home or work and Looking for assistance? Set your budget and connect with experts quickly!',
      image: image2, 
    },
    {
      title: 'CONVERSATION',
      description: 'Connect instantly via live chat, video, or audio calls to discuss your skill rental needs!',
      image: image3,
    },
  ];

  useEffect(() => {
    gsap.set([headingRef.current, ...cardsRef.current], {
      opacity: 0,
      scale: 0.5,
    });

    // Animate the heading
    gsap.to(headingRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1,
    });

    // Animate the cards
    gsap.to(cardsRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      stagger: 0.3,
      ease: 'power3.out',
    });
  }, []); 

  return (
    <div className="bg-gray-500 text-white py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-8" ref={headingRef}>How it works</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            ref={(el) => cardsRef.current[index] = el}
            className="bg-gray-400 rounded-sm shadow-2xl p-6 text-center max-w-sm flex-1"
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-50 h-40 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p className="text-sm leading-relaxed">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
