import logoImage from "@/assets/logo-precifica.png";

const PrecificaLogo = () => {
  return (
    <div className="px-4 sm:px-6 py-3 sm:py-4">
      <img 
        src={logoImage} 
        alt="Precific.aí Logo" 
        className="h-20 sm:h-24 md:h-32 w-auto mx-auto rounded"
      />
    </div>
  );
};

export default PrecificaLogo;