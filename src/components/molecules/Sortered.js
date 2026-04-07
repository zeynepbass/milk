  export default function Sortered({sortedData}){
    if (sortedData.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center text-center mt-16 px-4">
            <img
              src="/images/gonderi-bulunamadi.png"
              alt="Gönderi bulunamadı"
              className="w-40 h-40 object-contain opacity-80 block dark:hidden"
            />
            <img
              src="/images/dark-gonderi-bulunamadi.png"
              alt="Gönderi bulunamadı"
              className="w-40 h-40 object-contain opacity-80 hidden dark:block"
            />
    
            <h2 className="text-lg font-semibold text-gray-700 mb-1 dark:text-gray-400">
              Gönderi Bulunamadı
            </h2>
    
            <p className="text-gray-400 text-sm m-1 ">
              Henüz paylaşılmış bir gönderi bulunamadı
            </p>
          </div>
        );
      }
  }
