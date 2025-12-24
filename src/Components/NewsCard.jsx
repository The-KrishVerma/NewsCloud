import { FaEye, FaRegShareSquare, FaStar } from 'react-icons/fa';
import { CiBookmarkCheck } from "react-icons/ci";
import { Link } from 'react-router-dom';

const NewsCard = ({ news }) => {
    const {
        title,
        image_url,
        author,
        total_view,
        rating,
        published_date,
        details,
        id,
    } = news;

    return (
        <div className="card bg-gray-800/50 backdrop-blur-sm shadow-lg rounded-xl p-5 mb-6 group border border-gray-700/50 hover:border-blue-600/50 overflow-hidden">
            {/* Gradient accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            
            <div className="flex items-center justify-between mb-4 bg-gray-700/30 space-x-4 p-4 rounded-lg">

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-600 group-hover:ring-blue-500 transition-all">
                        <img src={author?.img || 'https://via.placeholder.com/40'} alt={author?.name || 'Author'} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-gray-100">{author?.name || 'Unknown Author'}</h2>
                        <time className="text-xs text-gray-500" dateTime={author?.published_date}>{author?.published_date ? new Date(author.published_date).toLocaleDateString() : ''}</time>
                    </div>
                </div>
                <div className="text-gray-400 space-x-2 flex">
                    <button className="p-2 hover:bg-blue-600/20 rounded-full transition-all hover:text-blue-400" title="Bookmark this article" aria-label="Bookmark article">
                        <CiBookmarkCheck size={20} />

                    </button>
                    <button className="p-2 hover:bg-blue-600/20 rounded-full transition-all hover:text-blue-400" title="Share this article" aria-label="Share article">

                        <FaRegShareSquare size={20} />
                    </button>
                </div>
            </div>

            <h2 className="text-lg font-bold mb-3 text-gray-50 group-hover:text-cyan-400 transition-colors line-clamp-2">{title}</h2>

            <figure className="overflow-hidden rounded-lg mb-3">
                <img src={image_url} alt={title} className="rounded-lg w-full h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
            </figure>

            <p className="text-sm text-gray-400 mt-3 line-clamp-3">
                {details.length > 200 ? details.slice(0, 200) + '...' : details}
                <Link to={`/news-details/${id}`} className="text-blue-400 font-medium ml-1 hover:text-cyan-300 cursor-pointer transition-colors">Read More</Link>
            </p>

            <div className="flex justify-between items-center mt-4 text-sm">
                <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(Math.round(rating.number))].map((_, i) => (
                        <FaStar key={i} />
                    ))}
                    <span className="ml-1 text-gray-300 font-medium">{rating.number}</span>
                </div>

                <div className="flex items-center gap-1 text-gray-400">
                    <FaEye />
                    <span>{total_view}</span>
                </div>
            </div>
        </div>
    );
};

export default NewsCard;
