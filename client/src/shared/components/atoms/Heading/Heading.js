export function Heading({title,desc,className}){
    <div>
    <h3 className={`text-md font-semibold text-gray-700 mb-2 dark:text-gray-400 ${className}`}>
        {title}
      </h3>
      <p className="text-gray-400 text-sm mb-4">
      {desc}
      </p>
    </div>
}