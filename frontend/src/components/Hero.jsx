import react from 'react';

const Hero = () => {
    return (
        <div
            className="relative w-full h-64 bg-cover bg-center"
            style={{ backgroundImage: 'url(/assets/placeholder.jpg)' }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <h1 className="text-white text-4xl font-bold">Featured Movie Title</h1>
            </div>
        </div>
    );
};

export default Hero;