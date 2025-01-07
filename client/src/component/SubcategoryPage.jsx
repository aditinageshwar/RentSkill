import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SubcategoryPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { categoryTitle, categoryParts } = location.state || {};
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!categoryTitle) 
        navigate('/');  
    }, [categoryTitle, categoryParts, navigate]);

    const filteredSubcategories = categoryParts?.filter((subcategory) =>
        subcategory.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
       <div className="container py-6 mx-auto">
          <div className="flex items-center gap-4 mb-8 mt-4 mx-60">
            <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)} 
               placeholder={`Search in ${categoryTitle} ...`}
               className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
            />
            <button className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600">
               Search
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-6 ml-20">{categoryTitle}</h2>

          <div className="flex justify-center space-x-6">
            {filteredSubcategories?.map((subcategory, index) => (
              <div key={index} className="bg-gray-100 rounded-lg shadow-lg hover:shadow-lg transition-transform transform hover:scale-104 min-w-[270px]">
                <div className="relative">
                    <img
                       src={subcategory.image}
                       alt={subcategory.title}
                       className="w-full h-[200px] object-cover transition-transform duration-300 ease-in-out transform hover:scale-105 rounded-lg"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-white rounded-full w-12 h-12 flex items-center justify-center mx-auto -mb-6 shadow-md">
                       <span className="text-2xl">{subcategory.icon}</span>
                    </div>
                </div>

                <div className="pt-8 pb-4 text-center">
                    <h3 className="font-medium text-lg">{subcategory.title}</h3>
                </div>
              </div>
            ))}
          </div>
       </div>
    );
};

export default SubcategoryPage;

