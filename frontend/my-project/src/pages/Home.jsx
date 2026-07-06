import HeroBanner from "../components/HeroBanner";
import Footer from "../components/Footer"
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
    <Navbar/>
    
      <HeroBanner onShopNow={() => {}} onBrowseCategories={() => {}} />
      {/* your product grid etc. */}
      <Footer/>
    
    </>
  );
}