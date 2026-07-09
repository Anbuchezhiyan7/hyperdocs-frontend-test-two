import React from 'react';

const Categories: React.FC = () => {
    return (
        <div className="p-6 bg-white">
            <div className="flex items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-gray-600">
                    Categories management content will be displayed here.
                </p>
            </div>
        </div>
    );
};

export default Categories;
