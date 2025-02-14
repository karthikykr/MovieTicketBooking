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
        speed: 600,
        slidesToShow: 1,
        centerMode: true,
        centerPadding: "12%",
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    centerPadding: "8%",
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerPadding: "5%",
                },
            },
        ],
    };

    return (
        <div className="relative w-full bg-gray-100">
            <div className="w-full max-w-screen-xl mx-auto overflow-hidden">
                <Slider {...settings} className="w-full">
                    {movies.map((movie) => (
                        <div key={movie.id} className="relative w-full h-[350px] flex justify-center">
                            {/* Movie Poster */}
                            <img
                                src={movie.image}
                                alt={movie.title}
                                className="w-full h-full object-cover rounded-lg shadow-md transition-transform hover:scale-105"
                            />

                            {/* Light Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black-200/70 rounded-lg"></div>

                            {/* Movie Details */}
                            <div className="absolute bottom-8 left-8 text-white space-y-2 max-w-md">
                                <h1 className="text-xl md:text-2xl font-semibold">{movie.title}</h1>
                                <p className="text-sm md:text-base">{movie.description}</p>
                                <button className="bg-blue-600 px-5 py-2 rounded-md text-white font-medium hover:bg-blue-700 transition">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default Hero;
