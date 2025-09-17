import logoImage from "@/assets/logo-precifica.png";

const PrecificaLogo = () => {
  return (
    <div className="bg-precifica-white rounded-lg px-4 sm:px-6 py-3 sm:py-4 shadow-lg">
      <img 
        src={logoImage} 
        alt="Precific.aí Logo" 
        className="h-16 sm:h-20 md:h-24 w-auto mx-auto"
      />
    </div>
  );
};

export default PrecificaLogo;