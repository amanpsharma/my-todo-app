import React from "react";

const Loader = () => {
	return (
		<div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center">
			<svg className="animate-spin h-12 w-12 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<path className="opacity-50" d="M3 18a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3H6a3 3 0 00-3 3v12z" stroke="currentColor" strokeWidth="2"></path>
				<path className="opacity-75" d="M8 6H16V8H8z" fill="currentColor"></path>
				<path className="opacity-75" d="M8 10H16V12H8z" fill="currentColor"></path>
				<path className="opacity-75" d="M8 14H16V16H8z" fill="currentColor"></path>
			</svg>
		</div>
	);
};

export default Loader;
