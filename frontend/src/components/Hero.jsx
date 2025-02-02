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
        slidesToShow: 1.3, // Show 1 full slide + peek into others
        centerMode: true, // Center the main slide
        centerPadding: "15%", // Padding on each side for peek effect
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    centerPadding: "10%",
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
        <div className="relative w-full flex justify-center items-center bg-gray-900">
            <div className="w-full max-w-screen-lg mx-auto overflow-hidden">
                <Slider {...settings} className="w-full">
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            className="relative flex justify-center items-center px-2"
                        >
                            <img
                                src={movie.image}
                                alt={movie.title}
                                className="w-full h-[350px] object-cover rounded-lg shadow-lg"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-70 rounded-lg"></div>
                            <div className="absolute bottom-10 left-10 text-white space-y-2">
                                <h1 className="text-2xl md:text-3xl font-bold">{movie.title}</h1>
                                <p className="max-w-md text-sm md:text-base">{movie.description}</p>
                                <button className="bg-red-500 px-4 py-2 rounded-md text-sm hover:bg-red-700 transition">
                                    Book Tickets
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
