import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="sticky top-0 bg-black z-20 pb-3">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          id="search"
          className="w-full bg-black text-white placeholder-gray-400 rounded-full pl-12 pr-4 py-2 focus:outline-none border border-gray-700"
        />
      </div>
    </div>
  );
}
