

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Layout: React.FC = () => {
	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<Header />
			<DndProvider backend={HTML5Backend}>
				<main className="">
					<Outlet />
				</main>
			</DndProvider>
			<Footer />
		</div>
	);
};

export default Layout;

