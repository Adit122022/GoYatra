
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import SplitText from '../components/ui/ReactBIt/SplitText';
import RotatingText from '../components/ui/ReactBIt/RotatingText';
import InfiniteMenu from '../components/ui/ReactBIt/InfiniteMenu ';




export default function Hero() {
  const containerRef = useRef(null);

  const items = [
    {
      image: '/images/item1.jpg',
      link: '/travel-preferences',
      title: 'Explore the Streets of Paris',
      description: 'Discover hidden cafes, iconic landmarks, and romantic boulevards in the City of Light.'
    },
    {
      image: '/images/item2.jpg',
      link: '/travel-preferences',
      title: 'Adventure Across the Swiss Alps',
      description: 'Experience breathtaking hikes, cozy mountain villages, and snow-capped wonders.'
    },
    {
      image: '/images/item3.jpg',
      link: '/travel-preferences',
      title: 'Relax on Bali’s Serene Beaches',
      description: 'Unwind with crystal-clear waters, lush jungles, and vibrant local culture in paradise'
    },
    {
      image: '/images/item4.jpg',
      link: '/travel-preferences',
      title: 'Wander Through Tokyo’s Neon Nights',
      description: 'Dive into futuristic skylines, ancient temples, and world-class cuisine in Japan’s capital.'
    },
    {
      image: '/images/item5.jpg',
      link: '/travel-preferences',
      title: 'Experience the Magic of Morocco',
      description: 'From desert dunes to vibrant souks, embrace the charm and culture of North Africa.'
    },
    {
      image: '/images/item6.jpg',
      link: '/travel-preferences',
      title: 'Cruise Along the Amalfi Coast',
      description: 'Enjoy scenic cliffside villages, turquoise waters, and mouthwatering Italian dishes.'
    },
    {
      image: '/images/item7.jpg',
      link: '/travel-preferences',
      title: 'Safari Through the Heart of Kenya',
      description: 'Witness the majesty of wildlife in their natural habitat across endless savannas.'
    }
  ];
  
  return (
    <div  className=" w-full md:flex justify-center items-center h-screen overflow-hidden">
    
      <div className="relative isolate px-6 mt-auto py-24 sm:py-32  lg:px-8">
       
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-20">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative flex items-center bg-primary/10 rounded-full px-3 py-1 text-sm/6  ring-1 ring-primary-900/10 hover:ring-primary-900/20">
           
       
              <Link to="/travel-preferences" className="font-semibold ">
              <RotatingText
  texts={[ 'Personalized Travel Itineraries for You',
    'AI-Powered Trip Planning Made Simple',
    'Custom Travel Plans at Your Fingertips',
    'Effortless Trip Planning with AI',
    'Smart Travel Itineraries Tailored for You',
    'Plan Your Next Adventure with AI',
    'Discover New Places with Smart Itineraries',
    'Explore the World with AI Assistance',
    'Travel Plans Designed Just for You']}
  mainClassName=" text-primary-800 overflow-hidden min-w-base py-0.5 justify-center rounded-lg"
  staggerFrom={"last"}
  initial={{ y: "100%" }}
  animate={{ y: 0 }}
  exit={{ y: "-120%" }}
  splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
  transition={{ type: "spring", damping: 30, stiffness: 400 }}
  rotationInterval={2000}
/>
              </Link>
            </div>
          </div>
          <div ref={containerRef} className="text-center relative">
       
            {/*  Split text is shiny text*/}
            <SplitText
 text=" Your Next Adventure with AI" disabled={false} speed={3} className='custom-class text-5xl font-bold tracking-tight  text-gray-900 sm:text-6xl' />
  
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
         
        <SplitText
 text="   Your personal trip planner and travel curator, creating custom
        itineraries tailored to your interests and budget." disabled={false} speed={3} className='custom-class ' />
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/travel-preferences"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
              <Link to="#" className=" btn text-sm/6 font-semibold  ">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        
        
      </div>

      {/* image section */}
      <div className='relative  overflow-hidden  px-6 mt-auto py-24 sm:py-32  lg:px-8'>
        {/* <img src="https://i.pinimg.com/736x/22/74/3e/22743e1e11d14dcea3cdd0c048cdcb43.jpg" alt="hero" className=" h-[70vh] w-full rounded-full object-cover object-center opacity-50" />
         */}
         
<div style={{ height: '600px', position: 'relative' }}>
  <InfiniteMenu items={items}/>
</div>
      </div>
    </div>
  )
}