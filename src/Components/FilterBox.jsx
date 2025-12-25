import React from 'react';
import filtersData from '../data/filters.json';

const FilterBox = ({ country, language, category, setSelectedCountry, setSelectedLanguage, setSelectedCategory, categories }) => {

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-blue-900/30">
            <h3 className="font-bold text-lg mb-3 text-blue-400 flex items-center gap-2">
                <span>🌍</span> Filter News
            </h3>
            <div className="space-y-3">
                <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-300">Country</label>
                    <select
                        id="country"
                        value={country}
                        onChange={e => setSelectedCountry(e.target.value)}
                        className="w-full p-2.5 text-gray-300 bg-gray-700/50 rounded-md outline-none border border-gray-600/30 focus:border-blue-600/50"
                    >
                        {filtersData.countries.map((country) => (
                            <option key={country.code} value={country.code}>{country.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-300">Language</label>
                    <select
                        id="language"
                        value={language}
                        onChange={e => setSelectedLanguage(e.target.value)}
                        className="w-full p-2.5 text-gray-300 bg-gray-700/50 rounded-md outline-none border border-gray-600/30 focus:border-blue-600/50"
                    >
                        {filtersData.languages.map((language) => (
                            <option key={language.code} value={language.code}>{language.name}</option>
                        ))}
                    </select>
                </div>
                {setSelectedCategory && categories && (
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={e => setSelectedCategory(e.target.value)}
                            className="w-full p-2.5 text-gray-300 bg-gray-700/50 rounded-md outline-none border border-gray-600/30 focus:border-blue-600/50"
                        >
                            {categories.map((cat) => (
                                <option key={cat.key} value={cat.key}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterBox;