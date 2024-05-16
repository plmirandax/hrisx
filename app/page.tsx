
import FirstSection from "./(homepage)/first-section/page";
import Navbar from "./(homepage)/navbar/page";
import SecondSection from "./(homepage)/second-section/page";
import ThirdSection from "./(homepage)/third-section/page";
import FourthSection from "./(homepage)/fourth-section/page";
import Pricing from "./(homepage)/pricing/page";
import FifthSection from "./(homepage)/fifth-section/page";
import Footer from "@/components/footer/footer";
import Carousel from "./(homepage)/carousel";



export default function Home() {
  return <div>
    <Navbar />
    <FirstSection />
    <Carousel />
    <SecondSection />
    <ThirdSection />
    <FourthSection />
    <Pricing />
    <FifthSection />
    <Footer />
  </div>;
}
