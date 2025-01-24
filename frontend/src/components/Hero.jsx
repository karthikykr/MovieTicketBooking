import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Hero = () => {
    const movies = [
        {
            id: 1,
            title: "Avengers: Endgame",
            description: "A thrilling conclusion to the Avengers saga.",
            image: "https://w0.peakpx.com/wallpaper/156/622/HD-wallpaper-avengers-endgame-all-characters-superheroes-movies.jpg",
        },
        {
            id: 2,
            title: "Inception",
            description: "A mind-bending journey through dreams.",
            image: "https://i.ebayimg.com/images/g/lVMAAOSwhQheYrmk/s-l1200.jpg",
        },
        {
            id: 3,
            title: "Interstellar",
            description: "A breathtaking adventure through space and time.",
            image: "https://m.media-amazon.com/images/I/71EKNu3ydrL._AC_UF894,1000_QL80_.jpg",
        },
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
    };

    return (
        <div className="relative w-full flex justify-center items-center">
            <Slider {...settings} className="w-full">
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className="relative flex justify-center items-center"
                    >
                        <img
                            src={movie.image}
                            alt={movie.title}
                            className="w-full max-h-[400px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-70"></div>
                        <div className="absolute bottom-5 left-5 text-white space-y-2">
                            <h1 className="text-2xl font-bold">{movie.title}</h1>
                            <p className="max-w-md text-sm">{movie.description}</p>
                            <button className="bg-red-500 px-4 py-1.5 rounded-md text-sm hover:bg-red-700">
                                Book Tickets
                            </button>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Hero;



