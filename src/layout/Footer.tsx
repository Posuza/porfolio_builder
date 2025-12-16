import React from 'react';

const Footer: React.FC = () => {
	return (
		<footer className="w-full bg-white border-t mt-6">
			<div className="max-w-[1200px] mx-auto px-4 py-3 text-sm text-gray-500 text-center">
				© {new Date().getFullYear()} Portfolio Builder — Built with ❤️
			</div>
		</footer>
	);
};

export default Footer;
