import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
	return (
		<header className="w-full bg-white border-b">
			<div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
				<Link to="/builder" className="text-lg font-semibold text-gray-800">📁 Portfolio Builder</Link>
				<nav className="flex items-center gap-3">
					<Link to="/studio/builder" className="text-sm text-gray-600 hover:text-gray-900">Editor</Link>
					<Link to="/studio/preview" className="text-sm text-gray-600 hover:text-gray-900">Preview</Link>
				</nav>
			</div>
		</header>
	);
};

export default Header;
