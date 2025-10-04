import { Lightbulb } from "lucide-react";

export default function DefaultMapScreen(){
    return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
        <div className="text-center px-6 max-w-md">
          <div className="mb-6 relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center shadow-xl">
              <Lightbulb className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-3 bg-pink-200/40 rounded-full blur-md"></div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Ready to Explore?
          </h2>
          
          <p className="text-gray-600 text-lg mb-2">
            Choose a location from the sidebar to discover amazing cafes nearby
          </p>
          
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
            Start your coffee adventure
          </p>
        </div>
      </div>
    );
}